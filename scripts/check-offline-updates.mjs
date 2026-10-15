import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../js/core/offline.js', import.meta.url), 'utf8').replace('export function', 'function');
function events(extra = {}) {
  const listeners = new Map();
  return Object.assign(extra, {
    addEventListener(type, callback) {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(callback);
    },
    async emit(type) { await Promise.all((listeners.get(type) ?? []).map(callback => callback())); },
  });
}
const flush = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };
async function app({ controlled = true, idle = true, waiting = true, online = true, saveFails = false, revision = null } = {}) {
  let reloads = 0, updates = 0, saves = 0, unregisters = 0;
  let registrationOptions;
  const messages = [], deleted = [];
  const buttons = [events({}), events({})], notices = [{}, {}];
  const worker = events({ state: 'installed', postMessage: message => messages.push(message) });
  const registration = events({ scope: 'https://game.test/', waiting: waiting ? worker : null, installing: null,
    update: async () => { updates++; }, unregister: async () => { unregisters++; return true; } });
  const serviceWorker = events({ controller: controlled ? {} : null, getRegistrations: async () => [registration],
    register: async (url, options) => {
      assert.equal(url, revision ? './sw.js?refresh=' + revision : './sw.js');
      registrationOptions = options;
      return registration;
    } });
  const document = events({ readyState: 'complete', baseURI: 'https://game.test/', visibilityState: 'visible',
    querySelectorAll: selector => selector === '[data-game-update]' ? buttons : notices,
    documentElement: { hasAttribute: () => true } });
  const window = events(), timers = new Map();
  const storage = new Map([['lifeAgainSave', 'saved-life'], ['lifeAgainAchievements', 'achievements'], ['lifeAgainTickets', 'tickets']]);
  if (revision) storage.set('lifeAgainWorkerRevision', revision);
  const context = vm.createContext({ navigator: { serviceWorker }, document, window, URL, AbortSignal,
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    fetch: async () => { if (!online) throw new Error('offline'); return { ok: true, json: async () => ({ ok: true }) }; },
    caches: { keys: async () => ['life-again-v1', 'life-again-runtime-v1', 'other-app'], delete: async key => { deleted.push(key); } },
    location: { reload: () => reloads++ }, setInterval: (callback, delay) => timers.set(delay, callback) });
  vm.runInContext(source + '\nthis.start = initOffline;', context);
  context.start(() => idle, { beforeUpdate: () => { saves++; if (saveFails) throw new Error('quota'); } });
  await flush();
  return { worker, registration, serviceWorker, document, window, timers, messages, buttons, notices, deleted,
    setIdle(value) { idle = value; }, get reloads() { return reloads; }, get updates() { return updates; },
    get saves() { return saves; }, get unregisters() { return unregisters; }, get options() { return registrationOptions; }, storage };
}
const revised = await app({ revision: '12345', waiting: false });
assert.equal(revised.options.updateViaCache, 'none', 'refresh token is reused on subsequent visits');
const active = await app({ idle: false });
assert.equal(active.options.updateViaCache, 'none');
assert.equal(active.updates, 1);
assert.equal(active.messages.length, 0, 'new release does not automatically interrupt play');
assert.match(active.buttons[0].textContent, /Có bản mới/);
active.setIdle(true);
active.timers.get(5000)();
assert.equal(active.reloads, 0, 'the waiting update is offered for explicit installation');
await active.buttons[0].emit('click');
assert.equal(active.saves, 2, 'save before cache changes and capture progress before reload');
assert.equal(active.unregisters, 1);
assert.deepEqual(active.deleted, ['life-again-v1', 'life-again-runtime-v1'], 'only game asset caches are refreshed');
assert.equal(active.reloads, 1, 'manual update bypasses a stalled waiting worker');
assert.match(active.storage.get('lifeAgainWorkerRevision'), /^\d+$/);
assert.equal(active.storage.get('lifeAgainSave'), 'saved-life');
assert.equal(active.storage.get('lifeAgainAchievements'), 'achievements');
assert.equal(active.storage.get('lifeAgainTickets'), 'tickets');
assert.equal(active.messages.length, 0, 'does not depend on skipWaiting succeeding');

const inGame = await app({ idle: false });
await Promise.all(inGame.buttons.map(button => button.emit('click')));
assert.equal(inGame.reloads, 1, 'both buttons share one update operation');
assert.equal(inGame.unregisters, 1);
const offline = await app({ online: false });
await offline.buttons[0].emit('click');
assert.equal(offline.reloads, 0);
assert.equal(offline.unregisters, 0);
assert.deepEqual(offline.deleted, [], 'offline failure keeps the downloadable game');
assert.match(offline.notices[0].textContent, /thử lại/);
assert.equal(offline.buttons[0].disabled, false);
const quota = await app({ saveFails: true });
await quota.buttons[0].emit('click');
assert.equal(quota.reloads, 0);
assert.equal(quota.unregisters, 0);
assert.deepEqual(quota.deleted, [], 'a failed save blocks the update');

