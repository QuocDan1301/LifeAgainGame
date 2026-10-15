import assert from 'node:assert/strict';
import { createInitialState } from '../js/core/state.js';
import { getAnnualEconomy, getIncomeTax, getRent, getResidence, collectHiringDeductions } from '../js/core/economy.js';
import { completeLifeYear, forecastNextYear, getYearLivingCost } from '../js/relationships/family.js';
import { careerAnnualSalaries } from '../js/career/career-salary.js';
import { studyAbroadCountries } from '../js/education/study-abroad.js';
import { shopCatalog, getShopItem, isAtLimit } from '../js/leisure/shop.js';
import { prepareStoryChoice, collectHomeLoanYear, HOME_TERMS } from '../js/core/story-transactions.js';
import { getHomePurchasePreview } from '../js/core/housing-preview.js';

const worker = (extra = {}) => ({ ...createInitialState().player, age: 25, money: 500e6,
  health: 80, happiness: 80, intelligence: 50, appearance: 80, relatives: [], illnessPlan: [],
  careerPath: { id: 'programming' }, careerLevel: 1, employmentStatus: 'employed',
  employedSince: 22, lastSalaryAge: 25, job: 'Lập trình viên', ...extra });
const year = (p, age, updates = {}) => {
  const random = Math.random;
  Math.random = () => 0.99;
  try { return completeLifeYear(p, age, updates); } finally { Math.random = random; }
};

// Independent boundary calculations, not another implementation of the formula.
assert.equal(getIncomeTax(0), 0);
assert.equal(getIncomeTax(60e6), 3e6);
assert.equal(getIncomeTax(180e6), 15e6);
assert.equal(getIncomeTax(360e6), 42e6);
assert.equal(getIncomeTax(600e6), 90e6);
assert.equal(getIncomeTax(1200e6), 240e6);
assert.equal(getIncomeTax(1300e6), 270e6);
const entry = getAnnualEconomy(worker(), 26, { salary: 120e6 });
assert.equal(entry.incomeTax, 0);
assert.equal(entry.insurance, 9.6e6);
assert.equal(entry.rent, 24e6);
assert.equal(120e6 - entry.total, 86.4e6);
const upper = getAnnualEconomy(worker(), 26, { salary: 180e6 });
assert.equal(upper.insurance, 14.4e6);
assert.equal(upper.incomeTax, 2.28e6);
assert.equal(getAnnualEconomy(worker(), 26, { salary: 720e6 }).insurance, 28.8e6);
const child = worker({ children: [{ initialAge: 0, joinedAtAge: 25 }] });
assert.equal(getAnnualEconomy(child, 26, { salary: 180e6 }).incomeTax, 480000);
assert.equal(getAnnualEconomy(worker(), 26, { salary: 120e6, sideIncome: 60e6 }).incomeTax, 2.52e6);
assert.equal(getAnnualEconomy(worker(), 26, { assetIncome: 60e6 }).assetTax, 2.4e6);
assert.equal(getAnnualEconomy(worker(), 26, { salary: 180e6, retired: true }).incomeTax, 0);
assert.equal(getAnnualEconomy(worker(), 26, { salary: 180e6, retired: true }).insurance, 0);
console.log('PASS marginal taxes, allowances, dependent deduction, side income, asset tax and pension exemptions');

assert.equal(getRent(worker(), 21), 0);
assert.equal(getRent(worker(), 22), 24e6);
assert.equal(getRent(worker({ careerPath: { id: 'casual' } }), 18), 24e6);
const overseas = worker({ careerPath: { id: 'study-abroad', school: { type: 'international', countryId: 'japan' } } });
assert.equal(getRent(overseas, 22), 36e6);
overseas.employmentStatus = 'unemployed';
overseas.abroadProgress = { phase: 'remediation', language: 10, academic: 10, extendedStudyUntilAge: 26 };
assert.equal(getRent(overseas, 26), 0, 'Not graduated yet: student costs replace residential rent');
assert.equal(getYearLivingCost(overseas.careerPath, 26, 0, 'normal', overseas), 24e6);
for (const mode of ['normal', 'frugal']) assert.equal(getYearLivingCost(null, 40, 1e9, mode), 0);
for (const id of ['starter-apartment', 'house', 'story-home', 'story-small-home']) {
  const p = worker({ purchases: [{ id, boughtAtAge: 25 }] });
  assert.ok(getResidence(p, 26));
  assert.equal(getRent(p, 26), 0);
}
assert.equal(getRent(worker({ purchases: [{ id: 'hotel', boughtAtAge: 25 }] }), 26), 24e6);
const landlord = worker({ purchases: [{ id: 'house', boughtAtAge: 20, rentedAtAge: 25 }] });
assert.equal(getRent(landlord, 26), 24e6);
assert.equal(getRent(landlord, 30), 0, 'Lease expires before the next accounting year');
const owner = worker({ purchases: [{ id: 'starter-apartment', boughtAtAge: 25 }] });
assert.equal(getAnnualEconomy(owner, 26).propertyTax, 0, 'First affordable home fits the residence allowance');
owner.purchases = [];
assert.equal(getRent(owner, 26), 24e6, 'Selling the residence restores rent');
console.log('PASS graduation, remedial study, residence ownership, commercial property, leasing and selling');

