import fs from 'node:fs';
import { getFamilyBudget, collectFamilyBudget } from '../js/relationships/family-budget.js';
import { getLivingCost } from '../js/relationships/family.js';
import { prepareStoryChoice, HOME_TERMS } from '../js/core/story-transactions.js';
import assert from 'node:assert/strict';
import { createInitialState } from '../js/core/state.js';
import { shopCatalog, collectAssetIncome, getAssetYearProjection } from '../js/leisure/shop.js';
import { completeLifeYear, forecastNextYear, getDebtInterest, getYearLivingCost, DEBT_INTEREST_RATE, FRUGAL_MAX_SAVING } from '../js/relationships/family.js';
import { ACTIVITY_GAIN_CAP, applyActivityGain, collectStatWearYear, previewActivityGain } from '../js/core/stat-budget.js';
import { getTienLenPot, TIEN_LEN_MAX_STAKE } from '../js/leisure/tien-len.js';
import { ACTIVITY_SLOTS_PER_YEAR, getActivitySlotsLeft, useActivitySlot } from '../js/core/stat-budget.js';
import { getPlayerAnnualSalary, getAnnualSalaryPayment, careerAnnualSalaries } from '../js/career/career-salary.js';
import { getStudentJobBlocker, shiftTypes, collectSideJobYear } from '../js/career/side-jobs.js';
import { getLifestyleIllnessChance, collectIllnessYear } from '../js/stats/hospital.js';
import { studyAbroadCountries, createStudyAbroadSchoolEvent } from '../js/education/study-abroad.js';
import { collectLotteryYear, getVietlottJackpot, VIETLOTT_JACKPOT, VIETLOTT_JACKPOT_GROWTH, VIETLOTT_JACKPOT_MAX } from '../js/leisure/lottery.js';
import { createLaterSpecialStep } from '../js/special-events/special-later-life.js';
import { createOldHouseSpecialStep } from '../js/special-events/special-event-40.js';
import { createLuggageSpecialStep } from '../js/special-events/special-event-55.js';

let passed = 0;
function test(name, body) { body(); passed++; console.log(`PASS ${name}`); }
const worker = () => ({ ...createInitialState().player, age: 50, money: 500_000_000,
  health: 80, happiness: 80, intelligence: 50, appearance: 80, relatives: [], illnessPlan: [],
  careerPath: { id: 'marketing' }, careerLevel: 2, employmentStatus: 'employed', job: 'Marketing', employedSince: 25 });
