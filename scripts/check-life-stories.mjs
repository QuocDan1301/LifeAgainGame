import { collectReformationYear } from '../js/events/crime-consequences.js';
 
 
//   node scripts/check-life-stories.mjs --registry   → ghi docs/su-kien-doi-thuong/SO-DAU.md
import { canAffordChoice } from '../js/core/story-transactions.js';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { lifeStoryCatalog } from '../js/events/life-stories/index.js';
import { lineageStories } from '../js/events/life-stories/lineage-stories.js';
import { createInitialState } from '../js/core/state.js';
import { applyEstateOnce } from '../js/core/inheritance.js';
import { buildSuccessor, canOfferSuccession, listHeirCandidates } from '../js/core/succession.js';
import { completeLifeYear } from '../js/relationships/family.js';
import { getOldAgeDeathChance } from '../js/stats/health-rules.js';
import { elderLifeStories } from '../js/events/life-stories/elder-everyday.js';
import { getDreamChoiceUpdates, getDreamStory, DREAM_IDS } from '../js/events/dreams.js';
import {
  EXCLUDED_AGES, POOL_SIZE, NEEDS, hasLifeStories, isLifeStoryEligible, createLifeStoryEvents, pickWeightedStory, seenFlag,
} from '../js/events/life-stories.js';

const words = value => String(value).match(/[\p{L}\p{N}]+/gu)?.length ?? 0;
const allowedStats = new Set(['health', 'happiness', 'intelligence', 'appearance']);
const allowedNeeds = new Set(Object.keys(NEEDS));
 
const banned = [/vô cùng/iu, /bỗng nhiên/iu, /bạn cảm thấy/iu, /(^|[.?…]s+)thật là/iu, /!/u, /[\p{Extended_Pictographic}]/u, /(rút ra|một|là) bài học|bài học (quý|đắt|lớn|cuộc|cho tôi)/iu];
const LIMITS = { text: 60, result: 55, label: 12 };

const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const isChain = story => Array.isArray(story.ages);
const ids = new Set();
const producers = new Map();   // flag → [{id, age}]
const consumers = new Map();   // flag → [{id, from, kind}]
const firstAge = story => isChain(story) ? story.ages[0] : story.age;