assert.deepEqual(Object.keys(HOME_TERMS), ['story-home']);
assert.equal(getShopItem('story-home').price, 600e6);
assert.equal(getShopItem('starter-apartment').price, 800e6);
assert.ok(!shopCatalog.some(item => item.id === 'story-small-home'));
assert.equal(getShopItem('story-small-home').id, 'story-home', 'Legacy owned homes still provide housing');
assert.ok(isAtLimit(worker({ purchases: [{ id: 'story-small-home' }] }), getShopItem('story-home')));
const buyer = worker({ money: 120e6 });
const financed = prepareStoryChoice({ home: 'story-home', label: 'Mua nhà' }, buyer, 25);
assert.equal(financed.money, -120e6);
buyer.money += financed.money;
Object.assign(buyer, financed.playerUpdates);
assert.equal(buyer.money, 0);
assert.equal(buyer.homeLoans[0].principal, 480e6);
assert.equal(buyer.homeLoans[0].outstanding, 768e6);
assert.equal(buyer.homeLoans[0].annualPayment, 38.4e6);
assert.equal(getRent(buyer, 25), 0, 'Housing starts before the first installment');
assert.equal(getAnnualEconomy(buyer, 26).propertyTax, 0);
assert.equal(collectHomeLoanYear(buyer, 25), null);
for (let age = 26; age <= 45; age++) {
  assert.equal(collectHomeLoanYear(buyer, age).amount, 38.4e6);
  assert.equal(collectHomeLoanYear(buyer, age), null, 'Installments never charge twice');
  Object.assign(buyer, JSON.parse(JSON.stringify(buyer)));
  assert.equal(collectHomeLoanYear(buyer, age), null, 'Reload preserves the paid year');
}
assert.equal(buyer.homeLoans[0].outstanding, 0);
assert.equal(buyer.money, -768e6);
assert.equal(collectHomeLoanYear(buyer, 46), null);
assert.equal(getRent(buyer, 46), 0, 'The home remains owned after payoff');
const pendingLegacy = prepareStoryChoice({ home: 'story-small-home', label: 'Mua nhà' }, worker(), 28);
assert.equal(pendingLegacy.money, -120e6);
assert.equal(pendingLegacy.playerUpdates.purchases.at(-1).id, 'story-home');
console.log('PASS one 600m installment home: 120m deposit, 20 x 38.4m, immediate residence, payoff, legacy IDs and 800m cash apartment');

for (const extra of [
  {},
  { children: [{ id: 'c', initialAge: 8, joinedAtAge: 25, educationPlan: 'supported', collegeSupport: true }] },
  { age: 61, lastSalaryAge: 61 },
  { careerPath: { id: 'casual' }, employmentStatus: 'unemployed', streetJobs: [{ id: 'lottery-seller', startedAtAge: 20 }] },
  { careerPath: { id: 'casual' }, employmentStatus: 'unemployed', streetJobs: [{ id: 'noodle-seller', startedAtAge: 20 }], purchases: [{ id: 'noodle-cart', boughtAtAge: 20 }] },
]) {
  const p = worker({ money: 150e6, ...extra });
  const before = JSON.stringify(p);
  const preview = getHomePurchasePreview(p, 'story-home');
  assert.equal(JSON.stringify(p), before, 'Housing forecast must not charge or change the save');
  const choice = prepareStoryChoice({ home: 'story-home', label: 'Mua nhà' }, p, p.age);
  assert.ok(choice.label.includes(preview.cashFlowText), 'Story choices show the same affordability preview');
  p.money += choice.money;
  Object.assign(p, choice.playerUpdates);
  assert.equal(p.money, preview.cashAfterDeposit);
  assert.equal(forecastNextYear(p).after, preview.after);
  year(p, p.age + 1);
  assert.equal(p.money, preview.after, 'Housing preview matches actual annual accounting, including family or retirement');
}
const lowIncome = worker({ careerPath: { id: 'casual' }, employmentStatus: 'unemployed', streetJobs: [{ id: 'lottery-seller', startedAtAge: 20 }] });
assert.equal(getHomePurchasePreview(lowIncome, 'story-home').annualNet, -2.4e6);
assert.match(getHomePurchasePreview(lowIncome, 'story-home').warning, /chi vượt thu/);
const modestIncome = worker({ careerPath: { id: 'casual' }, employmentStatus: 'unemployed', streetJobs: [{ id: 'street-vendor', startedAtAge: 20 }] });
assert.equal(getHomePurchasePreview(modestIncome, 'story-home').annualNet, 9.6e6);
assert.match(getHomePurchasePreview(modestIncome, 'story-home').warning, /dự phòng/);
const existingContract = worker({ homeLoans: [{ principal: 480e6, outstanding: 912e6, annualPayment: 60.8e6, years: 15, startedAtAge: 25, lastPaidAge: 25, paymentsMade: 0 }] });
assert.equal(collectHomeLoanYear(existingContract, 26).amount, 60.8e6, 'Existing signed contracts keep their saved terms');
console.log('PASS balanced housing: 3% flat/20 years; pure affordability preview; actual yearly cash, family and retirement; low-income warnings; existing contracts preserved');