const actualYear = (p, age, updates = {}) => {
  const random = Math.random; Math.random = () => 0.99;
  try { return completeLifeYear(p, age, updates); } finally { Math.random = random; }
};
test('Investment yields and quantity limits constrain compounding', () => {
  for (const item of shopCatalog.filter(item => item.profit)) {
    assert.ok(item.profit / item.price <= 0.100001, item.id);
    assert.ok(item.limit > 0, item.id);
  }
  assert.equal(shopCatalog.find(item => item.id === 'noodle-cart').profit, undefined);
});
test('Forecast includes rentals, businesses, livestock, pet upkeep and the loan bill', () => {
  const p = worker();
  p.livestock = [{ id: 'cow', boughtAtAge: 20 }, { id: 'cat', boughtAtAge: 20 }];
  p.purchases = [{ id: 'house', uid: 'h', boughtAtAge: 20, rentedAtAge: 50 },
    { id: 'cafe', uid: 'c', boughtAtAge: 20 }, { id: 'noodle-cart', uid: 'n', boughtAtAge: 20 }];
  p.homeLoans = [{ principal: 1_200_000_000, outstanding: 2_280_000_000, annualPayment: 152_000_000,
    years: 15, startedAtAge: 50, lastPaidAge: 50, paymentsMade: 0 }];
  const before = JSON.stringify(p); const forecast = forecastNextYear(p);
  assert.equal(JSON.stringify(p), before);
  assert.equal(forecast.assets, 421_800_000);
  assert.equal(forecast.upkeep, 3_500_000);
  assert.equal(forecast.living, 343_260_000, '40% through 200m, 55% through 600m, 70% above');
  actualYear(p, 51);
  assert.equal(p.money, forecast.after);
});
test('One-time rewards do not increase recurring living costs', () => {
  const p = worker(); const q = worker();
  const a = actualYear(p, 51); const b = actualYear(q, 51, { money: q.money + 200_000_000 });
  assert.equal(a.living.amount, b.living.amount);
  assert.equal(q.money - p.money, 200_000_000);
});
test('Loan principal repayments increase wallet but not living costs', () => {
  const p = worker(); p.storyLoans = [{ id: 'tu', principal: 30_000_000, outstanding: 30_000_000,
    repaymentYears: 3, lentAtAge: 50, lastRepaidAge: 50, amountRepaid: 0 }];
  const f = forecastNextYear(p);
  assert.equal(f.repayments, 10_000_000); assert.equal(f.living, 102_000_000);
  actualYear(p, 51); assert.equal(p.money, f.after);
});
test('Existing assets above the new cap remain owned and are paid only for future years', () => {
  const p = worker(); p.purchases = Array.from({ length: 5 }, (_, i) => ({ id: 'house', uid: `h${i}`, boughtAtAge: 40, rentedAtAge: 50 }));
  assert.equal(getAssetYearProjection(p, 50).amount, 0);
  assert.equal(collectAssetIncome(p, 51).amount, 1_500_000_000);
  assert.equal(p.purchases.length, 5);
});
test('Employment severance is not overwritten by an event money snapshot', () => {
  const p = worker(); p.money = 100_000_000; p.layoffDue = 51; p.layoffSeverance = 60_000_000;
  actualYear(p, 51, { money: 95_000_000 });
  assert.equal(p.money, 131_000_000);
});
test('New story reward amounts match the surrounding prose', () => {
  const oldHouse = createOldHouseSpecialStep(7);
  assert.deepEqual(oldHouse.choices.map(c => c.money), [100_000_000, 50_000_000]);
  assert.match(oldHouse.text, /100\.000\.000/);
  const luggage = createLuggageSpecialStep(4);
  assert.deepEqual(luggage.choices.map(c => c.money), [90_000_000, 60_000_000]);
  assert.match(luggage.text, /90\.000\.000/);
  for (const [age, amount] of [[60, 60_000_000], [65, 180_000_000], [75, 100_000_000], [80, 200_000_000], [85, 100_000_000]]) {
    const terminal = createLaterSpecialStep(age, [65, 75, 85].includes(age) ? 4 : 5);
    const win = terminal.choices.find(c => c.money > 0);
    assert.equal(win.money, amount);
    const amountText = amount.toLocaleString('de-DE');
    assert.ok(`${terminal.text} ${win.text}`.includes(amountText), String(age));
  }
});

