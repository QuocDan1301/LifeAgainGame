import assert from 'node:assert/strict';
import { createInitialState } from '../js/core/state.js';
import { canAffordChoice } from '../js/core/story-transactions.js';
import { buildLifeSummary } from '../js/core/life-archive.js';
import { lifeStoryCatalog } from '../js/events/life-stories/index.js';
import { createLifeStoryEvents, isLifeStoryEligible, POOL_SIZE, MAX_CHAINS_IN_POOL, EXCLUDED_AGES } from '../js/events/life-stories.js';
import { getDreamStory, getDreamChoiceUpdates, normalizeDreams, describeDreamRoot, setDreamRootStatus, describeDreamEnding } from '../js/events/dreams.js';
import { ROOT_IDS, ROOT_WINDOWS, ROOT_MAX_SEED_OFFERS } from '../js/events/dream-roots.js';

let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log(`PASS ${name}`); };
const parents = (motherAlive = true, fatherAlive = true) => [
  { id: 'father', role: 'Bố', name: 'Nguyễn Quốc Dân', alive: fatherAlive, ageAtPlayerBirth: 28, bond: 70 },
  { id: 'mother', role: 'Mẹ', name: 'Trần Thu Hà', alive: motherAlive, ageAtPlayerBirth: 26, bond: 75 },
];
const child = (extra = {}) => ({ ...createInitialState().player, name: 'Thử Mầm', province: 'Huế', age: 5, health: 80,
  money: 1_000_000_000, storyFlags: [], dreams: null, relatives: parents(), employmentStatus: 'unemployed', ...extra });
// Only one dream may be seeded in these tests, so the others are marked as already passed.
const onlySeed = id => ({ seed: { offers: 0, passed: ROOT_IDS.filter(other => other !== id), lastAge: null } });
const apply = (player, story, index, age) => {
  const choice = story.choices[index];
  const updates = getDreamChoiceUpdates(player, choice.dream, age, choice.money ?? 0);
  assert.ok(updates, `${story.id}: "${choice.label}" phải khớp trạng thái`);
  Object.assign(player, updates, { money: player.money + (choice.money ?? 0), age });
  return choice;
};
const pickAction = (story, action, test = () => true) => story.choices.findIndex(choice => choice.dream.action === action && test(choice));
const next = (player, from, to = 104) => {
  for (let age = from; age <= to; age++) {
    if (EXCLUDED_AGES.has(age)) continue;
    const story = getDreamStory({ ...player, age: age - 1 }, age);
    if (story) return { story, age };
  }
  return null;
};
const words = value => String(value).match(/[\p{L}\p{N}]+/gu)?.length ?? 0;
const banned = [/vô cùng/iu, /bỗng nhiên/iu, /bạn cảm thấy/iu, /!/u, /[\p{Extended_Pictographic}]/u, /bài học/iu, /\b(anh|chị) ơi\b/iu, /undefined|null/u];
const checkText = story => {
  assert.ok(words(story.text) <= 60, `${story.id}: tình huống ${words(story.text)} chữ: ${story.text}`);
  assert.ok(words(story.title) <= 10);
  assert.ok(story.choices.length >= 2 && story.choices.length <= 4);
  assert.ok(story.choices.some(choice => !(choice.money < 0)), `${story.id}: phải có lựa chọn không tốn tiền`);
  for (const choice of story.choices) {
    assert.ok(words(choice.label) <= 12, `${story.id}: nhãn dài: ${choice.label}`);
    assert.ok(words(choice.text) <= 55, `${story.id}: kết quả ${words(choice.text)} chữ: ${choice.text}`);
    for (const [stat, value] of Object.entries(choice.effects ?? {})) assert.ok(value >= -5 && value <= 4, `${story.id}: ${stat}=${value}`);
  }
  for (const value of [story.title, story.text, ...story.choices.flatMap(choice => [choice.label, choice.text])])
    for (const pattern of banned) assert.ok(!pattern.test(value), `${story.id}: ${pattern} trong "${value}"`);
};
// Walks one dream from seed to midlife with a chooser per step.
function grow(id, choose, extra = {}) {
  const player = child({ dreams: onlySeed(id), ...extra });
  const steps = [];
  let at = 5;
  for (let guard = 0; guard < 10; guard++) {
    const found = next(player, at + 1, 54);
    if (!found) break;
    checkText(found.story);
    const index = choose(found.story, found.age);
    steps.push({ step: found.story.dreamStep, age: found.age, label: found.story.choices[index].label });
    apply(player, found.story, index, found.age);
    at = found.age;
  }
  return { player, steps };
}

