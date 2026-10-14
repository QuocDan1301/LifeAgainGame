import assert from 'node:assert/strict';
import { createInitialState } from '../js/core/state.js';
import { achievements, meetsAchievement, recordAchievementFlags } from '../js/achievements/achievements-data.js';
import { educationEntryAchievementIds, recordGamblingLoss, collectCreatorAudienceYear } from '../js/achievements/achievement-progress.js';
import { completeCareerYear } from '../js/career/career-salary.js';
import { completeLifeYear, forecastNextYear } from '../js/relationships/family.js';
import { collectLotteryYear } from '../js/leisure/lottery.js';
import { createSchoolEvent } from '../js/career/career-schools.js';
import { createFailedTestEvent } from '../js/career/career-tests.js';
const earned = (id, p) => meetsAchievement(achievements.find(a => a.id === id), p);
const player = extra => ({ ...createInitialState().player, age: 30, health: 100, intelligence: 80,
  happiness: 80, appearance: 80, money: 1e9, illnessPlan: [], relatives: [], ...extra });
let count = 0;
const test = (name, run) => { run(); count++; console.log(`PASS ${name}`); };
test('University entry at 18 unlocks, academies and later schooling do not', () => {
  const choice = createSchoolEvent({ id: 'teaching', field: 'Sư phạm' }, player({ age: 17 })).choices[0];
  const state = { player: player({ age: 18 }) };
  recordAchievementFlags(state, educationEntryAchievementIds(choice.careerPath, 18));
  assert.ok(earned('university-18', state.player));
  assert.deepEqual(educationEntryAchievementIds(choice.careerPath, 19), []);
  assert.deepEqual(educationEntryAchievementIds({ id: 'esports', school: { type: 'academy' } }, 18), []);
  assert.deepEqual(educationEntryAchievementIds({ id: 'casual', school: null }, 18), []);
  assert.deepEqual(educationEntryAchievementIds({ id: 'study-abroad', school: { type: 'international' } }, 18), ['university-18']);
});
test('Both direct and fallback voluntary enlistment unlock military achievement', () => {
  const choices = [createSchoolEvent({ id: 'military', field: 'Nhập ngũ' }).choices[0],
    createFailedTestEvent().choices.find(c => c.careerPath?.id === 'military')];
  for (const choice of choices) {
    const state = { player: player() };
    recordAchievementFlags(state, educationEntryAchievementIds(choice.careerPath, 18));
    assert.ok(earned('voluntary-enlistment', state.player));
    assert.ok(!earned('university-18', state.player));
  }
});
test('Winning either lottery unlocks; losing and recollecting do not', () => {
  for (const type of ['kien-thiet', 'vietlott']) {
    const p = player({ lotteryTickets: [{ type, number: '123456', numbers: [1, 2, 3, 4, 5, 6], age: 30 }],
      lotteryDraws: { 30: { kienThiet: '123456', vietlott: [1, 2, 3, 4, 5, 6] } } });
    assert.ok(collectLotteryYear(p, 31, () => 0.99).amount > 0);
    assert.ok(earned('first-lottery-win', p));
    const money = p.money; collectLotteryYear(p, 31, () => 0.99); assert.equal(p.money, money);
  }
  const loser = player({ lotteryTickets: [{ type: 'kien-thiet', number: '000000', age: 30 }],
    lotteryDraws: { 30: { kienThiet: '123456', vietlott: [1, 2, 3, 4, 5, 6] } } });
  collectLotteryYear(loser, 31, () => 0.99); assert.ok(!earned('first-lottery-win', loser));
});
test('Creators can reach ten million through actual salary years before retirement', () => {
  for (const id of ['tiktok', 'youtube']) {
    const p = player({ age: 21, employmentStatus: 'employed', careerLevel: 1, careerPath: { id }, lastSalaryAge: 21 });
    for (let age = 22; age <= 55; age++) {
      p.careerLevel = age < 32 ? 1 : age < 42 ? 2 : 3;
      const salary = completeCareerYear(p, age);
      assert.match(salary.content, /người/);
    }
    assert.ok(earned(`${id}-10m`, p));
    const field = id === 'tiktok' ? 'tiktokFollowers' : 'youtubeSubscribers';
    const audience = p[field];
    completeCareerYear(p, 55); assert.equal(p[field], audience);
    const reload = JSON.parse(JSON.stringify(p)); completeCareerYear(reload, 55);
    assert.equal(reload[field], audience);
    completeCareerYear(p, 62); assert.equal(p[field], audience);
  }
});
test('Full annual accounting grows once, forecast stays pure, pension and prison do not grow', () => {
  const p = player({ careerPath: { id: 'tiktok', field: 'TikTok' }, careerLevel: 2,
    employmentStatus: 'employed', employedSince: 22, lastSalaryAge: 30 });
  const before = JSON.stringify(p); forecastNextYear(p); assert.equal(JSON.stringify(p), before);
  const random = Math.random; Math.random = () => 0.99;
  try {
    completeLifeYear(p, 31);
    assert.equal(p.tiktokFollowers, 400_000);
    const paid = JSON.parse(JSON.stringify(p)); completeLifeYear(paid, 31);
    assert.equal(paid.tiktokFollowers, 400_000);
    const jailed = player({ ...p, age: 31, prison: { releaseAge: 40, enteredAge: 31 } });
    completeLifeYear(jailed, 32); assert.equal(jailed.tiktokFollowers, 400_000);
  } finally { Math.random = random; }
  assert.equal(collectCreatorAudienceYear(player({ careerPath: { id: 'youtube' }, employmentStatus: 'unemployed' }), 31, { amount: 1 }), null);
});
test('Promotions use the paid rank for audience, rather than next year’s rank', () => {
  const p = player({ careerPath: { id: 'youtube' }, employmentStatus: 'employed', careerLevel: 2, lastSalaryAge: 30 });
  completeCareerYear(p, 31, { careerLevel: 3 });
  assert.equal(p.youtubeSubscribers, 400_000);
  completeCareerYear(p, 32); assert.equal(p.youtubeSubscribers, 1_400_000);
});
test('Net losing stakes accumulate, wins do not offset them, reload does not count twice', () => {
  const p = player();
  const round = { game: 'coin' };
  assert.equal(recordGamblingLoss(p, round, 6e6, 0), 6e6);
  assert.equal(recordGamblingLoss(p, JSON.parse(JSON.stringify(round)), 6e6, 0), 0);
  recordGamblingLoss(p, { game: 'blackjack' }, 6e6, 2e6);
  assert.equal(p.gamblingLosses, 10e6); assert.ok(earned('gambling-loss-10m', p));
  recordGamblingLoss(p, { game: 'dice' }, 1e6, 3e6); assert.equal(p.gamblingLosses, 10e6);
  recordGamblingLoss(p, { game: 'tower' }, 1e6, 1e6); assert.equal(p.gamblingLosses, 10e6);
  recordGamblingLoss(p, { game: 'box' }, 2e6, 0); assert.equal(p.gamblingLosses, 10e6);
  recordGamblingLoss(p, { game: 'tien-len' }, 1e6, 0); assert.equal(p.gamblingLosses, 11e6);
  recordGamblingLoss(p, {}, NaN, 0); assert.equal(p.gamblingLosses, 11e6);
});
console.log(`${count} achievement progression groups passed.`);
