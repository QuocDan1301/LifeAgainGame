import { lifeRandom } from '../core/life-seed.js';
import { getChildAge } from '../relationships/family.js';
import {
  normalizeRoots, normalizeSeedOffers, getRootStory, applyRootChoice, rootSparkText, rootJourneyChoice, setRootStatus,
  describeRootJourney, ROOT_NAMES,
} from './dream-roots.js';

// “Ước mơ dang dở”: từ 55 tuổi, chuyện thường ngày có thể gợi lại một ước mơ.
// Mỗi bước là một sự kiện đời thường được sinh theo trạng thái player.dreams,
// nên không thể xuất hiện sai thứ tự hay lặp lại sau khi đã xong.
export const DREAM_MIN_AGE = 55;
export const DREAM_LAST_AGE = 104;
export const DREAM_LATER_YEARS = 3;
// Khi một bước ước mơ sẵn sàng, khoảng 70–75% số năm có sự kiện vẫn là chuyện đời thường.
export const DREAM_BASE_WEIGHT = 1.5;
export const DREAM_STEP_COUNT = 3;
export const HOMECOMING_NOTICE_YEARS = 5;
const STATUSES = new Set(['active', 'paused', 'done', 'declined']);
const COMPANIONS = new Set(['partner', 'friend', 'child', 'solo']);

export const DREAMS = {
  trip: {
    name: 'Chuyến đi đã hẹn', icon: '🧳', art: '1F9F3', lastStartAge: 92,
    scales: {
      near: { label: 'Thuê xe đi trong ngày', cost: 10_000_000 },
      small: { label: 'Chuyến một tuần trong nước', cost: 36_000_000 },
      gentle: { label: 'Hành trình đi chậm, nghỉ nhiều', cost: 90_000_000 },
      large: { label: 'Chuyến dài đi xa', cost: 240_000_000 },
    },
  },
  music: {
    name: 'Làm điều từng yêu thích', icon: '🎸', art: '1F3B8', lastStartAge: 98,
    scales: {
      small: { label: 'Sắm đàn mới, tập ở nhà', cost: 6_000_000 },
      large: { label: 'Học thầy, thu âm, diễn buổi nhỏ', cost: 70_000_000 },
    },
  },
  homecoming: {
    name: 'Trở về nơi cũ', icon: '🏡', art: '1F3E1', lastStartAge: 98,
    scales: {
      near: { label: 'Thuê xe chở về một ngày', cost: 6_000_000 },
      small: { label: 'Về thăm một tuần', cost: 16_000_000 },
      large: { label: 'Ở lại một tháng, góp sửa trường', cost: 90_000_000 },
    },
  },
};
export const DREAM_IDS = Object.keys(DREAMS);

const integer = value => Number.isInteger(value) ? value : null;
const shortText = value => typeof value === 'string' && value.trim() ? value.slice(0, 200) : null;
const bool = value => value === true;

function blankEntry() {
  return { status: 'active', step: 1, scale: null, spent: 0, startedAtAge: null, lastStepAge: null, readyAge: null,
    finishedAtAge: null, pausedAtAge: null, deadline: null, companion: 'solo', companionName: null, place: null,
    withName: null, venue: null, helper: null, host: false, seekTeacher: false, rebuilt: false,
    delayed: false, twistSeen: false, interplaySeen: false, echoSeen: false, outcome: null, summary: null, fromRoot: false, forParent: false };
}

// Bản lưu cũ không có dữ liệu ước mơ, hoặc dữ liệu hỏng, đều trở về trạng thái hợp lệ.
export function normalizeDreams(raw) {
  const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  const entries = {};
  for (const id of DREAM_IDS) {
    const entry = source.entries?.[id];
    if (!entry || typeof entry !== 'object' || !STATUSES.has(entry.status)) continue;
    entries[id] = {
      ...blankEntry(),
      status: entry.status,
      step: Math.max(0, Math.min(DREAM_STEP_COUNT, integer(entry.step) ?? 0)),
      scale: typeof entry.scale === 'string' && DREAMS[id].scales[entry.scale] ? entry.scale : null,
      spent: Number.isFinite(entry.spent) && entry.spent > 0 ? entry.spent : 0,
      startedAtAge: integer(entry.startedAtAge), lastStepAge: integer(entry.lastStepAge),
      readyAge: integer(entry.readyAge), finishedAtAge: integer(entry.finishedAtAge),
      pausedAtAge: integer(entry.pausedAtAge), deadline: integer(entry.deadline),
      companion: COMPANIONS.has(entry.companion) ? entry.companion : 'solo',
      companionName: shortText(entry.companionName), place: ['que', 'pho-cu'].includes(entry.place) ? entry.place : null,
      withName: shortText(entry.withName), venue: shortText(entry.venue), helper: shortText(entry.helper),
      host: bool(entry.host), seekTeacher: bool(entry.seekTeacher), rebuilt: bool(entry.rebuilt),
      delayed: bool(entry.delayed), twistSeen: bool(entry.twistSeen), interplaySeen: bool(entry.interplaySeen),
      echoSeen: bool(entry.echoSeen), outcome: shortText(entry.outcome), summary: shortText(entry.summary),
      fromRoot: bool(entry.fromRoot), forParent: bool(entry.forParent),
    };
  }
  const later = {};
  const offers = {};
  for (const id of DREAM_IDS) {
    if (Number.isInteger(source.later?.[id])) later[id] = source.later[id];
    if (Number.isInteger(source.offers?.[id])) offers[id] = source.offers[id];
  }
  let active = DREAM_IDS.includes(source.active) && entries[source.active]?.status === 'active' ? source.active : null;
  for (const id of DREAM_IDS) {
    if (entries[id]?.status !== 'active') continue;
    if (!active) active = id;
    else if (id !== active) entries[id] = { ...entries[id], status: 'paused' };
  }
  // roots: ước mơ gieo từ tuổi nhỏ; seed: những lần gợi mầm đã qua (xem dream-roots.js).
  return { active, entries, later, offers, roots: normalizeRoots(source.roots), seed: normalizeSeedOffers(source.seed),
    parentWish: normalizeParentWish(source.parentWish) };
}

// Ước mơ chưa hoàn thành của bố/mẹ (đời đầu), lưu cho người con tự chọn có tiếp nối hay không.
function normalizeParentWish(raw) {
  if (!raw || typeof raw !== 'object' || !DREAMS[raw.id]) return null;
  return { id: raw.id, name: DREAMS[raw.id].name, parentRole: raw.parentRole === 'mẹ' ? 'mẹ' : 'bố',
    parentName: shortText(raw.parentName) ?? '', status: ['open', 'later', 'accepted', 'declined', 'done'].includes(raw.status) ? raw.status : 'open',
    laterAge: integer(raw.laterAge) };
}

const givenName = fullName => String(fullName ?? '').trim().split(/\s+/u).at(-1) ?? '';
const adultChild = (player, age) => (player.children ?? []).find(child =>
  child.alive !== false && child.isAlive !== false && getChildAge(child, age) >= 18);
const inPrison = player => Boolean(player.prison && player.prison.releaseAge > (player.age ?? 0));
const has = (player, ...flags) => flags.some(flag => player.storyFlags?.includes(flag));
const companionPhrase = entry => entry.companion === 'partner' ? `cùng ${entry.companionName ?? 'người ấy'}`
  : entry.companion === 'friend' ? `cùng ${entry.companionName ?? 'Bình'}`
    : entry.companion === 'child' ? `cùng ${entry.companionName ?? 'con'}` : 'một mình';
const together = entry => entry.companion !== 'solo' || Boolean(entry.withName);

// Quy mô theo sức khỏe hiện tại: người yếu có phương án gần, chậm, thuận tiện hơn.
export function getScaleOptions(id, player) {
  const health = player.health ?? 50;
  if (id === 'trip') return health < 30 ? ['near', 'gentle'] : health < 45 ? ['small', 'gentle'] : ['small', 'large'];
  if (id === 'homecoming') return health < 30 ? ['near', 'small'] : ['small', 'large'];
  return ['small', 'large'];
}

function story(id, step, age, fields) {
  return {
    id: `dream-${id}-${step}`, age, repeatable: true, kind: 'dream', dreamId: id, dreamStep: step,
    icon: DREAMS[id].art, weight: DREAM_BASE_WEIGHT, ...fields,
    choices: fields.choices.filter(Boolean).map(choice => ({ ...choice, dream: { id, ...choice.dream } })),
  };
}