test('1. Thứ tự giai đoạn và độ tuổi: gieo mầm → thử sức → ngã rẽ → giữ lửa', () => {
  for (const id of ROOT_IDS) {
    const { player, steps } = grow(id, story => story.dreamStep === 'root-seed' ? pickAction(story, 'root-seed') : 0);
    assert.deepEqual(steps.map(step => step.step), ['root-seed', 'root-try', 'root-cross', 'root-mid'], `${id}: ${JSON.stringify(steps)}`);
    const [seed, attempt, cross, mid] = steps;
    assert.ok(seed.age >= ROOT_WINDOWS.seed[0] && seed.age <= ROOT_WINDOWS.seed[1]);
    assert.ok(attempt.age >= ROOT_WINDOWS.try[0] && attempt.age <= ROOT_WINDOWS.try[1]);
    assert.ok(cross.age >= ROOT_WINDOWS.cross[0] && cross.age <= ROOT_WINDOWS.cross[1]);
    assert.ok(mid.age >= ROOT_WINDOWS.mid[0] && mid.age <= ROOT_WINDOWS.mid[1]);
    for (let i = 1; i < steps.length; i++) assert.ok(steps[i].age - steps[i - 1].age >= 2, 'có khoảng nghỉ giữa các bước');
    const root = normalizeDreams(player.dreams).roots;
    assert.equal(root.stage, 'mid');
    assert.equal(root.milestones.length, 4);
    assert.equal(getDreamStory({ ...player, age: 54 }, 54), null, 'xong giai đoạn trung niên thì chờ tới 55');
  }
});

test('2. Không áp đặt: từ chối gieo mầm, tối đa hai lần gợi, không gợi ngoài 6–14 tuổi', () => {
  const player = child();
  let offers = 0;
  for (let age = 6; age <= 14; age++) {
    const story = getDreamStory({ ...player, age: age - 1 }, age);
    if (!story) continue;
    offers++;
    assert.equal(story.dreamStep, 'root-seed');
    apply(player, story, pickAction(story, 'root-pass'), age);
    assert.equal(getDreamStory({ ...player, age }, age + 1), null, 'năm sau chưa gợi lại ngay');
  }
  assert.equal(offers, ROOT_MAX_SEED_OFFERS);
  assert.equal(normalizeDreams(player.dreams).roots, null);
  assert.ok(!Array.from({ length: 40 }, (_, i) => getDreamStory({ ...player, age: 14 + i }, 15 + i)).some(Boolean), 'không gieo mầm sau 14 tuổi');
  assert.equal(getDreamStory(child({ age: 4 }), 5), null);
});

test('3. Nguồn cảm hứng là người thân thật; không có người thân thì là thầy cô', () => {
  const withMom = getDreamStory(child({ dreams: onlySeed('music'), relatives: parents(true, false) }), 10);
  assert.ok(withMom.text.includes('mẹ Hà'), withMom.text);
  const withDad = getDreamStory(child({ dreams: onlySeed('trip'), relatives: parents(false, true) }), 10);
  assert.ok(withDad.text.includes('bố Dân'));
  const orphan = getDreamStory(child({ dreams: onlySeed('music'), relatives: parents(false, false) }), 10);
  assert.ok(orphan.text.includes('cô giáo') && !/mẹ|bố/u.test(orphan.text));
  const noRelatives = getDreamStory(child({ dreams: onlySeed('homecoming'), relatives: [] }), 10);
  assert.ok(noRelatives.title.includes('làng ven sông'));
});