// Deterministic progression, no gambling, illness, spouse or children. Investment
// is optional; this measures the advantage of one windfall rather than mortality.
function simulate(bonus) {
  const p = worker(); Object.assign(p, { age: 22, money: 40_000_000 + bonus,
    careerPath: { id: 'programming' }, careerLevel: 1, employedSince: 22, lastSalaryAge: 22 });
  let serial = 0;
  const invest = () => {
    for (const item of shopCatalog.filter(item => item.profit).sort((a, b) => b.profit / b.price - a.profit / a.price)) {
      const key = item.shop === 'pets' ? 'livestock' : 'purchases';
      let count = p[key].filter(entry => entry.id === item.id).length;
      while (count < item.limit && p.money >= item.price + 100_000_000) {
        p.money -= item.price;
        p[key].push({ id: item.id, uid: `i${serial++}`, boughtAtAge: p.age,
          ...(item.group === 'realestate' ? { rentedAtAge: p.age } : {}) }); count++;
      }
    }
    for (const entry of p.purchases) if (shopCatalog.find(item => item.id === entry.id).group === 'realestate' && p.age >= entry.rentedAtAge + 4) entry.rentedAtAge = p.age;
  };
  const wealth = () => p.money + [...p.purchases, ...p.livestock].reduce((sum, entry) => sum + shopCatalog.find(item => item.id === entry.id).price, 0);
  const milestones = {};
  for (let age = 23; age <= 62; age++) {
    invest();
    actualYear(p, age, age === 27 ? { careerLevel: 2 } : age === 37 ? { careerLevel: 3 } : {});
    if ([30, 40, 62].includes(age)) milestones[age] = Math.round(wealth());
  }
  return milestones;
}
test('A 100-million windfall remains an advantage without replacing a career', () => {
  const regular = simulate(0); const rewarded = simulate(100_000_000);
  assert.ok(rewarded[40] > regular[40]);
  assert.ok(rewarded[40] - regular[40] < 600_000_000);
  console.log('SIMULATION', JSON.stringify({ regular, rewarded }));
});
test('Debt carried into a working-age year costs interest, shown in the forecast', () => {
  const p = worker(); p.money = -500_000_000;
  assert.equal(getDebtInterest(22, -500_000_000), 0, 'No interest while still a student');
  assert.equal(getDebtInterest(51, -500_000_000), 500_000_000 * DEBT_INTEREST_RATE);
  assert.equal(getDebtInterest(51, 100), 0);
  const forecast = forecastNextYear(p);
  assert.equal(forecast.interest, 30_000_000);
  const result = actualYear(p, 51);
  assert.equal(p.money, forecast.after);
  assert.match(result.living.content, /Lãi nợ/);
});
test('Frugal living helps when poor but saves at most 12 million for high earners', () => {
  assert.equal(getYearLivingCost(null, 30, 0, 'frugal'), 16_000_000);
  assert.equal(getYearLivingCost(null, 30, 0, 'normal'), 24_000_000);
  const normal = getYearLivingCost(null, 30, 600_000_000, 'normal');
  assert.equal(normal - getYearLivingCost(null, 30, 600_000_000, 'frugal'), FRUGAL_MAX_SAVING);
});
test('Activity gains are capped per stat per year from 70, and high stats wear down', () => {
  const p = worker(); p.age = 30; p.health = 60;
  assert.equal(applyActivityGain(p, 'health', 20), 18, '10 up to 70, then 8');
  assert.equal(p.health, 78);
  assert.equal(previewActivityGain(p, 'health', 5), 0, 'Cap reached this year');
  p.happiness = 99; assert.equal(applyActivityGain(p, 'happiness', 6), 1, 'Never above 100');
  p.age = 31; assert.equal(applyActivityGain(p, 'health', 3), 3, 'Cap resets next year');
  Object.assign(p, { health: 100, happiness: 85, intelligence: 71, appearance: 70 });
  collectStatWearYear(p, 31);
  assert.deepEqual([p.health, p.happiness, p.intelligence, p.appearance], [97, 83, 70, 70]);
  Object.assign(p, { health: 100 });
  assert.equal(collectStatWearYear(p, 80), null, 'Old age uses its own decline');
   
  assert.ok(ACTIVITY_GAIN_CAP > 3 && ACTIVITY_GAIN_CAP < 30);
});
test('Tien len charges a table fee and caps the stake', () => {
  assert.equal(getTienLenPot(100_000), 320_000);
  assert.ok(getTienLenPot(TIEN_LEN_MAX_STAKE) < TIEN_LEN_MAX_STAKE * 4);
   
  assert.ok(0.28 * getTienLenPot(1_000_000) / 1_000_000 < 0.95);
  assert.ok(0.35 * getTienLenPot(1_000_000) / 1_000_000 < 1.15);
});
test('Study abroad admission requires intelligence by country, with one open option', () => {
  assert.ok(studyAbroadCountries.some(country => !country.minIntellect));
  const usa = studyAbroadCountries.find(country => country.id === 'usa');
  assert.ok(usa.minIntellect >= 70);
  const event = createStudyAbroadSchoolEvent({ id: 'study-abroad' }, { intelligence: 50, money: 0 });
  assert.equal(event.choices.find(choice => choice.label.includes('Mỹ')).minIntelligence, usa.minIntellect);
});
test('Vietlott jackpot accumulates yearly, resets when anyone wins and pays the accumulated amount', () => {
  const p = { age: 30, money: 0 };
  const noOther = () => 0.99, other = () => 0;
  assert.equal(getVietlottJackpot(p), VIETLOTT_JACKPOT);
  for (let age = 31; age <= 33; age++) collectLotteryYear(p, age, noOther);
  assert.equal(getVietlottJackpot(p), VIETLOTT_JACKPOT + 3 * VIETLOTT_JACKPOT_GROWTH, 'Grows even in years without tickets');
  collectLotteryYear(p, 33, noOther);
  assert.equal(getVietlottJackpot(p), VIETLOTT_JACKPOT + 3 * VIETLOTT_JACKPOT_GROWTH, 'Only one update per birthday');
  collectLotteryYear(p, 34, other);
  assert.equal(getVietlottJackpot(p), VIETLOTT_JACKPOT, 'Another winner resets the jackpot');
  for (let age = 35; age <= 37; age++) collectLotteryYear(p, age, noOther);
  const pot = getVietlottJackpot(p);
  p.lotteryTickets = [{ type: 'vietlott', numbers: [1, 2, 3, 4, 5, 6], age: 37 }];
  p.lotteryDraws = { 37: { kienThiet: '000000', vietlott: [1, 2, 3, 4, 5, 6] } };
  const result = collectLotteryYear(p, 38, noOther);
  assert.equal(result.amount, pot, 'Winner receives the accumulated jackpot');
  assert.equal(p.money, pot);
  assert.equal(getVietlottJackpot(p), VIETLOTT_JACKPOT, 'Jackpot restarts after the player wins');
  assert.equal(p.lotteryReveal.jackpot.outcome, 'player');
  const big = { age: 30, money: 0, vietlottPot: { amount: VIETLOTT_JACKPOT_MAX, updatedAge: 30 } };
  collectLotteryYear(big, 31, noOther);
  assert.equal(getVietlottJackpot(big), VIETLOTT_JACKPOT_MAX, 'Capped');
});
test('Each year has a limited number of free-time activity slots', () => {
  const p = worker(); p.age = 30;
  for (let i = 0; i < ACTIVITY_SLOTS_PER_YEAR; i++) assert.equal(useActivitySlot(p), true);
  assert.equal(getActivitySlotsLeft(p), 0);
  assert.equal(useActivitySlot(p), false, 'No more slots this year');
  p.age = 31; assert.equal(getActivitySlotsLeft(p), ACTIVITY_SLOTS_PER_YEAR, 'Slots reset on the next birthday');
});
test('Top salaries stay within about twice of each other; athletes earn less after their peak', () => {
  const tops = Object.entries(careerAnnualSalaries).filter(([id]) => id !== 'general').map(([, ranks]) => ranks[2]);
  assert.ok(Math.max(...tops) <= 2.5 * Math.min(...tops));
  const p = { ...worker(), careerPath: { id: 'football' }, careerLevel: 3, age: 30 };
  const peak = getPlayerAnnualSalary(p);
  assert.ok(getPlayerAnnualSalary(p, 36) < peak);
  p.age = 36; p.lastSalaryAge = 36;
  assert.match(getAnnualSalaryPayment(p, 37).content, /huấn luyện/);
});
test('Students only take part-time shifts in at most two stores; part-time is a lighter, fair option', () => {
  const student = { ...worker(), age: 19, careerPath: { id: 'law', school: { name: 'Luật' } }, sideJobs: [] };
  assert.ok(getStudentJobBlocker(student, 'full-time'));
  assert.equal(getStudentJobBlocker(student, 'part-time'), '');
  student.sideJobs = [{ storeId: 'gs25', shift: 'part-time' }, { storeId: 'circle-k', shift: 'part-time' }];
  assert.ok(getStudentJobBlocker(student, 'part-time'));
  assert.equal(getStudentJobBlocker({ ...student, age: 22, sideJobs: [] }, 'full-time'), '');
  const part = shiftTypes['part-time'], full = shiftTypes['full-time'];
  assert.ok(part.salary / -part.health >= 0.95 * full.salary / -full.health, 'Part-time pays about as well per health point as full-time');
  assert.ok(-part.health * 5 <= -full.health, 'Five part-time shifts are no harder on health than one full-time job');
});
test('Poor health and overwork raise the yearly risk of lifestyle illness; checkups halve it', () => {
  const healthy = { ...worker(), health: 90, sideJobs: [], streetJobs: [] };
  assert.equal(getLifestyleIllnessChance(healthy, 40), 0);
  const tired = { ...worker(), age: 39, health: 30, sideJobs: [{ storeId: 'gs25', shift: 'full-time' }], streetJobs: [], strainedYears: 3 };
  const risk = getLifestyleIllnessChance(tired, 40);
  assert.ok(risk > 0.05);
  assert.ok(Math.abs(getLifestyleIllnessChance({ ...tired, checkupAge: 39 }, 40) - risk / 2) < 1e-9);
  const sick = { ...tired, illnesses: [], illnessPlan: [] };
  collectIllnessYear(sick, 40, () => 0);
  assert.equal(sick.illnesses.length, 1);
  assert.equal(sick.lifestyleIllnesses, 1);
});
test('Convenience-store shifts end at retirement and are not forecast afterwards', () => {
  const p = { ...worker(), age: 61, employmentStatus: 'unemployed', sideJobs: [{ storeId: 'gs25', shift: 'part-time', startedAtAge: 50 }] };
  assert.equal(forecastNextYear(p).income - forecastNextYear({ ...p, sideJobs: [] }).income, 0, 'No side-job income forecast at 62');
  const year = collectSideJobYear(p, 62, () => 0.99);
  assert.equal(p.sideJobs.length, 0);
  assert.equal(year.amount, 0);
  assert.match(year.content, /nghỉ hưu/);
});
test('Prison years skip rent and pet costs, pause the mortgage without a lump sum, and match the forecast', () => {
  const p = { ...worker(), age: 30, money: 1_000_000_000, employmentStatus: 'unemployed', job: null, careerLevel: 0,
    prison: { enteredAge: 30, releaseAge: 33, crime: 'Trộm cắp', years: 3 },
    purchases: [{ id: 'house', uid: 'h', boughtAtAge: 20, rentedAtAge: 29 }], livestock: [{ id: 'cat', uid: 'c', boughtAtAge: 20 }],
    homeLoans: [{ principal: 1_000_000_000, outstanding: 500_000_000, annualPayment: 100_000_000, years: 10,
      startedAtAge: 25, lastPaidAge: 30, paymentsMade: 5 }] };
  for (const age of [31, 32, 33]) {
    const forecast = forecastNextYear(p);
    actualYear(p, age);
    assert.equal(p.money, forecast.after, `Forecast matches the prison year ${age}`);
  }
  assert.equal(p.money, 1_000_000_000, 'No rent, pet upkeep, living cost or mortgage while serving');
  assert.equal(p.homeLoans[0].outstanding, 500_000_000);
  p.prison = null;
  actualYear(p, 34);
  assert.equal(p.homeLoans[0].outstanding, 400_000_000, 'One instalment after release, not the paused years at once');
});
test('Progressive living costs preserve low-income savings and charge only marginal bands', () => {
  for (const [income, cost] of [[84e6, 33.6e6], [200e6, 80e6], [300e6, 135e6], [600e6, 300e6], [1200e6, 720e6]]) {
    assert.equal(getYearLivingCost(null, 35, income), cost);
    assert.equal(getYearLivingCost(null, 35, income, 'comfortable'), cost + 36e6);
    assert.equal(getYearLivingCost(null, 35, income, 'luxury'), cost + 120e6);
  }
  assert.equal(getLivingCost(22, 300e6, 'luxury'), 0);
  assert.equal(getLivingCost(35, 300e6, 'luxury'), 255e6);
  assert.ok(84e6 - getLivingCost(35, 84e6) > 50e6);
});