// ——— Khơi gợi ———
// Người từng gieo mầm ước mơ từ nhỏ được gợi lại đúng chuyện cũ: ai dạy, lần thử, lý do gác lại.
const ROOT_SPARK_TITLES = { music: 'Cây đàn năm ấy', trip: 'Những nơi ghi trong vở', homecoming: 'Con đường làng năm xưa' };
function sparkStory(id, player, age, repeat, root = null) {
  const base = baseSparkStory(id, player, age, repeat);
  if (!root || root.id !== id) return base;
  const partner = id === 'trip' && player.partner ? givenName(player.partner.name) : null;
  return { ...base, title: ROOT_SPARK_TITLES[id], text: rootSparkText(root, player, partner),
    choices: base.choices.map(choice => choice.dream.action !== 'accept' ? choice : {
      ...choice, dream: { ...choice.dream, fromRoot: true, ...(id === 'homecoming' ? { place: 'que' } : {}) },
      ...(id === 'music' && root.dropAge != null ? { label: 'Mua lại cây đàn', money: -3000000,
        text: 'Tôi mua cây đàn ở tiệm đồ cũ, mang về thay dây. Tối đó, đoạn nhạc đầu tiên năm xưa quay về dưới ngón tay, chậm và vấp, nhưng vẫn đúng.' } : {}),
    }) };
}

function baseSparkStory(id, player, age, repeat) {
  if (id === 'trip') {
    const partner = player.partner ? givenName(player.partner.name) : null;
    return story(id, 'spark', age, {
      title: partner ? 'Tấm vé xe chưa dùng' : 'Cuộc gọi của Bình',
      text: partner
        ? (repeat ? `${partner} lại nhắc chuyến lên vùng núi ngắm mùa hoa mà hai người cứ hẹn rồi lỡ. Lần này ${partner} hỏi nghiêm túc hơn: mình còn đợi tới bao giờ. Tôi phải trả lời.`
          : `Dọn tủ, ${partner} tìm thấy cặp vé xe đã ố vàng của chuyến lên vùng núi ngắm mùa hoa mà hai người từng định đi rồi lỡ. ${partner} đặt vé lên bàn, hỏi tôi giờ còn muốn đi không.`)
        : (repeat ? 'Bình, người bạn cùng lớp thời đi học, lại gọi điện nhắc chuyến ra đảo hai đứa từng bàn mà chưa đi. Bình nói đã để dành được một khoản, chỉ chờ tôi gật đầu.'
          : 'Bình, người bạn cùng lớp thời đi học, gọi điện sau nhiều năm. Bình kể vừa nghỉ hưu, nhắc chuyến ra đảo hai đứa từng bàn hồi trẻ mà chưa đi, rồi hỏi tôi có muốn đi thật một lần không.'),
      choices: [
        { label: 'Hẹn nhau đi thật', effects: { happiness: 2 },
          dream: { action: 'accept', companion: partner ? 'partner' : 'friend', companionName: partner ?? 'Bình' },
          text: partner ? 'Tôi kẹp cặp vé cũ vào cuốn sổ, ghi lên trang đầu: chuyến đi vùng núi. Tối đó hai người ngồi tính xem mùa hoa rơi vào tháng nào.'
            : 'Tôi nói với Bình là đi. Hai đứa nói chuyện tới khuya, bàn nên đi tàu hay đi xe. Tôi ghi tên hòn đảo vào cuốn sổ đặt cạnh điện thoại.' },
        { label: 'Để vài năm nữa', effects: {}, dream: { action: 'later' },
          text: partner ? `Tôi nói chưa phải lúc. ${partner} cất cặp vé vào ngăn kéo, không cằn nhằn, chỉ nói lúc nào muốn thì bảo.`
            : 'Tôi hẹn Bình để vài năm nữa. Bình nói không sao, đảo còn đó, chỉ sợ chân hai đứa không còn. Hai đứa cười, rồi cúp máy.' },
        { label: repeat ? 'Thôi, không đi nữa' : 'Không đi, giữ làm kỷ niệm', effects: { intelligence: 1 }, dream: { action: 'decline' },
          text: partner ? `Tôi nói thật mình không còn muốn đi xa. ${partner} gật đầu, dán cặp vé vào album. Chiều đó hai người đi bộ ra công viên gần nhà.`
            : 'Tôi nói với Bình mình không đi được nữa. Bình im một lúc, rồi kể sang chuyện khác. Thỉnh thoảng Bình vẫn gửi ảnh biển cho tôi xem.' },
      ],
    });
  }
  if (id === 'music') {
    const learned = has(player, 'hoc_dan', 'tap_dan_lai');
    const child = adultChild(player, age);
    const childName = child ? givenName(child.name) : null;
    return story(id, 'spark', age, {
      title: repeat ? 'Tiếng đàn nhà bên' : 'Cây đàn trong kho',
      text: repeat ? 'Đứa trẻ nhà bên tập đàn mỗi tối, đánh sai mãi một đoạn. Nghe một lúc, ngón tay tôi tự gõ theo nhịp trên mặt bàn. Cây đàn cũ vẫn nằm trong kho, và tôi nghĩ tới nó.'
        : learned ? 'Dọn kho, tôi tìm thấy cây đàn mình từng tập, dây đã chùng, mặt gỗ bám bụi. Tôi lau sơ, gảy thử một hợp âm, tiếng đàn rè nhưng vẫn còn. Tôi ngồi ôm đàn, nghĩ xem nên làm gì với nó.'
          : 'Dọn kho, tôi tìm thấy cây đàn ghi-ta cũ một người bạn gửi lại từ lâu, dây đã chùng, mặt gỗ bám bụi. Tôi gảy thử, tiếng đàn rè nhưng vẫn còn. Tôi ngồi ôm đàn, nghĩ xem nên làm gì với nó.',
      choices: [
        { label: 'Chơi thử, ôn lại', effects: { happiness: 2 }, dream: { action: 'accept', companion: 'solo' },
          text: 'Tôi thay dây, tìm video dạy lại từ hợp âm đầu tiên. Tay cứng, đầu ngón đau. Tối đó tôi đánh được nửa bài hát cũ, viết tên bài lên tờ giấy dán trong cửa tủ.' },
        childName && { label: `Rủ ${childName} cùng học`, effects: { happiness: 2 }, dream: { action: 'accept', companion: 'child', companionName: childName },
          text: `Tôi gọi ${childName} sang xem cây đàn. Con cầm thử, bấm sai hết, cả hai cùng cười. Chúng tôi hẹn tối thứ Bảy nào cũng học với nhau một bài.` },
        { label: 'Cất lại vào kho', effects: {}, dream: { action: 'later' },
          text: 'Tôi lau sạch đàn, bọc vải, đặt lại chỗ cũ. Chưa phải lúc. Thỉnh thoảng đi ngang kho, tôi vẫn liếc nhìn cái bọc vải.' },
        repeat && { label: 'Tặng đàn cho đứa trẻ', effects: { happiness: 1 }, dream: { action: 'decline' },
          text: 'Tôi mang cây đàn sang tặng đứa trẻ nhà bên. Nó ôm đàn, cúi đầu cảm ơn. Tối nào nghe nó tập, tôi biết đoạn nào nó vừa qua được.' },
      ],
    });
  }
  const place = has(player, 've_que_song', 've_que_song_mot_minh', 've_que_lam_vuon') ? 'pho-cu' : 'que';
  const where = place === 'que' ? `ngôi trường tiểu học nơi tôi lớn lên${player.province ? ` ở ${player.province}` : ''}` : 'khu phố nơi tôi sống những năm mới đi làm';
  return story(id, 'spark', age, {
    title: repeat ? 'Tấm ảnh trong nhóm bạn cũ' : 'Tấm ảnh nơi cũ',
    text: repeat ? `Nhóm bạn cũ lại gửi ảnh ${where}, lần này kèm lời rủ ai còn đi được thì về một chuyến. Tôi đọc tin nhắn mấy lần, tính xem lần này có về không.`
      : `Một người bạn cũ gửi cho tôi tấm ảnh ${where}, kèm câu hỏi còn nhớ chỗ này không. Tôi phóng to tấm ảnh, nhận ra cây bàng ở góc, và nghĩ tới chuyện về thăm một lần.`,
    choices: [
      { label: 'Hẹn về một chuyến', effects: { happiness: 2 }, dream: { action: 'accept', companion: 'solo', place },
        text: 'Tôi nhắn lại là sẽ về. Tối đó tôi lục tìm cuốn sổ địa chỉ cũ, ghi lại tên những người, những chỗ muốn ghé. Danh sách dài hơn tôi nghĩ.' },
      { label: 'Để sau hẵng tính', effects: {}, dream: { action: 'later' },
        text: 'Tôi lưu tấm ảnh vào điện thoại, trả lời rằng vẫn nhớ. Chuyện về thăm để sau. Thỉnh thoảng tôi mở ảnh ra xem.' },
      { label: 'Nhớ là đủ rồi', effects: { intelligence: 1 }, dream: { action: 'decline' },
        text: 'Tôi viết cho người bạn một tin nhắn dài, kể những gì còn nhớ về nơi ấy. Không về cũng được. Người bạn trả lời bằng một tấm ảnh khác.' },
    ],
  });
}