test('4. Ví dụ liên tục: mẹ dạy đàn năm 10 tuổi, gác vì công việc, trở lại năm 58 với hai kết thúc', () => {
  const player = child({ dreams: onlySeed('music'), relatives: parents(true, false) });
  let story = getDreamStory({ ...player, age: 9 }, 10);
  apply(player, story, pickAction(story, 'root-seed', choice => choice.dream.interest === 'eager'), 10);
  story = getDreamStory({ ...player, age: 19 }, 20);
  assert.equal(story.dreamStep, 'root-try');
  assert.ok(story.text.includes('mẹ Hà dạy tôi đoạn đàn đầu tiên'));
  Object.assign(player, { employmentStatus: 'employed' });
  story = getDreamStory({ ...player, age: 27 }, 28);
  assert.equal(story.dreamStep, 'root-cross', 'chưa thử sức thì vẫn tới ngã rẽ');
  assert.ok(story.text.includes('chưa từng có dịp thử'));
  apply(player, story, pickAction(story, 'root-cross', choice => choice.dream.choice === 'pause'), 28);
  assert.equal(normalizeDreams(player.dreams).roots.pauseReason, 'work');
  const spark = getDreamStory({ ...player, age: 57 }, 58);
  assert.equal(spark.dreamStep, 'spark');
  assert.equal(spark.dreamId, 'music', 'ước mơ từ nhỏ được gợi lại trước');
  assert.ok(spark.text.includes('Năm 10 tuổi, mẹ Hà dạy tôi đoạn đàn đầu tiên') && spark.text.includes('Năm 28 tuổi, tôi gác cây đàn lại vì công việc'), spark.text);
  apply(player, spark, pickAction(spark, 'accept'), 58);
  assert.equal(normalizeDreams(player.dreams).roots.stage, 'returned');
  let step = next(player, 59);
  apply(player, step.story, pickAction(step.story, 'prepare'), step.age);
  do { step = next(player, step.age + 1); } while (step.story.dreamStep !== 'journey' && apply(player, step.story, 0, step.age));
  const alive = step.story.choices.find(choice => choice.label.includes('cho mẹ nghe'));
  assert.ok(alive && alive.text.includes('mẹ Hà'), 'mẹ còn sống: đàn cho mẹ nghe');
  const memorialPlayer = { ...player, relatives: parents(false, false) };
  const memorial = next(memorialPlayer, step.age).story.choices.find(choice => choice.label.includes('Đàn lại bài mẹ'));
  assert.ok(memorial && memorial.dream.outcome.includes('tưởng nhớ'), 'mẹ đã mất: đàn lại để tưởng nhớ');
  apply(player, step.story, step.story.choices.indexOf(alive), step.age);
  const root = normalizeDreams(player.dreams).roots;
  assert.equal(root.stage, 'done');
  assert.ok(alive.keepsake.description.includes('cho mẹ Hà nghe'), 'kỷ vật ghi đúng kết thúc');
  const ending = describeDreamEnding(player).join('\n');
  assert.ok(ending.includes('10 tuổi, mẹ Hà dạy tôi đoạn đàn đầu tiên') && ending.includes('28 tuổi, tạm gác cây đàn vì công việc') && ending.includes('cho mẹ Hà nghe'), ending);
  const summary = buildLifeSummary({ player: { ...player, age: 80 }, logs: [] }, 'old-age');
  assert.ok(summary.dreamJourney[0].includes('Từ tuổi nhỏ') && summary.dreamJourney.some(line => line.includes('🌟')), 'sổ cuộc đời ghi hành trình');
});

test('5. Tạm gác, giữ tiếp, buông và nhặt lại; đổi ý không phải nhiệm vụ bắt buộc', () => {
  const player = child({ dreams: onlySeed('trip') });
  let story = getDreamStory({ ...player, age: 7 }, 8);
  apply(player, story, pickAction(story, 'root-seed'), 8);
  player.age = 16;
  player.dreams = setDreamRootStatus(player, 'paused', 16);
  assert.equal(describeDreamRoot(player).toggleLabel, '▶️ Giữ tiếp');
  assert.ok(!Array.from({ length: 7 }, (_, i) => getDreamStory({ ...player, age: 16 + i }, 17 + i)).some(Boolean), 'đang gác thì không có bước thử sức');
  player.dreams = setDreamRootStatus(player, 'growing', 23);
  story = getDreamStory({ ...player, age: 29 }, 30);
  assert.equal(story.dreamStep, 'root-cross');
  apply(player, story, pickAction(story, 'root-cross', choice => choice.dream.choice === 'drop'), 30);
  assert.equal(describeDreamRoot(player).toggleLabel, '🌱 Nhặt lại');
  assert.ok(!Array.from({ length: 24 }, (_, i) => getDreamStory({ ...player, age: 30 + i }, 31 + i)).some(Boolean), 'đã buông thì không bị nhắc tới 55');
  const spark = getDreamStory({ ...player, age: 56 }, 57);
  assert.ok(spark.text.includes('thôi hẳn những chuyến đi'), 'đã buông vẫn được gợi lại nhẹ nhàng khi về già');
  apply(player, spark, pickAction(spark, 'decline'), 57);
  assert.ok(describeDreamEnding(player)[0].includes('để ước mơ thời nhỏ ở lại trong ký ức'));
  assert.equal(setDreamRootStatus({ ...player, age: 60 }, 'growing', 60), null, 'sau 55 tuổi đổi ý qua hệ thống ước mơ tuổi già');
});

test('6. Chống trùng và chi phí: không gieo hai lần, không thử hai lần, có lựa chọn miễn phí', () => {
  const player = child({ dreams: onlySeed('music') });
  const seed = getDreamStory({ ...player, age: 8 }, 9);
  apply(player, seed, 0, 9);
  assert.equal(getDreamChoiceUpdates(player, seed.choices[0].dream, 10), null, 'không gieo mầm lần hai');
  assert.equal(getDreamStory({ ...player, age: 10 }, 11), null, 'đã có mầm thì không gợi ước mơ khác');
  const attempt = getDreamStory({ ...player, age: 18 }, 19);
  const paid = attempt.choices.find(choice => choice.money < 0);
  assert.equal(canAffordChoice({ money: 3_999_999 }, paid), false, 'lớp đàn có giá rõ ràng');
  assert.ok(attempt.choices.some(choice => !(choice.money < 0) && choice.dream.action === 'root-try'), 'nhà ít tiền vẫn có cách thử');
  apply(player, attempt, attempt.choices.indexOf(paid), 19);
  assert.equal(getDreamChoiceUpdates(player, attempt.choices[0].dream, 19), null, 'không thử sức lần hai');
  assert.equal(getDreamStory({ ...player, age: 20 }, 21), null);
});