// Sự kiện tuổi già bổ sung theo cùng quy tắc, và phải có chủ đề để tránh lặp.
for (const story of elderLifeStories) check(typeof story.theme === 'string' && story.ages?.[0] >= 55, `${story.id}: thiếu chủ đề hoặc khoảng tuổi dưới 55`);
for (const story of [...lifeStoryCatalog, ...elderLifeStories]) {
  const where = story.id ?? '(thiếu id)';
  check(story.id && !ids.has(story.id), `${where}: id trống hoặc trùng`);
  ids.add(story.id);
  if (isChain(story)) {
    check(story.ages.length === 2 && story.ages[0] <= story.ages[1] && story.ages[0] >= 1 && story.ages[1] <= 104,
      `${where}: ages phải là [từ, đến] trong 1–104`);
  } else {
    check(Number.isInteger(story.age) && story.age >= 1 && story.age <= 104 && !EXCLUDED_AGES.has(story.age),
      `${where}: age không hợp lệ hoặc rơi vào năm đặc biệt`);
  }
  check(story.title && words(story.title) <= 10, `${where}: tiêu đề trống hoặc quá dài`);
  check(words(story.text) > 0 && words(story.text) <= LIMITS.text, `${where}: tình huống ${words(story.text)} chữ (tối đa ${LIMITS.text})`);
  for (const need of story.needs ?? []) check(allowedNeeds.has(need), `${where}: needs không hỗ trợ "${need}"`);
  if (story.childAge) check(story.childAge.length === 2 && story.childAge[0] <= story.childAge[1], `${where}: childAge phải là [từ, đến]`);
  check([2, 3].includes(story.choices?.length), `${where}: cần 2–3 lựa chọn`);
  const results = new Set();
  for (const choice of story.choices ?? []) {
    check(words(choice.label) > 0 && words(choice.label) <= LIMITS.label, `${where}: nhãn "${choice.label}" quá dài`);
    check(words(choice.text) > 0 && words(choice.text) <= LIMITS.result, `${where}: kết quả "${choice.label}" ${words(choice.text)} chữ (tối đa ${LIMITS.result})`);
    check(!results.has(choice.text), `${where}: hai lựa chọn trùng kết quả`);
    results.add(choice.text);
    check(choice.minMoney === undefined, `${where}: minMoney đặt ở sự kiện, không đặt ở lựa chọn`);
    if ((choice.money ?? 0) < 0) {
      check(!canAffordChoice({ money: -choice.money - 1 }, choice), `${where}: không chặn lựa chọn khi thiếu tiền`);
      check(canAffordChoice({ money: -choice.money }, choice), `${where}: chặn nhầm khi đủ tiền`);
    }
    for (const [stat, value] of Object.entries(choice.effects ?? {})) {
      check(allowedStats.has(stat), `${where}: chỉ số "${stat}" không hỗ trợ`);
      check(Number.isInteger(value) && value >= -5 && value <= 4, `${where}: ${stat} = ${value} (cho phép −5..4)`);
    }
    for (const flag of choice.flags ?? []) {
      check(/^[a-z0-9_]+$/u.test(flag), `${where}: tên dấu "${flag}" chỉ dùng a-z, 0-9, _`);
      if (!producers.has(flag)) producers.set(flag, []);
      producers.get(flag).push({ id: story.id, age: firstAge(story) });
    }
  }
  for (const text of [story.title, story.text, ...(story.choices ?? []).flatMap(c => [c.label, c.text])]) {
    for (const pattern of banned) check(!pattern.test(text), `${where}: có lối viết cần tránh ${pattern} trong "${text.slice(0, 40)}…"`);
  }
  const uses = [...(story.requires ?? []), ...(story.requiresAny ?? [])].map(flag => [flag, 'requires'])
    .concat((story.blocks ?? []).map(flag => [flag, 'blocks']));
  for (const [flag, kind] of uses) {
    if (!consumers.has(flag)) consumers.set(flag, []);
    consumers.get(flag).push({ id: story.id, from: firstAge(story), kind });
  }
}

 
const dreamTexts = new Map();
function collectDream(player, age) {
  const story = getDreamStory(player, age);
  if (!story) return null;
  dreamTexts.set(`${story.id}|${story.title}|${story.text}`, story);
  return story;
}
for (const partner of [null, { id: 'p', name: 'Lê Minh Thư' }])
  for (const children of [[], [{ id: 'c', name: 'Phạm Gia Bảo', initialAge: 0, joinedAtAge: 30, alive: true }]])
    for (const health of [80, 40, 20])
      for (const id of DREAM_IDS)
        for (const pathIndex of [0, 1, 2, 3, 4, 5, 6, 7]) {
          const player = { name: `Thử ${id} ${pathIndex} ${health} ${children.length} ${partner ? 1 : 0}`, province: 'Huế', isAlive: true, health, money: 1e12, partner, children, storyFlags: pathIndex ? ['hoc_dan'] : [] };
          let age = 58;
          player.dreams = { active: null, entries: {}, later: Object.fromEntries(DREAM_IDS.filter(other => other !== id).map(other => [other, 200])), offers: pathIndex === 2 ? { [id]: 1 } : {} };
          for (let guard = 0; guard < 30 && age <= 104; guard++, age++) {
            const story = collectDream(player, age);
            if (!story) continue;
            const choice = story.choices[(guard + pathIndex) % story.choices.length];
            const next = choice.dream.action === 'decline' || choice.dream.action === 'later' ? story.choices[0] : choice;
            const updates = getDreamChoiceUpdates(player, next.dream, age, next.money ?? 0);
            if (updates) Object.assign(player, updates);
            if (pathIndex === 1 && next.dream.action === 'prepare') player.dreams.entries[id].delayed = true;
            if (pathIndex === 2 && next.dream.action === 'prepare') { player.partner = null; player.dreams.entries[id].deadline = age - 1; }
          }
        }
