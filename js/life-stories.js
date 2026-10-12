// Sự kiện đời thường: mỗi tuổi 4 sự kiện hợp với hoàn cảnh người chơi, cộng sự kiện chuỗi nối với lựa chọn cũ.
// Dữ liệu ở js/life-stories/*.js, cách viết ở docs/su-kien-doi-thuong/SO-TAY.md.
import { lifeStoryCatalog } from './life-stories/index.js';
import { openMojiArt } from './event-art.js';
import { RETIREMENT_AGE } from './career-salary.js';
import { getChildAge } from './family.js';

const relative = (player, id) => player.relatives?.find(person => person.id === id);
const isEmployed = (player, age) => player.employmentStatus === 'employed' && age < RETIREMENT_AGE;

// Hoàn cảnh dùng trong `needs`. Các cặp bổ sung nhau (partner/single, children/noChildren…)
// để mỗi người chơi luôn có đủ sự kiện hợp với đời mình.
export const NEEDS = {
  father: player => relative(player, 'father')?.alive === true,
  mother: player => relative(player, 'mother')?.alive === true,
  anyParent: player => ['father', 'mother'].some(id => relative(player, id)?.alive === true),
  fatherGone: player => relative(player, 'father')?.alive === false,
  motherGone: player => relative(player, 'mother')?.alive === false,
  parentsGone: player => !['father', 'mother'].some(id => relative(player, id)?.alive === true),
  partner: player => Boolean(player.partner),
  married: player => Boolean(player.partner) && player.marriedAtAge != null,
  dating: player => Boolean(player.partner) && player.marriedAtAge == null,
  single: player => !player.partner,
  widowed: player => !player.partner && player.widowedAtAge != null,
  neverMarried: player => !player.partner && player.widowedAtAge == null,
  children: player => Boolean(player.children?.length),
  noChildren: player => !player.children?.length,
  employed: (player, age) => isEmployed(player, age),
  notEmployed: (player, age) => !isEmployed(player, age) && age < RETIREMENT_AGE,
  retired: (player, age) => age >= RETIREMENT_AGE,
  student: (player, age) => age >= 18 && age <= 21 && Boolean(player.careerPath) &&
    !['military', 'esports', 'football'].includes(player.careerPath.id),
  notStudent: (player, age) => !NEEDS.student(player, age),
  vehicle: player => player.purchases?.some(item => /xe đạp|xe máy|ô tô|motorcycle|bicycle/iu.test(`${item.id} ${item.name}`)) === true,
  mobile: player => (player.health ?? 0) >= 30,
  frail: player => (player.health ?? 0) < 30,
};

function meetsNeeds(story, age, player) {
  if (player.isAlive === false) return false;
  // Chỉ chặn khi sự kiện có lựa chọn tốn tiền; người đang nợ (tiền âm) vẫn có sự kiện bình thường.
  if (story.minMoney > 0 && (player.money ?? 0) < story.minMoney) return false;
  if (!(story.needs ?? []).every(need => NEEDS[need]?.(player, age))) return false;
  if (story.childAge) {
    const [min, max] = story.childAge;
    if (!player.children?.some(child => {
      const childAge = getChildAge(child, age);
      return childAge >= min && childAge <= max;
    })) return false;
  }
  return true;
}

// Năm có sự kiện đặc biệt không thể thay thế: không có sự kiện đời thường.
// (18 tuổi luôn là sự kiện chọn ngành của main.js.)
export const EXCLUDED_AGES = new Set([15, 16, 18, 22, 24, 25, 105]);
export const POOL_SIZE = 4;
// Sự kiện chuỗi chiếm tối đa 2 chỗ trong 4 và được bốc với trọng số cao hơn,
// để chuyện cũ có cơ hội quay lại trong khoảng tuổi của nó.
export const MAX_CHAINS_IN_POOL = 2;
export const CHAIN_WEIGHT = 3;

const isChain = story => Array.isArray(story.ages);
const inWindow = (story, age) => isChain(story)
  ? age >= story.ages[0] && age <= story.ages[1]
  : story.age === age;

export const seenFlag = id => `seen:${id}`;

