// Sự kiện đời thường: mỗi tuổi 4 sự kiện hợp với hoàn cảnh người chơi, cộng sự kiện chuỗi nối với lựa chọn cũ.
// Dữ liệu ở js/events/life-stories/*.js, cách viết ở docs/su-kien-doi-thuong/SO-TAY.md.
import { lifeStoryCatalog } from './life-stories/index.js';
import { openMojiArt } from '../media/event-art.js';
import { prepareStoryChoice } from '../core/story-transactions.js';
import { getEmploymentType } from '../career/job-loss.js';
import { RETIREMENT_AGE } from '../career/career-salary.js';
import { getChildAge } from '../relationships/family.js';

const relative = (player, id) => player.relatives?.find(person => person.id === id);
const ROAD_VEHICLES = new Set(['motorbike', 'big-bike', 'car', 'porsche', 'lamborghini', 'rolls-royce']);
const isEmployed = (player, age) => player.employmentStatus === 'employed' && age < RETIREMENT_AGE;

// Hoàn cảnh dùng trong `needs`. Các cặp bổ sung nhau (partner/single, children/noChildren…)
// để mỗi người chơi luôn có đủ sự kiện hợp với đời mình.
export const NEEDS = {
  criminalRecord: player => (player.criminalRecord?.length ?? 0) > 0,
  outsidePrison: player => !player.prison,
  reformationReady: player => player.lifePath === 'reformed' && (player.reformedYears ?? 0) >= 3 && !player.workInvestigation && !player.reformationRecognized,
  studyAbroad: (player, age) => age >= 18 && age <= 21 && player.careerPath?.id === 'study-abroad' && player.careerPath.school?.type === 'international',
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
  retired: (player, age) => player.employmentStatus === 'retired' || age >= RETIREMENT_AGE,
  student: (player, age) => age >= 18 && age <= 21 && Boolean(player.careerPath) &&
    !['military', 'esports', 'football'].includes(player.careerPath.id),
  notStudent: (player, age) => !NEEDS.student(player, age),
  // Xe mua trong Mua sắm chỉ lưu mã (motorbike, car…), không lưu tên.
  vehicle: player => player.purchases?.some(item => ROAD_VEHICLES.has(item.id)) === true,
  mobile: player => (player.health ?? 0) >= 30,
  frail: player => (player.health ?? 0) < 30,
};

function meetsNeeds(story, age, player) {
  if (player.isAlive === false) return false;
  // Chỉ chặn khi sự kiện có lựa chọn tốn tiền; người đang nợ (tiền âm) vẫn có sự kiện bình thường.
  if (story.needs?.includes('employed') && getEmploymentType(player.careerPath?.id) === 'service' && /công ty|sếp|khách hàng/iu.test(story.text)) return false;
  if (story.minMoney > 0 && (player.money ?? 0) < story.minMoney) return false;
  if (!(story.needs ?? []).every(need => NEEDS[need]?.(player, age))) return false;
  if (story.choices?.some(choice => choice.repayLoan) && !story.choices.some(choice => player.storyLoans?.some(loan => loan.id === choice.repayLoan && loan.outstanding > 0))) return false;
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
    tuoiCon: child ? getChildAge(child, player.storyAge ?? player.age ?? child.joinedAtAge) : 'chưa rõ',
    tuoiBanDoi: player.partner ? (player.partner.ageAtMeeting ?? player.partner.metAtAge ?? player.relationshipStartedAtAge ?? player.age ?? 0) + (player.storyAge ?? player.age ?? 0) - (player.partner.metAtAge ?? player.relationshipStartedAtAge ?? player.age ?? 0) : 'chưa rõ',
    soNamKetHon: player.marriedAtAge != null ? Math.max(0, (player.storyAge ?? player.age ?? player.marriedAtAge) - player.marriedAtAge) : 'nhiều',
    soNamConThuyen: Math.max(0, (player.storyAge ?? player.age ?? 3) - 3),
  };
  return String(text).replace(/\{(tenBa|tenMe|tenBanDoi|tenCon|tuoiCon|tuoiBanDoi|soNamKetHon|soNamConThuyen)\}/gu, (_, key) => names[key]);
}

// Mặt cười gắn lúc hiển thị (dữ liệu không chứa emoji), khớp với cảm xúc của đoạn văn.
// Mỗi đoạn luôn ra cùng một mặt để tải lại game không đổi.
// Chỉ dùng emoji mặt phổ biến (Unicode 13 trở xuống) để máy cũ vẫn hiển thị được.
export const FACES = {
  joy: ['😄', '😊', '🥰', '😁', '🤗', '😃', '😆', '🥳', '😍', '🤩', '😀', '😸'],
  warm: ['🙂', '😌', '😊', '☺️', '😇', '😙', '😚', '🤗', '😺'],
  neutral: ['🙂', '😐', '😶', '🤔', '😑', '🧐', '😗', '😯'],
  uneasy: ['😕', '😟', '😬', '🥲', '😓', '😰', '😧', '🙁', '😖', '😣'],
  sad: ['😔', '😢', '🥺', '😞', '😥', '☹️', '😩', '😿'],
  heavy: ['😭', '😢', '😞', '😫', '😩', '😿'],
  // Bùi ngùi: kết quả nhẹ lòng nhưng giữa chuyện mất mát, bệnh tật.
  tender: ['🥲', '😌', '🙂', '🥺', '😇', '☺️'],
  dilemma: ['🤔', '😟', '😬', '😕', '🙁', '😶', '🧐', '😯', '😮', '😐'],
};

