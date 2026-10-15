 
 
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { achievements } from '../js/achievements/achievements-data.js';
import { getBaseAgeEvents } from '../js/events/events.js';
import { applySpecialInventory, createAuthoredSpecialStep, createSpecialStep, isOrderedSpecialChain, tagSourceIndex } from '../js/special-events/special-chain.js';
import { createCareerSparkPickEvent, createCareerSparkStep, getSparkChance, careerMilestones } from '../js/career/career-milestones.js';
import { canChooseCareer, studyBlocks } from '../js/education/study-blocks.js';

let passed = 0;
const test = (name, run) => { run(); console.log(`PASS ${name}`); passed++; };
const SEEDS = Array.from({ length: 240 }, (_, index) => Math.imul(index + 1, 2654435761) >>> 0);

const spouse = { id: 'p1', name: 'Hạnh', relationship: 90, isAlive: true, stats: { health: 80 } };
const basePlayer = { name: 'Thử', province: 'Huế', age: 60, health: 90, happiness: 60, intelligence: 60,
  partner: spouse, marriedAtAge: 30, children: [{ name: 'Bình', relationship: 80, isAlive: true, stats: { health: 90 } }] };
 
const variants = [
  ...[10, 20, 30, 40, 50, 55].map(age => ({ name: `age-${age}`, age })),
  { name: 'age-35 khỏe', age: 35 },
  { name: 'age-35 yếu', age: 35, extra: { health: 20 } },
  { name: 'age-45 chưa gặp bà cụ', age: 45 },
  { name: 'age-45 đã đoàn tụ', age: 45, extra: { achievementFlags: { 'story-reincarnation': true } } },
  ...[60, 65, 70, 75, 80, 85, 90, 95, 100, 105].map(age => ({ name: `later-${age}`, age })),
];
const playerFor = (variant, lifeSeed) => ({ ...basePlayer, age: variant.age, ...(variant.extra ?? {}),
  ...(lifeSeed === undefined ? {} : { lifeSeed }) });
const startOf = (variant, player) => getBaseAgeEvents(variant.age, null, player).find(isOrderedSpecialChain);

 
const isReward = choice => Boolean((choice.achievementIds?.length && !choice.ending) || choice.money > 0 ||
  choice.keepsake || choice.statTargets || choice.minimumStats);
const outcomeOf = choice => JSON.stringify({ title: choice.title, text: choice.text, effects: choice.effects,
  money: choice.money ?? 0, achievementIds: choice.achievementIds ?? [], ending: choice.ending ?? null,
  death: choice.death === true, keepsake: choice.keepsake?.id ?? null, description: choice.keepsake?.description ?? null,
  memory: choice.memory?.id ?? null, unlockActivity: choice.unlockActivity ?? null, statTargets: choice.statTargets ?? null,
  minimumStats: choice.minimumStats ?? null, schoolYearDueAge: choice.schoolYearDueAge ?? null,
  partnerRelationship: choice.partnerRelationship ?? null, reward: isReward(choice) });

 
function following(step, choice, player, make) {
  if (choice.nextStep) {
    const inventory = step.kind === 'special-chain' ? applySpecialInventory(step.specialInventory, choice) : {};
    return make(step.kind, step.specialId, choice.nextStep, inventory, player);
  }
  if (step.kind === 'lost-child-chain' && choice.schoolYearDueAge === 11) return make(step.kind, step.specialId, 5, {}, player);
  return null;
}
 
function walk(step, player, make, path = [], leaves = new Map()) {
  assert.ok(step?.choices?.length, `Bước ${step?.specialId} ${step?.specialStep} có lựa chọn`);
  for (const choice of step.choices) {
    assert.ok(Number.isInteger(choice.sourceIndex), `${step.specialId} ${step.specialStep}: mọi lựa chọn có sourceIndex`);
    const route = [...path, `${step.specialStep}:${choice.sourceIndex}`];
    const next = following(step, choice, player, make);
    if (next) walk(next, player, make, route, leaves);
    else leaves.set(route.join('>'), outcomeOf(choice));
  }
  return leaves;
}
function alwaysFirst(step, player, make) {
  for (let guard = 0; guard < 20; guard++) {
    const choice = step.choices[0];
    const next = following(step, choice, player, make);
    if (!next) return isReward(choice);
    step = next;
  }
  throw new Error('Chuỗi không kết thúc');
}
 
