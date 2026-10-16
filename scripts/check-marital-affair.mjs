import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createInitialState } from '../js/core/state.js';
import { getEventTags } from '../js/events/event-category.js';
import { createMaritalAffairEvent, getActiveAffair } from '../js/relationships/marital-affair.js';
import { getBreakupUpdates, canStartRelationship } from '../js/relationships/relationships.js';
import { createRelativeDeathEvent } from '../js/relationships/family-members.js';

const spouse = { id: 'spouse', name: 'An', relationship: 85, gender: 'female',
  ageAtMeeting: 25, metAtAge: 25, stats: { health: 100 } };
const makePlayer = () => ({ ...createInitialState().player, age: 30, gender: 'male',
  orientation: 'heterosexual', isAlive: true, happiness: 80, partner: { ...spouse },
  marriedAtAge: 27, children: [{ id: 'child', name: 'Bé', birthAge: 28 }], childcareDebt: 123 });
const apply = (player, event, index) => Object.assign(player,
  JSON.parse(JSON.stringify(event.choices[index].playerUpdates)));
const begin = () => {
  const player = makePlayer();
  apply(player, createMaritalAffairEvent(player, 30, () => 0), 1);
  return player;
};
let count = 0;
const test = (name, run) => { run(); count++; console.log(`PASS ${name}`); };

