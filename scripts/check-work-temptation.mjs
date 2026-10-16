import assert from 'node:assert/strict';
import { createInitialState } from '../js/core/state.js';
import { createWorkTemptationEvent, createWorkInvestigationEvent, WORK_TEMPTATIONS } from '../js/career/work-temptation.js';
import { completeLifeYear } from '../js/relationships/family.js';
import { createPrisonEvent } from '../js/events/crime.js';
import { canAffordChoice } from '../js/core/story-transactions.js';
const player = () => ({ ...createInitialState().player, age: 30, money: -10_000_000, health: 80, happiness: 50,
  intelligence: 70, appearance: 70, careerPath: { id: 'programming' }, careerLevel: 2, job: 'Lập trình viên',
  employmentStatus: 'employed', employedSince: 24, nextPromotionAge: 33, relatives: [], illnessPlan: [] });
const sequence = values => { let index = 0; return () => values[index++] ?? 0.9; };
for (const p of [ { ...player(), employmentStatus: 'unemployed' }, { ...player(), age: 16 },
  { ...player(), isAlive: false }, { ...player(), prison: { releaseAge: 40 } },
  { ...player(), casualService: { releaseAge: 40 } }, { ...player(), lastWorkTemptationAge: 30 },
  { ...player(), workInvestigation: { dueAge: 32 } },
  { ...player(), careerPath: { id: 'study-abroad' }, abroadProgress: { phase: 'studying' } }]) {
  const before = JSON.stringify(p);
  assert.equal(createWorkTemptationEvent(p, p.age + 1, () => 0), null);
  assert.equal(JSON.stringify(p), before);
}
assert.equal(createWorkTemptationEvent(player(), 62, () => 0), null);
assert.equal(createWorkTemptationEvent(player(), 31, () => 0.99), null);
for (const template of WORK_TEMPTATIONS) {
  const p = { ...player(), careerPath: { id: template.careers[0] }, abroadProgress: { phase: 'graduated' } };
  const event = createWorkTemptationEvent(p, 31, () => 0);
  assert.ok(event.id.includes(template.id));
  assert.equal(event.choices.length, 4);
  assert.ok(event.text.includes('Ví của tôi đang âm'));
  assert.ok(event.text.includes('Nguy cơ bị phát hiện ngay'));
  assert.ok(event.choices.every(choice => canAffordChoice(p, choice)), 'Poverty must never force accepting an illegal offer');
}
const p = player(), before = JSON.stringify(p);
const arrested = createWorkTemptationEvent(p, 31, () => 0);
assert.equal(JSON.stringify(p), before, 'Showing an offer does not mutate the player');
const arrestChoice = arrested.choices[0];
assert.ok(arrestChoice.playerUpdates.prison);
assert.equal(arrestChoice.money, undefined);
assert.equal(arrestChoice.playerUpdates.employmentStatus, 'unemployed');
assert.equal(arrestChoice.playerUpdates.nextPromotionAge, null);
p.sideJobs = [{ id: 'old' }]; p.streetJobs = [{ id: 'old' }];
const arrestYear = completeLifeYear(p, 31, arrestChoice.playerUpdates);
assert.equal(p.age, 31);
assert.equal(arrestYear.salary, undefined);
assert.equal(arrestYear.sideJobs, undefined);
assert.deepEqual(p.sideJobs, []);
assert.deepEqual(p.streetJobs, []);
assert.ok(p.money < -10_000_000);
assert.equal(createPrisonEvent(p, 32).kind, 'prison');
assert.equal(createWorkTemptationEvent(p, 32, () => 0), null);

