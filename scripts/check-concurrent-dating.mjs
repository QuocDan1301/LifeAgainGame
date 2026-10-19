import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createDatingDramaStep } from '../js/relationships/dating-drama.js';
import { createInitialState } from '../js/core/state.js';
import { canStartRelationship, getDatingUpdates, getBreakupUpdates, getMarriageUpdates, createMarriageEvent } from '../js/relationships/relationships.js';
import { getDatingPartners, selectDatingPartnerUpdates, createConcurrentDatingEvent, postponeDatingMarriage } from '../js/relationships/concurrent-dating.js';
import { collectFamilyYear, createRelativeDeathEvent, getLivingFamily } from '../js/relationships/family-members.js';
import { createChildProposalEvent, completeLifeYear } from '../js/relationships/family.js';
import { createAcquaintanceEvent } from '../js/relationships/acquaintance.js';
import { getStatWear } from '../js/core/stat-budget.js';
let count = 0;
const test = (name, body) => { body(); count++; console.log(`PASS ${name}`); };
const person = (id, age = 25) => ({ id, name: `Người ${id}`, gender: 'female', ageAtMeeting: age,
  metAtAge: age, relationship: 80, condition: 'healthy', stats: { health: 80 }, workplace: 'cộng đồng', reason: 'thích trò chuyện' });
function player() { return { ...createInitialState().player, age: 25, gender: 'male', name: 'An',
  money: 500_000_000, health: 80, happiness: 80, intelligence: 80, appearance: 80,
  relatives: [], illnessPlan: [], relationshipHistory: [] }; }
