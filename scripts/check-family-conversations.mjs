import assert from 'node:assert/strict';
import { createFamilyConversation, rememberFamilyConversation, FAMILY_MEMORY_LIMIT } from '../js/relationships/family-conversations.js';

const parent = () => ({ id: 'mother', role: 'Mẹ', name: 'Lan', alive: true, bond: 70, condition: 'healthy' });
const player = (extra = {}) => ({ age: 30, money: 1e7, isAlive: true, ...extra });
const cases = [
  [player({ age: 3 }), parent(), 'call', 'little-day'],
  [player({ age: 10 }), parent(), 'call', 'school-day'],
  [player({ age: 16 }), parent(), 'call', 'growing-up'],
  [player(), { ...parent(), bond: 20 }, 'visit', 'rebuilding'],
  [player(), { ...parent(), condition: 'severe' }, 'call', 'health'],
  [player({ money: -1 }), parent(), 'call', 'hard-times'],
  [player({ employmentStatus: 'employed' }), parent(), 'call', 'work'],
  [player({ employmentStatus: 'employed', children: [{}] }), parent(), 'visit', 'parenthood'],
];
for (const [person, relative, action, topic] of cases) {
  const snapshot = JSON.stringify([person, relative]);
  const scene = createFamilyConversation(person, relative, action);
  assert.equal(scene.topic, topic);
  assert.equal(scene.choices.length, 3);
  assert.equal(new Set(scene.choices.map(choice => choice.id)).size, 3);
  assert.deepEqual(createFamilyConversation(person, relative, action), scene, 'reopening is deterministic');
  for (const choice of scene.choices) {
    const result = rememberFamilyConversation(relative, scene, choice.id);
    assert.equal(result.memory.memory, choice.memory);
    assert.ok(choice.reply && choice.label);
  }
  assert.equal(JSON.stringify([person, relative]), snapshot, 'preview/resolution never mutate inputs');
}
let relative = parent();
const person = player({ money: -1 });
const first = createFamilyConversation(person, relative, 'call');
relative.conversationMemories = rememberFamilyConversation(relative, first, 'honest').memories;
const saved = JSON.parse(JSON.stringify(relative));
const next = createFamilyConversation(player({ age: 31 }), saved, 'visit');
assert.equal(next.topic, 'follow-up-worry');
assert.match(next.recall, /khó khăn/);
saved.conversationMemories = rememberFamilyConversation(saved, next, 'boundary').memories;
assert.ok(!createFamilyConversation(player({ age: 32 }), saved, 'call').topic.startsWith('follow-up'), 'a resolved topic does not loop forever');
const father = { ...parent(), id: 'father', role: 'Bố' };
assert.equal(createFamilyConversation(player(), father, 'call').recall, null, 'parents have separate memories');
const tense = createFamilyConversation(person, parent(), 'visit');
const distant = { ...parent(), conversationMemories: rememberFamilyConversation(parent(), tense, 'snap').memories };
assert.equal(createFamilyConversation(player({ age: 31 }), distant, 'call').topic, 'follow-up-distance');
for (let age = 32; age < 85; age++) {
  const scene = createFamilyConversation(player({ age }), saved, 'call');
  saved.conversationMemories = rememberFamilyConversation(saved, scene, scene.choices[0].id).memories;
}
assert.equal(saved.conversationMemories.length, FAMILY_MEMORY_LIMIT);
assert.ok(saved.conversationMemories.every(memory => memory.id.length < 100), 'memory IDs stay bounded');
assert.equal(rememberFamilyConversation(parent(), first, 'invalid'), null);
assert.equal(rememberFamilyConversation(father, first, 'honest'), null);
assert.equal(createFamilyConversation(player({ isAlive: false }), parent(), 'call'), null);
assert.equal(createFamilyConversation(player(), { ...parent(), alive: false }, 'call'), null);
assert.equal(createFamilyConversation(player(), parent(), 'treatment'), null);
console.log('PASS family conversations: age/context, distinct choices, deterministic preview, old saves, remembered follow-ups, reconciliation, separate parents, bounded persistent memories.');