const successful = createWorkTemptationEvent(player(), 31, sequence([0, 0, 0.5, 0.99, 0, 0.99]));
const successChoice = successful.choices[0];
assert.ok(successChoice.money > 0);
assert.equal(successChoice.playerUpdates.workInvestigation.caught, true);
const worker = player();
const restored = JSON.parse(JSON.stringify(successful));
assert.deepEqual(restored.choices, successful.choices, 'Reload preserves every branch and future investigation');
completeLifeYear(worker, 31, { ...successChoice.playerUpdates, money: worker.money + successChoice.money });
assert.equal(createWorkInvestigationEvent(worker, 32), null);
worker.employmentStatus = 'unemployed'; worker.money = 0;
const investigation = createWorkInvestigationEvent(worker, 33);
assert.equal(investigation.kind, 'work-investigation');
assert.ok(investigation.choices[0].playerUpdates.money < -successChoice.money, 'Spent money and unemployment cannot erase recovery or fine');
completeLifeYear(worker, 33, investigation.choices[0].playerUpdates);
assert.equal(worker.workInvestigation, null);
assert.ok(worker.prison && worker.criminalRecord.length === 1);
assert.equal(createWorkInvestigationEvent(worker, 34), null);

const refused = createWorkTemptationEvent(player(), 31, () => 0).choices[1];
assert.ok(refused.playerUpdates.money < player().money);
assert.equal(refused.playerUpdates.nextPromotionAge, 35, 'Existing promotion date is delayed by two years');
assert.equal(refused.playerUpdates.prison, undefined);
const senior = createWorkTemptationEvent({ ...player(), careerLevel: 3 }, 31, () => 0).choices[1];
assert.equal(senior.playerUpdates.nextPromotionAge, undefined);
const report = createWorkTemptationEvent(player(), 31, () => 0).choices[2];
assert.equal(report.playerUpdates.employmentStatus, 'unemployed');
assert.equal(report.playerUpdates.prison, undefined);
const quit = successful.choices[3];
assert.equal(quit.playerUpdates.employmentStatus, 'unemployed');
assert.equal(quit.playerUpdates.careerExperience.careerId, 'programming');
const reformed = { ...player(), criminalRecord: [{ crime: 'old' }], crimeHeat: 10 };
const repeat = createWorkTemptationEvent(reformed, 31, () => 0).choices[0];
assert.ok(repeat.playerUpdates.prison.years > arrestChoice.playerUpdates.prison.years);
const noCase = createWorkTemptationEvent(player(), 31, sequence([0, 0, 0.5, 0.99, 0.99, 0.99])).choices[0];
const safe = { ...player(), ...noCase.playerUpdates };
const closure = createWorkInvestigationEvent(safe, 33);
assert.equal(closure.choices[0].playerUpdates.workInvestigation, null);
assert.equal(closure.choices[0].playerUpdates.prison, undefined);
// Each offer counts once regardless of the chosen answer, career changes or reloads.
for (let choiceIndex = 0; choiceIndex < 4; choiceIndex++) {
  const limited = player();
  for (const age of [31, 34]) {
    const event = createWorkTemptationEvent(limited, age, () => 0);
    assert.ok(event);
    const saved = JSON.parse(JSON.stringify(event));
    assert.equal(saved.choices[choiceIndex].playerUpdates.workTemptationCount, (limited.workTemptationCount ?? 0) + 1);
    Object.assign(limited, saved.choices[choiceIndex].playerUpdates);
    // Restore eligibility to prove quitting or a new job does not reset the lifetime cap.
    Object.assign(limited, { employmentStatus: 'employed', prison: null, workInvestigation: null,
      crimeActionAge: null, careerPath: { id: 'medicine' } });
  }
  assert.equal(limited.workTemptationCount, 2);
  assert.equal(createWorkTemptationEvent(JSON.parse(JSON.stringify(limited)), 40, () => 0), null);
}
const legacy = player();
delete legacy.workTemptationCount;
legacy.lastWorkTemptationAge = 25;
assert.equal(createWorkTemptationEvent(legacy, 31, () => 0).choices[0].playerUpdates.workTemptationCount, 2);
const pendingCase = { ...player(), workTemptationCount: 2, workInvestigation: successful.choices[0].playerUpdates.workInvestigation };
assert.ok(createWorkInvestigationEvent(pendingCase, 33), 'The cap does not erase an existing investigation');
console.log('PASS work temptation: nine career dilemmas; employment and age gates; frequency; all options available in debt; refusal cost; reporting risk; resignation; saved outcomes; delayed recovery; arrest year without wages; prison continuation; repeat-offense penalties');
