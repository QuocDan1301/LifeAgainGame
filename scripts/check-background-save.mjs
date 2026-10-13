import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as rules from '../js/leisure/tien-len-rules.js';
import { saveGame, isSavePaused, onSavePaused } from '../js/core/save-store.js';
import { recoverTicketPurchase, addTickets, SAVE_KEY } from '../js/core/ticket-store.js';
import { createInitialState } from '../js/core/state.js';

const data = new Map();
let denyLock = false;
let beforeAcquire = () => {};
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { locks: {
  async request(name, options, callback) {
    assert.equal(name, 'lifeAgain-playing');
    if (denyLock) return callback(null);
    beforeAcquire();
    return callback({ name });
  },
} } });
globalThis.localStorage = {
  getItem: key => data.get(key) ?? null,
  setItem: (key, value) => data.set(key, String(value)),
};
const initial = createInitialState();
const advanced = structuredClone(initial);
advanced.player.age = 5;
data.set('lifeAgainTickets', JSON.stringify({ tickets: 0, pendingGame: initial }));
assert.throws(() => addTickets(1), /phục hồi/);
beforeAcquire = () => {
  data.set('lifeAgainTickets', JSON.stringify({ tickets: 0 }));
  data.set(SAVE_KEY, JSON.stringify(advanced));
};
await recoverTicketPurchase();
assert.equal(JSON.parse(data.get(SAVE_KEY)).player.age, 5, 'Stale recovery must reread its journal under the lock');
beforeAcquire = () => {};
data.set('lifeAgainTickets', JSON.stringify({ tickets: 0, pendingGame: initial }));
denyLock = true;
await assert.rejects(recoverTicketPurchase(), /tab khác/);
assert.equal(JSON.parse(data.get(SAVE_KEY)).player.age, 5);
denyLock = false;
await recoverTicketPurchase();
assert.equal(JSON.parse(data.get(SAVE_KEY)).player.age, 0);
assert.equal(JSON.parse(data.get('lifeAgainTickets')).tickets, 0);

let stopped = 0;
onSavePaused(() => stopped++);
localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
assert.throws(() => saveGame(initial), /Không lưu/);
assert.equal(isSavePaused(), true);
assert.equal(stopped, 1);
const round = rules.createGame(rules.dealHands(() => 0.5), { starter: 1 });
const before = JSON.stringify(round);
const source = fs.readFileSync(new URL('../js/leisure/tien-len.js', import.meta.url), 'utf8');
const actStart = source.indexOf('  function act(');
const aiStart = source.indexOf('  function aiStep(');
const code = source.slice(actStart, source.indexOf('  function playSelected(', actStart)) +
  source.slice(aiStart, source.indexOf('  function cardFace(', aiStart));
const context = vm.createContext({ ...rules, isSavePaused, game: () => round, viewing: true,
  timer: null, status: '', seatName: String, cardsText: JSON.stringify,
  save: () => { throw new Error('AI tried to save after pause'); }, settle: () => {},
  stopTimer: () => {}, onSavePaused, renderTable: () => {},
});
vm.runInContext(code + '\naiStep();', context);
assert.equal(JSON.stringify(round), before, 'Queued AI must not mutate any cards after pause');

const arcade = fs.readFileSync(new URL('../js/leisure/arcade-games.js', import.meta.url), 'utf8');
const loopStart = arcade.indexOf('function runLoop(');
const loopEnd = arcade.indexOf('\n}', loopStart) + 2;
let frame;
let steps = 0;
const loopContext = vm.createContext({ isSavePaused, performance: { now: () => 0 },
  requestAnimationFrame: callback => { frame = callback; return 1; }, cancelAnimationFrame: () => {},
  step: () => { steps++; },
});
vm.runInContext(arcade.slice(loopStart, loopEnd) + '\nrunLoop(step);', loopContext);
frame(16);
assert.equal(steps, 0, 'Arcade frame must stop before changing a session');
console.log('PASS locked ticket recovery, stale journal, pending-ticket protection, pause notification, queued AI and arcade frame');
