import { getRecordPenalty, getConvictionSocialUpdates, collectReformationYear, getReformationUpdates, describeCrimeEnding } from '../js/events/crime-consequences.js';
import { getInterviewChance, rollInterview } from '../js/stats/intellect-rules.js';
import { getJobApplicationBlocker } from '../js/career/job-applications.js';
import { createLifeStoryEvents, isLifeStoryEligible } from '../js/events/life-stories.js';
import { afterPrisonStories } from '../js/events/life-stories/after-prison.js';
import { prepareStoryChoice } from '../js/core/story-transactions.js';
import { createWorkTemptationEvent } from '../js/career/work-temptation.js';
import assert from 'node:assert/strict';
import { createInitialState } from '../js/core/state.js';
import { crimeTools, hasCrimeTool } from '../js/events/crime-tools.js';
import { shopCatalog, shops, getSellPrice } from '../js/leisure/shop.js';
import { CRIMES, commitCrime, crimeRisk, createPrisonEvent, isInPrison } from '../js/events/crime.js';
import { completeLifeYear } from '../js/relationships/family.js';

const player = () => ({ ...createInitialState().player, age: 24, money: 100_000_000,
  health: 80, happiness: 80, intelligence: 70, appearance: 70, relatives: [], illnessPlan: [],
  purchases: crimeTools.map(tool => ({ id: tool.id, uid: tool.id, boughtAtAge: 24 })) });