const otherTab = await app({ idle: false, waiting: false });
await otherTab.serviceWorker.emit('controllerchange');
assert.equal(otherTab.reloads, 0);
otherTab.setIdle(true);
otherTab.timers.get(5000)();
assert.equal(otherTab.reloads, 1);
otherTab.timers.get(5000)();
assert.equal(otherTab.reloads, 1, 'reload is requested only once');
const first = await app({ controlled: false, waiting: false });
first.serviceWorker.controller = {};
await first.serviceWorker.emit('controllerchange');
assert.equal(first.reloads, 0, 'first installation does not reload');
first.document.visibilityState = 'hidden';
await first.timers.get(60000)();
assert.equal(first.updates, 1);
first.document.visibilityState = 'visible';
await first.window.emit('online');
assert.equal(first.updates, 2);

// A runtime response from an older release must never override current files.
const template = fs.readFileSync(new URL('./sw-template.js', import.meta.url), 'utf8')
  .replace('__VERSION__', '"test-v2"').replace('__PRECACHE__', '[]').replace('__FONT_STYLESHEETS__', '[]');
const buckets = new Map([
  ['life-again-test-v2', new Map([['https://game.test/js/boot.js', new Response('current code')]])],
  ['life-again-runtime', new Map([['https://game.test/js/boot.js', new Response('old code')], ['https://game.test/img/event.webp', new Response('old image')]])],
]);
let downloads = 0;
const caches = {
  async open(name) {
    if (!buckets.has(name)) buckets.set(name, new Map());
    const bucket = buckets.get(name);
    return { match: async request => bucket.get(request.url ?? request)?.clone(), put: async (request, response) => bucket.set(request.url ?? request, response), addAll: async () => {} };
  },
  keys: async () => [...buckets.keys()],
  delete: async name => buckets.delete(name),
};
const handlers = new Map();
const sw = vm.createContext({ caches, Request, Response, URL, AbortSignal,
  fetch: async () => { downloads++; return new Response('new image'); },
  self: { location: { origin: 'https://game.test' }, clients: { claim: async () => {} }, addEventListener: (type, callback) => handlers.set(type, callback) },
});
vm.runInContext(template, sw);
assert.equal(await (await sw.cacheFirst(new Request('https://game.test/js/boot.js'))).text(), 'current code');
assert.equal(await (await sw.cacheFirst(new Request('https://game.test/img/event.webp'))).text(), 'new image');
assert.equal(downloads, 1);
let activation;
handlers.get('activate')({ waitUntil: promise => { activation = promise; } });
await activation;
assert.equal(buckets.has('life-again-runtime'), false, 'cleans up legacy runtime cache');
assert.equal(buckets.has('life-again-test-v2'), true);
assert.equal(buckets.has('life-again-runtime-test-v2'), true);
// A stalled font CDN must not prevent this worker or the next version activating.
const realTimeout = AbortSignal.timeout.bind(AbortSignal);
let fontSignal;
sw.AbortSignal = { timeout: milliseconds => {
  assert.equal(milliseconds, 5000, 'font warming has a five-second budget');
  return realTimeout(20);
} };
sw.fetch = async (_url, options) => {
  fontSignal = options.signal;
  return new Promise((resolve, reject) => options.signal.addEventListener('abort',
    () => reject(options.signal.reason), { once: true }));
};
let deadline;
try {
  await Promise.race([
    sw.cacheStylesheetWithFonts('https://fonts.googleapis.com/stalled'),
    new Promise((_, reject) => { deadline = setTimeout(() => reject(new Error('Font warming blocked activation')), 1000); }),
  ]);
} finally { clearTimeout(deadline); }
assert.equal(fontSignal.aborted, true, 'stalled optional downloads are aborted');
try {
  const response = await Promise.race([
    sw.cacheFirst(new Request('https://fonts.gstatic.com/stalled.woff2')),
    new Promise((_, reject) => { deadline = setTimeout(() => reject(new Error('Runtime font fetch blocked update')), 1000); }),
  ]);
  assert.equal(response.type, 'error', 'runtime font failure allows fallback without blocking');
  assert.equal(fontSignal.aborted, true, 'runtime CDN requests have the same deadline');
} finally { clearTimeout(deadline); }
let skipWaitingCalls = 0;
sw.self.skipWaiting = async () => { skipWaitingCalls++; };
let messageLifetime;
handlers.get('message')({ data: 'skip-waiting', waitUntil: promise => { messageLifetime = promise; } });
await messageLifetime;
assert.equal(skipWaitingCalls, 1, 'message lifetime covers activation request');
console.log('PASS offline updates: manual update buttons, save protection, failed-network retry, asset-only cache refresh, background discovery, other tabs, first install, font deadlines and versioned caches.');