test('Opportunity respects eligibility and its exact probability boundary', () => {
  const p = makePlayer();
  for (const change of [{ marriedAtAge: null }, { partner: null }, { isAlive: false },
    { marriedAtAge: 30 }, { prison: { releaseAge: 35 } }, { partner: { ...spouse, deceased: true } }]) {
    assert.equal(createMaritalAffairEvent({ ...p, ...change }, 30, () => 0), null);
  }
  assert.equal(createMaritalAffairEvent(p, 30, () => 0.15), null);
  assert.ok(createMaritalAffairEvent(p, 30, () => 0.149));
});
test('Preview is pure, refusal preserves marriage, acceptance survives JSON saves', () => {
  const p = makePlayer(); const before = JSON.stringify(p);
  const event = createMaritalAffairEvent(p, 30, () => 0);
  assert.equal(JSON.stringify(p), before);
  apply(p, event, 0);
  assert.equal(p.affair, null); assert.equal(p.partner.id, 'spouse');
  assert.equal(createMaritalAffairEvent(p, 30, () => 0), null);
  const q = JSON.parse(JSON.stringify(begin()));
  assert.ok(getActiveAffair(q)); assert.equal(q.marriedAtAge, 27);
  assert.equal(q.otherPartners.length, 0); assert.equal(canStartRelationship(q), false);
  assert.equal(createMaritalAffairEvent(q, 30, () => 0), null);
});
test('Discovery uses 50% boundary and cannot mutate preview state', () => {
  const p = begin(); const before = JSON.stringify(p);
  assert.equal(createMaritalAffairEvent(p, 31, () => 0.499).title, 'Tin nhắn không thể giấu');
  assert.equal(createMaritalAffairEvent(p, 31, () => 0.5).title, 'Bí mật vẫn còn đó');
  assert.equal(JSON.stringify(p), before);
});
test('Undiscovered affair can end or continue; one resolution per year', () => {
  for (const index of [0, 1]) {
    const p = begin(); const event = createMaritalAffairEvent(p, 31, () => 0.5);
    apply(p, event, index);
    assert.equal(Boolean(getActiveAffair(p)), index === 1);
    assert.equal(p.partner.id, 'spouse'); assert.equal(p.marriedAtAge, 27);
    assert.equal(p.partner.relationship, index === 1 ? 80 : 85);
    assert.equal(createMaritalAffairEvent(p, 31, () => 0), null);
  }
});
test('Reconciliation ends affair, reduces trust, keeps spouse and children', () => {
  const p = begin(); p.partnerPromise = { partnerId: spouse.id };
  apply(p, createMaritalAffairEvent(p, 31, () => 0), 0);
  assert.equal(p.affair, null); assert.equal(p.partner.relationship, 50);
  assert.equal(p.marriedAtAge, 27); assert.equal(p.partnerPromise, null);
  assert.equal(p.children.length, 1); assert.equal(p.childcareDebt, 123);
  assert.equal(p.relationshipHistory.at(-1).type, 'affair-discovered');
});
test('Low trust, denial, and voluntary divorce end marriage and preserve childcare', () => {
  for (const index of [0, 1, 2]) {
    const p = begin(); if (index === 0) p.partner.relationship = 69;
    apply(p, createMaritalAffairEvent(p, 31, () => 0), index);
    assert.equal(p.partner, null); assert.equal(p.marriedAtAge, null);
    assert.equal(p.affair, null); assert.equal(p.children.length, 1);
    assert.equal(p.childcareDebt, 123); assert.equal(p.nextChildProposalAge, null);
    assert.equal(p.relationshipHistory.at(-1).type, 'divorced');
    assert.equal(p.relationshipHistory.at(-1).age, 31);
    assert.ok(p.moodEffects.length > 0);
  }
});
test('Manual divorce and widowhood clear the secret relationship', () => {
  const p = begin(); Object.assign(p, getBreakupUpdates(p)); assert.equal(p.affair, null);
  const q = begin(); q.relatives = []; q.partner.ageAtMeeting = 110;
  const death = createRelativeDeathEvent(q, 31, () => 0);
  assert.ok(death);
  apply(q, death, 0); assert.equal(q.affair, null); assert.equal(q.partner, null);
  assert.equal(getActiveAffair({ ...begin(), partner: { ...spouse, id: 'new-spouse' } }), null);
});
test('Game handler stages serialized choices, applies happiness and guards repeated clicks', () => {
  const main = fs.readFileSync(new URL('../js/main.js', import.meta.url), 'utf8');
  const start = main.indexOf('function chooseEventAction(index)');
  const handler = main.slice(start, main.indexOf('ageButton.addEventListener("click",', start));
  for (const index of [0, 1, 2]) {
    const p = begin();
    const state = { player: p, pendingEvent: JSON.parse(JSON.stringify({
      ...createMaritalAffairEvent(p, 31, () => 0), stage: 'choice', age: 31,
    })) };
    const before = JSON.stringify(p);
    const ctx = vm.createContext({ state, canAffordChoice: () => true, softenSetback: (_, c) => c,
      statNames: { happiness: 'Hạnh phúc' }, createSchoolEntryReward: () => null,
      createEventLogSummary: ({ changes }) => changes.join(' '), getChoiceOutcome: () => null,
      getEventTags, saveEventProgress() {}, showPendingEvent() {} });
    vm.runInContext(handler, ctx);
    vm.runInContext(`chooseEventAction(${index})`, ctx);
    assert.equal(JSON.stringify(p), before);
    assert.equal(state.pendingEvent.stage, 'result');
    assert.equal(state.pendingEvent.updates.affair, null);
    assert.equal(state.pendingEvent.updates.partner?.id ?? null, index === 0 ? 'spouse' : null);
    assert.equal(state.pendingEvent.updates.happiness, 80 - [12, 8, 5][index]);
    const snapshot = JSON.stringify(state.pendingEvent);
    state.pendingEvent = JSON.parse(snapshot);
    vm.runInContext('chooseEventAction(0)', ctx);
    assert.equal(JSON.stringify(state.pendingEvent), snapshot);
  }
});
test('Only two invitations per life, including refusals, remarriage and reloads', () => {
  const p = makePlayer();
  for (const age of [30, 31]) {
    const event = createMaritalAffairEvent(p, age, () => 0);
    assert.ok(event);
    assert.equal(event.choices[0].playerUpdates.affairOpportunityCount, age - 29);
    assert.equal(event.choices[1].playerUpdates.affairOpportunityCount, age - 29);
    apply(p, JSON.parse(JSON.stringify(event)), 0);
  }
  const restored = JSON.parse(JSON.stringify(p));
  restored.partner = { ...spouse, id: 'new-spouse' };
  restored.marriedAtAge = 32;
  assert.equal(createMaritalAffairEvent(restored, 34, () => 0), null);
});
test('Second invitation still allows discovery and consequences of an active affair', () => {
  const p = makePlayer();
  apply(p, createMaritalAffairEvent(p, 30, () => 0), 0);
  apply(p, createMaritalAffairEvent(p, 31, () => 0), 1);
  assert.equal(p.affairOpportunityCount, 2);
  const continuation = createMaritalAffairEvent(p, 32, () => 0.9);
  assert.equal(continuation.title, 'Bí mật vẫn còn đó');
  apply(p, continuation, 1);
  assert.equal(p.affairOpportunityCount, 2);
  const discovery = createMaritalAffairEvent(p, 33, () => 0);
  assert.equal(discovery.title, 'Tin nhắn không thể giấu');
  apply(p, discovery, 0);
  assert.equal(p.affair, null);
  assert.equal(createMaritalAffairEvent(p, 34, () => 0), null);
});
test('Older saves retain known invitation history', () => {
  const p = makePlayer();
  delete p.affairOpportunityCount;
  p.affairLastEventAge = 29;
  assert.equal(createMaritalAffairEvent(p, 30, () => 0).choices[0].playerUpdates.affairOpportunityCount, 2);
  p.relationshipHistory = [{ type: 'affair' }, { type: 'affair' }];
  assert.equal(createMaritalAffairEvent(p, 30, () => 0), null);
});
console.log(`${count} marital affair checks passed.`);