for (const story of dreamTexts.values()) {
  const where = `${story.id} "${story.title}"`;
  check(words(story.text) > 0 && words(story.text) <= LIMITS.text, `${where}: tình huống ${words(story.text)} chữ (tối đa ${LIMITS.text})`);
  check(story.title && words(story.title) <= 10, `${where}: tiêu đề trống hoặc quá dài`);
  check(story.choices.length >= 2 && story.choices.length <= 4, `${where}: cần 2–4 lựa chọn`);
  check(story.choices.some(choice => !(choice.money < 0)), `${where}: luôn phải có một lựa chọn không tốn tiền`);
  for (const choice of story.choices) {
    check(words(choice.label) > 0 && words(choice.label) <= LIMITS.label, `${where}: nhãn "${choice.label}" quá dài`);
    check(words(choice.text) > 0 && words(choice.text) <= LIMITS.result, `${where}: kết quả "${choice.label}" ${words(choice.text)} chữ (tối đa ${LIMITS.result})`);
    for (const [stat, value] of Object.entries(choice.effects ?? {})) check(allowedStats.has(stat) && value >= -5 && value <= 4, `${where}: ${stat} = ${value}`);
  }
  for (const value of [story.title, story.text, ...story.choices.flatMap(c => [c.label, c.text])]) {
    for (const pattern of banned) check(!pattern.test(value), `${where}: có lối viết cần tránh ${pattern} trong "${value.slice(0, 40)}…"`);
  }
}
for (const step of ['spark', 'prepare', 'twist', 'interplay', 'journey', 'echo'])
  for (const id of DREAM_IDS) check([...dreamTexts.values()].some(story => story.id === `dream-${id}-${step}`), `dream-${id}-${step}: chưa sinh được trong kiểm tra`);


