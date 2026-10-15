// Local-only history. No save, achievement or account keys are changed here.
export const LIFE_ARCHIVE_KEY = 'lifeAgainLifeArchive';
export const LIFE_ARCHIVE_LIMIT = 50;
export const SPECIAL_CATALOG = [
  ['lost-child-school', 'Ngôi trường tuổi thơ', 5], ['diamond-mine', 'Mỏ kim cương', 7],
  ['earth-auction', 'Đấu giá Trái Đất', 7], ['save-life', 'Cứu người', 4],
  ['old-house', 'Ngôi nhà cũ', 7], ['last-train', 'Chuyến tàu cuối', 4],
  ['theater', 'Nhà hát', 7], ['luggage', 'Chiếc va li', 4],
  ...[60, 65, 70, 75, 80, 85, 90, 95, 100, 105].map(age =>
    [`later-${age}`, `Câu chuyện tuổi ${age}`, [65, 75, 85, 95, 105].includes(age) ? 4 : 5]),
];
export const TITLE_CATALOG = [
  { id: 'reformed', label: 'Người hoàn lương', hint: 'ra tù và giữ con đường hoàn lương sau một lần vấp ngã' },
  { id: 'teacher', label: 'Người thầy cả đời đứng lớp', hint: 'theo ngành Sư phạm và gắn bó ít nhất 20 năm' },
  { id: 'family', label: 'Ông/bà của đại gia đình', hint: 'nuôi dưỡng ít nhất 3 người con và sống tới tuổi 60' },
  { id: 'self-made', label: 'Tay trắng làm nên', hint: 'tích lũy ít nhất 5 tỷ trong ví' },
  { id: 'traveler', label: 'Người đi qua những miền xa', hint: 'du lịch tới ít nhất 3 điểm đến' },
  { id: 'free', label: 'Người sống một mình tự do', hint: 'sống tới tuổi 40 mà không kết hôn hay có con' },
  { id: 'dark', label: 'Một đời trong bóng tối', hint: 'khám phá kết thúc của con đường tội lỗi' },
  { id: 'ordinary', label: 'Một cuộc đời đáng nhớ', hint: 'viết tiếp một cuộc đời theo cách riêng' },
];
const unique = values => [...new Set(values)];
const array = value => Array.isArray(value) ? value : [];

// Pure, deterministic priority: specific life paths first; at most three titles.
export function deriveLifeTitles(player = {}) {
  const records = array(player.criminalRecord);
  const marriedBefore = player.marriedAtAge != null || array(player.relationshipHistory)
    .some(entry => ['married', 'marriage', 'divorced', 'widowed'].includes(entry.type));
  const teachingYears = player.careerYears?.teaching ??
    (player.careerPath?.id === 'teaching' && Number.isFinite(player.employedSince)
      ? Math.max(0, Math.min(player.age ?? 0, 62) - player.employedSince) : 0);
  const matches = [
     
    player.lifePath === 'reformed' && records.length > 0 && !player.prison,
    teachingYears >= 20,
    (player.age ?? 0) >= 60 && array(player.children).length >= 3,
     
    (player.money ?? 0) >= 5_000_000_000,
    Object.keys(player.tripsTaken ?? {}).length >= 3,
    (player.age ?? 0) >= 40 && !marriedBefore && !player.partner && !array(player.children).length,
    player.lifePath === 'dark',
  ];
  const titles = TITLE_CATALOG.filter((_, index) => matches[index]).slice(0, 3);
  if (!titles.length) titles.push(TITLE_CATALOG.at(-1));
  return { main: titles[0], secondary: titles.slice(1) };
}

export function describeCriminalRecord(player = {}) {
  const records = array(player.criminalRecord);
  return records.length ? records.map(record =>
    `${record.crime ?? 'Vi phạm'} (${record.age ?? '?'} tuổi, án ${record.years ?? 0} năm)`)
    .join('; ') : 'Không có tiền án';
}