function couple() {
  const p = player();
  Object.assign(p, getDatingUpdates(p, person('A'), 25));
  Object.assign(p, getDatingUpdates(p, person('B', 26), 26));
  return p;
}
test('Legacy one-person saves retain identity and permit a second person', () => {
  const p = player(); delete p.otherPartners;
  Object.assign(p, getDatingUpdates(p, person('A'), 25));
  p.partnerActions = { talk: 25 }; p.nextMarriageProposalAge = 32;
  Object.assign(p, getDatingUpdates(p, person('B', 26), 26));
  assert.equal(p.partner.id, 'A'); assert.equal(p.nextMarriageProposalAge, 32);
  assert.equal(p.partnerActions.talk, 25);
  assert.deepEqual(getDatingPartners(p).map(x => x.id), ['A', 'B']);
  assert.equal(canStartRelationship(p), false);
});
test('Reject duplicate, third, married and deceased-player dating', () => {
  const p = couple();
  assert.deepEqual(getDatingUpdates(p, person('A'), 26), {});
  assert.deepEqual(getDatingUpdates(p, person('C'), 26), {});
  assert.deepEqual(getDatingUpdates({ ...player(), marriedAtAge: 25 }, person('C'), 26), {});
  assert.deepEqual(getDatingUpdates({ ...player(), isAlive: false }, person('C'), 26), {});
});
test('Switching preserves each person’s actions, promise and wedding schedule across reload', () => {
  let p = couple();
  p.partnerActions = { talk: 27 };
  p.partnerPromise = { partnerId: 'A', dueAge: 28 }; p.nextMarriageProposalAge = 32;
  Object.assign(p, selectDatingPartnerUpdates(p, 'B'));
  assert.equal(p.nextMarriageProposalAge, 31); assert.deepEqual(p.partnerActions, {});
  p.partnerActions = { together: 27 }; p.partner.relationship = 91;
  p = JSON.parse(JSON.stringify(p));
  Object.assign(p, selectDatingPartnerUpdates(p, 'A'));
  assert.equal(p.partnerActions.talk, 27); assert.equal(p.partnerPromise.partnerId, 'A');
  assert.equal(p.nextMarriageProposalAge, 32);
  Object.assign(p, selectDatingPartnerUpdates(p, 'B'));
  assert.equal(p.partnerActions.together, 27); assert.equal(p.partner.relationship, 91);
});
test('Breakup removes only the selected person and preserves children', () => {
  const p = couple(); p.children = [{ id: 'child' }];
  Object.assign(p, getBreakupUpdates(p));
  assert.equal(p.partner.id, 'B'); assert.equal(p.nextMarriageProposalAge, 31);
  assert.equal(p.children.length, 1); assert.equal(p.relationshipHistory.at(-1).person.id, 'A');
  assert.equal(canStartRelationship(p), true);
  Object.assign(p, getBreakupUpdates(p));
  assert.equal(p.partner, null); assert.deepEqual(p.otherPartners, []);
});
test('Marriage finds the due person regardless of UI selection, and defers only that person', () => {
  const p = couple(); Object.assign(p, selectDatingPartnerUpdates(p, 'B'));
  const event = createMarriageEvent(p, 30);
  assert.equal(event.person.id, 'A'); assert.match(event.choices[0].label, /kết thúc/);
  postponeDatingMarriage(p, 'A', 33);
  assert.equal(p.nextMarriageProposalAge, 31);
  assert.equal(createMarriageEvent(p, 30), null);
  assert.equal(createMarriageEvent(p, 31).person.id, 'B');
});
test('Postponing and twice declining marriage retain the unrelated relationship', () => {
  const p = couple();
  Object.assign(p, getMarriageUpdates(p, person('A'), 30, 'decline'));
  assert.equal(p.nextMarriageProposalAge, 32); assert.equal(getDatingPartners(p).length, 2);
  Object.assign(p, getMarriageUpdates(p, person('A'), 32, 'decline'));
  assert.equal(p.partner.id, 'B'); assert.equal(p.nextMarriageProposalAge, 31);
  assert.equal(getDatingPartners(p).length, 1);
});
test('Wedding with the second person closes the first relationship and uses the right co-parent', () => {
  const p = couple();
  Object.assign(p, getMarriageUpdates(p, person('B'), 31, 'accept'));
  assert.equal(p.partner.id, 'B'); assert.equal(p.marriedAtAge, 31);
  assert.equal(p.otherPartners.length, 0); assert.equal(canStartRelationship(p), false);
  assert.ok(p.relationshipHistory.some(x => x.type === 'breakup' && x.person.id === 'A'));
  assert.equal(createChildProposalEvent(p, 36).person.id, 'B');
  const snapshot = JSON.stringify(p);
  assert.deepEqual(getMarriageUpdates(p, person('B'), 31, 'accept'), {});
  assert.equal(JSON.stringify(p), snapshot);
});
test('Discovery probability, preview purity, reload, choosing either person and ending both', () => {
  const p = couple(); const before = JSON.stringify(p);
  assert.equal(createConcurrentDatingEvent(p, 26, () => 0), null);
  assert.equal(createConcurrentDatingEvent(p, 27, () => 0.5), null);
  const event = createConcurrentDatingEvent(p, 27, () => 0.49);
  assert.equal(JSON.stringify(p), before); assert.equal(event.choices.length, 3);
  for (let i = 0; i < 3; i++) {
    const q = JSON.parse(before);
    let scene = event;
    for (const index of [0, 0, i]) {
      const reply = scene.choices[index];
      scene = createDatingDramaStep(q, 27, reply.nextStep, {
        ...scene.datingDrama, replies: [...scene.datingDrama.replies, reply.response],
      });
    }
    const choice = JSON.parse(JSON.stringify(scene.choices[0]));
    Object.assign(q, choice.playerUpdates);
    assert.equal(getDatingPartners(q).length, i === 2 ? 0 : 1);
    if (i < 2) { assert.equal(q.partner.id, i === 0 ? 'A' : 'B'); assert.equal(q.partner.relationship, 60); }
    assert.equal(createConcurrentDatingEvent(q, 27, () => 0), null);
  }
});
test('Both partners age, receive health progression and cannot evade a broken promise by switching', () => {
  const p = couple(); p.age = 28;
  p.otherPartners[0].datingState.partnerPromise = { partnerId: 'B', dueAge: 28 };
  assert.equal(getLivingFamily(p).length, 2);
  const result = collectFamilyYear(p, 29, () => 0.99);
  assert.equal(p.otherPartners[0].relationship, 75);
  assert.match(result.content, /Người B/);
  assert.equal(p.otherPartners[0].datingState.partnerPromise, null);
});
test('Death of either partner preserves the surviving relationship and its schedule', () => {
  for (const id of ['A', 'B']) {
    const p = couple(); p.age = 60;
    if (id === 'A') p.partner.ageAtMeeting = 110;
    else p.otherPartners[0].ageAtMeeting = 110;
    const event = createRelativeDeathEvent(p, 61, () => 0.99);
    assert.ok(event);
    Object.assign(p, event.choices[0].playerUpdates);
    assert.equal(p.partner.id, id === 'A' ? 'B' : 'A');
    assert.equal(p.nextMarriageProposalAge, id === 'A' ? 31 : 30);
    assert.equal(getDatingPartners(p).length, 1);
  }
});
test('Natural acquaintance can add a second romance while a full pair gets friendship choices', () => {
  const p = player(); p.employmentStatus = 'employed'; Object.assign(p, getDatingUpdates(p, person('A'), 25));
  const event = createAcquaintanceEvent(p, 26, () => 0.1);
  const romance = event.choices.find(c => c.playerUpdates?.otherPartners?.length);
  assert.ok(romance); Object.assign(p, romance.playerUpdates);
  assert.equal(getDatingPartners(p).length, 2);
  const full = createAcquaintanceEvent(p, 27, () => 0.1);
  assert.ok(full); assert.equal(full.choices.some(c => c.playerUpdates?.partner || c.playerUpdates?.otherPartners), false);
});