const authored = (kind, id, step, inventory, player) => tagSourceIndex(createAuthoredSpecialStep(kind, id, step, inventory, player));
const authoredStart = (variant, player) => {
  const shown = startOf(variant, player);
  return { ...shown, choices: [...shown.choices].sort((a, b) => a.sourceIndex - b.sourceIndex) };
};
 
const orderKey = (variant, player) => {
  const keys = [];
  const visit = step => {
    keys.push(`${step.specialStep}:${step.choices.map(c => c.sourceIndex).join(',')}`);
    for (const choice of step.choices) { const next = following(step, choice, player, createSpecialStep); if (next) visit(next); }
  };
  visit(startOf(variant, player));
  return keys.join('|');
};

const baseline = new Map(variants.map(variant => {
  const player = playerFor(variant, 1);
  return [variant.name, walk(authoredStart(variant, player), player, authored)];
}));
const rewardedVariants = variants.filter(variant => [...baseline.get(variant.name).values()].some(o => JSON.parse(o).reward));

test(`Có đường nhận thưởng trong ${rewardedVariants.length} chuỗi, gồm câu đố cần giữ vật phẩm`, () => {
  assert.equal(rewardedVariants.length, variants.length - 1, 'Mọi chuỗi trừ tuổi 105 đều có thưởng');
  for (const variant of rewardedVariants) {
    const player = playerFor(variant, 1);
    assert.ok([...baseline.get(variant.name).values()].some(outcome => JSON.parse(outcome).reward), `${variant.name}: có nhánh thưởng thực sự đạt được`);
  }
});

test(`(a) Sau khi xáo, "luôn chọn ô đầu" không thắng mọi chuỗi ở cả ${SEEDS.length} hạt giống`, () => {
  const winsPerChain = Object.fromEntries(rewardedVariants.map(v => [v.name, 0]));
  let bestSeedWins = 0;
  let totalWins = 0;
  for (const seed of SEEDS) {
    let wins = 0;
    for (const variant of rewardedVariants) {
      const player = playerFor(variant, seed);
      if (alwaysFirst(startOf(variant, player), player, createSpecialStep)) { wins++; winsPerChain[variant.name]++; }
    }
    assert.ok(wins < rewardedVariants.length, `Hạt giống ${seed}: ô đầu thắng ${wins}/${rewardedVariants.length}`);
    bestSeedWins = Math.max(bestSeedWins, wins);
    totalWins += wins;
  }
  for (const [name, wins] of Object.entries(winsPerChain)) {
    assert.ok(wins < SEEDS.length * 0.75, `${name}: ô đầu thắng ${wins}/${SEEDS.length} đời`);
  }
  console.log(`  ô đầu thắng trung bình ${(totalWins / SEEDS.length).toFixed(2)}/${rewardedVariants.length} chuỗi mỗi đời, nhiều nhất ${bestSeedWins}`);
  console.log(`  số đời (trên ${SEEDS.length}) ô đầu thắng: ${Object.entries(winsPerChain).map(([n, w]) => `${n}=${w}`).join(', ')}`);
});

test('(b) Cùng hạt giống thì cùng thứ tự; bản lưu giữ nguyên thứ tự; khác đời thì khác thứ tự', () => {
  for (const variant of variants) {
    const orders = new Set();
    for (const seed of SEEDS) {
      const first = orderKey(variant, playerFor(variant, seed));
      assert.equal(orderKey(variant, playerFor(variant, seed)), first, `${variant.name} hạt giống ${seed}`);
       
      const shown = startOf(variant, playerFor(variant, seed));
      const saved = JSON.parse(JSON.stringify(shown));
      assert.deepEqual(saved.choices.map(c => c.sourceIndex), shown.choices.map(c => c.sourceIndex));
      orders.add(first);
    }
    assert.ok(orders.size > 1, `${variant.name}: các đời khác nhau có thứ tự khác nhau`);
  }
   
  const old = variants.find(v => v.name === 'later-60');
  assert.equal(orderKey(old, playerFor(old)), orderKey(old, playerFor(old)));
});