// ——— Chuẩn bị: chọn quy mô theo tiền và sức khỏe ———
const PREPARE_TEXT = {
  trip: {
    near: 'Thuê xe riêng có tài xế, đón tận cửa, đi trong ngày, tối là về. Không xa, nhưng vẫn là một chuyến đi.',
    small: 'Một tuần đi máy bay rồi xe, ở khách sạn nhỏ gần biển, đi những chỗ trong nước.',
    gentle: 'Mười ngày, mỗi ngày đi một ít, ở khách sạn có thang máy, có xe riêng và người xách hành lý giúp.',
    large: 'Ba tuần đi xa, đi máy bay rồi tàu, ngủ ở những nơi chưa từng tới, có người dẫn đường.',
  },
  music: {
    small: 'Sắm một cây đàn mới vừa tay, mua sách nhạc, tự tập ở nhà, cuối cùng đàn cho người quen nghe.',
    large: 'Học thầy mỗi tuần suốt một năm, thuê phòng thu, mời người đệm đàn, rồi diễn ở một quán cà phê nhỏ quen.',
  },
  homecoming: {
    near: 'Thuê xe riêng chở về một ngày, đi chậm, nghỉ nhiều.',
    small: 'Về một tuần, ở nhà nghỉ, mời bạn cũ một bữa cơm, đi bộ quanh những chỗ cũ.',
    large: 'Ở lại một tháng, góp tiền sửa thư viện trường, đãi bạn cũ một buổi họp mặt.',
  },
};

function prepareStory(id, entry, player, age) {
  const options = getScaleOptions(id, player);
  const frail = (player.health ?? 50) < 45 && id !== 'music';
  const intro = id === 'trip' ? `Tôi ngồi tính chuyến đi ${companionPhrase(entry)}.`
    : id === 'music' ? `Tôi tính chuyện tập đàn${entry.companion === 'child' ? ` ${companionPhrase(entry)}` : ''} cho ra một buổi trọn vẹn.`
      : 'Tôi ngồi tính chuyến về nơi cũ.';
  const warning = id === 'homecoming' ? ' Bạn cũ báo dãy lớp cũ sẽ bị phá để xây mới trong vài năm tới.' : '';
  return story(id, 'prepare', age, {
    title: id === 'trip' ? 'Lên kế hoạch chuyến đi' : id === 'music' ? 'Tập lại từ đầu' : 'Chuẩn bị về thăm',
    text: `${intro}${frail ? ' Sức khỏe không như trước, nên phải chọn cách cho vừa sức.' : ''} Mỗi cách tốn tiền và công sức khác nhau.${warning} Tôi phải quyết định làm theo cách nào, hay để dành thêm.`,
    choices: [
      ...options.map(scale => ({
        label: DREAMS[id].scales[scale].label, money: -DREAMS[id].scales[scale].cost, effects: { happiness: 1 },
        dream: { action: 'prepare', scale },
        text: `${PREPARE_TEXT[id][scale]} Tôi trả tiền, ghi lịch vào cuốn sổ. Từ hôm đó, sáng nào thức dậy cũng thấy có một việc để chờ.`,
      })),
      { label: 'Để dành thêm, chuẩn bị kỹ', effects: { intelligence: 1 }, dream: { action: 'wait' },
        text: 'Tôi chưa trả gì, để dành thêm một thời gian và hỏi kỹ những người từng làm. Kế hoạch lùi lại, nhưng tôi biết rõ hơn mình cần gì.' },
    ],
  });
}

// ——— Hoàn cảnh đổi khác sau khi trì hoãn: có lúc khó hơn, có lúc thuận hơn ———
function tripTwist(entry, player, age) {
  const child = adultChild(player, age);
  const health = player.health ?? 50;
  if (entry.companion === 'partner' && !player.partner) {
    return story('trip', 'twist', age, {
      title: 'Chuyến đi còn lại một người',
      text: `Chuyến đi từng hẹn với ${entry.companionName ?? 'người ấy'} giờ chỉ còn mình tôi giữ cuốn sổ kế hoạch. Tiền đã trả vẫn còn đó. Tôi lật từng trang, nghĩ xem chuyến đi này nên tiếp tục ra sao.`,
      choices: [
        { label: 'Đi một mình, mang theo ảnh', effects: { happiness: 1 }, dream: { action: 'twist', companion: 'solo' },
          text: 'Tôi quyết định vẫn đi, bỏ tấm ảnh hai người vào túi áo khoác. Đổi vé lại cho một người, tôi ngồi nhìn tờ xác nhận khá lâu.' },
        { label: 'Rủ Bình đi cùng', effects: { happiness: 2 }, dream: { action: 'twist', companion: 'friend', companionName: 'Bình' },
          text: 'Tôi gọi cho Bình, người bạn cùng lớp lâu rồi chưa gặp. Bình nghe chuyện, im một lúc, rồi nói sẽ đi cùng, tự lo phần tiền của mình.' },
      ],
    });
  }
  if (entry.scale === 'large' && health < 45) {
    return story('trip', 'twist', age, {
      title: 'Chuyến dài thành khó',
      text: 'Mấy năm chờ, sức khỏe tôi đi xuống, leo vài bậc thang đã thở dốc. Chuyến dài đi xa đã trả tiền giờ thành nặng sức. Người tư vấn nói có thể đổi sang hành trình chậm, hoặc giữ nguyên và thuê người hỗ trợ đi kèm.',
      choices: [
        { label: 'Đổi sang hành trình chậm', effects: { health: 1 }, dream: { action: 'twist', scale: 'gentle' },
          text: 'Tôi đổi sang hành trình chậm, bỏ bớt hai điểm đến xa. Phần tiền chênh không lấy lại được, nhưng lịch đi nhẹ hẳn, ngày nào cũng có giờ nghỉ trưa.' },
        { label: 'Giữ lịch, thuê người hỗ trợ', money: -30000000, effects: { happiness: 1 }, dream: { action: 'twist', helper: 'người hỗ trợ đi kèm' },
          text: 'Tôi giữ nguyên chuyến dài, thuê một điều dưỡng đi kèm suốt hành trình, đổi sang ghế máy bay rộng hơn. Tốn thêm một khoản lớn, nhưng tôi không phải bỏ điểm đến nào.' },
      ],
    });
  }
  if (entry.companion === 'friend') {
    return story('trip', 'twist', age, {
      title: 'Bình chuyển nhà',
      text: 'Bình gọi điện báo đã chuyển vào ở với con ở một thành phố khác, xa chỗ hẹn xuất phát. Bình vẫn muốn đi, chỉ ngại tôi phải đổi kế hoạch. Tôi mở bản đồ, nhìn hai chấm cách xa nhau.',
      choices: [
        { label: 'Đổi lộ trình, đi đón Bình', money: -6000000, effects: { happiness: 2 }, dream: { action: 'twist' },
          text: 'Tôi đổi lộ trình, bay tới chỗ Bình trước. Tốn thêm vé máy bay, thêm một ngày đường. Bình nói ở thành phố mới chưa quen ai, nghe tôi tới thì đếm ngày.' },
        { label: 'Đi một mình, ghé thăm Bình', effects: { happiness: 1, intelligence: 1 }, dream: { action: 'twist', companion: 'solo' },
          text: 'Hai đứa bàn lại: tôi đi một mình theo lịch cũ, trên đường về ghé nhà Bình hai hôm. Bình hơi tiếc, nhưng nói vậy cũng là gặp nhau.' },
      ],
    });
  }
  if (child) {
    const name = givenName(child.name);
    return story('trip', 'twist', age, {
      title: `${name} muốn đi cùng`,
      text: `Biết tôi hoãn chuyến đi, ${name} nói năm nay xin được nghỉ phép dài, muốn đi cùng cho yên tâm, tự lo tiền của mình. Tôi nghĩ tới chuyến đi đã tính từ lâu, nghĩ tới con, chưa trả lời.`,
      choices: [
        { label: 'Rủ con đi cùng', effects: { happiness: 2 }, dream: { action: 'twist', withName: name },
          text: `Tôi gật đầu. ${name} lập bảng kế hoạch chi tiết đến từng giờ, tôi xóa bớt một nửa. Hai người bàn tới bàn lui vài lần, rồi chốt được lịch.` },
        { label: 'Giữ chuyến đi như đã hẹn', effects: { intelligence: 1 }, dream: { action: 'twist' },
          text: `Tôi cảm ơn con, nói chuyến này là lời hẹn cũ, muốn giữ đúng như thế. ${name} hiểu, chỉ dặn đến nơi nào cũng nhắn một tin.` },
      ],
    });
  }
  const current = entry.scale ?? 'small';
  return story('trip', 'twist', age, {
    title: 'Khoản tiền để dành thêm',
    text: 'Mấy năm hoãn, khoản tiền để dành cho chuyến đi đã nhiều lên. Người tư vấn nói có thể nâng thành chuyến dài hơn, hoặc giữ nguyên và để phần dư cho việc khác. Tôi nhìn con số trong sổ, tính xem nên làm gì.',
    choices: [
      current !== 'large' && health >= 45 && { label: 'Nâng lên chuyến dài', money: -(DREAMS.trip.scales.large.cost - DREAMS.trip.scales[current].cost), effects: { happiness: 1 }, dream: { action: 'twist', scale: 'large' },
        text: 'Tôi trả thêm phần chênh, nâng lên chuyến dài. Lịch đi xa hơn, nhiều chặng hơn. Tối đó tôi trải bản đồ ra sàn, đánh dấu từng chặng.' },
      { label: 'Giữ nguyên kế hoạch', effects: { intelligence: 1 }, dream: { action: 'twist' },
        text: 'Tôi giữ kế hoạch cũ, phần tiền dư để riêng một phong bì, phòng khi đi đường cần. Chuyến đi vẫn như lời hẹn ban đầu.' },
      { label: 'Rủ một người hàng xóm', effects: { happiness: 2 }, dream: { action: 'twist', withName: 'người hàng xóm' },
        text: 'Tôi rủ người hàng xóm cùng tuổi, cũng sống một mình, đi chung. Người ấy tự trả phần mình, mừng như được quà. Từ đó hai nhà hay qua lại.' },
    ],
  });
}