for (const [flag, uses] of consumers) {
  const made = producers.get(flag) ?? [];
  for (const use of uses) {
    if (use.kind === 'blocks') check(made.length > 0, `${use.id}: chặn bằng dấu "${flag}" nhưng không sự kiện nào gieo nó`);
    else check(made.some(p => p.age < use.from), `${use.id}: cần dấu "${flag}" nhưng chưa có sự kiện nào gieo nó trước tuổi ${use.from}`);
  }
}

 
const coveredAges = [];
const thinSpots = [];
function profilesFor(age) {
  const list = [];
  const parentSets = age < 24 ? [['alive', 'alive']]
    : age < 60 ? [['alive', 'alive'], ['gone', 'alive'], ['gone', 'gone']] : [['gone', 'gone'], ['alive', 'gone']];
  const partners = age < 18 ? ['none'] : age < 20 ? ['none', 'dating'] : ['none', 'dating', 'married', 'widowed'];
  for (const [fa, mo] of age >= 85 ? [['gone', 'gone']] : parentSets)
    for (const partner of partners)
      for (const kids of age >= 26 && partner !== 'none' && partner !== 'dating' ? [false, 'young', 'older'] : [false])
        for (const employed of age >= 18 && age < 62 ? [true, false] : [false])
          for (const studying of age >= 18 && age <= 21 ? ['domestic', 'abroad', false] : [false])
          for (const health of [80, 20])
            for (const money of [0, -300_000_000, 500_000_000]) {
              if (partner === 'widowed' && age < 26) continue;
              list.push({
                isAlive: true, name: 'Thử', money, health, storyFlags: [],
                employmentStatus: employed ? 'employed' : 'unemployed',
                careerPath: age < 18 ? null : studying === 'abroad'
                  ? { id: 'study-abroad', school: { type: 'international', countryId: 'japan' } }
                  : studying || age > 21 ? { id: 'programming' } : { id: 'military' },
                relatives: [{ id: 'father', name: 'Nguyễn Văn Dân', alive: fa === 'alive' }, { id: 'mother', name: 'Trần Thị Hà', alive: mo === 'alive' }],
                partner: partner === 'dating' || partner === 'married' ? { id: 'p', name: 'Lê Minh Thư' } : null,
                marriedAtAge: partner === 'married' ? Math.max(20, age - 10) : null,
                widowedAtAge: partner === 'widowed' ? age - 1 : null,
                 
                children: kids ? [{ id: 'c', name: 'Phạm Gia Bảo', initialAge: 0, joinedAtAge: kids === 'young' ? Math.max(25, age - 3) : 27 }] : [],
              });
            }
  return list;
}
for (let age = 1; age <= 104; age++) {
  if (!hasLifeStories(age)) continue;
  coveredAges.push(age);
  const base = lifeStoryCatalog.filter(s => !isChain(s) && s.age === age);
  for (const player of profilesFor(age)) {
    const count = base.filter(story => isLifeStoryEligible(story, age, player)).length;
    const who = `ba ${player.relatives[0].alive ? 'còn' : 'mất'}, mẹ ${player.relatives[1].alive ? 'còn' : 'mất'}, ${player.partner ? (player.marriedAtAge ? 'đã cưới' : 'đang yêu') : player.widowedAtAge ? 'góa' : 'độc thân'}, ${player.children.length ? 'có con' : 'không con'}, ${player.employmentStatus}, sức khỏe ${player.health}, tiền ${player.money}`;
    check(count >= 3, `Tuổi ${age}: chỉ có ${count} sự kiện cho người ${who}`);
    if (count === 3) thinSpots.push(age);
  }
}

 
const runs = process.argv.includes('--quick') ? 100 : 4000;
let chainShown = 0, chainEligibleYears = 0, dreamReadyYears = 0, dreamShown = 0, elderShown = 0, eventYears55 = 0;
let rootShown = 0, eventYearsYoung = 0, rootLives = 0, rootSteps = 0;
const shownCount = new Map();
for (let run = 0; run < runs; run++) {
  const player = {
    name: `Người chơi ${run}`, isAlive: true, money: 0, health: 70, storyFlags: [],
    relatives: [{ id: 'father', name: 'Nguyễn Quốc Dân', alive: true }, { id: 'mother', name: 'Trần Thu Hà', alive: true }],
  };
  for (const age of coveredAges) {
     
    const options = profilesFor(age);
    const { storyFlags, name, ...circumstance } = options[Math.floor(Math.random() * options.length)];
    Object.assign(player, circumstance, { age: age - 1 });
    if (age === 23 && run % 4 === 0) Object.assign(player, {
      criminalRecord: [{ age: 18, years: 2, crime: 'Trộm cắp' }],
      releasedAtAge: 20, lifePath: run % 8 === 0 ? 'reformed' : 'dark',
    });
    collectReformationYear(player, age);
    const pool = createLifeStoryEvents(age, player);
    check(pool.length >= 2, `Tuổi ${age}: chỉ còn ${pool.length} sự kiện trong một lần mô phỏng`);
    if (Math.random() >= 0.8 || !pool.length) continue;  
    if (pool.some(e => e.chain)) chainEligibleYears++;
    const event = pickWeightedStory(pool);
    if (event.chain) chainShown++;
    if (age >= 55) eventYears55++;
    if (age >= 6 && age <= 54) eventYearsYoung++;
    if (event.dreamStep?.startsWith('root-')) { rootShown++; rootSteps++; }
    if (pool.some(e => e.dreamId && e.dreamStep !== 'spark' && e.dreamStep !== 'echo' && !e.dreamStep.startsWith('root-'))) {
      dreamReadyYears++;
      if (event.dreamId) dreamShown++;
    }
    if (elderLifeStories.some(story => story.id === event.id)) elderShown++;
    check(!player.storyFlags.includes(seenFlag(event.id)), `${event.id}: xuất hiện hai lần trong một đời`);
    shownCount.set(event.id, (shownCount.get(event.id) ?? 0) + 1);
    const choice = event.choices[Math.floor(Math.random() * event.choices.length)];
    Object.assign(player, choice.playerUpdates);
    if (choice.dream) {
      const updates = getDreamChoiceUpdates(player, choice.dream, age, choice.money ?? 0);
      check(Boolean(updates), `${event.id}: bước ước mơ không khớp trạng thái khi mô phỏng`);
      if (updates) Object.assign(player, updates);
    }
  }
}
 