test('(c) Mọi phần thưởng và kết thúc vẫn đạt được; logic theo chỉ số tác giả không đổi theo thứ tự hiển thị', () => {
  for (const variant of variants) {
    const expected = baseline.get(variant.name);
    for (const seed of SEEDS) {
      const player = playerFor(variant, seed);
      const leaves = walk(startOf(variant, player), player, createSpecialStep);
      assert.deepEqual([...leaves.keys()].sort(), [...expected.keys()].sort(), `${variant.name} hạt giống ${seed}: cùng tập đường đi`);
      for (const [route, outcome] of expected) assert.equal(leaves.get(route), outcome, `${variant.name} hạt giống ${seed}: ${route}`);
    }
  }
   
  const outcomes = name => [...baseline.get(name)].map(([route, o]) => [route, JSON.parse(o)]);
  const lessons = outcomes('later-60').filter(([, o]) => o.unlockActivity === 'free-repair-lessons');
  assert.ok(lessons.length && lessons.every(([route]) => route.endsWith('5:1')), 'Tuổi 60: dạy sửa đồ chỉ ở ô tác giả số 1 của bước 5');
  const cold = outcomes('later-105').filter(([, o]) => o.ending === 'cold');
  assert.ok(cold.length && cold.every(([route]) => /3:2>4:2$/.test(route)), 'Tuổi 105: lạnh lẽo chỉ khi chọn ô tác giả số 2 ở bước 3 và bước 4');
  assert.ok(outcomes('later-105').filter(([route]) => /3:2>4:2$/.test(route)).every(([, o]) => o.ending === 'cold'));
  assert.ok(outcomes('later-105').some(([, o]) => o.ending === 'fulfilled'));
  const tickets = outcomes('later-80').filter(([, o]) => o.keepsake).map(([route, o]) => [route, o.description]);
  assert.ok(tickets.every(([route, text]) => text.includes(route.includes('3:0') ? '0080' : '8888')), 'Tuổi 80: số vé theo nhánh tác giả ở bước 3');
  assert.ok(tickets.some(([, t]) => t.includes('0080')) && tickets.some(([, t]) => t.includes('8888')));
});

test('Tuổi 16: chọn 1 trong 3 ngành của khối, cố định theo đời chơi, giữ dòng công khai tỉ lệ', () => {
  for (const block of studyBlocks.map(b => b.id)) {
    const pool = Object.keys(careerMilestones).filter(id => canChooseCareer(id, block));
    const seen = new Set();
    for (const seed of SEEDS) {
      const player = { ...basePlayer, age: 16, studyBlock: block, lifeSeed: seed };
      const pick = getBaseAgeEvents(16, null, player);
      assert.equal(pick.length, 1);
      assert.equal(pick[0].kind, 'career-spark-pick');
      const ids = pick[0].choices.map(c => c.careerSparkId);
      assert.equal(ids.length, Math.min(3, pool.length));
      assert.equal(new Set(ids).size, ids.length);
      assert.ok(ids.every(id => pool.includes(id)), `Khối ${block} chỉ mời ngành của khối`);
      assert.deepEqual(getBaseAgeEvents(16, null, player)[0].choices.map(c => c.careerSparkId), ids, 'Tải lại không đổi 3 ngành');
      ids.forEach(id => seen.add(id));
      for (const choice of pick[0].choices) {
        const chance = Math.round(getSparkChance(choice.careerSparkId, player).chance * 100);
        assert.ok(choice.label.includes(`${chance}%`), 'Nhãn ghi đúng tỉ lệ');
        const first = createCareerSparkStep(choice.careerSparkId, 1, () => 0.5, player);
        assert.ok(first.text.includes(`📊 Vòng quyết định: khả năng thành công khoảng ${chance}%`), 'Bước 1 giữ dòng công khai tỉ lệ');
      }
    }
    assert.deepEqual([...seen].sort(), [...pool].sort(), `Khối ${block}: mọi ngành đều có lúc được mời`);
  }
  assert.equal(createCareerSparkPickEvent('A00', { lifeSeed: 7 }).choices.length, 3);
});

const storyReachability = achievements.filter(achievement => achievement.id.startsWith('story-') || achievement.id === 'ending-fulfilled')
  .map(achievement => ({
    id: achievement.id, title: achievement.title,
    chains: variants.filter(variant => [...baseline.get(variant.name).values()]
      .some(outcome => JSON.parse(outcome).achievementIds?.includes(achievement.id))).map(variant => variant.name),
  }));
assert.ok(storyReachability.every(row => row.chains.length), 'Every story achievement has an actual reachable terminal choice');
fs.mkdirSync('output', { recursive: true });
fs.writeFileSync('output/story-achievement-feasibility.json', JSON.stringify({
  assumptions: 'Choice-tree reachability under an eligible living player profile, with required inventory carried between steps. Survival to the trigger age and relationship prerequisites are conditional, not guaranteed.',
  achievements: storyReachability,
}, null, 2));
console.log(`${storyReachability.length} story/ending achievements have a verified terminal route.`);
console.log(`${passed} nhóm kiểm tra thứ tự chuỗi đặc biệt đều đạt.`);