function musicTwist(entry, player, age) {
  if (entry.scale === 'large') {
    return story('music', 'twist', age, {
      title: 'Quán cà phê đổi chủ',
      text: 'Quán cà phê nhỏ nơi tôi định diễn đã đổi chủ, sân khấu gỗ bị dỡ để kê thêm bàn. Tiền học thầy và phòng thu đã trả rồi, chỉ còn thiếu chỗ diễn. Tôi đứng trước cửa quán, nghĩ xem buổi diễn sẽ ở đâu.',
      choices: [
        { label: 'Diễn ở sân nhà', effects: { happiness: 2 }, dream: { action: 'twist', venue: 'sân nhà' },
          text: 'Tôi quyết định diễn ngay ở sân nhà, mượn thêm ghế nhựa của hàng xóm. Không có sân khấu, nhưng có giàn hoa và đèn dây tự mắc.' },
        { label: 'Thuê hội trường nhỏ', money: -6000000, effects: { happiness: 1 }, dream: { action: 'twist', venue: 'hội trường nhỏ của phường' },
          text: 'Tôi thuê hội trường nhỏ của phường một buổi tối, có loa, có đèn sân khấu, có người lo âm thanh. Người phụ trách hứa dán thông báo ở bảng tin cho cả phường biết.' },
      ],
    });
  }
  return story('music', 'twist', age, {
    title: 'Lời mời của câu lạc bộ',
    text: 'Câu lạc bộ người cao tuổi phường nghe nói tôi tập đàn lại, mời góp một tiết mục trong buổi văn nghệ cuối năm. Nhận lời thì phải tập theo lịch chung, đứng trước nhiều người. Tôi phải trả lời họ.',
    choices: [
      { label: 'Nhận lời câu lạc bộ', effects: { happiness: 1, health: -1 }, dream: { action: 'twist', venue: 'buổi văn nghệ của câu lạc bộ' },
        text: 'Tôi nhận lời, mỗi tuần tập với ban nhạc của câu lạc bộ hai buổi. Lần đầu tập chung, tôi đánh lệch nhịp cả bài. Người trưởng nhóm chỉ cười, bảo tập tiếp.' },
      { label: 'Giữ kế hoạch nhỏ', effects: { intelligence: 1 }, dream: { action: 'twist' },
        text: 'Tôi cảm ơn câu lạc bộ, hẹn dịp khác. Tôi muốn buổi đầu tiên là ở nhà, với vài người quen. Câu lạc bộ để ngỏ lời mời.' },
    ],
  });
}

function homecomingTwist(entry, player, age) {
  const child = adultChild(player, age);
  if (entry.deadline != null && age > entry.deadline) {
    return story('homecoming', 'twist', age, {
      title: 'Dãy lớp cũ đã phá',
      text: 'Bạn cũ gửi ảnh: dãy lớp cũ đã phá, ngôi trường mới ba tầng đã xây xong. Chuyến về của tôi đã trả tiền từ trước. Tôi nhìn tấm ảnh, nghĩ xem về rồi sẽ tìm lại điều gì.',
      choices: [
        { label: 'Vẫn về thăm trường mới', effects: { happiness: 1 }, dream: { action: 'twist', rebuilt: true },
          text: 'Tôi vẫn giữ chuyến về. Trường mới thì lạ, nhưng con đường dẫn tới cổng chắc vẫn vậy. Tôi ghi thêm vào sổ: hỏi xem cây bàng còn không.' },
        { label: 'Đổi sang tìm thăm thầy cô', effects: { intelligence: 1 }, dream: { action: 'twist', rebuilt: true, seekTeacher: true },
          text: 'Tôi đổi kế hoạch, nhờ bạn cũ dò địa chỉ thầy cô năm xưa. Bạn tìm được hai người còn ở gần trường. Tôi gói sẵn hai hộp trà.' },
      ],
    });
  }
  if (child) {
    const name = givenName(child.name);
    return story('homecoming', 'twist', age, {
      title: `${name} muốn về cùng`,
      text: `${name} biết tôi hoãn chuyến về nơi cũ, nói muốn đi cùng để xem chỗ tôi hay kể. Nhưng con chỉ rảnh dịp cuối năm, còn tôi đã hẹn bạn cũ từ trước. Tôi phải chọn đi lúc nào.`,
      choices: [
        { label: 'Chờ đi cùng con', effects: { happiness: 2 }, dream: { action: 'twist', withName: name, delay: 1 },
          text: `Tôi báo bạn cũ lùi lịch. ${name} đánh dấu ngày trên lịch, hỏi tôi đủ thứ về con đường, cây bàng, gánh hàng trước cổng trường.` },
        { label: 'Đi trước như đã hẹn', effects: { intelligence: 1 }, dream: { action: 'twist' },
          text: `Tôi giữ lịch với bạn cũ, hứa với ${name} sẽ chụp thật nhiều ảnh. Con dặn đi đâu cũng gọi video cho con xem.` },
      ],
    });
  }
  return story('homecoming', 'twist', age, {
    title: 'Lời mời ở nhờ',
    text: 'Một người bạn cũ còn ở lại nơi ấy nghe tôi hoãn chuyến về, gọi điện mời tới ở nhờ nhà mình cho tiện. Ở nhờ thì ấm cúng nhưng phải theo nếp nhà người ta. Tôi phải trả lời bạn.',
    choices: [
      { label: 'Nhận lời ở nhờ', effects: { happiness: 2 }, dream: { action: 'twist', host: true },
        text: 'Tôi nhận lời, gửi trước một thùng quà. Người bạn nhắn đã dọn sẵn căn phòng có cửa sổ nhìn ra con đường cũ.' },
      { label: 'Cảm ơn, vẫn ở nhà nghỉ', effects: { intelligence: 1 }, dream: { action: 'twist' },
        text: 'Tôi cảm ơn, nói muốn tự do đi giờ giấc của mình. Hai người hẹn một bữa cơm ở nhà bạn trong chuyến về.' },
    ],
  });
}

