import assert from 'node:assert/strict';
import { annualDatingCost, getDatingExpenses, DATING_COST_MIN, DATING_COST_MAX } from '../js/relationships/dating-expenses.js';
import { getFamilyBudget, collectFamilyBudget } from '../js/relationships/family-budget.js';
import { completeLifeYear, forecastNextYear } from '../js/relationships/family.js';
import { selectDatingPartnerUpdates, addDatingPartnerUpdates } from '../js/relationships/concurrent-dating.js';
import { createInitialState } from '../js/core/state.js';

const partner = (gender = 'female', id = 'person-73') => ({ id, name: 'An', gender, metAtAge: 25, ageAtMeeting: 25, relationship: 80, condition: 'healthy', stats: { health: 80, happiness: 70 } });
const base = (gender = 'male', person = partner()) => ({ ...createInitialState().player,
  age: 30, gender, partner: person, relationshipStartedAtAge: 25, marriedAtAge: null, otherPartners: [],
  money: 100000000, happiness: 70, health: 90, intelligence: 50, employmentStatus: 'declined',
  relatives: [], children: [], isAlive: true });

for (const [gender, lover, count] of [['male', 'female', 1], ['male', 'male', 1], ['female', 'male', 0], ['female', 'female', 1]]) {
  const player = base(gender, partner(lover));
  const before = JSON.stringify(player);
  const charges = getDatingExpenses(player, 31);
  assert.equal(charges.length, count, `${gender} dating ${lover}`);
  assert.equal(JSON.stringify(player), before, 'preview stays pure');
  assert.deepEqual(getDatingExpenses(JSON.parse(before), 31), charges, 'reload does not reroll');
}
const amounts = new Set();
for (let age = 31; age < 60; age++) {
  const amount = annualDatingCost(partner(), age, 25);
  assert.ok(amount >= DATING_COST_MIN && amount <= DATING_COST_MAX);
  assert.equal(amount % 1000000, 0);
  amounts.add(amount);
}
assert.ok(amounts.size >= 10, 'annual expenses vary instead of staying flat');
for (const overrides of [{ partner: null }, { isAlive: false }, { marriedAtAge: 29 }, { prison: { enteredAge: 29, releaseAge: 31 } }]) {
  assert.equal(getDatingExpenses({ ...base(), ...overrides }, 31).length, 0);
}
assert.equal(getDatingExpenses(base(), 17).length, 0);
assert.equal(getDatingExpenses({ ...base(), partner: { ...partner(), deceased: true } }, 31).length, 0);
assert.equal(getDatingExpenses({ ...base(), relationshipStartedAtAge: 31 }, 31).length, 0, 'no charge on starting birthday');
assert.equal(getDatingExpenses({ ...base(), relationshipStartedAtAge: 31 }, 32).length, 1);

const multiple = base('female', partner('male', 'a'));
multiple.otherPartners = [{ ...partner('female', 'b'), datingState: { relationshipStartedAtAge: 27 } }];
const original = getDatingExpenses(multiple, 31);
assert.equal(original.length, 1, 'only the female partner is chargeable for a female character');
Object.assign(multiple, selectDatingPartnerUpdates(multiple, 'b'));
assert.deepEqual(getDatingExpenses(multiple, 31), original, 'switching selected partner preserves the cost');
const two = base('male', partner('female', 'a'));
two.otherPartners = [{ ...partner('female', 'b'), datingState: { relationshipStartedAtAge: 27 } }, partner('female', 'a')];
assert.equal(getDatingExpenses(two, 31).length, 2, 'each distinct partner charged once');

const player = base();
const expected = getDatingExpenses(player, 31)[0].amount;
const forecastSnapshot = JSON.stringify(player);
const forecast = forecastNextYear(player);
assert.equal(forecast.dating, expected);
assert.equal(forecast.familyBudget, expected);
assert.equal(JSON.stringify(player), forecastSnapshot);
const withoutPartner = forecastNextYear({ ...player, partner: null });
assert.equal(forecast.costs - withoutPartner.costs, expected);
const budget = getFamilyBudget(player, 31);
const money = player.money;
const relationship = player.partner.relationship;
const paid = collectFamilyBudget(player, 31, budget);
assert.equal(player.money, money - expected);
assert.equal(player.partner.relationship, relationship, 'automatic spending does not buy relationship points');
assert.match(paid.content, /Chi phí hẹn hò/);
assert.equal(collectFamilyBudget(JSON.parse(JSON.stringify(player)), 31), null, 'reload cannot double charge');

// Actual annual collection agrees with the forecast, including debt and paused dating.
const random = Math.random;
Math.random = () => 0.99;
try {
  for (const gender of ['male', 'female']) {
    for (const lover of ['male', 'female']) {
      const p = base(gender, partner(lover));
      const f = forecastNextYear(p);
      completeLifeYear(p, 31);
      assert.equal(p.money, f.after, `forecast/collection agree for ${gender}/${lover}`);
    }
  }
  const poor = { ...base(), money: 0 };
  const poorForecast = forecastNextYear(poor);
  completeLifeYear(poor, 31);
  assert.equal(poor.money, poorForecast.after);
  assert.ok(poor.money < 0, 'insufficient balance follows the existing debt rules');
  const newDating = { ...base(), partner: null, relationshipStartedAtAge: null };
  const date = partner();
  const updates = addDatingPartnerUpdates(newDating, date, 31);
  const result = completeLifeYear(newDating, 31, updates);
  assert.ok(!result.living?.content.includes('Chi phí hẹn hò'), 'no whole-year charge when a relationship just begins');
  assert.ok(forecastNextYear(newDating).dating >= DATING_COST_MIN);
  for (const updates of [{ partner: null, otherPartners: [] }, { marriedAtAge: 31 }]) {
    const p = base();
    const result = completeLifeYear(p, 31, updates);
    assert.ok(!result.living?.content.includes('Chi phí hẹn hò'), 'breakup/marriage stops the separate dating charge');
  }
  const released = { ...base(), prison: { enteredAge: 29, releaseAge: 31 } };
  assert.equal(forecastNextYear(released).dating, 0);
  const prisonYear = completeLifeYear(released, 31, { prison: null });
  assert.ok(!prisonYear.living?.content.includes('Chi phí hẹn hò'), 'release year has no outside dating expenses');
  assert.ok(forecastNextYear(released).dating >= DATING_COST_MIN);
} finally { Math.random = random; }
console.log('PASS dating expenses: male and female/female rules, varying annual amounts, stable forecasts/reloads, multiple partners, one charge/year, debt, relationship start/end, marriage and prison.');