test('7. Bản lưu cũ, lưu/tải giữa chừng và cuộc đời mới', () => {
  const legacy = child({ age: 30 });
  delete legacy.dreams;
  assert.equal(getDreamStory(legacy, 31), null, 'bản lưu cũ đã qua tuổi gieo mầm vẫn chơi bình thường');
  assert.equal(getDreamStory({ ...legacy, age: 59 }, 60).dreamStep, 'spark', 'và vẫn tìm thấy ước mơ mới khi về già');
  const young = child({ age: 9 });
  delete young.dreams;
  assert.equal(getDreamStory(young, 10)?.dreamStep, 'root-seed', 'bản lưu cũ còn nhỏ tuổi vẫn được gieo mầm');
  const { player } = grow('homecoming', story => 0);
  const reloaded = JSON.parse(JSON.stringify(player));
  assert.deepEqual(normalizeDreams(reloaded.dreams).roots, normalizeDreams(player.dreams).roots);
  assert.equal(normalizeDreams({ roots: { id: 'unknown', status: 'growing' } }).roots, null);
  assert.equal(createInitialState().player.dreams, null);
});

test('8. Người thân mất giữa chừng: lời kể đổi theo, không nói như người còn sống', () => {
  const player = child({ dreams: onlySeed('trip'), relatives: parents(false, true) });
  let story = getDreamStory({ ...player, age: 8 }, 9);
  apply(player, story, pickAction(story, 'root-seed'), 9);
  story = getDreamStory({ ...player, age: 18 }, 19);
  assert.ok(story.choices.some(choice => choice.text.includes('Bố Dân nghe tôi kể')), 'bố còn sống thì có phản ứng của bố');
  const afterLoss = { ...player, relatives: parents(false, false) };
  const later = getDreamStory({ ...afterLoss, age: 18 }, 19);
  assert.ok(!later.choices.some(choice => choice.text.includes('Bố Dân nghe tôi kể')), 'bố đã mất thì không còn lời bố');
  assert.ok(later.text.includes('bố Dân đưa tôi đi biển lần đầu'), 'nhưng kỷ niệm vẫn được nhắc');
});

test('9. Không lấn át chuyện đời thường: sự kiện cũ giữ nguyên chỗ trong nhóm bốc', () => {
  for (const id of ROOT_IDS) for (const age of [8, 19, 30, 45]) {
    const player = child({ age: age - 1, dreams: onlySeed(id) });
    const pool = createLifeStoryEvents(age, player);
    const eligible = lifeStoryCatalog.filter(story => isLifeStoryEligible(story, age, player));
    const expected = Math.min(POOL_SIZE, Math.min(MAX_CHAINS_IN_POOL, eligible.filter(s => Array.isArray(s.ages)).length) + eligible.filter(s => !Array.isArray(s.ages)).length);
    assert.equal(pool.filter(event => lifeStoryCatalog.some(story => story.id === event.id)).length, expected);
    assert.ok(pool.filter(event => event.dreamId).length <= 1);
  }
});

test('10. Mọi lời kể ở mọi nhánh đúng giới hạn và giọng văn', () => {
  let count = 0;
  for (const id of ROOT_IDS)
    for (const relatives of [parents(true, true), parents(false, true), parents(true, false), parents(false, false)])
      for (const pickIndex of [0, 1, 2])
        for (const employed of [true, false]) {
          // Never pass on the seed here, so every later stage is reached; vary the other answers.
          const { player } = grow(id, story => story.dreamStep === 'root-seed'
            ? pickAction(story, 'root-seed', choice => pickIndex !== 1 || choice.dream.interest === 'quiet')
            : Math.min(pickIndex, story.choices.length - 1),
          { relatives, employmentStatus: employed ? 'employed' : 'unemployed', children: employed ? [] : [{ id: 'k', name: 'Bé', initialAge: 0, joinedAtAge: 27 }] });
          for (const partner of [null, { id: 'p', name: 'Lê Minh Thư' }]) {
            const spark = getDreamStory({ ...player, partner, age: 56 }, 57);
            if (spark) { checkText(spark); count++; }
          }
        }
  assert.ok(count > 50, `đã kiểm ${count} lời gợi tuổi già`);
});

console.log(`${passed} nhóm kiểm tra ước mơ từ tuổi nhỏ đều qua.`);