for (const extra of [
  {}, { money: -100e6 }, { livingMode: 'luxury' },
  { purchases: [{ id: 'starter-apartment', boughtAtAge: 25 }] },
  { purchases: [{ id: 'house', uid: 'h', boughtAtAge: 20, rentedAtAge: 25 }, { id: 'cafe', boughtAtAge: 20 }] },
  { streetJobs: [{ id: 'lottery-seller', startedAtAge: 20 }] },
  { children: [{ initialAge: 2, joinedAtAge: 25, lastCarePaidAtAge: 25 }] },
  { age: 61, lastSalaryAge: 61 },
  { age: 30, prison: { enteredAge: 30, releaseAge: 33 }, employmentStatus: 'unemployed', careerLevel: 0 },
]) {
  const p = worker(extra);
  const old = JSON.stringify(p);
  const forecast = forecastNextYear(p);
  assert.equal(JSON.stringify(p), old, 'Forecast must be read-only');
  year(p, forecast.age);
  assert.equal(p.money, forecast.after, JSON.stringify(extra));
}
const p = worker();
year(p, 26);
const paid = p.money;
year(p, 26);
assert.equal(p.money, paid, 'No repeated tax/rent in one year');
const restored = JSON.parse(JSON.stringify(p));
year(restored, 26);
assert.equal(restored.money, paid, 'Payment guard survives save/reload');
const normal = worker(), gift = worker();
year(normal, 26); year(gift, 26, { money: gift.money + 100e6 });
assert.equal(gift.money - normal.money, 100e6, 'One-off gifts do not get taxed as salary');
console.log('PASS actual cash flow matches forecasts; pension/prison/debt; no duplicate or retroactive fees');
const hired = worker({ age: 22, money: 180e6, lastSalaryAge: 22, careerPath: { id: 'medicine' } });
const hiringDeductions = collectHiringDeductions(hired, 22, { amount: 180e6 });
assert.equal(hiringDeductions.amount, 16.68e6);
assert.equal(hired.money, 163.32e6);
assert.equal(collectHiringDeductions(hired, 22, null), null);
year(hired, 22);
assert.equal(hired.money, 139.32e6, 'Annual close only adds rent; salary tax already withheld');
assert.equal(hired.economyIncomeYear.paidIncomeTax, 2.28e6);
const paidHire = hired.money;
year(hired, 22);
assert.equal(hired.money, paidHire);
const afterSideJob = worker({ money: 500e6, economyPaidAge: 25,
  economyIncomeYear: { age: 25, salary: 0, sideIncome: 240e6, assetIncome: 0, paidIncomeTax: 9e6, paidInsurance: 0 } });
const topUp = collectHiringDeductions(afterSideJob, 25, { amount: 180e6 });
assert.equal(topUp.incomeTax, 21.84e6);
assert.equal(topUp.insurance, 14.4e6);
assert.equal(afterSideJob.money, 463.76e6);
console.log('PASS first hiring withholds deductions, shares yearly allowance with side jobs and never duplicates rent/tax');

for (const ranks of Object.values(careerAnnualSalaries)) assert.ok(ranks[0] >= 120e6 && ranks[0] <= 180e6);
for (const country of studyAbroadCountries) {
  assert.ok(country.salaries[0] >= 120e6 && country.salaries[0] <= 180e6);
  const debt = 4 * (country.tuition + country.living);
  const abroad = worker({ age: 22, money: -debt, careerPath: { id: 'study-abroad', school: { type: 'international', countryId: country.id } }, lastSalaryAge: 22 });
  for (let age = 23; age <= 32; age++) {
    const forecast = forecastNextYear(abroad);
    year(abroad, age);
    assert.equal(abroad.money, forecast.after);
  }
  assert.ok(abroad.money > 0, country.id + ': entry salary can repay four years of study within ten working years');
}
console.log('PASS domestic/international entry salaries 10–15m/month and overseas debt remains repayable');