const TWISTS = { trip: tripTwist, music: musicTwist, homecoming: homecomingTwist };

// ——— Đời sống xen vào kế hoạch ———
function interplayStory(id, entry, player, age) {
  if (id === 'trip') {
    return story(id, 'interplay', age, {
      title: 'Mái hiên dột trước chuyến đi',
      text: 'Gần tới ngày đi, một trận mưa lớn làm mái hiên dột, nước loang vào góc phòng khách. Thợ nói sửa kỹ thì mất cả tuần, đúng vào lịch đi. Tôi nhìn vệt nước trên tường, rồi nhìn cuốn sổ kế hoạch.',
      choices: [
        { label: 'Sửa mái, lùi chuyến đi', money: -12000000, effects: { health: 1 }, dream: { action: 'interplay', delay: 1 },
          text: 'Tôi ở nhà trông thợ lợp lại cả mái hiên, thay luôn máng nước, báo lùi chuyến đi thêm một năm. Mái mới chắc chắn. Cuốn sổ kế hoạch tôi gạch ngày cũ, ghi ngày mới.' },
        { label: 'Vá tạm, đi đúng hẹn', effects: { happiness: 1, health: -1 }, dream: { action: 'interplay' },
          text: 'Tôi trèo lên chằng tạm tấm bạt, kê xô hứng nước, dặn hàng xóm trông giúp. Chuyến đi vẫn đúng hẹn, lưng tôi đau mấy hôm.' },
        { label: 'Nhờ thợ làm khi mình đi', money: -18000000, effects: { happiness: 1 }, dream: { action: 'interplay' },
          text: 'Tôi thuê đội thợ lợp lại cả mái trong lúc mình đi, trả thêm người trông coi nhà, gửi ảnh mỗi ngày. Tốn hơn nhiều, nhưng lịch đi giữ nguyên.' },
      ],
    });
  }
  if (id === 'music') {
    return story(id, 'interplay', age, {
      title: 'Chiếc máy ghi âm cho mượn',
      text: 'Một người quen biết tôi đang tập đàn, mang sang cho mượn chiếc máy ghi âm cũ còn tốt, dặn dùng bao lâu cũng được. Tôi chưa quen máy móc, sợ làm hỏng đồ của người ta, nên cầm máy mà ngần ngừ.',
      choices: [
        { label: 'Mượn, ghi lại từng buổi', effects: { intelligence: 1, happiness: 1 }, dream: { action: 'interplay', helper: 'máy ghi âm' },
          text: 'Tôi ghi lại từng buổi tập, tối nghe lại thấy chỗ nào vấp. Tuần sau tiếng đàn đều hơn. Tôi dán băng dính ghi chú lên từng nút của máy.' },
        { label: 'Cảm ơn, tập theo cách cũ', effects: { happiness: 1 }, dream: { action: 'interplay' },
          text: 'Tôi cảm ơn, nói thích tập theo tai mình hơn. Người quen cười, bảo khi nào cần thì sang lấy. Tôi biếu lại họ một hộp bánh.' },
      ],
    });
  }
  return story(id, 'interplay', age, {
    title: 'Ai tưới cây khi mình đi',
    text: 'Gần tới chuyến về, tôi lo nhất là mấy chậu cây ở nhà. Người hàng xóm trẻ ngỏ ý tưới giúp, nhưng họ cũng bận. Dịch vụ trông nhà thì tốn tiền. Tôi đi một vòng quanh nhà, đếm chậu cây, tính xem nhờ ai.',
    choices: [
      { label: 'Nhờ hàng xóm, gửi quà', money: -1000000, effects: { happiness: 1 }, dream: { action: 'interplay' },
        text: 'Hàng xóm nhận lời, tôi viết tờ giấy hướng dẫn tưới cây dán ở tủ lạnh, gửi trước giỏ quà và phong bì cảm ơn. Họ gửi ảnh mấy chậu cây mỗi tối.' },
      { label: 'Thuê dịch vụ trông nhà', money: -4000000, effects: { health: 1 }, dream: { action: 'interplay' },
        text: 'Tôi thuê dịch vụ trông nhà trọn gói, người ta đến mỗi ngày, tưới cây, quét nhà, gửi báo cáo kèm ảnh. Tôi đi mà không phải gọi điện hỏi ai.' },
      { label: 'Gửi cây sang nhà người quen', effects: { health: -1, happiness: 1 }, dream: { action: 'interplay' },
        text: 'Tôi khuân từng chậu cây sang nhà người quen ở cuối đường, mỏi cả lưng. Họ xếp cây dọc hiên, nói nhà tự dưng xanh hẳn, về muộn mấy hôm cũng được.' },
    ],
  });
}

// ——— Thực hiện: một quyết định giữa chừng, kết quả là kết thúc của ước mơ ———
const JOURNEY = {
  trip: {
    title: { near: 'Chuyến đi trong ngày', small: 'Lên đường', gentle: 'Hành trình đi chậm', large: 'Chuyến đi xa' },
    scene: entry => `Chuyến đi ${companionPhrase(entry)}${entry.withName ? `, có thêm ${entry.withName}` : ''}${entry.helper ? `, có ${entry.helper}` : ''} bắt đầu từ sáng sớm. Giữa đường, xe dừng ở một thị trấn đang có phiên chợ. Ở lại xem thì lỡ một điểm đã định, đi tiếp thì kịp lịch.`,
    choices: entry => {
      const we = together(entry) ? 'Chúng tôi' : 'Tôi';
      return [
        { label: 'Ở lại xem phiên chợ', outcome: 'phiên chợ ở thị trấn lạ',
          text: scale => `${we} ở lại, ăn bát cháo ở phiên chợ, mua mấy món đồ đan tay. Điểm đã định thì lỡ. ${scale === 'large' ? 'Chuyến đi xa còn nhiều chặng,' : 'Chuyến đi không dài,'} vậy mà về sau điều tôi nhớ nhất lại là cái chợ không có trong kế hoạch.` },
        { label: 'Đi tiếp cho kịp lịch', outcome: 'đến đúng nơi đã hẹn',
          text: scale => `${we} đi tiếp, tới đúng nơi đã hẹn lúc chiều xuống. ${scale === 'near' ? 'Chỉ kịp đứng một lúc rồi về,' : 'Đứng nhìn cảnh đã nghĩ tới bao nhiêu năm,'} tôi thấy lời hẹn cũ cuối cùng đã thành chuyện có thật.` },
      ];
    },
    keepsake: (entry, outcome) => ({ id: 'dream-trip', name: 'Cuống vé chuyến đi đã hẹn', icon: '🎫',
      description: `Chuyến đi ${companionPhrase(entry)}, nhớ nhất là ${outcome}.` }),
    effects: scale => scale === 'large' ? { happiness: 4, health: -1 } : scale === 'gentle' ? { happiness: 3 } : scale === 'near' ? { happiness: 2 } : { happiness: 3, health: -1 },
  },
  music: {
    title: { small: 'Buổi đàn ở nhà', large: 'Buổi diễn nhỏ' },
    scene: entry => {
      const venue = entry.venue ?? (entry.scale === 'large' ? 'quán cà phê quen' : null);
      return `Đến ngày ${venue ? `diễn ở ${venue}` : 'đàn cho người quen nghe ở nhà'}, tôi${entry.companion === 'child' ? ` ${companionPhrase(entry)}` : ''} chuẩn bị ba bài. Ngay trước giờ bắt đầu, tay tôi run. Tôi phải chọn mở đầu bằng bài cũ đã thuộc lòng hay bài mới tập.`;
    },
    choices: entry => [
      { label: 'Mở đầu bằng bài cũ', outcome: 'bài hát cũ ai cũng hát theo',
        text: scale => `Bài cũ vừa vang lên, mấy người ngồi dưới đã hát theo. ${scale === 'large' ? 'Người thu âm giữ trọn buổi diễn.' : entry.helper === 'máy ghi âm' ? 'Chiếc máy ghi âm mượn được giữ lại cả buổi.' : 'Một người quen ghi lại bằng điện thoại.'} Tay tôi hết run từ câu thứ hai.` },
      { label: 'Liều với bài mới tập', outcome: 'bài mới tập, vấp một đoạn rồi đàn lại',
        text: scale => `Bài mới vấp ở đoạn giữa, tôi dừng, cười, đàn lại từ đầu. Mọi người vỗ tay to hơn cả lúc trước. ${scale === 'large' ? 'Bản thu giữ cả chỗ vấp ấy.' : 'Có người nói lần đầu nghe tôi đàn mà thấy gần gũi.'}` },
    ],
    keepsake: (entry, outcome) => ({ id: 'dream-music', name: entry.scale === 'large' ? 'Bản thu buổi diễn nhỏ' : 'Đoạn ghi âm buổi đàn ở nhà', icon: '🎵',
      description: `Buổi đàn${entry.companion === 'child' ? ` ${companionPhrase(entry)}` : ''}: ${outcome}.` }),
    effects: scale => scale === 'large' ? { happiness: 4, intelligence: 1 } : { happiness: 3 },
  },
  homecoming: {
    title: { near: 'Một ngày ở nơi cũ', small: 'Về thăm nơi cũ', large: 'Một tháng ở nơi cũ' },
    scene: entry => `Tôi về tới ${entry.place === 'pho-cu' ? 'khu phố cũ' : 'nơi mình lớn lên'}${entry.withName ? ` cùng ${entry.withName}` : ''}${entry.host ? ', ở nhờ nhà người bạn cũ' : ''}. ${entry.rebuilt ? 'Trường cũ đã xây mới, nhiều thứ không còn như trong trí nhớ.' : 'Nhiều thứ đã đổi khác, vài thứ vẫn y nguyên.'} Thời gian có hạn, tôi phải chọn đi tìm người hay tìm lại những chỗ cũ.`,
    choices: entry => [
      entry.seekTeacher
        ? { label: 'Đi thăm thầy cô cũ', outcome: 'thăm lại thầy cô năm xưa',
          text: scale => `Thầy giáo cũ nhận ra tôi sau một lúc nhìn kỹ, gọi đúng tên. Thầy lấy ra cuốn sổ điểm đã ố vàng, tìm tên tôi trong đó. ${scale === 'large' ? 'Cuối tháng, tôi mời cả lớp cũ đến nhà thầy.' : 'Lúc về, thầy tiễn tôi ra tận đầu đường.'}` }
        : { label: 'Tìm người quen cũ', outcome: 'gặp lại người quen cũ',
          text: scale => `Tôi hỏi thăm từng nhà, tìm được người bạn ngồi cùng bàn năm xưa. Hai người ngồi tới tối, kể chuyện từng đứa trong lớp. ${scale === 'large' ? 'Cuối tháng, cả lớp cũ họp mặt được mười mấy người.' : 'Lúc về, bạn dúi cho tôi túi trái cây vườn nhà.'}` },
      { label: 'Tìm lại những chỗ cũ', outcome: 'tìm lại cây bàng và con đường cũ',
        text: scale => `${entry.rebuilt ? 'Trường mới, nhưng cây bàng góc sân vẫn được giữ lại.' : 'Cây bàng góc sân vẫn còn, chỉ to hơn.'} Tôi đi lại con đường cũ, đếm từng ngã rẽ. ${scale === 'large' ? 'Thư viện trường sửa xong, có tấm bảng nhỏ ghi lời cảm ơn.' : 'Tôi chụp tấm ảnh trước cổng, đứng đúng chỗ năm xưa.'}` },
    ],
    keepsake: (entry, outcome) => ({ id: 'dream-homecoming', name: 'Tấm ảnh trước cổng nơi cũ', icon: '📷',
      description: `Chuyến về nơi cũ: ${outcome}.` }),
    effects: scale => scale === 'large' ? { happiness: 4, intelligence: 1 } : scale === 'near' ? { happiness: 2 } : { happiness: 3 },
  },
};