// Đoạn văn nói về mất mát, bệnh tật, tang lễ: không dùng mặt cười tươi.
const SOMBER = /qua đời|mất vào|đã mất|vừa mất|người đã khuất|đám tang|lễ tang|tang lễ|quan tài|linh cữu|canh linh|viếng|nghĩa trang|tảo mộ|ngôi mộ|bệnh nặng|ung thư|khối u|tế bào bất thường|tai biến|đột quỵ|cấp cứu|không còn bao lâu|không còn nữa|không dậy nữa|không thở nữa|ra đi|lần cuối|khóc/iu;
const isSomber = text => SOMBER.test(String(text));

function faceSeed(key) {
  let hash = 7;
  for (const char of key) hash = (hash * 31 + char.codePointAt(0)) >>> 0;
  return hash;
}

// Mặt cho cả sự kiện: tình huống trước, rồi từng kết quả theo thứ tự tác giả viết.
// Mặt đã dùng trong cùng sự kiện thì chọn mặt kế tiếp trong nhóm, để các lựa chọn không lặp mặt nhau.
function pickEventFaces(entries) {
  const used = new Set();
  return entries.map(([mood, key]) => {
    const pool = FACES[mood];
    const start = faceSeed(key) % pool.length;
    const free = pool.map((_, step) => pool[(start + step) % pool.length]).find(face => !used.has(face));
    const face = free ?? pool[start];
    used.add(face);
    return face;
  });
}

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


// Thứ tự lựa chọn xoay vòng theo sự kiện và theo ván chơi (cố định khi tải lại), để lựa chọn
// có lợi nhất không luôn nằm ở ô đầu tiên như trong dữ liệu.
function orderChoices(story, player) {
  const choices = story.choices;
  const offset = choices.length > 1 ? faceSeed(`${story.id}|${player.name ?? ''}|${player.province ?? ''}`) % choices.length : 0;
  return [...choices.slice(offset), ...choices.slice(0, offset)];
}

function toGameEvent(story, age, player) {
  player = { ...player, storyAge: age };
  const icon = story.icon ?? (age < 6 ? '1F9F8' : age < 18 ? '1F4DA' : age < 60 ? '1F4AC' : '1F375');
  const art = openMojiArt(icon, fillStoryText(story.title, player));
  const owned = player.storyFlags ?? [];
  const requirements = [...(story.needs ?? [])];
  const child = story.childAge
    ? player.children?.find(kid => getChildAge(kid, age) >= story.childAge[0] && getChildAge(kid, age) <= story.childAge[1])
    : player.children?.[0];
  const saving = story.choices.every(choice => choice.money < 0 || choice.home || choice.salaryMonths)
    ? { label: 'Chưa chi tiền lúc này', text: 'Tôi xem lại số tiền trong ví và quyết định để dành. Chuyện này phải chờ thêm.', effects: {} }
    : null;
  const authoredChoices = [...story.choices, ...(saving ? [saving] : [])];
  const prepared = authoredChoices.map(source => prepareStoryChoice(source, player, age));
  const somberStory = isSomber(story.text);
  const [situationFace, ...resultFaces] = pickEventFaces([
    [situationMood(story), story.id],
    ...prepared.map((choice, index) => [resultMood(choice.effects, somberStory || isSomber(choice.text)), `${story.id}#${index}`]),
  ]);
  return {
    id: story.id, age, title: fillStoryText(story.title, player, child), mode: 'choice',
    text: `${fillStoryText(story.text, player, child)} ${situationFace}`,
    ...art,
    kind: 'everyday', category: 'everyday', catalogVersion: 3, lifeStory: true,
    chain: isChain(story), weight: isChain(story) ? CHAIN_WEIGHT : 1,
    conditions: { age, alive: true, required: requirements, minimumMoney: story.minMoney ?? 0 },
    conditionText: `Tuổi ${age}; còn sống${requirements.length ? '; ' + requirements.join(', ') : ''}.`,
    automaticResult: false,
    everydayDifficultyApplied: true,
    choices: [...orderChoices(story, player), ...(saving ? [saving] : [])].map((source) => {
      const index = authoredChoices.indexOf(source);
      const choice = prepared[index];
      return ({
      label: fillStoryText(choice.label, player, child),
      title: fillStoryText(choice.title ?? story.title, player, child),
      text: `${fillStoryText(choice.text, player, child)} ${resultFaces[index]}`,
      effects: { ...(choice.effects ?? {}) },
      ...(choice.money === undefined ? {} : { money: choice.money }),
      ...(choice.keepsake ? { keepsake: { ...choice.keepsake } } : {}),
      ...art,
      achievementIds: [],
      everydayRewardsApplied: true,
      confirmText: 'Tiếp tục',
      // Dấu được tính sẵn từ dấu hiện có, nên áp dụng bằng playerUpdates như các sự kiện khác.
      playerUpdates: {
        ...choice.playerUpdates,
        storyFlags: [...new Set([...owned, seenFlag(story.id), ...(choice.flags ?? [])])],
      },
    }); }),
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
