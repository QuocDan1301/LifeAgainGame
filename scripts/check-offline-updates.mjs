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
    emit(type) { for (const callback of listeners.get(type) ?? []) callback(); },
  });
}
const flush = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };
async function app({ controlled = true, idle = true, waiting = true } = {}) {
  let reloads = 0;
  let updates = 0;
  let registrationOptions;
  const messages = [];
  const worker = events({ state: 'installed', postMessage: message => messages.push(message) });
  const registration = events({ waiting: waiting ? worker : null, installing: null, update: async () => { updates++; } });
  const serviceWorker = events({ controller: controlled ? {} : null, register: async (url, options) => {
    assert.equal(url, './sw.js');
    registrationOptions = options;
    return registration;
  } });
  const document = events({ readyState: 'complete', visibilityState: 'visible', documentElement: { hasAttribute: () => true } });
  const window = events();
  const timers = new Map();
  const context = vm.createContext({ navigator: { serviceWorker }, document, window, location: { reload: () => reloads++ },
    setInterval: (callback, delay) => timers.set(delay, callback) });
  vm.runInContext(source + '\nthis.start = initOffline;', context);
  context.start(() => idle);
  await flush();
  return { worker, registration, serviceWorker, document, window, timers, messages,
    setIdle(value) { idle = value; }, get reloads() { return reloads; }, get updates() { return updates; },
    get options() { return registrationOptions; } };
}

const active = await app({ idle: false });
assert.equal(active.options.updateViaCache, 'none');
assert.equal(active.updates, 1, 'checks for updates on opening');
assert.equal(active.messages.length, 0, 'does not interrupt a game');
active.setIdle(true);
active.timers.get(5000)();
assert.deepEqual(active.messages, ['skip-waiting']);
active.serviceWorker.emit('controllerchange');
assert.equal(active.reloads, 1, 'opens the installed version at the lobby');

const otherTab = await app({ idle: false, waiting: false });
otherTab.serviceWorker.emit('controllerchange');
assert.equal(otherTab.reloads, 0, 'another tab updating does not interrupt play');
otherTab.setIdle(true);
otherTab.timers.get(5000)();
assert.equal(otherTab.reloads, 1, 'another tab updating refreshes at the lobby');

const first = await app({ controlled: false, waiting: false });
first.serviceWorker.controller = {};
first.serviceWorker.emit('controllerchange');
assert.equal(first.reloads, 0, 'first installation does not reload');
first.document.visibilityState = 'hidden';
first.timers.get(60000)();
await flush();
assert.equal(first.updates, 1);
first.document.visibilityState = 'visible';
first.window.emit('online');
await flush();
assert.equal(first.updates, 2, 'reconnection checks for a new release');
first.registration.update = async () => { throw new Error('offline'); };
first.window.emit('focus');
await flush();
assert.equal(first.reloads, 0, 'network failures leave the offline game running');

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
const sw = vm.createContext({ caches, Request, Response, URL,
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
console.log('PASS offline updates: opening/reconnection checks, safe lobby activation, other tabs, first install, offline fallback, versioned caches.');