let count = 0;
const test = (name, fn) => { fn(); count++; console.log(`PASS ${name}`); };
test('Age, death and invalid actions cannot mutate the character', () => {
  for (const p of [{ ...player(), age: 17 }, { ...player(), isAlive: false }, player()]) {
    const before = JSON.stringify(p);
    assert.equal(commitCrime(p, p.age === 24 && p.isAlive ? 'invalid' : 'theft', () => 0), null);
    assert.equal(JSON.stringify(p), before);
  }
});
test('Every crime requires its matching purchased tool, without mutation or rolling when missing', () => {
  for (const crime of CRIMES) {
    const p = player();
    p.purchases = p.purchases.filter(item => item.id !== crimeTools.find(tool => tool.crime === crime.id).id);
    const before = JSON.stringify(p);
    assert.equal(hasCrimeTool(p, crime.id), false);
    assert.equal(commitCrime(p, crime.id, () => { throw new Error('Must not roll without a tool'); }), null);
    assert.equal(JSON.stringify(p), before);
    p.purchases = undefined;
    assert.equal(commitCrime(p, crime.id), null);
  }
});
test('Tools are purchasable items, reusable after reload, and selling removes eligibility', () => {
  assert.equal(shops.shopping.groups.find(group => group.id === 'items').comingSoon, undefined);
  for (const tool of crimeTools) {
    assert.ok(shopCatalog.some(item => item.id === tool.id && item.group === 'items' && item.shop === 'shopping'));
    assert.equal(tool.minAge, 18);
    assert.equal(getSellPrice(tool), tool.price / 2);
    const p = JSON.parse(JSON.stringify(player()));
    const before = p.purchases.length;
    assert.ok(commitCrime(p, tool.crime, () => 0.99));
    assert.equal(p.purchases.length, before);
    p.age++;
    p.purchases = p.purchases.filter(item => item.id !== tool.id);
    assert.equal(commitCrime(p, tool.crime), null);
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
test('Conviction affects living family, friends and all partners without forcing a breakup', () => {
  const p = { ...player(), partner: { id: 'p', relationship: 80 }, otherPartners: [{ id: 'q', relationship: 60 }],
    relatives: [{ id: 'father', alive: true, bond: 70 }, { id: 'mother', alive: false, bond: 70 }],
    friends: [{ id: 'f', bond: 50 }] };
  commitCrime(p, 'theft', () => 0);
  assert.equal(p.partner.relationship, 68); assert.equal(p.otherPartners[0].relationship, 48);
  assert.equal(p.relatives[0].bond, 62); assert.equal(p.relatives[1].bond, 70); assert.equal(p.friends[0].bond, 45);
  assert.match(getJobApplicationBlocker({ ...p, careerPath: { id: 'programming' } }), /thụ án/);
});

test('Record penalties apply to actual interviews, with partial and full rehabilitation', () => {
  const p = { ...player(), intelligence: 50, careerPath: { id: 'programming' } };
  const clean = getInterviewChance(p, 'good').chance;
  p.criminalRecord = [{ age: 18, years: 2 }]; p.lifePath = 'dark';
  assert.ok(Math.abs(getInterviewChance(p, 'good').chance - (clean - 0.2)) < 1e-9);
  assert.match(rollInterview(p, 'good', () => clean - 0.15).note, /Tiền án/);
  assert.equal(rollInterview(p, 'good', () => clean - 0.15).passed, false);
  p.lifePath = 'reformed';
   
  assert.equal(getRecordPenalty({ ...p, prison: { enteredAge: 18, releaseAge: 20 } }), 0.2);
  assert.equal(getRecordPenalty(p), 0.1);
  assert.equal(rollInterview(p, 'good', () => clean - 0.15).passed, true);
  p.reformedYears = 3; Object.assign(p, getReformationUpdates(p));
  assert.equal(getRecordPenalty(p), 0);
  assert.equal(p.criminalRecord.length, 1);
  assert.match(describeCrimeEnding(p), /Những năm làm lại/);
});

test('Reformation needs full outside years, survives reload and resets on reoffending', () => {
  let p = { ...player(), age: 26, criminalRecord: [{ age: 24, years: 2 }], lifePath: 'reformed', releasedAtAge: 26 };
  collectReformationYear(p, 26); assert.equal(p.reformedYears, 0);
  for (const age of [27, 28, 29]) {
    p = JSON.parse(JSON.stringify(p)); collectReformationYear(p, age); collectReformationYear(p, age);
  }
  assert.equal(p.reformedYears, 3);
  Object.assign(p, getReformationUpdates(p)); assert.equal(getRecordPenalty(p), 0);
  p.age = 29; commitCrime(p, 'theft', () => 0.99);
  assert.equal(p.reformationRecognized, false); assert.equal(p.reformedYears, 0); assert.equal(getRecordPenalty(p), 0.2);
  p.lifePath = 'reformed'; collectReformationYear(p, 30); assert.equal(p.reformedYears, 0);
  collectReformationYear(p, 31); assert.equal(p.reformedYears, 1);
  p.workInvestigation = {}; collectReformationYear(p, 32); assert.equal(p.reformedYears, 0);
});

test('After-prison story is gated, follows flags and grants the letter only when ready', () => {
  const p = { ...player(), age: 30, storyFlags: [], criminalRecord: [{ age: 24, years: 2 }], lifePath: 'reformed', reformedYears: 3 };
  const root = afterPrisonStories[0], end = afterPrisonStories.at(-1);
  assert.equal(isLifeStoryEligible(root, 30, { ...p, criminalRecord: [] }), false);
  assert.equal(isLifeStoryEligible(root, 30, { ...p, prison: { releaseAge: 40 } }), false);
  assert.equal(isLifeStoryEligible(end, 30, p), false);
  for (const id of ['ls-tro-ve-ho-so', 'ls-tro-ve-nguoi-xac-nhan', 'ls-tro-ve-cuoc-hen', 'ls-tro-ve-thu-gioi-thieu']) {
    const raw = afterPrisonStories.find(s => s.id === id);
    assert.equal(isLifeStoryEligible(raw, p.age, p), true, id);
    // Search deterministic pools across names; no bypass of the real event adapter.
    let event;
    for (let i = 0; i < 200 && !event; i++) event = createLifeStoryEvents(p.age, { ...p, name: 'Test' + i }).find(e => e.id === id);
    assert.ok(event, id);
    const choice = event.choices.find(c => raw.choices[0].flags.every(f => c.playerUpdates.storyFlags.includes(f)));
    assert.ok(choice); Object.assign(p, choice.playerUpdates);
    assert.equal(isLifeStoryEligible(raw, p.age, p), false, 'Seen stories never repeat');
    p.age++;
  }
  assert.equal(p.reformationRecognized, true); assert.equal(getRecordPenalty(p), 0);
  assert.equal(isLifeStoryEligible(end, p.age, { ...p, reformationRecognized: false, reformedYears: 0, storyFlags: ['tro_ve_giu_hen'] }), false);
  assert.deepEqual(getReformationUpdates({ ...p, lifePath: 'dark' }), {});
});

test('Workplace conviction uses the same social consequences and ending', () => {
  const p = { ...player(), age: 30, careerPath: { id: 'programming' }, careerLevel: 2, employmentStatus: 'employed',
    partner: { relationship: 70 }, reformationRecognized: true, reformedYears: 5 };
  const event = createWorkTemptationEvent(p, 31, () => 0);
  assert.ok(event);
  const convicted = event.choices.find(c => c.playerUpdates?.prison);
  assert.ok(convicted);
  assert.equal(convicted.playerUpdates.partner.relationship, 58);
  assert.equal(convicted.playerUpdates.reformationRecognized, false);
  assert.match(describeCrimeEnding({ ...p, ...convicted.playerUpdates }), /cánh cổng/);
});
console.log(`PASS ${count} crime and prison checks`);
