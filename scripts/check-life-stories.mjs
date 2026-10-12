// Kiểm tra bộ sự kiện đời thường mới và sinh sổ dấu.
//   node scripts/check-life-stories.mjs              → kiểm tra + mô phỏng
//   node scripts/check-life-stories.mjs --registry   → ghi docs/su-kien-doi-thuong/SO-DAU.md
import { canAffordChoice } from '../js/story-transactions.js';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { lifeStoryCatalog } from '../js/life-stories/index.js';
import {
  EXCLUDED_AGES, POOL_SIZE, NEEDS, hasLifeStories, isLifeStoryEligible, createLifeStoryEvents, pickWeightedStory, seenFlag,
} from '../js/life-stories.js';

const words = value => String(value).match(/[\p{L}\p{N}]+/gu)?.length ?? 0;
const allowedStats = new Set(['health', 'happiness', 'intelligence', 'appearance']);
const allowedNeeds = new Set(Object.keys(NEEDS));
// Lối viết của AI cần tránh (xem SO-TAY.md).
const banned = [/vô cùng/iu, /bỗng nhiên/iu, /bạn cảm thấy/iu, /(^|[.?…]s+)thật là/iu, /!/u, /[\p{Extended_Pictographic}]/u, /(rút ra|một|là) bài học|bài học (quý|đắt|lớn|cuộc|cho tôi)/iu];
const LIMITS = { text: 60, result: 55, label: 12 };

const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const isChain = story => Array.isArray(story.ages);
const ids = new Set();
const producers = new Map();   // flag → [{id, age}]
const consumers = new Map();   // flag → [{id, from, kind}]
const firstAge = story => isChain(story) ? story.ages[0] : story.age;

for (const story of lifeStoryCatalog) {
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

// Dấu bắt buộc phải được gieo trước tuổi bắt đầu của sự kiện dùng nó; dấu chặn chỉ cần tồn tại.
for (const [flag, uses] of consumers) {
  const made = producers.get(flag) ?? [];
  for (const use of uses) {
    if (use.kind === 'blocks') check(made.length > 0, `${use.id}: chặn bằng dấu "${flag}" nhưng không sự kiện nào gieo nó`);
    else check(made.some(p => p.age < use.from), `${use.id}: cần dấu "${flag}" nhưng chưa có sự kiện nào gieo nó trước tuổi ${use.from}`);
  }
}

// Mỗi hoàn cảnh hợp lý ở mỗi tuổi phải nhận được ít nhất 3 sự kiện cố định (mục tiêu 4).
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
                // Con nhỏ: khoảng 3 tuổi; con lớn: sinh khi mình 27 tuổi.
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

// Mô phỏng nhiều cuộc đời: pool không rỗng, không lặp sự kiện, đo tỉ lệ chuyện cũ quay lại.
const runs = process.argv.includes('--quick') ? 100 : 4000;
let chainShown = 0, chainEligibleYears = 0;
const shownCount = new Map();
for (let run = 0; run < runs; run++) {
  const player = {
    name: `Người chơi ${run}`, isAlive: true, money: 0, health: 70, storyFlags: [],
    relatives: [{ id: 'father', name: 'Nguyễn Quốc Dân', alive: true }, { id: 'mother', name: 'Trần Thu Hà', alive: true }],
  };
  for (const age of coveredAges) {
    // Hoàn cảnh ngẫu nhiên theo tuổi (gia đình, tiền, việc làm), giữ nguyên dấu đã có.
    const options = profilesFor(age);
    const { storyFlags, name, ...circumstance } = options[Math.floor(Math.random() * options.length)];
    Object.assign(player, circumstance);
    const pool = createLifeStoryEvents(age, player);
    check(pool.length >= 2, `Tuổi ${age}: chỉ còn ${pool.length} sự kiện trong một lần mô phỏng`);
    if (Math.random() >= 0.8 || !pool.length) continue; // 20% năm không có sự kiện, như main.js
    if (pool.some(e => e.chain)) chainEligibleYears++;
    const event = pickWeightedStory(pool);
    if (event.chain) chainShown++;
    check(!player.storyFlags.includes(seenFlag(event.id)), `${event.id}: xuất hiện hai lần trong một đời`);
    shownCount.set(event.id, (shownCount.get(event.id) ?? 0) + 1);
    const choice = event.choices[Math.floor(Math.random() * event.choices.length)];
    Object.assign(player, choice.playerUpdates);
  }
}
// Trong game ba mẹ chỉ có thể mất khi nhân vật đã trưởng thành.
const noParents = { isAlive: true, money: 0, health: 70, storyFlags: [], relatives: [] };
for (const age of coveredAges.filter(age => age >= 20)) {
  check(createLifeStoryEvents(age, noParents).length >= 1, `Tuổi ${age}: không còn sự kiện nào khi ba mẹ đã mất`);
}

if (errors.length) {
  console.error(`FAIL: ${errors.length} lỗi`);
  for (const error of [...new Set(errors)].slice(0, 60)) console.error(' - ' + error);
  process.exit(1);
}

const neverShown = lifeStoryCatalog.filter(s => !shownCount.has(s.id)).map(s => s.id);
const unused = [...producers.keys()].filter(flag => !consumers.has(flag));
console.log(`PASS: ${lifeStoryCatalog.length} sự kiện (${lifeStoryCatalog.filter(isChain).length} chuỗi), tuổi đã viết: ${coveredAges[0]}–${coveredAges.at(-1)} (${coveredAges.length} tuổi).`);
console.log(`Mô phỏng ${runs} đời: sự kiện chuỗi được bốc ở ${(100 * chainShown / Math.max(1, chainEligibleYears)).toFixed(0)}% số năm có chuỗi sẵn sàng.`);
if (thinSpots.length) console.log(`Tuổi có hoàn cảnh chỉ nhận 3 sự kiện: ${[...new Set(thinSpots)].join(', ')}`);
if (neverShown.length) console.log(`Chưa từng xuất hiện trong mô phỏng: ${neverShown.join(', ')}`);
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