function journeyStory(id, entry, player, age, root = null) {
  const data = JOURNEY[id];
  const scale = entry.scale ?? 'small';
  // Người trở lại với ước mơ thời nhỏ có thêm một kết thúc nhắc đúng người và chuyện cũ.
  const special = entry.fromRoot && root?.id === id ? rootJourneyChoice(root, player, scale) : null;
  const options = [...data.choices(entry), ...(special ? [{ ...special, text: () => special.text }] : [])];
  return story(id, 'journey', age, {
    title: data.title[scale] ?? data.title.small,
    text: data.scene(entry),
    choices: options.map(choice => ({
      ...(entry.forParent ? { achievementIds: ['promise-kept'] } : {}),
      label: choice.label, effects: data.effects(scale), text: choice.text(scale),
      keepsake: data.keepsake(entry, choice.outcome),
      dream: { action: 'journey', outcome: choice.outcome },
    })),
  });
}

// ——— Dư âm sau khi hoàn thành ———
function echoStory(id, entry, player, age) {
  if (id === 'trip') {
    return story(id, 'echo', age, {
      title: 'Những tấm ảnh chuyến đi',
      text: `Điện thoại hiện lại những tấm ảnh chuyến đi ${companionPhrase(entry)} mấy năm trước. Tôi lướt xem từng tấm, dừng ở tấm chụp ${entry.outcome ?? 'vội ven đường'}. Ảnh vẫn nằm trong máy, chưa in tấm nào, và tôi nghĩ xem nên làm gì với chúng.`,
      choices: [
        { label: 'In thành một cuốn album', money: -1600000, effects: { happiness: 2 }, dream: { action: 'echo' },
          text: 'Tôi chọn năm mươi tấm, in thành cuốn album bìa cứng, giấy dày. Cuốn album nằm trên bàn nước, khách đến hay lật xem, hỏi chỗ này ở đâu.' },
        { label: 'Kể lại cho người quen', effects: { happiness: 1, intelligence: 1 }, dream: { action: 'echo' },
          text: 'Tôi mang điện thoại ra quán trà, kể lại chuyến đi cho nhóm bạn. Có người ghi lại tên chỗ đó, nói năm sau cũng muốn đi.' },
      ],
    });
  }
  if (id === 'music') {
    return story(id, 'echo', age, {
      title: 'Bản thu năm ấy',
      text: `Một tối mất điện, tôi mở lại bản thu buổi đàn năm nào trên điện thoại. Tiếng đàn ngày ấy còn chắc tay, có cả ${entry.outcome ?? 'tiếng vỗ tay'}. Nghe xong, tôi nhìn cây đàn dựng ở góc nhà.`,
      choices: [
        { label: 'Gửi bản thu cho người cũ', effects: { happiness: 2 }, dream: { action: 'echo' },
          text: 'Tôi gửi bản thu cho những người hôm ấy có mặt. Tin nhắn trả lời đến tận khuya, có người gửi lại ảnh chụp buổi đó mà tôi chưa xem bao giờ.' },
        { label: 'Lấy đàn ra đàn lại', effects: { happiness: 1, health: 1 }, dream: { action: 'echo' },
          text: 'Tôi lấy đàn ra đàn lại bài ấy trong bóng tối. Tay chậm hơn bản thu, nhưng vẫn nhớ. Có điện lại rồi tôi vẫn ngồi đàn thêm một lúc.' },
      ],
    });
  }
  return story(id, 'echo', age, {
    title: 'Lá thư từ nơi cũ',
    text: `Người bạn ở nơi cũ gửi thư tay, kể từ sau chuyến tôi về, chuyện ${entry.outcome ?? 'hôm ấy'} vẫn hay được nhắc tới. Trong thư có kẹp một chiếc lá bàng ép khô. Tôi đọc thư hai lần, nghĩ xem nên đáp lại thế nào.`,
    choices: [
      { label: 'Viết thư tay trả lời', effects: { happiness: 2 }, dream: { action: 'echo' },
        text: 'Tôi viết ba trang thư, chữ run nhưng đều. Gửi thư xong, tôi ép chiếc lá bàng vào cuốn sổ, cạnh tấm ảnh chụp trước cổng.' },
      { label: 'Gọi điện nói chuyện', effects: { happiness: 1 }, dream: { action: 'echo' },
        text: 'Tôi gọi điện, hai người nói chuyện gần một tiếng, cười nhiều hơn nói. Cúp máy, tôi kẹp chiếc lá bàng vào khung tấm ảnh cũ.' },
    ],
  });
}

const chance = (player, key, value) => lifeRandom(player, key)() < value;