test('Family plans respect ages, living parents, opt-in, reload and one collection per year', () => {
  const p = { ...worker(), age: 40, children: [
    { id: 'c', name: 'Con', initialAge: 6, joinedAtAge: 40, educationPlan: 'intensive', collegeSupport: true },
  ], relatives: [
    { id: 'father', name: 'Ba', ageAtPlayerBirth: 25, alive: true, supportPlan: 'care', bond: 50 },
    { id: 'mother', name: 'Mẹ', ageAtPlayerBirth: 24, alive: false, supportPlan: 'care' },
  ] };
  assert.equal(getFamilyBudget(p, 41).amount, 96e6);
  const old = JSON.stringify(p);
  getFamilyBudget(p, 41); assert.equal(JSON.stringify(p), old);
  collectFamilyBudget(p, 41);
  assert.equal(p.money, 404e6); assert.equal(p.relatives[0].bond, 53);
  const reload = JSON.parse(JSON.stringify(p));
  assert.equal(collectFamilyBudget(reload, 41), null);
  assert.equal(reload.money, p.money);
  assert.equal(getFamilyBudget(p, 53).charges.find(c => c.id === 'c').amount, 20e6);
  assert.equal(getFamilyBudget(p, 56).charges.find(c => c.id === 'c').amount, 20e6);
  assert.equal(getFamilyBudget(p, 57).charges.some(c => c.id === 'c'), false);
  delete p.children[0].educationPlan; delete p.children[0].collegeSupport; delete p.relatives[0].supportPlan;
  assert.equal(getFamilyBudget(p, 42).amount, 0, 'Legacy saves do not silently opt in');
});