export function hasLifeStories(age) {
  return !EXCLUDED_AGES.has(age) && lifeStoryCatalog.some(story => !isChain(story) && story.age === age);
}

export function isLifeStoryEligible(story, age, player = {}) {
  if (!inWindow(story, age)) return false;
  const flags = new Set(player.storyFlags ?? []);
  if (flags.has(seenFlag(story.id))) return false;
  if ((story.requires ?? []).some(flag => !flags.has(flag))) return false;
  if (story.requiresAny?.length && !story.requiresAny.some(flag => flags.has(flag))) return false;
  if ((story.blocks ?? []).some(flag => flags.has(flag))) return false;
  return meetsNeeds(story, age, player);
}

const givenName = fullName => String(fullName ?? '').trim().split(/\s+/u).at(-1) ?? '';

// {tenBa}, {tenMe}, {tenBanDoi}, {tenCon}: tên gọi của người thân thật trong ván chơi.
// {tenCon} là đứa con hợp với childAge của sự kiện (nếu có), không thì con đầu.
export function fillStoryText(text, player = {}, child = player.children?.[0]) {
  const names = {
    tenBa: givenName(relative(player, 'father')?.name) || 'ba',
    tenMe: givenName(relative(player, 'mother')?.name) || 'mẹ',
    tenBanDoi: givenName(player.partner?.name) || 'người ấy',
    tenCon: givenName(child?.name) || 'con',
  };
  return String(text).replace(/\{(tenBa|tenMe|tenBanDoi|tenCon)\}/gu, (_, key) => names[key]);
}

// Mặt cười gắn lúc hiển thị (dữ liệu không chứa emoji), khớp với cảm xúc của đoạn văn.
// Mỗi đoạn luôn ra cùng một mặt để tải lại game không đổi.
export const FACES = {
  joy: ['😄', '😊', '🥰', '😁', '🤗'],
  warm: ['🙂', '😌', '😊', '☺️', '😇'],
  neutral: ['🙂', '😐', '😶', '🤔'],
  uneasy: ['😕', '😟', '😬', '🥲', '😓'],
  sad: ['😔', '😢', '🥺', '😞', '😥'],
  heavy: ['😭', '😢', '😞'],
  // Bùi ngùi: kết quả nhẹ lòng nhưng giữa chuyện mất mát, bệnh tật.
  tender: ['🥲', '😌', '🙂'],
  dilemma: ['🤔', '😟', '😬', '😕', '🙁', '😶'],
};

// Đoạn văn nói về mất mát, bệnh tật, tang lễ: không dùng mặt cười tươi.
const SOMBER = /qua đời|mất vào|đã mất|vừa mất|người đã khuất|đám tang|lễ tang|tang lễ|quan tài|linh cữu|canh linh|viếng|nghĩa trang|tảo mộ|ngôi mộ|bệnh nặng|ung thư|khối u|tế bào bất thường|tai biến|đột quỵ|cấp cứu|không còn bao lâu|không còn nữa|không dậy nữa|không thở nữa|ra đi|lần cuối|khóc/iu;
const isSomber = text => SOMBER.test(String(text));

function faceSeed(key) {
  let hash = 7;
  for (const char of key) hash = (hash * 31 + char.codePointAt(0)) >>> 0;
  return hash;
}
const pickFace = (mood, key) => FACES[mood][faceSeed(key) % FACES[mood].length];

// Kết quả: theo mức hạnh phúc của lựa chọn; hạnh phúc không đổi thì xét các chỉ số còn lại.
// Giữa chuyện buồn (somber), kết quả tích cực chỉ ở mức bùi ngùi.
export function resultMood(effects = {}, somber = false) {
  const happiness = effects.happiness ?? 0;
  const others = Object.entries(effects).reduce((sum, [stat, value]) => stat === 'happiness' ? sum : sum + value, 0);
  let mood;
  if (happiness >= 3) mood = 'joy';
  else if (happiness >= 1) mood = 'warm';
  else if (happiness === 0) mood = others > 0 ? 'warm' : others < 0 ? 'uneasy' : 'neutral';
  else if (happiness === -1) mood = 'uneasy';
  else mood = happiness <= -4 ? 'heavy' : 'sad';
  return somber && ['joy', 'warm', 'neutral'].includes(mood) ? 'tender' : mood;
}