// Legacy ID depends on immutable birth information, never on the final age.
export function getLifeId(state) {
  if (state.player.lifeId) return state.player.lifeId;
  const source = JSON.stringify([state.player.lifeSeed, state.player.name,
    state.player.gender, state.player.province, state.logs?.[0]]);
  let hash = 2166136261;
  for (const character of source) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return `legacy-${(hash >>> 0).toString(16)}`;
}

export function observeLifeProgress(player, event, completed = false) {
  const special = SPECIAL_CATALOG.find(([id]) => id === event?.specialId);
  if (special) {
    player.specialChainsSeen = unique([...array(player.specialChainsSeen), special[0]]);
    // Finishing the last authored scene counts, including an unsuccessful ending.
    // Leaving or dying in an earlier scene counts only as encountered.
    if (completed && event.specialStep >= special[2])
      player.specialChainsCompleted = unique([...array(player.specialChainsCompleted), special[0]]);
  }
  const career = player.careerPath?.id;
  if (career && player.careerLevel > 0) {
    player.careerHighestRanks = { ...player.careerHighestRanks,
      [career]: Math.max(player.careerHighestRanks?.[career] ?? 0, player.careerLevel) };
    if (player.employmentStatus === 'employed' && player.careerTrackedAge !== player.age) {
      const legacyYears = Number.isFinite(player.employedSince)
        ? Math.max(0, Math.min(player.age ?? 0, 62) - player.employedSince) : 0;
      player.careerYears = { ...player.careerYears, [career]: (player.careerYears?.[career] ?? legacyYears) + 1 };
      player.careerTrackedAge = player.age;
    }
  }
}

export function buildLifeSummary(state, cause) {
  const p = state.player;
  const titles = deriveLifeTitles(p);
  const ranks = { ...p.careerHighestRanks };
  if (p.careerPath?.id) ranks[p.careerPath.id] = Math.max(ranks[p.careerPath.id] ?? 0, p.careerLevel ?? 0);
  return {
    id: getLifeId(state), name: p.name ?? '', gender: p.gender ?? '', province: p.province ?? '',
    age: p.age ?? 0, cause: cause ?? p.deathEvent ?? p.deathCause ?? 'Hành trình đã khép lại',
    career: { id: p.careerPath?.id ?? null, field: p.careerPath?.field ?? '',
      job: p.job ?? '', level: p.careerLevel ?? 0, highestRanks: ranks },
    marriage: p.marriedAtAge != null ? 'Đã kết hôn' : array(p.relationshipHistory).some(e =>
      ['married', 'marriage', 'divorced', 'widowed'].includes(e.type)) ? 'Từng kết hôn' : 'Chưa kết hôn',
    children: array(p.children).length,
    criminalRecord: array(p.criminalRecord).map(({ crime, age, years }) => ({ crime, age, years })),
    lifePath: p.lifePath ?? 'ordinary', titles,
    specialSeen: unique(array(p.specialChainsSeen)), specialCompleted: unique(array(p.specialChainsCompleted)),
    achievements: unique(array(p.lifeUnlockedAchievementIds ?? p.lifeAchievementIds)),
  };
}

export function readLifeArchive(storage) {
  try {
    const target = storage ?? globalThis.localStorage;
    const raw = JSON.parse(target.getItem(LIFE_ARCHIVE_KEY) ?? '[]');
    const entries = Array.isArray(raw) ? raw : raw?.entries;
    return array(entries).filter(entry => entry && typeof entry.id === 'string' &&
      typeof entry.name === 'string' && Number.isFinite(entry.age) &&
      typeof entry.titles?.main?.id === 'string' && typeof entry.titles.main.label === 'string')
      .slice(-LIFE_ARCHIVE_LIMIT).map(entry => ({ ...entry,
        titles: { main: entry.titles.main, secondary: array(entry.titles.secondary)
          .filter(title => typeof title?.id === 'string' && typeof title.label === 'string').slice(0, 2) },
        specialSeen: array(entry.specialSeen).filter(id => typeof id === 'string'),
        specialCompleted: array(entry.specialCompleted).filter(id => typeof id === 'string'),
        achievements: array(entry.achievements).filter(id => typeof id === 'string'),
        criminalRecord: array(entry.criminalRecord).filter(record => record && typeof record === 'object'),
      }));
  } catch { return []; }
}