// Mô phỏng hai đời: đời đầu được dựng ngẫu nhiên lúc qua đời (60–80 tuổi), chia thừa kế bằng applyEstateOnce,
// người con được dựng bằng buildSuccessor, rồi đời con chạy từng năm bằng completeLifeYear và bộ chọn sự kiện thật
// cho tới khi mất. Lựa chọn được áp dụng như game: dấu, chỉ số, tiền. Giao diện được kiểm tra riêng ở check-lineage-play.html.
const lineageRuns = process.argv.includes('--quick') ? 80 : 800;
const lineageStats = new Map(lineageStories.map(story => [story.id, { eligible: 0, inPool: 0, shown: 0, processed: 0 }]));
const heirFamily = { single: 0, married: 0, withChildren: 0, fromHistory: 0 };
let heirLives = 0, heirYears = 0;
const deeds = ['xay_cau', 'giup_hoc_tro', 'thu_vien_truong_lang', 'do_dau_tre'];
const pickOne = list => list[Math.floor(Math.random() * list.length)];
for (let run = 0; run < lineageRuns; run++) {
  const age = 60 + Math.floor(Math.random() * 21);
  const married = Math.random() < 0.7;
  const kids = Array.from({ length: 1 + Math.floor(Math.random() * 3) }, (_, index) => ({
    id: `k${index}`, name: pickOne(['Gia Bảo', 'Minh Anh', 'Khánh Linh', 'Hoàng Nam']), gender: Math.random() < 0.5 ? 'male' : 'female',
    adopted: Math.random() < 0.15, initialAge: 0, joinedAtAge: 22 + Math.floor(Math.random() * Math.max(1, age - 30)), relationship: 70,
    coParent: { id: 'p1', name: 'Lê Minh Thư' }, ...(Math.random() < 0.4 ? { dreamSeed: { id: pickOne(DREAM_IDS), interest: 'eager', age: 10, text: 'mê một điều từ nhỏ.' } } : {}),
  }));
  const flags = [...(Math.random() < 0.3 ? [pickOne(deeds)] : []), ...(Math.random() < 0.25 ? ['seen:ls50-con-cuoi'] : []), ...(age >= 68 && Math.random() < 0.2 ? ['seen:ls68-chat-nho'] : [])];
  const house = Math.random() < 0.5 ? [{ uid: 'house-1', id: 'house', boughtAtAge: 45 }] : [];
  const founder = { ...createInitialState().player, name: 'Nguyễn Quốc Dân', gender: Math.random() < 0.5 ? 'male' : 'female', province: 'Huế',
    age, isAlive: false, lifeSeed: 9000 + run, lifeId: `sim-${run}`, health: 20, money: Math.random() < 0.1 ? -50_000_000 : Math.floor(Math.random() * 1500) * 1_000_000,
    partner: married ? { id: 'p1', name: 'Lê Minh Thư', gender: 'female', ageAtMeeting: 25, metAtAge: 25, relationship: 80 } : null, marriedAtAge: married ? 26 : null,
    children: kids, purchases: house, storyFlags: flags,
    will: house.length && Math.random() < 0.5 ? { shares: {}, assets: { 'purchase:house-1': `child:${pickOne(kids).id}` } } : null };
  applyEstateOnce(founder);
  const candidates = listHeirCandidates(founder);
  if (!candidates.length) { check(!canOfferSuccession(founder), 'không có con trưởng thành thì không được tiếp nối'); continue; }
  const chosen = pickOne(candidates).child;
  const heir = buildSuccessor({ player: founder, logs: [] }, chosen.id, { recall: chosen.dreamSeed ? null : pickOne([...DREAM_IDS, null]) }).player;
  heirLives++;
  const family = heir.lineage.inferred.family;
  heirFamily[family.status]++;
  if (heir.children.length) heirFamily.withChildren++;
  if (family.source === 'history') heirFamily.fromHistory++;
  const shownHere = new Set();
  for (let year = heir.age + 1; year <= 106 && heir.isAlive !== false; year++) {
    for (const story of lineageStories) if (isLifeStoryEligible(story, year, heir)) lineageStats.get(story.id).eligible++;
    const pool = createLifeStoryEvents(year, heir);
    for (const event of pool) if (lineageStats.has(event.id)) lineageStats.get(event.id).inPool++;
    if (pool.length && Math.random() < 0.8) {
      const event = pickWeightedStory(pool);
      // Như trên màn hình: lựa chọn không đủ tiền bị khóa, người chơi chọn trong phần còn lại.
      const open = event.choices.filter(item => canAffordChoice(heir, item));
      check(open.length > 0, `${event.id}: không còn lựa chọn nào bấm được`);
      const choice = open[Math.floor(Math.random() * open.length)] ?? event.choices[0];
      if (lineageStats.has(event.id)) {
        check(!shownHere.has(event.id), `${event.id}: lặp lại trong một đời con`);
        shownHere.add(event.id);
        lineageStats.get(event.id).shown++;
      }
      if (canAffordChoice(heir, choice)) {
        Object.assign(heir, choice.playerUpdates);
        for (const [stat, value] of Object.entries(choice.effects ?? {})) heir[stat] = Math.max(0, Math.min(100, heir[stat] + value));
        if (choice.money) heir.money += choice.money;
        if (choice.dream) { const updates = getDreamChoiceUpdates(heir, choice.dream, year, choice.money ?? 0); if (updates) Object.assign(heir, updates); }
        if (lineageStats.has(event.id) && heir.storyFlags.includes(seenFlag(event.id))) lineageStats.get(event.id).processed++;
      }
    }
    completeLifeYear(heir, year);
    heirYears++;
    if (heir.isAlive !== false && Math.random() < getOldAgeDeathChance(year, heir.health)) heir.isAlive = false;
  }
  check(heir.isAlive === false, 'đời con phải khép lại');
  applyEstateOnce(heir);
  check(!canOfferSuccession(heir) && !buildSuccessor({ player: heir, logs: [] }, heir.children[0]?.id ?? 'x'), 'không có đời cháu');
}
for (const [id, stat] of lineageStats) {
  check(stat.shown > 0 && stat.processed === stat.shown, `${id}: đời con trong mô phỏng chưa gặp hoặc chưa xử lý (${JSON.stringify(stat)})`);
}