test('Family commitments and comfort match forecasts, including prison and changing plans', () => {
  for (const prison of [null, { releaseAge: 45, enteredAge: 40 }]) {
    const p = { ...worker(), age: 40, prison, livingMode: 'comfortable', children: [
      { id: 'c', name: 'Con', joinedAtAge: 34, initialAge: 0, educationPlan: 'supported', lastCarePaidAtAge: 40 },
    ] };
    const f = forecastNextYear(p);
    assert.equal(f.familyBudget, 20e6);
    actualYear(p, 41);
    assert.equal(p.money, f.after);
    p.children[0].educationPlan = 'basic';
    assert.equal(forecastNextYear(p).familyBudget, 0);
  }
  const p = { ...worker(), age: 35, livingMode: 'luxury', happiness: 85 };
  const plain = { ...structuredClone(p), livingMode: 'normal' };
  actualYear(p, 36); actualYear(plain, 36);
  assert.equal(plain.money - p.money, 120e6);
  assert.ok(p.happiness > plain.happiness);
});

test('Housing deposit and annual mortgage are real expenses, not an extra living charge', () => {
  const p = { ...worker(), age: 35, money: 500e6 };
  const choice = prepareStoryChoice({ home: 'story-small-home', label: 'Mua nhà' }, p, 35);
  p.money += choice.money; Object.assign(p, choice.playerUpdates);
  assert.equal(p.money, 320e6);
  const f = forecastNextYear(p);
  assert.equal(f.mortgage, Math.ceil(720e6 * 1.9 / HOME_TERMS['story-small-home'].years));
  actualYear(p, 36);
  assert.equal(p.money, f.after);
});

