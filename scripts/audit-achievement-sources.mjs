import fs from 'node:fs';
import { achievements } from '../js/achievements/achievements-data.js';
const files = fs.readdirSync('js', { recursive: true }).filter(file => file.endsWith('.js')
  && !file.includes('achievements-data') && !file.includes('life-archive'));
const sources = files.map(file => ({ file, text: fs.readFileSync(`js/${file}`, 'utf8') }));
const rows = achievements.map(a => ({ id: a.id, title: a.title, rule: a.rule,
  sources: sources.filter(s => s.text.includes(a.rule.kind === 'flag' ? a.id : a.rule.field)).map(s => s.file) }));
import assert from 'node:assert/strict';
import { careerPaths } from '../js/career/career-event.js';
import { createPromotionEvent } from '../js/career/career-jobs.js';
import { getRankLock, createCareerSparkStep } from '../js/career/career-milestones.js';
import { careerMilestones } from '../js/career/career-milestones-data.js';
import { drawTarotCards, tarotAchievementIds } from '../js/leisure/tarot.js';
import { collectLotteryYear } from '../js/leisure/lottery.js';
import { meetsAchievement } from '../js/achievements/achievements-data.js';
import { getStudentJobBlocker, convenienceStores } from '../js/career/side-jobs.js';
const careers = {};
for (const [id, , field] of careerPaths) {
  if (id === 'casual') continue;
  const p = { age: 35, employedSince: 22, health: 100, intelligence: 100, happiness: 100,
    appearance: 100, money: 1e12, careerPath: { id, field }, careerLevel: 2,
    employmentStatus: 'employed', careerSpark: id };
  assert.equal(getRankLock(p).maxRank, 3, id);
  if (careerMilestones[id]) assert.ok(createCareerSparkStep(id, 4, () => 0, p)
    .choices.some(c => c.outcome === 'success'), id);
  const success = createPromotionEvent(p, () => 0, 36).choices.find(c => c.careerLevel === 3);
  assert.ok(success, id);
  for (const a of success.achievementIds ?? []) careers[a] = id;
}
assert.deepEqual(achievements.filter(a => a.id.startsWith('career-') && !careers[a.id]), []);
const collection = {};
for (let i = 0; i < 78; i++) {
  const first = drawTarotCards(() => 0, collection)[0];
  assert.ok(!collection[first]);
  collection[first] = { discoveredAt: 'audit' };
}
const oldStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: () => JSON.stringify(collection) } });
let tarot;
try { tarot = tarotAchievementIds(); assert.equal(tarot.length, 6); }
finally {
  if (oldStorage) Object.defineProperty(globalThis, 'localStorage', oldStorage);
  else delete globalThis.localStorage;
}
const winner = { money: 0, lotteryTickets: [{ type: 'kien-thiet', number: '123456', age: 20 }],
  lotteryDraws: { 20: { kienThiet: '123456', vietlott: [1, 2, 3, 4, 5, 6] } } };
const result = collectLotteryYear(winner, 21, () => 0.99);
assert.ok(result.amount > 0);
const lotteryUnlocked = meetsAchievement(achievements.find(a => a.id === 'first-lottery-win'), winner);
assert.ok(lotteryUnlocked, 'Actual lottery win unlocks its achievement');
const adult = { age: 23, health: 100, sideJobs: [], careerPath: { id: 'teaching', school: {} } };
for (const store of convenienceStores) {
  assert.equal(getStudentJobBlocker(adult, 'part-time'), '');
  adult.sideJobs.push({ storeId: store.id, shift: 'part-time' });
}
const report = { total: rows.length, missingSources: rows.filter(row => !row.sources.length),
  verifiedCareerBranches: careers, verifiedTarot: tarot, lotteryAchievementUnlocked: lotteryUnlocked,
  lotteryPrize: result.amount, adultCanTakeAllStores: adult.sideJobs.length === convenienceStores.length,
  limits: 'Career fixtures assume eligible characters and favorable random outcomes; source presence alone does not prove a complete life playthrough.' };
fs.mkdirSync('output', { recursive: true });
fs.writeFileSync('output/achievement-reachability-report.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