const noParents = { isAlive: true, money: 0, health: 70, storyFlags: [], relatives: [] };
for (const age of coveredAges.filter(age => age >= 20)) {
  check(createLifeStoryEvents(age, noParents).length >= 1, `Tuổi ${age}: không còn sự kiện nào khi ba mẹ đã mất`);
}

if (errors.length) {
  console.error(`FAIL: ${errors.length} lỗi`);
  for (const error of [...new Set(errors)].slice(0, 60)) console.error(' - ' + error);
  process.exit(1);
}

const neverShown = lifeStoryCatalog.filter(s => !shownCount.has(s.id) && !lineageStats.has(s.id)).map(s => s.id);
check(rootShown <= eventYearsYoung * 0.12, `Ước mơ từ tuổi nhỏ chiếm ${(100 * rootShown / Math.max(1, eventYearsYoung)).toFixed(1)}% số năm 6–54 có sự kiện, quá nhiều`);
const elderNeverShown = elderLifeStories.filter(s => !shownCount.has(s.id)).map(s => s.id);
const unused = [...producers.keys()].filter(flag => !consumers.has(flag));
console.log(`PASS: ${lifeStoryCatalog.length} sự kiện (${lifeStoryCatalog.filter(isChain).length} chuỗi), tuổi đã viết: ${coveredAges[0]}–${coveredAges.at(-1)} (${coveredAges.length} tuổi).`);
console.log(`Mô phỏng ${runs} đời: sự kiện chuỗi được bốc ở ${(100 * chainShown / Math.max(1, chainEligibleYears)).toFixed(0)}% số năm có chuỗi sẵn sàng.`);
if (thinSpots.length) console.log(`Tuổi có hoàn cảnh chỉ nhận 3 sự kiện: ${[...new Set(thinSpots)].join(', ')}`);
if (neverShown.length) console.log(`Chưa từng xuất hiện trong mô phỏng: ${neverShown.join(', ')}`);
console.log(`Tuổi già mới: ${elderLifeStories.length} sự kiện, chiếm ${(100 * elderShown / Math.max(1, eventYears55)).toFixed(0)}% số năm có sự kiện từ 55 tuổi${elderNeverShown.length ? `; chưa xuất hiện: ${elderNeverShown.join(', ')}` : '; tất cả đều đã xuất hiện'}.`);
console.log(`Ước mơ từ tuổi nhỏ: ${rootShown} bước trong ${runs} đời, chiếm ${(100 * rootShown / Math.max(1, eventYearsYoung)).toFixed(1)}% số năm 6–54 có sự kiện.`);
console.log(`Ước mơ: ${dreamTexts.size} lời kể đã kiểm tra; khi có bước ước mơ sẵn sàng, ${(100 * dreamShown / Math.max(1, dreamReadyYears)).toFixed(0)}% số năm có sự kiện là bước ước mơ, còn lại là đời thường.`);
console.log(`Hai đời: ${heirLives} đời con chạy ${heirYears} năm tới khi mất; gia đình lúc tiếp quản: ${heirFamily.single} độc thân, ${heirFamily.married} đã cưới (${heirFamily.withChildren} có con, ${heirFamily.fromHistory} theo lịch sử đời đầu).`);
console.log(`Sự kiện liên thế hệ (năm đủ điều kiện / vào nhóm bốc / được bốc / đã xử lý): ${[...lineageStats].map(([id, s]) => `${id.replace('ls-the-he-', '')} ${s.eligible}/${s.inPool}/${s.shown}/${s.processed}`).join('; ')}.`);
console.log(`Dấu đã gieo: ${producers.size}, đã có sự kiện nối: ${producers.size - unused.length}, đang chờ nối: ${unused.length}.`);

