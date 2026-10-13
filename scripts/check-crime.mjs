import assert from 'node:assert/strict';
import { createInitialState } from '../js/core/state.js';
import { CRIMES, commitCrime, crimeRisk, createPrisonEvent, isInPrison } from '../js/events/crime.js';
import { completeLifeYear } from '../js/relationships/family.js';

const player = () => ({ ...createInitialState().player, age: 24, money: 100_000_000,
  health: 80, happiness: 80, intelligence: 70, appearance: 70, relatives: [], illnessPlan: [] });
let count = 0;
const test = (name, fn) => { fn(); count++; console.log(`PASS ${name}`); };
test('Age, death and invalid actions cannot mutate the character', () => {
  for (const p of [{ ...player(), age: 17 }, { ...player(), isAlive: false }, player()]) {
    const before = JSON.stringify(p);
    assert.equal(commitCrime(p, p.age === 24 && p.isAlive ? 'invalid' : 'theft', () => 0), null);
    assert.equal(JSON.stringify(p), before);
  }
});
test('Successful crime pays once per year and survives reload', () => {
  const p = player();
  assert.ok(commitCrime(p, 'theft', () => 0.99));
  assert.equal(p.money, 108_000_000);
  assert.equal(p.lifePath, 'dark');
  assert.equal(commitCrime(JSON.parse(JSON.stringify(p)), 'fraud', () => 0.99), null);
});
test('Arrest removes employment, fines the player and records the sentence', () => {
  const p = { ...player(), job: 'Kế toán', employmentStatus: 'employed', careerLevel: 2, sideJobs: [{ id: 'part-time' }] };
  commitCrime(p, 'theft', () => 0);
  assert.equal(p.money, 95_000_000);
  assert.equal(p.job, null);
  assert.equal(p.employmentStatus, 'unemployed');
  assert.deepEqual(p.sideJobs, []);
  assert.equal(p.prison.releaseAge, 26);
  assert.equal(p.criminalRecord.length, 1);
  assert.equal(commitCrime(p, 'robbery'), null);
});
test('Prison yearly story replaces outside life and keeps a saved sentence', () => {
  const p = player(); commitCrime(p, 'theft', () => 0);
  const restored = JSON.parse(JSON.stringify(p));
  assert.equal(isInPrison(restored), true);
  const event = createPrisonEvent(restored, 25);
  assert.equal(event.id, 'prison-year');
  assert.equal(event.choices.length, 3);
  const money = restored.money;
  const result = completeLifeYear(restored, 25, event.choices[0].playerUpdates);
  assert.equal(restored.age, 25);
  assert.equal(restored.money, money);
  assert.equal(result.salary, undefined);
  assert.equal(result.sideJobs, undefined);
  assert.equal(result.tuition, undefined);
  assert.equal(restored.lifePath, 'reformed');
});
test('Release happens at the promised age and a clean path preserves the record', () => {
  const p = player(); commitCrime(p, 'theft', () => 0);
  completeLifeYear(p, 25);
  const release = createPrisonEvent(p, 26);
  assert.equal(release.id, 'prison-release');
  completeLifeYear(p, 26, release.choices[0].playerUpdates);
  assert.equal(isInPrison(p), false);
  assert.equal(p.prison, null);
  assert.equal(p.lifePath, 'reformed');
  assert.equal(p.criminalRecord.length, 1);
  assert.equal(createPrisonEvent(p, 27), null);
});
test('Repeat offenses raise risk and extend the sentence', () => {
  const p = player(); commitCrime(p, 'theft', () => 0);
  completeLifeYear(p, 26, createPrisonEvent(p, 26).choices[1].playerUpdates);
  assert.ok(crimeRisk(p, CRIMES[0]) > CRIMES[0].risk);
  commitCrime(p, 'theft', () => 0);
  assert.equal(p.prison.years, 3);
  assert.equal(p.criminalRecord.length, 2);
});
test('Compensation can create debt without allowing crimes in prison', () => {
  const p = { ...player(), money: 0 };
  commitCrime(p, 'robbery', () => 0);
  assert.equal(p.money, -40_000_000);
  const before = p.money;
  const year = completeLifeYear(p, 25);
  assert.ok(p.money < before);
  assert.ok(year.living.content.includes('Lãi nợ'));
});
test('Study abroad blocks crimes while studying, then unlocks after graduation', () => {
  const p = { ...player(), careerPath: { id: 'study-abroad' }, abroadProgress: { phase: 'studying' } };
  assert.equal(commitCrime(p, 'theft', () => 0), null);
  p.abroadProgress.phase = 'graduated';
  assert.ok(commitCrime(p, 'theft', () => 0.99));
});
console.log(`PASS ${count} crime and prison checks`);
