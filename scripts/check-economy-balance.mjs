import assert from 'node:assert/strict';
import { createInitialState } from '../js/core/state.js';
import { shopCatalog, collectAssetIncome, getAssetYearProjection } from '../js/leisure/shop.js';
import { completeLifeYear, forecastNextYear, getDebtInterest, getYearLivingCost, DEBT_INTEREST_RATE, FRUGAL_MAX_SAVING } from '../js/relationships/family.js';
import { ACTIVITY_GAIN_CAP, applyActivityGain, collectStatWearYear, previewActivityGain } from '../js/core/stat-budget.js';
import { getTienLenPot, TIEN_LEN_MAX_STAKE } from '../js/leisure/tien-len.js';
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
  assert.equal(shopCatalog.find(item => item.id === 'noodle-cart').profit * 3, 9_000_000);
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
  assert.equal(forecast.assets, 424_800_000);
  assert.equal(forecast.upkeep, 3_500_000);
  assert.equal(forecast.living, 199_440_000);
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
  assert.equal(f.repayments, 10_000_000); assert.equal(f.living, 72_000_000);
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
  // Một người chịu khó tối đa mỗi năm vẫn giữ được 100, nhưng không thể nhảy từ 70 lên 100 trong một năm.
  assert.ok(ACTIVITY_GAIN_CAP > 3 && ACTIVITY_GAIN_CAP < 30);
});
test('Tien len charges a table fee and caps the stake', () => {
  assert.equal(getTienLenPot(100_000), 360_000);
  assert.ok(getTienLenPot(TIEN_LEN_MAX_STAKE) < TIEN_LEN_MAX_STAKE * 4);
  // Bấm gợi ý mỗi lượt thắng khoảng 28%: với phí bàn, kỳ vọng xấp xỉ hòa vốn thay vì lãi 13%.
  assert.ok(0.28 * getTienLenPot(1_000_000) / 1_000_000 < 1.02);
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
console.log(`${passed} economy balance groups passed.`);