if (process.argv.includes('--registry')) {
  const rows = [...new Set([...producers.keys(), ...consumers.keys()])].sort().map(flag => {
    const made = [...new Set((producers.get(flag) ?? []).map(p => `${p.id} (${p.age})`))].join(', ') || '—';
    const used = (consumers.get(flag) ?? []).map(u => `${u.kind === 'blocks' ? 'chặn ' : ''}${u.id} (từ ${u.from})`).join(', ') || '**chưa nối**';
    return `| \`${flag}\` | ${made} | ${used} |`;
  });
  const out = `# Sổ dấu\n\nFile này do \`node scripts/check-life-stories.mjs --registry\` sinh ra. Đừng sửa tay.\n\n` +
    `Dấu "chưa nối" là chỗ có thể viết sự kiện quay lại ở giai đoạn sau. Không cần nối hết, khoảng một phần ba là đủ.\n\n` +
    `| Dấu | Gieo ở (tuổi) | Được dùng ở |\n|---|---|---|\n${rows.join('\n')}\n`;
  fs.mkdirSync(new URL('../docs/su-kien-doi-thuong/', import.meta.url), { recursive: true });
  fs.writeFileSync(new URL('../docs/su-kien-doi-thuong/SO-DAU.md', import.meta.url), out);
  console.log('Đã ghi docs/su-kien-doi-thuong/SO-DAU.md');
}
