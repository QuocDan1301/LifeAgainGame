import assert from 'node:assert/strict';
import { createInitialState } from '../js/core/state.js';
import { readSavedGame, startLife, SAVE_KEY } from '../js/core/ticket-store.js';

Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {} });
const data = new Map();
let failKey;
globalThis.localStorage = {
  getItem: key => data.get(key) ?? null,
  setItem(key, value) {
    if (key === failKey) throw new Error('QuotaExceededError');
    data.set(key, String(value));
  },
};
const state = createInitialState();
Object.assign(state.player, { health: 80, happiness: 80, intelligence: 80, appearance: 80 });
state.logs.push({ age: 0, content: 'Test' });
const original = JSON.stringify(state);
data.set(SAVE_KEY, original);
assert.ok(readSavedGame());
for (const [key, value] of [['age', 20.5], ['age', 106], ['money', 'bad'], ['health', -1], ['happiness', 999], ['intelligence', null], ['children', {}]]) {
  const invalid = JSON.parse(original);
  invalid.player[key] = value;
  data.set(SAVE_KEY, JSON.stringify(invalid));
  assert.equal(readSavedGame(), null, key);
}
data.set(SAVE_KEY, original);
const first = await import('../js/core/save-store.js?tab=first');
const second = await import('../js/core/save-store.js?tab=second');
await assert.rejects(first.beginSaveSession(), /chưa hỗ trợ/);
const sessionLocks = new Set();
const manager = {
  async request(name, options, callback) {
    if (sessionLocks.has(name)) return callback(null);
    sessionLocks.add(name);
    try { return await callback({ name }); } finally { sessionLocks.delete(name); }
  },
};
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { locks: manager } });
await first.beginSaveSession();
// A stale writer still cannot bypass the optimistic comparison.
second.trackSavedGame();
state.player.age = 1;
first.saveGame(state);
const latest = data.get(SAVE_KEY);
assert.throws(() => second.saveGame(JSON.parse(original)), /tab khác/);
assert.equal(data.get(SAVE_KEY), latest);
assert.throws(() => second.saveGame(state), /tạm dừng/);

failKey = SAVE_KEY;
state.player.age = 2;
assert.throws(() => first.saveGame(state), /Không lưu/);
assert.equal(data.get(SAVE_KEY), latest);
failKey = undefined;
await first.beginSaveSession();
first.saveGame(state);
assert.equal(JSON.parse(data.get(SAVE_KEY)).player.age, 2);

await first.endSaveSession();
data.set('lifeAgainTickets', JSON.stringify({ tickets: 2 }));
failKey = SAVE_KEY;
await assert.rejects(startLife(JSON.parse(original), data.get(SAVE_KEY)), /chưa hoàn tất/);
assert.equal(JSON.parse(data.get('lifeAgainTickets')).tickets, 1);
failKey = undefined;
const { recoverTicketPurchase } = await import('../js/core/ticket-store.js');
await recoverTicketPurchase();
await recoverTicketPurchase();
assert.equal(JSON.parse(data.get('lifeAgainTickets')).tickets, 1);
assert.equal(data.get(SAVE_KEY), original);

await first.endSaveSession();

// Reject invalid nested save data, while accepting a resumed transition.
for (const patch of [
  { illnesses: [null] }, { illnesses: [{ id: 'flu', since: 'bad' }] },
  { pendingEvent: { stage: 'choice', age: 1, choices: {} } },
  { pendingEvent: { stage: 'choice', age: 1, choices: [null] } },
  { pendingEvent: { stage: 'result', age: 1, updates: [] } },
  { pendingEvent: { stage: 'result', age: 1, mediaTransition: true } },
  { pendingEvent: { stage: 'result', age: 1, nextScene: { stage: 'choice', age: 1, choices: {} } } },
]) {
  const invalid = JSON.parse(original);
  if (patch.illnesses) invalid.player.illnesses = patch.illnesses;
  else Object.assign(invalid, patch);
  data.set(SAVE_KEY, JSON.stringify(invalid));
  assert.equal(readSavedGame(), null, JSON.stringify(patch));
}
const resumed = JSON.parse(original);
resumed.player.illnesses = [{ id: 'flu', since: 0 }];
resumed.pendingEvent = {
  stage: 'result', age: 1, mediaTransition: true,
  nextScene: { stage: 'choice', age: 1, choices: [{ label: 'Tiếp tục' }] },
};
data.set(SAVE_KEY, JSON.stringify(resumed));
assert.ok(readSavedGame());

// Two tabs racing to enter use an exclusive browser lock.
const locks = new Set();
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {
  locks: { async request(name, options, callback) {
    if (locks.has(name)) return callback(null);
    locks.add(name);
    try { return await callback({ name }); } finally { locks.delete(name); }
  } },
} });
const locked = await import('../js/core/save-store.js?tab=locked');
const competing = await import('../js/core/save-store.js?tab=competing');
await locked.beginSaveSession();
await assert.rejects(competing.beginSaveSession(), /tab khác/);
await locked.endSaveSession();
await competing.beginSaveSession();
await competing.endSaveSession();

const read = localStorage.getItem;
localStorage.getItem = () => { throw new Error('SecurityError'); };
await assert.rejects(locked.beginSaveSession(), /SecurityError/);
localStorage.getItem = read;
assert.equal(locks.size, 0, 'Failed entry must release its acquired lock');
await competing.beginSaveSession();
await competing.endSaveSession();
assert.equal(locks.size, 0, 'Lobby exit must release the playing session');
console.log('PASS nested validation, resumed events, failed-entry cleanup, unsupported-browser protection, stale-tab protection, write retry, ticket recovery and exclusive lock');
