import assert from 'node:assert/strict';
import { archiveLife, readLifeArchive, buildLifeSummary, deriveLifeTitles, observeLifeProgress,
  getArchiveDiscovery, readLifeDiscovery, LIFE_ARCHIVE_KEY, LIFE_ARCHIVE_LIMIT } from '../js/core/life-archive.js';
const storage = () => {
  const data = new Map();
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
};
const life = (id = 'one', extra = {}) => ({ player: { lifeId: id, name: 'An', gender: 'female',
  province: 'Huế', age: 55, isAlive: false, money: 0, ...extra }, logs: [] });
let count = 0;
function test(name, run) { run(); count++; console.log(`PASS ${name}`); }
test('Titles work before 105, have deterministic priority and do not mutate the player', () => {
  const p = life('one', { lifePath: 'reformed', criminalRecord: [{ crime: 'Trộm cắp', age: 25, years: 3 }],
    careerYears: { teaching: 25 }, money: 5e9, tripsTaken: { a: 1, b: 1, c: 1 } }).player;
  const before = JSON.stringify(p);
  const titles = deriveLifeTitles(p);
  assert.equal(titles.main.id, 'reformed');
  assert.notEqual(deriveLifeTitles({ ...p, prison: { enteredAge: 44, releaseAge: 50 } }).main.id, 'reformed', 'Not reformed while still in prison');
  assert.deepEqual(titles.secondary.map(t => t.id), ['teacher', 'self-made']);
  assert.equal(JSON.stringify(p), before);
  assert.deepEqual(deriveLifeTitles(p), titles);
});
test('Family, solitude, wealth, dark path and legacy title boundaries', () => {
  assert.equal(deriveLifeTitles({ age: 60, children: [{}, {}, {}] }).main.id, 'family');
  assert.notEqual(deriveLifeTitles({ age: 59, children: [{}, {}, {}] }).main.id, 'family');
  assert.equal(deriveLifeTitles({ age: 40 }).main.id, 'free');
  assert.notEqual(deriveLifeTitles({ age: 40, relationshipHistory: [{ type: 'widowed' }] }).main.id, 'free');
  assert.notEqual(deriveLifeTitles({ age: 40, marriedAtAge: 20 }).main.id, 'free');
  assert.equal(deriveLifeTitles({ money: 5e9 }).main.id, 'self-made');
  assert.notEqual(deriveLifeTitles({ money: 4.9e9 }).main.id, 'self-made');
  assert.equal(deriveLifeTitles({ lifePath: 'dark', age: 25 }).main.id, 'dark');
  assert.equal(deriveLifeTitles({}).main.id, 'ordinary');
  assert.equal(deriveLifeTitles({ age: 50, employedSince: 22, careerPath: { id: 'teaching' } }).main.id, 'teacher');
});
test('One record per life survives reload and a lost save marker', () => {
  const s = storage(), state = life();
  assert.equal(archiveLife(state, s).status, 'saved');
  assert.equal(archiveLife(JSON.parse(JSON.stringify(state)), s).status, 'duplicate');
  delete state.player.lifeArchivedId;
  assert.equal(archiveLife(state, s).status, 'duplicate');
  assert.equal(readLifeArchive(s).length, 1);
  const legacy = life(); delete legacy.player.lifeId;
  archiveLife(legacy, s); delete legacy.player.lifeArchivedId;
  archiveLife(JSON.parse(JSON.stringify(legacy)), s);
  assert.equal(readLifeArchive(s).length, 2);
  assert.equal(archiveLife(life('alive', { isAlive: true }), s).status, 'alive');
});
test('Latest 50 lives retained; an evicted life with a saved marker is not reinserted', () => {
  const s = storage(), first = life('0'); archiveLife(first, s);
  for (let i = 1; i < 55; i++) archiveLife(life(String(i)), s);
  assert.equal(readLifeArchive(s).length, LIFE_ARCHIVE_LIMIT);
  assert.equal(readLifeArchive(s)[0].id, '5');
  assert.equal(readLifeArchive(s).at(-1).id, '54');
  assert.equal(archiveLife(first, s).status, 'duplicate');
  assert.equal(readLifeArchive(s).at(-1).id, '54');
});
test('Unavailable storage, quota errors and invalid JSON never interrupt the game; retry succeeds', () => {
  const p = life();
  const broken = { getItem() { throw Error('blocked'); }, setItem() { throw Error('quota'); } };
  assert.deepEqual(readLifeArchive(broken), []);
  assert.equal(archiveLife(p, broken).status, 'error');
  assert.equal(p.player.lifeArchivedId, undefined);
  const s = storage(); s.setItem(LIFE_ARCHIVE_KEY, '{bad');
  assert.deepEqual(readLifeArchive(s), []);
  assert.equal(archiveLife(p, s).status, 'saved');
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw Error('disabled'); } });
  try {
    assert.deepEqual(readLifeArchive(), []);
    assert.equal(archiveLife(life('blocked')).status, 'error');
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor);
    else delete globalThis.localStorage;
  }
});
test('Summary preserves requested facts without full player or diary data', () => {
  const summary = buildLifeSummary(life('facts', { careerPath: { id: 'law', field: 'Luật' }, careerLevel: 3,
    job: 'Luật sư', marriedAtAge: 30, children: [{}, {}], criminalRecord: [{ crime: 'Trộm', age: 20, years: 3 }],
    specialChainsSeen: ['old-house'], specialChainsCompleted: ['old-house'],
    lifeAchievementIds: ['old'], lifeUnlockedAchievementIds: ['new'] }), 'Tuổi già');
  assert.equal(summary.cause, 'Tuổi già'); assert.equal(summary.children, 2);
  assert.equal(summary.marriage, 'Đã kết hôn'); assert.equal(summary.career.highestRanks.law, 3);
  assert.equal(summary.criminalRecord[0].crime, 'Trộm');
  assert.deepEqual(summary.achievements, ['new']);
  assert.equal(summary.logs, undefined); assert.equal(summary.player, undefined);
});
test('Special progress, rank 3 and discovery hints persist without double counting', () => {
  const p = life('progress', { age: 40, careerPath: { id: 'teaching' }, careerLevel: 3,
    employmentStatus: 'employed', employedSince: 22 }).player;
  observeLifeProgress(p, { specialId: 'old-house', specialStep: 1 }, true);
  assert.deepEqual(p.specialChainsSeen, ['old-house']);
  assert.equal(p.specialChainsCompleted, undefined);
  observeLifeProgress(p, { specialId: 'old-house', specialStep: 7 }, true);
  const years = p.careerYears.teaching;
  observeLifeProgress(p, { specialId: 'old-house', specialStep: 7 }, true);
  assert.equal(p.careerYears.teaching, years);
  assert.deepEqual(p.specialChainsCompleted, ['old-house']);
  p.careerLevel = 0;
  const d = getArchiveDiscovery([buildLifeSummary({ player: p, logs: [] })]);
  assert.deepEqual(d.rank3, ['teaching']);
  assert.deepEqual(d.completed, ['old-house']); assert.ok(d.hints.length >= 2);
  assert.ok(!d.hints.some(h => h.includes('Ngôi nhà cũ')));
});
test('Lifetime discovery survives eviction, reload, duplicate saves and legacy migration', () => {
  const s = storage();
  const first = life('first', { age: 55, lifePath: 'reformed', criminalRecord: [{ crime: 'Trộm', age: 20, years: 2 }],
    specialChainsSeen: ['diamond-mine'], specialChainsCompleted: ['diamond-mine'],
    careerPath: { id: 'teaching' }, careerLevel: 3 });
  // Seed the previous array format and migrate on the next completed life.
  s.setItem(LIFE_ARCHIVE_KEY, JSON.stringify([buildLifeSummary(first)]));
  for (let i = 0; i < 55; i++) archiveLife(life(`later-${i}`, { age: 20 }), s);
  assert.equal(readLifeArchive(s).length, 50);
  const d = readLifeDiscovery(s);
  assert.ok(d.seen.includes('diamond-mine'));
  assert.ok(d.completed.includes('diamond-mine'));
  assert.ok(d.titles.includes('reformed'));
  assert.ok(d.rank3.includes('teaching'));
  assert.ok(!d.hints.some(h => h.includes('Mỏ kim cương')));
  const persisted = s.getItem(LIFE_ARCHIVE_KEY);
  const reloadStore = storage(); reloadStore.setItem(LIFE_ARCHIVE_KEY, persisted);
  assert.deepEqual(readLifeDiscovery(reloadStore), d);
  const duplicate = life('later-54', { age: 20 });
  archiveLife(duplicate, reloadStore);
  assert.equal(reloadStore.getItem(LIFE_ARCHIVE_KEY), persisted);
});
test('Read and write failures preserve stored lifetime progress and allow retry', () => {
  const s = storage(), existing = life('old', { specialChainsSeen: ['old-house'] });
  archiveLife(existing, s);
  const before = s.getItem(LIFE_ARCHIVE_KEY);
  const next = life('next');
  const readFailure = { getItem() { throw Error('denied'); }, setItem: s.setItem };
  assert.equal(archiveLife(next, readFailure).status, 'error');
  assert.equal(s.getItem(LIFE_ARCHIVE_KEY), before);
  assert.equal(next.player.lifeArchivedId, undefined);
  const writeFailure = { getItem: s.getItem, setItem() { throw Error('quota'); } };
  assert.equal(archiveLife(next, writeFailure).status, 'error');
  assert.equal(s.getItem(LIFE_ARCHIVE_KEY), before);
  assert.equal(archiveLife(next, s).status, 'saved');
  assert.ok(readLifeDiscovery(s).seen.includes('old-house'));
  s.setItem(LIFE_ARCHIVE_KEY, JSON.stringify({ entries: [], discovery: { seen: 'bad', completed: null, titles: ['unknown'], rank3: [null] } }));
  assert.deepEqual(readLifeDiscovery(s).seen, []);
  assert.deepEqual(readLifeDiscovery(s).titles, []);
});
console.log(`${count} life archive groups passed.`);