// Controlled cash-flow lives, not a replay of the user's unavailable 93-life sample.
// Hold health and employment stable, no jackpots/windfalls, run to age 80.
// Compare the previous living formula with B using the real annual accounting.
function simulateBudgetLife(career, style, modern) {
  const p = { ...worker(), age: 22, money: 40e6, careerPath: { id: career }, careerLevel: 1,
    employedSince: 22, lastSalaryAge: 22, livingMode: modern && style === 'comfort' ? 'comfortable' : style === 'entry' ? 'frugal' : 'normal' };
  let billionaireAge = null;
  const cash = {};
  for (let age = 23; age <= 80; age++) {
    p.health = 90; p.happiness = 80; p.isAlive = true;
    if (style === 'family' && age === 30) p.children = [{ id: 'c', name: 'Con', initialAge: 0, joinedAtAge: age,
      educationPlan: modern ? 'supported' : 'basic', collegeSupport: modern }];
    if (style === 'family' && age === 40) p.relatives = [{ id: 'mother', role: 'Mẹ', name: 'Mẹ',
      alive: true, ageAtPlayerBirth: 25, bond: 70, condition: 'healthy', done: {}, interactions: {},
      supportPlan: modern ? 'support' : 'none' }];
    if (style === 'family' && age === 35 && p.money >= 180e6) {
      const home = prepareStoryChoice({ label: 'Nhà', home: 'story-small-home' }, p, p.age);
      p.money += home.money; Object.assign(p, home.playerUpdates);
    }
    const f = forecastNextYear(p);
    const updates = style !== 'entry' && age === 27 ? { careerLevel: 2 }
      : style !== 'entry' && age === 37 ? { careerLevel: 3 } : {};
    const year = actualYear(p, age, updates);
    if (!modern) {
      const recurring = (year.salary?.amount ?? 0) + (year.sideJobs?.amount ?? 0);
      const normal = Math.max(24e6, Math.min(recurring, 200e6) * 0.3 + Math.max(0, recurring - 200e6) * 0.5);
      const frugal = Math.max(16e6, Math.min(recurring, 200e6) * 0.2 + Math.max(0, recurring - 200e6) * 0.5, normal - 12e6);
      p.money += (year.living?.amount ?? 0) - (p.livingMode === 'frugal' ? frugal : normal);
    }
    if (p.money > 1e9 && billionaireAge === null) billionaireAge = age;
    if ([35, 50, 62, 80].includes(age)) cash[age] = Math.round(p.money);
  }
  return { cash, billionaireAge };
}
test('96 controlled lives compare B against the previous costs, including childfree and entry-level lives', () => {
  const rows = Object.keys(careerAnnualSalaries).flatMap(career => ['single', 'comfort', 'family', 'entry'].map(style => ({
    career, style, before: simulateBudgetLife(career, style, false), after: simulateBudgetLife(career, style, true),
  })));
  for (const row of rows) assert.ok(row.after.cash[62] < row.before.cash[62], row.career + '/' + row.style);
  const median = values => { const sorted = [...values].sort((a,b) => a-b); return (sorted[Math.floor((sorted.length-1)/2)] + sorted[Math.ceil((sorted.length-1)/2)]) / 2; };
  const summary = ['single', 'comfort', 'family', 'entry'].map(style => {
    const group = rows.filter(r => r.style === style);
    return { style, lives: group.length,
      medianCashAt80Before: median(group.map(r => r.before.cash[80])),
      medianCashAt80After: median(group.map(r => r.after.cash[80])),
      billionaireBefore: group.filter(r => r.before.billionaireAge !== null).length,
      billionaireAfter: group.filter(r => r.after.billionaireAge !== null).length,
      medianFirstBillionBefore: median(group.filter(r => r.before.billionaireAge).map(r => r.before.billionaireAge)),
      medianFirstBillionAfter: median(group.filter(r => r.after.billionaireAge).map(r => r.after.billionaireAge)) };
  });
  fs.mkdirSync(new URL('../output/', import.meta.url), { recursive: true });
  fs.writeFileSync(new URL('../output/economy-balance-report.json', import.meta.url), JSON.stringify({
    assumptions: '96 controlled cash-flow lives; age 23–80; stable work and maintained health; no windfalls; entry stays rank 1; other profiles promote at 27/37. Family buys a small home at 35 when affordable, one child at 30; B adds education and parent support. This is not a stochastic survival simulation or the original 93-life sample.',
    summary, rows,
  }, null, 2));
  console.log('BUDGET_SIMULATION', JSON.stringify(summary));
});
test('Child education and college support update ending relationships, legacy values and capped logs', () => {
  const p = { ...worker(), age: 40, children: [
    { id: 'new', name: 'Con', initialAge: 6, joinedAtAge: 40, educationPlan: 'intensive', relationship: 58 },
    { id: 'legacy', name: 'Con cũ', initialAge: 19, joinedAtAge: 40, collegeSupport: true, bond: 99 },
  ], relatives: [{ id: 'father', name: 'Ba', ageAtPlayerBirth: 25, alive: true, bond: 100, supportPlan: 'care' }] };
  const result = collectFamilyBudget(p, 41);
  assert.equal(p.children[0].relationship, 60);
  assert.equal(p.children[1].relationship, 100);
  assert.match(result.content, /Con cũ:.*gắn kết \+1/);
  assert.match(result.content, /Ba:.*gắn kết đã tối đa; có người chăm sóc/);
  assert.equal(collectFamilyBudget(p, 41), null);
  assert.equal(p.children[0].relationship, 60);
   
  assert.equal(p.relatives[0].caredAt, 41);
  assert.equal(p.relatives[0].careBy, 'helper');
  const q = { ...worker(), age: 41, relatives: [{ id: 'mother', name: 'Má', ageAtPlayerBirth: 25, alive: true, bond: 70,
    supportPlan: 'care', caredAt: 42, careBy: 'self' }] };
  collectFamilyBudget(q, 42);
  assert.equal(q.relatives[0].careBy, 'self');
  const r = { ...worker(), age: 41, relatives: [{ id: 'mother', name: 'Má', ageAtPlayerBirth: 25, alive: true, bond: 70, supportPlan: 'support' }] };
  collectFamilyBudget(r, 42);
  assert.equal(r.relatives[0].caredAt, undefined);
   
  const s = { ...worker(), age: 40, children: [{ id: 'k', name: 'Bé', initialAge: 0, joinedAtAge: 35, relationship: 80 },
    { id: 'baby', name: 'Út', initialAge: 0, joinedAtAge: 40, relationship: 80 }] };
  for (let age = 41; age <= 57; age++) collectFamilyBudget(s, age);
  assert.equal(s.children[0].relationship, 80 - 17 * 2);
  assert.ok(s.children[0].relationship < 60);
  assert.equal(s.children[1].relationship, 80 - 12 * 2, 'Only counts from age 6');
  const t = { ...worker(), age: 40, children: [{ id: 'k', name: 'Bé', initialAge: 0, joinedAtAge: 35, relationship: 80, educationPlan: 'supported', collegeSupport: true }] };
  for (let age = 41; age <= 57; age++) collectFamilyBudget(t, age);
  assert.equal(t.children[0].relationship, 97);
});
console.log(`${passed} economy balance groups passed.`);