// Tối đa một bước ước mơ cho năm này, hoặc null. Bước tiếp theo chỉ mở từ năm sau
// năm vừa tiến, nên mỗi năm có nhiều nhất một bước tiến.
function parentWishStory(dreams, player, age) {
  const wish = dreams.parentWish;
  if (!wish || dreams.active || dreams.entries[wish.id] || !['open', 'later'].includes(wish.status) || (wish.laterAge ?? 0) > age) return null;
  if (Number.isInteger(player.lineage?.takeoverAge) && age <= player.lineage.takeoverAge) return null;
  const who = `${wish.parentRole} ${wish.parentName}`.trim();
  return story(wish.id, 'parent-wish', age, {
    title: 'Ước nguyện còn dang dở',
    text: `Dọn tủ của ${who}, tôi thấy cuốn sổ ghi dở một dòng: “${wish.name}”. Đó là điều ${wish.parentRole} còn mong mà chưa làm trọn. Tôi lật từng trang, nghĩ xem mình có muốn đi tiếp con đường ấy không.`,
    choices: [
      { label: `Làm tiếp thay ${wish.parentRole}`, effects: { happiness: 2 }, dream: { action: 'wish-accept' },
        text: `Tôi ghi thêm một dòng bên dưới nét chữ của ${wish.parentRole}: sẽ làm tiếp. Từ hôm ấy cuốn sổ nằm trên bàn, cạnh cuốn sổ của chính tôi.` },
      { label: 'Để vài năm nữa', effects: {}, dream: { action: 'wish-later' },
        text: 'Tôi cất cuốn sổ vào ngăn kéo. Chưa phải lúc, nhưng tôi biết nó vẫn ở đó.' },
      { label: 'Giữ cuốn sổ làm kỷ niệm', effects: { intelligence: 1 }, dream: { action: 'wish-decline' },
        text: `Tôi giữ cuốn sổ như giữ giọng nói của ${wish.parentRole}. Con đường ấy là của ${wish.parentRole}; tôi có con đường của mình.` },
    ],
  });
}

export function getDreamStory(player, age) {
  if (!player || player.isAlive === false || age > DREAM_LAST_AGE || inPrison(player)) return null;
  const dreams = normalizeDreams(player.dreams);
  const entry = dreams.active ? dreams.entries[dreams.active] : null;
  // Trước 55 tuổi chỉ có ước mơ từ tuổi nhỏ, trừ khi người con đang tiếp nối ước nguyện của bố/mẹ.
  if (age < DREAM_MIN_AGE && !entry?.forParent) return parentWishStory(dreams, player, age) ?? getRootStory(player, age, dreams);
  if (entry && (entry.lastStepAge ?? -1) < age && (entry.readyAge ?? 0) <= age) {
    const id = dreams.active;
    // Chờ càng lâu, bước tiếp theo càng dễ được bốc, để chuỗi không kéo dài vô tận.
    const weight = DREAM_BASE_WEIGHT + Math.min(1.5, 0.5 * Math.max(0, age - (entry.lastStepAge ?? age) - 1));
    let step = null;
    if (entry.step === 1) step = prepareStory(id, entry, player, age);
    else if (entry.step === 2) {
      const companionMissing = entry.companion === 'partner' && !player.partner;
      const deadlinePassed = id === 'homecoming' && entry.deadline != null && age > entry.deadline && !entry.rebuilt;
      if (!entry.twistSeen && (entry.delayed || companionMissing || deadlinePassed)) step = TWISTS[id](entry, player, age);
      else if (!entry.interplaySeen && !entry.twistSeen && chance(player, `dream-interplay|${id}|${age}`, 0.35)) step = interplayStory(id, entry, player, age);
      else step = journeyStory(id, entry, player, age, dreams.roots);
    }
    if (step) return { ...step, weight };
  }
  const echo = DREAM_IDS.find(id => {
    const done = dreams.entries[id];
    return done?.status === 'done' && !done.echoSeen && age - (done.finishedAtAge ?? age) >= 2;
  });
  if (echo && chance(player, `dream-echo|${age}`, 0.5)) return echoStory(echo, dreams.entries[echo], player, age);
  if (dreams.active) return null;
  const wishStory = parentWishStory(dreams, player, age);
  if (wishStory) return wishStory;
  const open = DREAM_IDS.filter(id => !dreams.entries[id] && (dreams.later[id] ?? 0) <= age && age <= DREAMS[id].lastStartAge);
  if (!open.length) return null;
  // Gợi ý theo dấu vết cuộc đời trước; người thiếu lịch sử vẫn có thứ tự ngẫu nhiên theo đời.
  const affinity = id => (id === 'music' && has(player, 'hoc_dan', 'tap_dan_lai')) || (id === 'trip' && Boolean(player.partner)) ||
    (id === 'homecoming' && has(player, 've_truong_cu', 've_que_lam')) ? 1 : 0;
  const preferred = open.filter(affinity);
  const pool = preferred.length ? preferred : open;
  // Ước mơ gieo từ nhỏ (kể cả đã gác hay đã buông) được gợi lại trước tiên.
  const rootPick = dreams.roots && open.includes(dreams.roots.id) && !['returned', 'done'].includes(dreams.roots.stage) ? dreams.roots.id : null;
  const pick = rootPick ?? pool[Math.floor(lifeRandom(player, `dream-spark|${age}`)() * pool.length)];
  return sparkStory(pick, player, age, (dreams.offers[pick] ?? 0) > 0, pick === rootPick ? dreams.roots : null);
}