export function archiveLife(state, storage, cause) {
  try {
    if (state.player.isAlive !== false) return { status: 'alive' };
    const id = getLifeId(state);
    if (state.player.lifeArchivedId === id) return { status: 'duplicate' };
    const target = storage ?? globalThis.localStorage;
    // A failed read must not overwrite an existing archive with an empty one.
    const serialized = target.getItem(LIFE_ARCHIVE_KEY) ?? '[]';
    const snapshot = { getItem: () => serialized };
    const entries = readLifeArchive(snapshot);
    const exists = entries.some(entry => entry.id === id);
    if (!exists) {
      entries.push(buildLifeSummary(state, cause));
      const discovery = getArchiveDiscovery(entries, readLifeDiscovery(snapshot));
      // One atomic write keeps lifetime progress and the capped archive in sync.
      target.setItem(LIFE_ARCHIVE_KEY, JSON.stringify({ version: 2,
        entries: entries.slice(-LIFE_ARCHIVE_LIMIT),
        discovery: { seen: discovery.seen, completed: discovery.completed,
          titles: discovery.titles, rank3: discovery.rank3 },
      }));
    }
    // Only mark success after a successful write. Failed storage can be retried.
    state.player.lifeArchivedId = id;
    return { status: exists ? 'duplicate' : 'saved' };
  } catch { return { status: 'error' }; }
}

export function readLifeDiscovery(storage) {
  try {
    const target = storage ?? globalThis.localStorage;
    const raw = JSON.parse(target.getItem(LIFE_ARCHIVE_KEY) ?? '[]');
    return getArchiveDiscovery(readLifeArchive(target), Array.isArray(raw) ? {} : raw?.discovery ?? {});
  } catch { return getArchiveDiscovery([]); }
}

export function getArchiveDiscovery(entries, lifetime = {}) {
  const seen = unique([...array(lifetime.seen), ...entries.flatMap(entry => array(entry.specialSeen))]).filter(id => SPECIAL_CATALOG.some(s => s[0] === id));
  const completed = unique([...array(lifetime.completed), ...entries.flatMap(entry => array(entry.specialCompleted))]).filter(id => SPECIAL_CATALOG.some(s => s[0] === id));
  const titles = unique([...array(lifetime.titles), ...entries.flatMap(entry => [entry.titles?.main, ...array(entry.titles?.secondary)]).map(t => t?.id)])
    .filter(id => TITLE_CATALOG.some(t => t.id === id));
  const rank3 = unique([...array(lifetime.rank3), ...entries.flatMap(entry => Object.entries(entry.career?.highestRanks ?? {})
    .filter(([, level]) => level >= 3).map(([id]) => id))]).filter(id => typeof id === 'string');
  const hints = [];
  const nextSpecial = SPECIAL_CATALOG.find(([id]) => !completed.includes(id));
  if (nextSpecial) hints.push(`Đời sau thử đi tới cuối chuỗi “${nextSpecial[1]}”.`);
  const nextTitle = TITLE_CATALOG.find(t => !titles.includes(t.id) && !['dark', 'ordinary'].includes(t.id));
  if (nextTitle) hints.push(`Đời sau thử ${nextTitle.hint} để nhận “${nextTitle.label}”.`);
  if (!rank3.length) hints.push('Đời sau thử khám phá ngành ở tuổi 16, theo đúng ngành và đạt bậc 3.');
  if (!hints.length) hints.push('Đời sau thử một lựa chọn khác trong những câu chuyện đã khám phá.');
  return { seen, completed, titles, rank3, hints };
}