// Tình huống: mặt đang phân vân; chuyện buồn, hoặc lựa chọn nào cũng buồn, thì dùng mặt buồn.
export function situationMood(story) {
  const average = story.choices.reduce((sum, choice) => sum + (choice.effects?.happiness ?? 0), 0) / story.choices.length;
  return isSomber(story.text) || average <= -1.5 ? 'sad' : 'dilemma';
}

const withFace = (text, mood, key) => `${text} ${pickFace(mood, key)}`;

function toGameEvent(story, age, player) {
  const icon = story.icon ?? (age < 6 ? '1F9F8' : age < 18 ? '1F4DA' : age < 60 ? '1F4AC' : '1F375');
  const art = openMojiArt(icon, story.title);
  const owned = player.storyFlags ?? [];
  const requirements = [...(story.needs ?? [])];
  const child = story.childAge
    ? player.children?.find(kid => getChildAge(kid, age) >= story.childAge[0] && getChildAge(kid, age) <= story.childAge[1])
    : player.children?.[0];
  return {
    id: story.id, age, title: story.title, mode: 'choice',
    text: withFace(fillStoryText(story.text, player, child), situationMood(story), story.id),
    ...art,
    kind: 'everyday', category: 'everyday', catalogVersion: 2, lifeStory: true,
    chain: isChain(story), weight: isChain(story) ? CHAIN_WEIGHT : 1,
    conditions: { age, alive: true, required: requirements, minimumMoney: story.minMoney ?? 0 },
    conditionText: `Tuổi ${age}; còn sống${requirements.length ? '; ' + requirements.join(', ') : ''}.`,
    automaticResult: false,
    everydayDifficultyApplied: true,
    choices: story.choices.map((choice, index) => ({
      label: choice.label,
      title: choice.title ?? story.title,
      text: withFace(fillStoryText(choice.text, player, child), resultMood(choice.effects, isSomber(story.text) || isSomber(choice.text)), `${story.id}#${index}`),
      effects: { ...(choice.effects ?? {}) },
      ...(choice.money === undefined ? {} : { money: choice.money }),
      ...art,
      achievementIds: [],
      everydayRewardsApplied: true,
      confirmText: 'Tiếp tục',
      // Dấu được tính sẵn từ dấu hiện có, nên áp dụng bằng playerUpdates như các sự kiện khác.
      playerUpdates: {
        storyFlags: [...new Set([...owned, seenFlag(story.id), ...(choice.flags ?? [])])],
      },
    })),
  };
}

// Số cố định theo ván chơi và tuổi: tải lại game không đổi danh sách, nhưng mỗi ván nhường chỗ khác nhau.
function lifeSeed(player, age) {
  let hash = age;
  for (const char of `${player.name ?? ''}|${player.province ?? ''}`) hash = (hash * 31 + char.codePointAt(0)) >>> 0;
  return hash;
}

export function createLifeStoryEvents(age, player = {}) {
  if (player.isAlive === false || EXCLUDED_AGES.has(age)) return [];
  const eligible = lifeStoryCatalog.filter(story => isLifeStoryEligible(story, age, player));
  const chains = eligible.filter(isChain).slice(0, MAX_CHAINS_IN_POOL);
  const base = eligible.filter(story => !isChain(story));
  // Khi chuỗi chiếm chỗ, sự kiện cố định phải nhường được chọn luân phiên chứ không luôn là cái cuối.
  const shift = base.length ? lifeSeed(player, age) % base.length : 0;
  const rotated = [...base.slice(shift), ...base.slice(0, shift)];
  const kept = rotated.slice(0, Math.max(0, POOL_SIZE - chains.length));
  return [...chains, ...base.filter(story => kept.includes(story))]
    .map(story => toGameEvent(story, age, player));
}

export function pickWeightedStory(stories, random = Math.random) {
  const total = stories.reduce((sum, story) => sum + (story.weight ?? 1), 0);
  let roll = random() * total;
  for (const story of stories) {
    roll -= story.weight ?? 1;
    if (roll < 0) return story;
  }
  return stories.at(-1);
}