test('Actual game choice handler resolves discovery exactly once after reload', () => {
  const main = fs.readFileSync(new URL('../js/main.js', import.meta.url), 'utf8');
  const handler = main.slice(main.indexOf('function chooseEventAction(index)'), main.indexOf('ageButton.addEventListener("click",', main.indexOf('function chooseEventAction(index)')));
  const p = couple(); p.age = 26;
  const state = { player: p, pendingEvent: { ...createConcurrentDatingEvent(p, 27, () => 0), stage: 'choice', age: 27 } };
  const ctx = vm.createContext({ state, canAffordChoice: () => true, softenSetback: (_, c) => c,
    statNames: { happiness: 'Hạnh phúc' }, createSchoolEntryReward: () => null,
    createEventLogSummary: ({ changes }) => changes.join(' '), getChoiceOutcome: () => null, getEventTags: () => [],
    saveEventProgress() {}, showPendingEvent() {}, createDatingDramaStep });
  vm.runInContext(handler, ctx);
  for (const index of [0, 0, 1]) {
    vm.runInContext(`chooseEventAction(${index})`, ctx);
    assert.equal(state.pendingEvent.stage, 'choice');
    assert.equal(getDatingPartners(p).length, 2);
    state.pendingEvent = JSON.parse(JSON.stringify(state.pendingEvent));
  }
  vm.runInContext('chooseEventAction(0)', ctx);
  assert.equal(getDatingPartners(p).length, 2);
  assert.equal(state.pendingEvent.stage, 'result');
  assert.match(state.pendingEvent.logContent, /Tôi đáp:/);
  assert.match(state.pendingEvent.logContent, /Người A:/);
  assert.match(state.pendingEvent.logContent, /Người B:/);
  const before = JSON.stringify(state.pendingEvent);
  state.pendingEvent = JSON.parse(before);
  vm.runInContext('chooseEventAction(0)', ctx); assert.equal(JSON.stringify(state.pendingEvent), before);
  const random = Math.random; Math.random = () => 0.99;
  try { completeLifeYear(p, 27, state.pendingEvent.updates); } finally { Math.random = random; }
  assert.equal(p.partner.id, 'B'); assert.equal(p.partner.relationship, 60);
   
  assert.equal(p.happiness, 75 - getStatWear(75)); assert.equal(p.otherPartners.length, 0);
});
test('Drama branches: denial, blame, trying to keep both and weak trust can lose both partners', () => {
  const resolve = (p, indices) => {
    let scene = createConcurrentDatingEvent(p, 27, () => 0);
    for (const index of indices) {
      const reply = scene.choices[index];
      scene = createDatingDramaStep(p, 27, reply.nextStep, JSON.parse(JSON.stringify({
        ...scene.datingDrama, replies: [...scene.datingDrama.replies, reply.response],
      })));
    }
    return scene;
  };
  for (const indices of [[1, 1, 0], [0, 2, 1], [2, 0, 0], [0, 0, 3]]) {
    const p = couple(); const scene = resolve(p, indices);
    assert.equal(scene.choices[0].playerUpdates.partner, null);
    assert.equal(scene.choices[0].effects.happiness, -15);
    assert.deepEqual(scene.choices[0].playerUpdates.otherPartners, []);
  }
  const weak = couple(); weak.partner.relationship = 60;
  assert.equal(resolve(weak, [0, 0, 0]).choices[0].playerUpdates.partner, null);
  const high = couple(); high.partner.relationship = 95;
  const late = resolve(high, [1, 0, 0]);
  assert.equal(late.choices[0].playerUpdates.partner.id, 'A');
  assert.equal(late.choices[0].playerUpdates.partner.relationship, 60);
  assert.ok(resolve(couple(), [0, 0, 0]).dialogueLines.some(line => line.role === 'player'));
});
console.log(`${count} concurrent-dating regression groups passed.`);
