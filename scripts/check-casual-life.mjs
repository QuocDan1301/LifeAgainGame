import assert from 'node:assert/strict';
import { createInitialState } from '../js/core/state.js';
import { careerEvent } from '../js/career/career-event.js';
import { createCasualStartChoice, createCasualServiceEvent, getStreetJobBlocker, startStreetJob, getStreetIncome, collectStreetYear } from '../js/career/street-work.js';
import { createCasualLifeEvents } from '../js/events/casual-life.js';
import { completeLifeYear, forecastNextYear, getAnnualTuition } from '../js/relationships/family.js';
import { getAssetYearProjection } from '../js/leisure/shop.js';
import { createEmploymentEvent } from '../js/career/career-jobs.js';
import { createGraduationNotice } from '../js/career/job-applications.js';
import { RETIREMENT_AGE } from '../js/career/career-salary.js';

let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log(`PASS ${name}`); };
const player = gender => ({ ...createInitialState().player, gender, age: 18, health: 90,
  intelligence: 70, happiness: 80, appearance: 70, money: 100_000_000, relatives: [], illnessPlan: [] });
const start = p => { const c = createCasualStartChoice(p, careerEvent.choices.find(c => c.careerPath.id === 'casual')); Object.assign(p, c.playerUpdates, { careerPath: c.careerPath }); return c; };
test('No-school choice is available and has no tuition or graduation', () => {
  const p = player('female'); start(p);
  assert.equal(p.casualService, null); assert.equal(getAnnualTuition(p.careerPath), 0);
  assert.equal(createEmploymentEvent(p, 22), null); assert.equal(createGraduationNotice(p, 22), null);
  assert.ok(createCasualLifeEvents(19, p).length);
});
test('Men enlist immediately and return at twenty, including a saved service', () => {
  const p = player('male'); start(p);
  assert.equal(p.casualService.releaseAge, 20);
  assert.equal(createCasualServiceEvent(p, 19).id, 'casual-training');
  assert.deepEqual(createCasualLifeEvents(19, p), []);
  p.purchases = [{ id: 'motorbike' }];
  assert.ok(getStreetJobBlocker(p, 'motorbike-taxi').includes('nghĩa vụ'));
  const restored = JSON.parse(JSON.stringify(p));
  const release = createCasualServiceEvent(restored, 20);
  completeLifeYear(restored, 20, release.choices[0].playerUpdates);
  assert.equal(restored.casualService, null);
  assert.equal(startStreetJob(restored, 'motorbike-taxi'), true);
});
test('Both jobs require the right asset, and wait until students leave school', () => {
  const p = player('female'); p.careerPath = { id: 'programming', school: { name: 'Test' } };
  assert.equal(startStreetJob(p, 'noodle-seller'), false);
  assert.equal(startStreetJob(p, 'motorbike-taxi'), false);
  p.purchases = [{ id: 'noodle-cart' }, { id: 'motorbike' }];
  assert.match(getStreetJobBlocker(p, 'noodle-seller'), /đi học/, 'Students cannot stack street jobs on top of school');
  assert.equal(startStreetJob(p, 'noodle-seller'), false);
  p.age = 22;
  assert.equal(startStreetJob(p, 'noodle-seller'), true);
  assert.equal(startStreetJob(p, 'motorbike-taxi'), true);
  assert.equal(startStreetJob(p, 'motorbike-taxi'), false);
  assert.equal(getStreetIncome(p, 22), 0);
  assert.equal(getStreetIncome(p, 23), 132_000_000);
});
test('Income is paid once, assets give no passive noodle income, sale stops work', () => {
  const p = player('female'); p.purchases = [{ id: 'noodle-cart', boughtAtAge: 18 }];
  startStreetJob(p, 'noodle-seller');
  assert.equal(getAssetYearProjection(p, 19).recurringIncome, 0);
  const money = p.money;
  assert.equal(collectStreetYear(p, 19).amount, 60_000_000);
  assert.equal(p.money, money + 60_000_000);
  assert.equal(collectStreetYear(p, 19), null);
  p.purchases = []; assert.equal(getStreetIncome(p, 20), 0);
  assert.deepEqual(createCasualLifeEvents(20, p), []);
});
test('Forecast and annual accounting agree for a working student', () => {
  const p = player('female'); p.age = 24; p.employmentStatus = 'declined';
  p.careerPath = { id: 'programming', school: null };
  p.purchases = [{ id: 'motorbike', boughtAtAge: 23 }]; startStreetJob(p, 'motorbike-taxi');
  const forecast = forecastNextYear(p); const before = p.money;
  const original = Math.random; Math.random = () => 0.99;
  try { const year = completeLifeYear(p, 25); assert.equal(year.sideJobs.amount, 72_000_000); }
  finally { Math.random = original; }
  assert.equal(p.money, forecast.after); assert.ok(p.money > before);
});
test('Own stories span working ages, end at retirement and support both jobs', () => {
  const p = player('female'); start(p);
  for (const age of [19, 25, 35, 45, 55, RETIREMENT_AGE - 1]) assert.ok(createCasualLifeEvents(age, p).length);
  p.purchases = [{ id: 'noodle-cart' }, { id: 'motorbike' }]; startStreetJob(p, 'noodle-seller'); startStreetJob(p, 'motorbike-taxi');
  const events = createCasualLifeEvents(40, p);
  assert.ok(events.some(e => e.id.includes('noodle-seller')));
  assert.ok(events.some(e => e.id.includes('motorbike-taxi')));
  assert.deepEqual(createCasualLifeEvents(RETIREMENT_AGE, p), []);
  assert.equal(getStreetIncome(p, RETIREMENT_AGE), 0);
  assert.ok(collectStreetYear(p, RETIREMENT_AGE).content.includes('nghỉ'));
  assert.deepEqual(p.streetJobs, []);
});
console.log(`PASS ${passed} casual life groups`);