// Áp dụng một lựa chọn ước mơ. Trả về null nếu lựa chọn không còn hợp với trạng thái hiện tại
// (đã hoàn thành, đã tạm gác, đã đổi mục tiêu), để không trừ tiền hay trao thưởng lặp.
export function getDreamChoiceUpdates(player, descriptor, age, money = 0) {
  const id = descriptor?.id;
  if (!DREAMS[id]) return null;
  const dreams = normalizeDreams(player.dreams);
  const cost = money < 0 ? -money : 0;
  if (String(descriptor.action).startsWith('wish-')) {
    const wish = dreams.parentWish;
    if (!wish || wish.id !== id || !['open', 'later'].includes(wish.status) || dreams.entries[id]) return null;
    if (descriptor.action === 'wish-later') return { dreams: { ...dreams, parentWish: { ...wish, status: 'later', laterAge: age + 5 } } };
    if (descriptor.action === 'wish-decline') return { dreams: { ...dreams, parentWish: { ...wish, status: 'declined' } } };
    if (descriptor.action !== 'wish-accept') return null;
    const paused = dreams.active ? { [dreams.active]: { ...dreams.entries[dreams.active], status: 'paused', pausedAtAge: age, delayed: true } } : {};
    const partner = id === 'trip' && player.partner ? player.partner : null;
    return { dreams: { ...dreams, active: id, parentWish: { ...wish, status: 'accepted' }, entries: { ...dreams.entries, ...paused,
      [id]: { ...blankEntry(), startedAtAge: age, lastStepAge: age, forParent: true, place: 'que',
        companion: partner ? 'partner' : 'solo', companionName: partner ? givenName(partner.name) : null } } } };
  }
  if (String(descriptor.action).startsWith('root-')) {
    const next = applyRootChoice(dreams, descriptor, age, player, cost);
    return next ? { dreams: next } : null;
  }
  const entry = dreams.entries[id] ?? null;
  const roots = dreams.roots;
  const rootMark = (stage, text) => roots?.id === id ? { roots: { ...roots, stage: stage ?? roots.stage,
    ...(stage === 'returned' ? { returnedAge: age } : {}), milestones: [...roots.milestones, { age, text }].slice(-10) } } : {};
  const update = (changes, entryChanges = {}) => ({ dreams: { ...dreams, ...changes, entries: { ...dreams.entries, ...entryChanges } } });
  const isActive = dreams.active === id && entry?.status === 'active';
  const offers = { ...dreams.offers, [id]: (dreams.offers[id] ?? 0) + 1 };
  switch (descriptor.action) {
    case 'accept': {
      if (entry) return null;
      const paused = dreams.active ? { [dreams.active]: { ...dreams.entries[dreams.active], status: 'paused', pausedAtAge: age, delayed: true } } : {};
      const fromRoot = descriptor.fromRoot === true && roots?.id === id;
      return update({ active: id, offers, ...(fromRoot ? rootMark('returned', `trở lại với ước mơ thời nhỏ.`) : {}) },
        { ...paused, [id]: { ...blankEntry(), startedAtAge: age, lastStepAge: age, fromRoot,
          companion: COMPANIONS.has(descriptor.companion) ? descriptor.companion : 'solo',
          companionName: descriptor.companionName ?? null, place: descriptor.place ?? null, spent: cost } });
    }
    case 'later':
      if (entry) return null;
      return update({ later: { ...dreams.later, [id]: age + DREAM_LATER_YEARS }, offers });
    case 'decline':
      if (entry) return null;
      return update({ offers, ...rootMark(null, 'chọn để ước mơ thời nhỏ ở lại trong ký ức.') },
        { [id]: { ...blankEntry(), status: 'declined', step: 0, lastStepAge: age } });
    case 'prepare':
      if (!isActive || entry.step !== 1 || !DREAMS[id].scales[descriptor.scale]) return null;
      return update({}, { [id]: { ...entry, step: 2, scale: descriptor.scale, spent: entry.spent + cost, lastStepAge: age,
        deadline: id === 'homecoming' ? age + HOMECOMING_NOTICE_YEARS : entry.deadline } });
    case 'wait':
      if (!isActive || entry.step !== 1) return null;
      return update({}, { [id]: { ...entry, lastStepAge: age, delayed: true } });
    case 'twist':
      if (!isActive || entry.step !== 2 || entry.twistSeen) return null;
      return update({}, { [id]: { ...entry, twistSeen: true, lastStepAge: age, spent: entry.spent + cost,
        ...(descriptor.scale && DREAMS[id].scales[descriptor.scale] ? { scale: descriptor.scale } : {}),
        ...(descriptor.companion ? { companion: descriptor.companion, companionName: descriptor.companion === 'solo' ? entry.companionName : descriptor.companionName ?? null } : {}),
        ...(descriptor.withName ? { withName: descriptor.withName } : {}),
        ...(descriptor.venue ? { venue: descriptor.venue } : {}),
        ...(descriptor.helper ? { helper: descriptor.helper } : {}),
        ...(descriptor.host ? { host: true } : {}),
        ...(descriptor.seekTeacher ? { seekTeacher: true } : {}),
        ...(descriptor.rebuilt ? { rebuilt: true } : {}),
        ...(descriptor.delay ? { readyAge: age + 1 + descriptor.delay } : {}) } });
    case 'interplay':
      if (!isActive || entry.step !== 2 || entry.interplaySeen) return null;
      return update({}, { [id]: { ...entry, interplaySeen: true, lastStepAge: age, spent: entry.spent + cost,
        ...(descriptor.helper ? { helper: descriptor.helper } : {}),
        ...(descriptor.delay ? { readyAge: age + 1 + descriptor.delay } : {}) } });
    case 'journey': {
      if (!isActive || entry.step !== 2) return null;
      const finished = { ...entry, step: 3, status: 'done', lastStepAge: age, finishedAtAge: age, spent: entry.spent + cost,
        outcome: descriptor.outcome ?? null };
      finished.summary = describeFinishedDream(id, finished) +
        (entry.forParent && dreams.parentWish?.id === id ? ` Tiếp nối ước nguyện của ${dreams.parentWish.parentRole} ${dreams.parentWish.parentName}.` : '');
      return update({ active: null, ...(entry.fromRoot ? rootMark('done', `${descriptor.outcome}.`) : {}),
        ...(entry.forParent && dreams.parentWish?.id === id ? { parentWish: { ...dreams.parentWish, status: 'done' } } : {}) }, { [id]: finished });
    }
    case 'echo':
      if (entry?.status !== 'done' || entry.echoSeen) return null;
      return update({}, { [id]: { ...entry, echoSeen: true } });
    default:
      return null;
  }
}

// Tạm gác hoặc tiếp tục từ bảng Ước mơ. Tiếp tục một ước mơ khác nghĩa là đổi mục tiêu:
// ước mơ đang theo đuổi chuyển sang tạm gác, tiền đã chi giữ nguyên, không hoàn lại.
export function setDreamPaused(player, id, paused, age = player.age) {
  const dreams = normalizeDreams(player.dreams);
  const entry = dreams.entries[id];
  if (!entry) return null;
  const entries = { ...dreams.entries };
  if (paused) {
    if (entry.status !== 'active') return null;
    entries[id] = { ...entry, status: 'paused', pausedAtAge: age, delayed: true };
    return { ...dreams, active: null, entries };
  }
  if (entry.status !== 'paused') return null;
  if (dreams.active) entries[dreams.active] = { ...entries[dreams.active], status: 'paused', pausedAtAge: age, delayed: true };
  // Tiếp tục từ năm sau, để mỗi năm có nhiều nhất một bước tiến.
  entries[id] = { ...entry, status: 'active', pausedAtAge: null, lastStepAge: Math.max(entry.lastStepAge ?? age, age) };
  return { ...dreams, active: id, entries };
}

export const STATUS_LABELS = { active: 'Đang theo đuổi', paused: 'Đang tạm gác', done: 'Đã hoàn thành', declined: 'Đã bỏ qua' };

function describeFinishedDream(id, entry) {
  const scale = entry.scale ? DREAMS[id].scales[entry.scale].label.toLowerCase() : '';
  const who = id === 'trip' || entry.companion === 'child' ? ` ${companionPhrase(entry)}` : '';
  return `${DREAMS[id].name}${who}: ${scale}${entry.outcome ? `, ${entry.outcome}` : ''}.`;
}

export function getDreamNextStep(id, entry) {
  if (entry.status === 'done' || entry.status === 'declined') return '';
  if (entry.status === 'paused') return 'Bấm Tiếp tục khi muốn theo đuổi lại.';
  if (entry.step === 1) return 'Tiếp theo: chọn cách thực hiện, trong những năm tới.';
  const warning = id === 'homecoming' && entry.deadline != null && !entry.rebuilt
    ? ` Dãy lớp cũ dự kiến bị phá sau tuổi ${entry.deadline}.` : '';
  return `Tiếp theo: ${id === 'trip' ? 'lên đường' : id === 'music' ? 'buổi đàn' : 'về thăm'}.${warning}`;
}

// Dữ liệu ngắn gọn cho bảng Ước mơ và tổng kết cuối đời.
export function describeDreams(player) {
  const dreams = normalizeDreams(player?.dreams);
  return DREAM_IDS.filter(id => dreams.entries[id]).map(id => {
    const entry = dreams.entries[id];
    return {
      id, name: DREAMS[id].name, icon: DREAMS[id].icon, status: entry.status, statusLabel: STATUS_LABELS[entry.status],
      progress: entry.status === 'declined' ? 0 : entry.step, total: DREAM_STEP_COUNT,
      scale: entry.scale ? DREAMS[id].scales[entry.scale].label : '', spent: entry.spent,
      nextStep: getDreamNextStep(id, entry), summary: entry.summary ?? '',
      startedAtAge: entry.startedAtAge, finishedAtAge: entry.finishedAtAge, active: dreams.active === id,
    };
  });
}

// Ước mơ từ tuổi nhỏ trong bảng Ước mơ: hành trình, trạng thái và nút đổi ý trước 55 tuổi.
export function describeDreamRoot(player) {
  const dreams = normalizeDreams(player?.dreams);
  const root = dreams.roots;
  if (!root) return null;
  const age = player.age ?? 0;
  const open = age < DREAM_MIN_AGE && !['returned', 'done'].includes(root.stage);
  return { id: root.id, name: ROOT_NAMES[root.id], icon: DREAMS[root.id].icon, status: root.status, stage: root.stage,
    milestones: root.milestones, journey: describeRootJourney(root),
    toggle: open ? (root.status === 'growing' ? 'paused' : 'growing') : null,
    toggleLabel: !open ? '' : root.status === 'growing' ? '⏸️ Tạm gác' : root.status === 'dropped' ? '🌱 Nhặt lại' : '▶️ Giữ tiếp' };
}
export function setDreamRootStatus(player, status, age = player.age) {
  return setRootStatus(normalizeDreams(player.dreams), status, age);
}

export function describeDreamEnding(player) {
  const root = normalizeDreams(player?.dreams).roots;
  return [...(root ? [describeRootJourney(root)] : []), ...describeDreams(player).filter(dream => dream.status !== 'declined').map(dream => dream.status === 'done'
    ? `${dream.icon} ${dream.summary} Hoàn thành năm ${dream.finishedAtAge} tuổi.`
    : `${dream.icon} ${dream.name}: dừng ở bước ${dream.progress}/${dream.total}, ${dream.statusLabel.toLowerCase()}${dream.spent ? `, đã chi ${Math.round(dream.spent / 1_000_000)} triệu` : ''}.`)];
}
