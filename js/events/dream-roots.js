import { lifeRandom } from '../core/life-seed.js';

// “Ước mơ hình thành từ tuổi nhỏ”: một ước mơ được gieo năm 6–14 tuổi, thử sức năm 17–23,
// gặp ngã rẽ năm 26–40, giữ lửa hoặc được gợi lại năm 41–54, rồi trở lại từ 55 tuổi qua
// hệ thống ước mơ tuổi già (dreams.js). Trạng thái nằm ở player.dreams.roots.
export const ROOT_IDS = ['music', 'trip', 'homecoming'];
export const ROOT_NAMES = { music: 'Âm nhạc', trip: 'Chuyến đi đã hẹn', homecoming: 'Trở về nơi cũ' };
export const ROOT_ICONS = { music: '🎸', trip: '🧳', homecoming: '🏡' };
const ART = { music: '1F3B8', trip: '1F9F3', homecoming: '1F3E1' };
export const ROOT_WINDOWS = { seed: [6, 14], try: [17, 23], cross: [26, 40], mid: [41, 54] };
export const ROOT_GAP = 2;
export const ROOT_MAX_SEED_OFFERS = 2;
export const ROOT_WEIGHT = 1.5;
const MILESTONE_LIMIT = 10;
const STATUSES = new Set(['growing', 'paused', 'dropped']);
const STAGES = new Set(['seed', 'tried', 'crossed', 'mid', 'returned', 'done']);
const REASONS = { work: 'vì công việc', family: 'để lo cho gia đình', money: 'vì tiền bạc chật vật', study: 'để lo việc học', other: 'vì cuộc sống bận rộn' };

const integer = value => Number.isInteger(value) ? value : null;
const shortText = value => typeof value === 'string' && value.trim() ? value.slice(0, 160) : null;
const givenName = fullName => String(fullName ?? '').trim().split(/\s+/u).at(-1) ?? '';
const capitalize = text => text ? `${text[0].toLocaleUpperCase('vi-VN')}${text.slice(1)}` : text;
const relative = (player, id) => (player.relatives ?? []).find(person => person.id === id);

export function normalizeRoots(raw) {
  if (!raw || typeof raw !== 'object' || !ROOT_IDS.includes(raw.id) || !STATUSES.has(raw.status)) return null;
  return {
    id: raw.id, status: raw.status, stage: STAGES.has(raw.stage) ? raw.stage : 'seed',
    interest: raw.interest === 'quiet' ? 'quiet' : 'eager',
    seedAge: integer(raw.seedAge), sourceKind: ['parent', 'school', 'heir', 'recall'].includes(raw.sourceKind) ? raw.sourceKind : 'school',
    sourceId: ['father', 'mother'].includes(raw.sourceId) ? raw.sourceId : null, sourceName: shortText(raw.sourceName),
    tryAge: integer(raw.tryAge), tryWay: shortText(raw.tryWay), tryWith: shortText(raw.tryWith),
    keptAge: integer(raw.keptAge), pauseAge: integer(raw.pauseAge), pauseReason: REASONS[raw.pauseReason] ? raw.pauseReason : null,
    dropAge: integer(raw.dropAge), midAge: integer(raw.midAge), midWay: shortText(raw.midWay),
    returnedAge: integer(raw.returnedAge), lastStepAge: integer(raw.lastStepAge),
    milestones: (Array.isArray(raw.milestones) ? raw.milestones : [])
      .filter(item => item && Number.isInteger(item.age) && typeof item.text === 'string')
      .map(item => ({ age: item.age, text: item.text.slice(0, 200) })).slice(-MILESTONE_LIMIT),
  };
}

export function normalizeSeedOffers(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  return { offers: Number.isInteger(source.offers) ? source.offers : 0,
    passed: (Array.isArray(source.passed) ? source.passed : []).filter(id => ROOT_IDS.includes(id)),
    lastAge: integer(source.lastAge) };
}

// Người gợi cảm hứng: một người thân thật trong cuộc đời này, hoặc thầy cô, lớp học khi không có.
function chooseSource(player, id) {
  const alive = ['mother', 'father'].map(key => relative(player, key)).filter(person => person?.alive === true && person.name);
  if (!alive.length) return { sourceKind: 'school', sourceId: null, sourceName: null };
  const person = alive[Math.floor(lifeRandom(player, `root-source|${id}`)() * alive.length)];
  return { sourceKind: 'parent', sourceId: person.id, sourceName: givenName(person.name) };
}
// “mẹ Hà”, “bố Dân” theo dữ liệu người thân thật.
export function sourceLabel(root, player) {
  if (root.sourceKind !== 'parent' || !root.sourceId) return null;
  const person = relative(player, root.sourceId);
  const role = root.sourceId === 'mother' ? 'mẹ' : 'bố';
  return `${role} ${root.sourceName ?? givenName(person?.name)}`.trim();
}
export const sourceAlive = (root, player) => root.sourceKind === 'parent' && relative(player, root.sourceId)?.alive === true;
const roleOf = root => root.sourceId === 'mother' ? 'mẹ' : 'bố';

function pauseReasonFor(player, age) {
  if ((player.money ?? 0) < 0) return 'money';
  if ((player.children ?? []).some(child => child.alive !== false && child.initialAge + Math.max(0, age - child.joinedAtAge) < 12)) return 'family';
  if (player.employmentStatus === 'employed') return 'work';
  return 'other';
}

function story(id, step, age, fields) {
  return {
    id: `dream-${id}-root-${step}`, age, repeatable: true, kind: 'dream', dreamId: id, dreamStep: `root-${step}`,
    icon: ART[id], weight: ROOT_WEIGHT, ...fields,
    choices: fields.choices.filter(Boolean).map(choice => ({ ...choice, dream: { id, ...choice.dream } })),
  };
}

// ——— Câu nhắc lại chuyện cũ, dùng ở mọi giai đoạn sau ———
// Người con tiếp quản: mầm ghi lúc bố/mẹ nuôi (heir) hoặc chọn khi hồi tưởng (recall, không nêu sự kiện cụ thể).
function heirSeedSentence(root) {
  if (root.sourceKind === 'recall' || root.seedAge == null) return {
    music: 'Từ nhỏ tôi đã thích tiếng đàn.', trip: 'Từ nhỏ tôi đã mơ đi thật xa.', homecoming: 'Từ nhỏ tôi đã nhớ những mùa hè ở quê.',
  }[root.id];
  const who = root.sourceName ? `${root.sourceId === 'mother' ? 'mẹ' : 'bố'} ${root.sourceName}` : 'bố mẹ';
  const at = `Năm ${root.seedAge} tuổi`;
  const eager = root.interest === 'eager';
  if (root.id === 'music') return eager ? `${at}, tôi xin ${who} cho đi học đàn.` : `${at}, tôi mê tiếng đàn mà chưa dám xin học.`;
  if (root.id === 'trip') return eager ? `${at}, tôi trải bản đồ ra sàn, đánh dấu những nơi muốn tới.` : `${at}, tôi hay ngồi xem sách ảnh về những miền đất xa.`;
  return eager ? `${at}, tôi chỉ mong tới hè để được về quê.` : `${at}, tôi thích nghe ${who} kể chuyện quê.`;
}

export function seedSentence(root, player) {
  if (root.sourceKind === 'heir' || root.sourceKind === 'recall') return heirSeedSentence(root);
  const who = sourceLabel(root, player);
  const at = `Năm ${root.seedAge ?? 10} tuổi`;
  if (root.id === 'music') return who
    ? (root.interest === 'eager' ? `${at}, ${who} dạy tôi đoạn đàn đầu tiên.` : `${at}, tôi ngồi nghe ${who} đàn trong đêm mất điện.`)
    : `${at}, cô giáo âm nhạc giữ tôi lại lớp tập đàn.`;
  if (root.id === 'trip') return who ? `${at}, ${who} đưa tôi đi biển lần đầu.` : `${at}, chuyến dã ngoại tới thác nước làm tôi mơ đi xa.`;
  return who ? `${at}, ${who} đưa tôi về quê một mùa hè.` : `${at}, mùa hè sinh hoạt ở làng ven sông làm tôi nhớ mãi.`;
}

const OBJECT = { music: 'cây đàn', trip: 'những chuyến đi', homecoming: 'chuyện về quê' };
export function turnSentence(root) {
  if (root.dropAge != null) return `Năm ${root.dropAge} tuổi, tôi đã thôi hẳn ${OBJECT[root.id]}.`;
  if (root.status === 'paused' && root.pauseAge != null) return `Năm ${root.pauseAge} tuổi, tôi gác ${OBJECT[root.id]} lại ${REASONS[root.pauseReason ?? 'other']}.`;
  if (root.midAge != null && root.midWay) return `Năm ${root.midAge} tuổi, tôi đã ${root.midWay}.`;
  if (root.keptAge != null) return `Những năm đi làm, tôi vẫn giữ ${OBJECT[root.id]} ở quy mô nhỏ.`;
  if (root.tryAge != null && root.tryWay) return `Năm ${root.tryAge} tuổi, tôi từng ${root.tryWay}.`;
  return '';
}

// Phản ứng của người thân hoặc bạn bè trong lần thử sức đầu tiên, để thành kỷ niệm.
function reaction(root, player) {
  const who = sourceLabel(root, player);
  const person = root.sourceId ? relative(player, root.sourceId) : null;
  if (who && person?.alive) return (person.bond ?? 70) >= 60
    ? `${capitalize(who)} ngồi hàng cuối, vỗ tay to nhất.` : `${capitalize(who)} không nói gì nhiều, nhưng tối đó hỏi tôi đã làm những gì.`;
  return 'Đám bạn cùng lớp hò reo gọi tên tôi.';
}

// ——— 6–14 tuổi: gieo mầm ———
function seedStory(id, player, age) {
  const source = chooseSource(player, id);
  const who = source.sourceKind === 'parent' ? `${source.sourceId === 'mother' ? 'mẹ' : 'bố'} ${source.sourceName}` : null;
  const Who = capitalize(who);
  const role = source.sourceId === 'mother' ? 'mẹ' : 'bố';
  const seed = (interest, extra = {}) => ({ action: 'root-seed', interest, ...source, ...extra });
  if (id === 'music') {
    return story(id, 'seed', age, who ? {
      title: 'Tiếng đàn tối mất điện',
      text: `Tối mất điện, ${who} lấy cây đàn ghi-ta cũ trên tường xuống, đàn một bài hát thời trẻ. Tôi ngồi sát bên, nhìn những ngón tay chuyển hợp âm. Đàn xong, ${role} đưa đàn sang, hỏi tôi có muốn thử không.`,
      choices: [
        { label: 'Ôm đàn, xin học ngay', effects: { happiness: 2 }, dream: seed('eager'),
          text: `${Who} đặt ngón tay tôi lên từng dây, dạy một đoạn ngắn. Tôi đánh sai mãi, đầu ngón đau rát, nhưng tối đó không chịu đi ngủ cho tới khi đánh được trọn đoạn.` },
        { label: 'Chỉ ngồi nghe thêm', effects: { happiness: 1 }, dream: seed('quiet'),
          text: `Tôi lắc đầu, chỉ xin ${role} đàn thêm một bài. Tiếng đàn hòa với tiếng dế ngoài sân. Bài hát ấy tôi nhớ mãi, dù không biết tên.` },
        { label: 'Chạy ra sân chơi', effects: {}, dream: { action: 'root-pass' },
          text: 'Tôi chạy ra sân chơi với lũ trẻ hàng xóm. Tiếng đàn vẫn vọng ra theo, nhưng tôi mải đuổi bắt nên không nghe kỹ.' },
      ],
    } : {
      title: 'Giờ âm nhạc',
      text: 'Giờ âm nhạc, cô giáo mang cây đàn phím cũ vào lớp, cho mỗi đứa bấm thử vài nốt. Đến lượt tôi, cô khen tôi bắt nhịp nhanh. Tan học, cô hỏi tôi có muốn ở lại tập thêm không.',
      choices: [
        { label: 'Ở lại tập thêm', effects: { happiness: 2 }, dream: seed('eager'),
          text: 'Tôi ở lại tới khi trường vắng hẳn. Cô chép cho tôi một bản nhạc ngắn trên giấy kẻ ô, dặn về nhà tập bằng cách gõ ngón tay xuống bàn.' },
        { label: 'Hẹn cô dịp khác', effects: { happiness: 1 }, dream: seed('quiet'),
          text: 'Tôi ngại, hẹn cô dịp khác. Nhưng về nhà, tôi vẫn ngồi gõ ngón tay lên mép bàn, nhẩm lại mấy nốt vừa bấm.' },
        { label: 'Về với đám bạn', effects: {}, dream: { action: 'root-pass' },
          text: 'Tôi chạy về với đám bạn đang đợi ở cổng trường. Cô cười, cất đàn vào tủ.' },
      ],
    });
  }
  if (id === 'trip') {
    return story(id, 'seed', age, who ? {
      title: 'Lần đầu thấy biển',
      text: `Hè năm ấy, ${who} cho tôi theo chuyến xe ra biển. Lần đầu thấy biển, tôi đứng ngây ra nhìn tới chỗ trời và nước dính vào nhau. Trên đường về, ${role} hỏi tôi còn muốn đi những đâu nữa.`,
      choices: [
        { label: 'Kể một loạt nơi muốn tới', effects: { happiness: 2 }, dream: seed('eager'),
          text: `Tôi kể không ngừng: núi tuyết, sa mạc, những thành phố trong sách. ${Who} cười, nói mỗi năm đi một nơi thì cũng hết đời. Tôi ghi tên từng nơi vào trang cuối vở.` },
        { label: 'Xin chụp một tấm ảnh', effects: { happiness: 1 }, dream: seed('quiet'),
          text: `${Who} chụp cho tôi một tấm ảnh đứng trước biển, tóc rối, mắt nheo vì nắng. Tấm ảnh ấy tôi kẹp vào cuốn sách giáo khoa.` },
        { label: 'Chỉ muốn về nhà ngủ', effects: {}, dream: { action: 'root-pass' },
          text: 'Tôi ngủ gà gật suốt đường về, tay vẫn nắm vỏ ốc nhặt trên bãi.' },
      ],
    } : {
      title: 'Chuyến dã ngoại xa',
      text: 'Lớp tổ chức chuyến dã ngoại xa nhất từ trước tới giờ, đi xe cả buổi sáng mới tới một khu rừng có thác. Đứng dưới chân thác, tôi nghe cô giáo kể còn những nơi xa hơn nữa, và tôi cứ nghĩ mãi.',
      choices: [
        { label: 'Xin cô tấm bản đồ cũ', effects: { happiness: 2 }, dream: seed('eager'),
          text: 'Cô cho tôi tấm bản đồ cũ của lớp, đã rách một góc. Tôi dán nó lên tường, lấy bút đỏ khoanh tròn khu rừng có thác, rồi khoanh thêm vài chỗ khác.' },
        { label: 'Viết nhật ký chuyến đi', effects: { intelligence: 1 }, dream: seed('quiet'),
          text: 'Tối đó tôi viết kín ba trang nhật ký về tiếng thác. Cuốn sổ ấy tôi giữ rất lâu.' },
        { label: 'Kể xong rồi quên', effects: {}, dream: { action: 'root-pass' },
          text: 'Tôi kể cho cả nhà nghe về thác nước, rồi hôm sau đã mải chuyện khác.' },
      ],
    });
  }
  return story(id, 'seed', age, who ? {
    title: 'Mùa hè ở quê',
    text: `Hè năm ấy, ${who} đưa tôi về quê ở một tháng. Tôi theo lũ trẻ trong xóm ra đồng, tắm sông, xem hội làng. Ngày về, mấy đứa bạn mới chạy theo xe tới tận đầu đường, và tôi ngoái lại nhìn mãi.`,
    choices: [
      { label: 'Hứa hè sau sẽ về', effects: { happiness: 2 }, dream: seed('eager'),
        text: `Tôi hứa với lũ bạn hè sau sẽ về. Cả năm học, tôi gấp thuyền giấy đếm ngày, hỏi ${role} mãi chừng nào về quê.` },
      { label: 'Xin mang về con diều', effects: { happiness: 1 }, dream: seed('quiet'),
        text: 'Đứa bạn ở quê cho tôi con diều giấy tự làm. Tôi treo nó trên tường phòng, mỗi lần nhìn lại nhớ mùi rơm.' },
      { label: 'Mừng vì được về phố', effects: {}, dream: { action: 'root-pass' },
        text: 'Về tới nhà, tôi mở ti vi xem hoạt hình, quên ngay cái nắng ở quê.' },
    ],
  } : {
    title: 'Mùa hè ở làng ven sông',
    text: 'Trường tổ chức sinh hoạt hè ở một làng ven sông. Tôi ở nhà một bác nông dân, sáng theo bác ra đồng, chiều tắm sông với lũ trẻ trong làng. Ngày về, bác dúi cho tôi túi ổi, và tôi chưa muốn đi.',
    choices: [
      { label: 'Hứa sẽ quay lại', effects: { happiness: 2 }, dream: seed('eager'),
        text: 'Tôi hứa với bác sẽ quay lại. Cả năm, tôi viết thư cho mấy đứa bạn ở làng, thư đi thư về mất cả tháng.' },
      { label: 'Giữ lại tấm ảnh làng', effects: { happiness: 1 }, dream: seed('quiet'),
        text: 'Tôi xin cô giáo tấm ảnh chụp cả nhóm trước bến sông. Tấm ảnh ấy tôi dán vào trang đầu cuốn vở.' },
      { label: 'Mừng vì được về nhà', effects: {}, dream: { action: 'root-pass' },
        text: 'Về tới nhà, tôi tắm nước nóng, ngủ một giấc dài, quên chuyện làng ven sông.' },
    ],
  });
}

// ——— 17–23 tuổi: thử sức, có cách cho nhà ít tiền ———
function tryStory(root, player, age) {
  const id = root.id;
  const recall = seedSentence(root, player);
  const react = reaction(root, player);
  const who = sourceLabel(root, player);
  const remote = who && sourceAlive(root, player) ? ` ${capitalize(who)} nghe tôi kể, nói lần sau nhớ báo trước.` : '';
  if (id === 'music') {
    return story(id, 'try', age, {
      title: 'Lần thử sức đầu tiên',
      text: `${recall} Giờ câu lạc bộ âm nhạc của trường tìm người đệm đàn cho buổi văn nghệ, còn trung tâm gần nhà mở lớp đàn cuối tuần, học phí không rẻ. Việc học cũng đang nặng. Tôi phải chọn cách bắt đầu.`,
      choices: [
        { label: 'Vào câu lạc bộ, tập miễn phí', effects: { happiness: 2 }, dream: { action: 'root-try', way: 'đệm đàn cho câu lạc bộ trường' },
          text: `Tôi tập cùng câu lạc bộ mỗi chiều, đầu ngón chai cứng. Hôm văn nghệ, tôi đệm đàn trọn ba bài. ${react}` },
        { label: 'Đăng ký lớp đàn cuối tuần', money: -4000000, effects: { intelligence: 1, happiness: 1 }, dream: { action: 'root-try', way: 'học lớp đàn cuối tuần' },
          text: 'Thầy dạy kỹ từng thế tay, tôi tiến bộ nhanh. Học phí đóng từng tháng, có tháng phải bớt tiền ăn sáng. Cuối khóa, thầy cho tôi đàn một bài trước cả lớp.' },
        { label: 'Gác lại để lo việc học', effects: { intelligence: 1 }, dream: { action: 'root-pause', reason: 'study' },
          text: 'Tôi cất đàn lên nóc tủ, dồn sức cho việc học. Thỉnh thoảng nghe ai đàn ngoài đường, tôi vẫn dừng lại nghe hết bài.' },
      ],
    });
  }
  if (id === 'trip') {
    return story(id, 'try', age, {
      title: 'Chuyến đi không có người lớn',
      text: `${recall} Giờ Bình, bạn cùng lớp, rủ một chuyến xa đầu tiên không có người lớn: xe khách đêm, nhà nghỉ rẻ. Một đoàn tình nguyện lên vùng cao cũng đang tuyển người, lo chỗ ở nhưng phải làm cả ngày.`,
      choices: [
        { label: 'Đi cùng Bình, tự lo tiền', money: -2000000, effects: { happiness: 2 }, dream: { action: 'root-try', way: 'đi xe khách đêm cùng Bình', with: 'Bình' },
          text: `Hai đứa ngồi xe khách đêm, chia nhau gói xôi. Nhà nghỉ ẩm, mưa suốt hai ngày, nhưng đứng trên đèo nhìn xuống, tôi biết mình sẽ còn đi nữa.${remote}` },
        { label: 'Theo đoàn tình nguyện', effects: { intelligence: 1, health: -1 }, dream: { action: 'root-try', way: 'theo đoàn tình nguyện lên vùng cao' },
          text: `Tôi theo đoàn lên vùng cao, ban ngày sửa lớp học, tối ngủ nhà sàn. Chuyến đi không để ngắm cảnh, nhưng tôi thấy được nơi mình chưa từng nghĩ tới.${remote}` },
        { label: 'Để dành tiền, hẹn dịp khác', effects: {}, dream: { action: 'root-pause', reason: 'money' },
          text: 'Tôi nói với Bình để dịp khác, rồi bỏ từng tờ tiền lẻ vào ống tiết kiệm. Bình đi một mình, gửi về cho tôi tấm ảnh chụp trên đèo.' },
      ],
    });
  }
  return story(id, 'try', age, {
    title: 'Mùa hè làm đường',
    text: `${recall} Giờ ở quê đang làm lại con đường vào làng, đoàn thanh niên kêu gọi người trẻ về góp công dịp hè. Cùng lúc, tôi được mời làm thêm suốt mùa hè, có tiền đóng học.`,
    choices: [
      { label: 'Về góp công làm đường', effects: { happiness: 2, health: -1 }, dream: { action: 'root-try', way: 'về quê góp công làm đường' },
        text: `Tôi về làng, cùng mọi người trộn bê tông, khiêng đá dưới nắng. Tối nằm võng nghe ếch kêu.${remote || ' Lũ trẻ trong làng theo tôi suốt cả mùa hè, gọi tôi là người thành phố.'}` },
      { label: 'Gửi tiền góp, ở lại làm', money: -1000000, effects: { intelligence: 1 }, dream: { action: 'root-try', way: 'gửi tiền góp làm đường quê' },
        text: 'Tôi ở lại làm thêm, gửi về một khoản góp tiền mua xi măng. Đoàn thanh niên gửi lại tấm ảnh con đường mới, có tên tôi trong danh sách ủng hộ.' },
      { label: 'Ở lại làm thêm', effects: {}, dream: { action: 'root-pause', reason: 'work' },
        text: 'Tôi ở lại thành phố làm thêm cả mùa hè, có tiền đóng học. Con đường quê làm xong lúc nào, tôi chỉ biết qua lời người quen.' },
    ],
  });
}

// ——— 26–40 tuổi: ngã rẽ giữa công việc, tiền bạc, gia đình ———
function crossStory(root, player, age) {
  const id = root.id;
  const reason = pauseReasonFor(player, age);
  const kids = reason === 'family' ? ', con nhỏ' : '';
  const back = root.status === 'paused' && root.pauseAge != null ? `Từ năm ${root.pauseAge} tuổi tôi đã gác lại.` : root.tryAge == null ? 'Tôi chưa từng có dịp thử sức thật sự.' : '';
  const intro = `${seedSentence(root, player)} ${back}`.trim();
  const lines = {
    music: { title: 'Cây đàn trên nóc tủ', scene: 'Cây đàn nằm trên nóc tủ, phủ một lớp bụi mỏng.',
      keep: ['Giữ, mỗi tuần tập một buổi', -1500000, 'Tôi thay bộ dây mới, mua cuốn sách nhạc. Tối thứ Bảy nào tôi cũng tập một tiếng khi cả nhà đã ngủ. Không tiến bộ nhanh, nhưng tay không quên đàn.', 'tập đàn mỗi tối thứ Bảy'],
      pause: 'Tôi bọc đàn trong túi vải, cất lại lên nóc tủ. Mỗi lần lau nhà, tôi lau luôn lớp bụi trên túi đàn.',
      drop: 'Tôi tặng cây đàn cho một đứa trẻ trong xóm đang tập. Nhìn nó ôm đàn ra về, tôi thấy nhẹ lòng, không tiếc như mình tưởng.' },
    trip: { title: 'Tấm bản đồ trên tường', scene: 'Tấm bản đồ đánh dấu những nơi muốn tới vẫn dán ở góc phòng.',
      keep: ['Mỗi năm một chuyến gần', -5000000, 'Mỗi năm tôi để dành cho một chuyến ngắn, có khi chỉ hai ngày. Tấm bản đồ trên tường có thêm vài chấm đỏ.', 'đi một chuyến gần mỗi năm'],
      pause: 'Tôi cuộn tấm bản đồ lại, cất vào ngăn kéo. Những chuyến đi để dành cho lúc khác.',
      drop: 'Tôi gỡ tấm bản đồ xuống, thay bằng bức tranh phong cảnh mua ở chợ. Đi xa không còn là điều tôi mong.' },
    homecoming: { title: 'Những lần hứa về quê', scene: 'Người quen ở quê vẫn nhắn hỏi chừng nào tôi về.',
      keep: ['Giữ lệ về quê dịp Tết', -3000000, 'Tết nào tôi cũng về quê vài ngày, mang quà cho mấy nhà quen. Con đường làng giờ đã trải nhựa, lũ trẻ ngày xưa đã thành cha mẹ.', 'về quê mỗi dịp Tết'],
      pause: 'Tôi nhắn cho người quen rằng năm nay bận, hẹn năm sau. Tin nhắn ấy tôi gửi đi mấy năm liền.',
      drop: 'Tôi tự nhủ quê là chỗ để nhớ, không nhất thiết phải về. Cuộc sống ở thành phố đã đủ đầy những việc khác.' },
  }[id];
  return story(id, 'cross', age, {
    title: lines.title,
    text: `${intro} Giờ công việc, tiền nhà${kids} chiếm gần hết thời gian. ${lines.scene} Tôi phải quyết định giữ nó thế nào.`,
    choices: [
      { label: lines.keep[0], money: lines.keep[1], effects: { happiness: 2, health: -1 }, dream: { action: 'root-cross', choice: 'keep', way: lines.keep[3] }, text: lines.keep[2] },
      { label: 'Tạm gác, để sau', effects: { intelligence: 1 }, dream: { action: 'root-cross', choice: 'pause', reason }, text: lines.pause },
      { label: 'Thôi hẳn, không tiếc', effects: { health: 1 }, dream: { action: 'root-cross', choice: 'drop' }, text: lines.drop },
    ],
  });
}

// ——— 41–54 tuổi: giữ lửa nếu còn theo, hoặc một dịp gợi lại nếu đang gác ———
function midStory(root, player, age) {
  const id = root.id;
  if (root.status === 'growing') {
    if (id === 'music') return story(id, 'mid', age, {
      title: 'Đàn trong đám cưới',
      text: 'Người quen nhờ tôi đàn một bài trong đám cưới con gái họ, vì nghe nói tôi vẫn tập đều. Đứng trước cả trăm khách thì run tay, mà từ chối thì ngại. Tôi phải trả lời họ.',
      choices: [
        { label: 'Nhận lời, đàn bài quen', effects: { happiness: 3 }, dream: { action: 'root-mid', way: 'đàn một bài trong đám cưới người quen' },
          text: 'Tôi đàn bài quen nhất, tay run ở mấy nốt đầu rồi vững dần. Cô dâu chú rể nhảy điệu đầu tiên theo tiếng đàn của tôi.' },
        { label: 'Rủ người khác hát cùng', effects: { happiness: 2, intelligence: 1 }, dream: { action: 'root-mid', way: 'đệm đàn cho một người hát trong đám cưới' },
          text: 'Tôi rủ một người bạn hát, mình chỉ đệm đàn. Hai người tập ba buổi tối. Hôm cưới, khách đứng dậy vỗ tay theo nhịp.' },
        { label: 'Từ chối, chỉ đàn ở nhà', effects: {}, dream: { action: 'root-mid', way: '' },
          text: 'Tôi từ chối khéo, gửi mừng một phong bì. Tối về, tôi vẫn ngồi đàn bài định đàn ở đám cưới, chỉ cho mình nghe.' },
      ],
    });
    if (id === 'trip') return story(id, 'mid', age, {
      title: 'Chuyến đi xa hơn một chút',
      text: 'Mấy năm đi những chuyến gần, tôi để dành được một khoản. Có tour mười ngày tới một nơi tôi đánh dấu trên bản đồ từ nhỏ. Đi thì phải xin nghỉ dài, không đi thì giữ tiền cho những năm sau.',
      choices: [
        { label: 'Đi tour mười ngày', money: -15000000, effects: { happiness: 3, health: -1 }, dream: { action: 'root-mid', way: 'đi một chuyến mười ngày tới nơi đánh dấu từ nhỏ' },
          text: 'Mười ngày đi xa nhất đời tới lúc ấy. Đứng ở nơi từng khoanh bút đỏ trên bản đồ, tôi gạch nó đi, rồi khoanh thêm hai chỗ mới.' },
        { label: 'Đi chuyến gần như mọi năm', money: -5000000, effects: { happiness: 1 }, dream: { action: 'root-mid', way: 'giữ lệ mỗi năm một chuyến gần' },
          text: 'Tôi đi chuyến gần như mọi năm, hai ngày ở một thị trấn nhỏ. Nơi xa để dành cho lúc khác.' },
        { label: 'Giữ tiền lại', effects: { intelligence: 1 }, dream: { action: 'root-mid', way: '' },
          text: 'Tôi giữ tiền lại. Tấm bản đồ vẫn trên tường, chấm đỏ chưa gạch.' },
      ],
    });
    return story(id, 'mid', age, {
      title: 'Quỹ khuyến học ở quê',
      text: 'Người quen ở quê lập quỹ khuyến học cho trẻ trong làng, biết tôi hay về nên gọi hỏi. Góp tiền thì dễ, về tận nơi trao học bổng thì phải xin nghỉ vài ngày. Tôi phải trả lời họ.',
      choices: [
        { label: 'Góp tiền và về trao quà', money: -5000000, effects: { happiness: 3 }, dream: { action: 'root-mid', way: 'về quê trao học bổng cho trẻ trong làng' },
          text: 'Tôi về trao học bổng ở sân đình, đọc tên từng đứa. Một đứa bé run run nhận phong bì, cúi đầu cảm ơn rất lâu.' },
        { label: 'Chỉ gửi tiền góp', money: -5000000, effects: { happiness: 1 }, dream: { action: 'root-mid', way: 'góp vào quỹ khuyến học ở quê' },
          text: 'Tôi gửi tiền góp qua người quen. Họ gửi lại danh sách học sinh nhận học bổng, kèm tấm ảnh chụp ở sân đình.' },
        { label: 'Hẹn năm sau', effects: {}, dream: { action: 'root-mid', way: '' },
          text: 'Tôi hẹn năm sau sẽ góp. Người quen nói không sao, quỹ còn đó.' },
      ],
    });
  }
  const reason = REASONS[root.pauseReason ?? 'other'];
  if (id === 'music') return story(id, 'mid', age, {
    title: 'Tiếng đàn ở chợ đêm',
    text: `Đi chợ đêm, tôi dừng trước một người đàn hát rong đang đàn đúng bài mình từng tập. Mấy năm nay tôi gác đàn ${reason}. Tôi đứng nghe hết bài, nghĩ tới cây đàn ở nhà.`,
    choices: [
      { label: 'Về nhà lấy đàn xuống', effects: { happiness: 2 }, dream: { action: 'root-mid', resume: true, way: 'lấy lại cây đàn sau mấy năm gác' },
        text: 'Về nhà, tôi lấy đàn xuống, lên dây lại. Ngón tay quên gần hết, nhưng đoạn nhạc đầu tiên thì vẫn nhớ.' },
      { label: 'Xin đàn thử một đoạn', effects: { happiness: 1 }, dream: { action: 'root-mid', way: 'đàn thử một đoạn ở chợ đêm' },
        text: 'Người hát rong đưa đàn cho tôi. Tôi đàn được nửa đoạn thì vấp, cả hai cùng cười. Tôi bỏ tiền vào hộp đàn rồi về.' },
      { label: 'Bỏ tiền vào hộp rồi về', effects: {}, dream: { action: 'root-mid', way: '' },
        text: 'Tôi bỏ tờ tiền vào hộp đàn, gật đầu chào rồi đi tiếp. Cây đàn ở nhà vẫn nằm yên chỗ cũ.' },
    ],
  });
  if (id === 'trip') return story(id, 'mid', age, {
    title: 'Vé máy bay giá rẻ',
    text: `Hãng bay quảng cáo vé rẻ tới một nơi tôi từng muốn đi từ nhỏ. Mấy năm nay tôi không đi đâu xa ${reason}. Tôi mở trang đặt vé, ngón tay dừng ở nút thanh toán.`,
    choices: [
      { label: 'Đặt vé đi thử', money: -6000000, effects: { happiness: 2 }, dream: { action: 'root-mid', resume: true, way: 'đi lại một chuyến xa sau mấy năm gác' },
        text: 'Tôi đặt vé, đi ba ngày một mình. Ngồi ở quán nhỏ bên đường, tôi nhớ lại cảm giác lần đầu thấy biển.' },
      { label: 'Gửi cho người quen xem', effects: { happiness: 1 }, dream: { action: 'root-mid', way: 'rủ người quen tính chuyện đi xa' },
        text: 'Tôi gửi đường dẫn cho một người quen. Hai người bàn tới khuya rồi hẹn năm sau, khi rảnh hơn.' },
      { label: 'Đóng trang, để khi khác', effects: {}, dream: { action: 'root-mid', way: '' },
        text: 'Tôi đóng trang đặt vé. Tấm bản đồ cũ vẫn nằm trong ngăn kéo.' },
    ],
  });
  return story(id, 'mid', age, {
    title: 'Tin nhắn từ quê',
    text: `Nhóm bạn ở quê gửi ảnh con đường làng đã trải nhựa, hỏi bao giờ tôi về. Mấy năm nay tôi chưa về được ${reason}. Tôi đọc tin nhắn mấy lần, chưa biết trả lời sao.`,
    choices: [
      { label: 'Hẹn Tết này sẽ về', effects: { happiness: 2 }, dream: { action: 'root-mid', resume: true, way: 'hẹn về quê sau mấy năm vắng' },
        text: 'Tết ấy tôi về, đi bộ trên con đường mới, nhận ra vài gương mặt cũ. Có người gọi đúng tên tôi từ bên kia đường.' },
      { label: 'Gửi ít quà về trước', money: -1000000, effects: { happiness: 1 }, dream: { action: 'root-mid', way: 'gửi quà về quê' },
        text: 'Tôi gửi về mấy hộp bánh cho nhà người quen. Họ gửi lại ảnh cả nhà quây quần, hỏi lần sau có về không.' },
      { label: 'Nói chưa sắp xếp được', effects: {}, dream: { action: 'root-mid', way: '' },
        text: 'Tôi trả lời là chưa sắp xếp được. Nhóm bạn gửi biểu tượng mặt cười, rồi nói sang chuyện khác.' },
    ],
  });
}

// Bước tuổi nhỏ và trung niên cho năm này, hoặc null. Cách nhau ít nhất ROOT_GAP năm.
export function getRootStory(player, age, dreams) {
  if (age < ROOT_WINDOWS.seed[0] || age > ROOT_WINDOWS.mid[1]) return null;
  const root = dreams.roots;
  if (!root) {
    const seed = dreams.seed;
    if (age > ROOT_WINDOWS.seed[1] || seed.offers >= ROOT_MAX_SEED_OFFERS || (seed.lastAge != null && age - seed.lastAge < ROOT_GAP)) return null;
    const open = ROOT_IDS.filter(id => !seed.passed.includes(id));
    if (!open.length) return null;
    return seedStory(open[Math.floor(lifeRandom(player, `root-seed|${age}`)() * open.length)], player, age);
  }
  if (root.status === 'dropped' || (root.lastStepAge != null && age - root.lastStepAge < ROOT_GAP)) return null;
  const within = ([from, to]) => age >= from && age <= to;
  if (root.stage === 'seed' && root.status === 'growing' && within(ROOT_WINDOWS.try)) return tryStory(root, player, age);
  if ((root.stage === 'seed' || root.stage === 'tried') && within(ROOT_WINDOWS.cross)) return crossStory(root, player, age);
  if (root.stage === 'crossed' && within(ROOT_WINDOWS.mid)) return midStory(root, player, age);
  return null;
}

const milestone = (root, age, text) => [...root.milestones, { age, text }].slice(-MILESTONE_LIMIT);

// Áp dụng lựa chọn của bước tuổi nhỏ/trung niên lên dreams; null nếu không còn khớp trạng thái.
export function applyRootChoice(dreams, descriptor, age, player, cost = 0) {
  const root = dreams.roots;
  const seed = dreams.seed;
  const id = descriptor.id;
  switch (descriptor.action) {
    case 'root-seed': {
      if (root || !ROOT_IDS.includes(id)) return null;
      const next = { id, status: 'growing', stage: 'seed', interest: descriptor.interest === 'quiet' ? 'quiet' : 'eager', seedAge: age,
        sourceKind: descriptor.sourceKind === 'parent' ? 'parent' : 'school', sourceId: descriptor.sourceId ?? null, sourceName: descriptor.sourceName ?? null,
        tryAge: null, tryWay: null, tryWith: null, keptAge: null, pauseAge: null, pauseReason: null, dropAge: null, midAge: null, midWay: null,
        returnedAge: null, lastStepAge: age, milestones: [] };
      next.milestones = [{ age, text: seedSentence(next, player).replace(/^Năm \d+ tuổi, /u, '') }];
      return { ...dreams, roots: next, seed: { ...seed, offers: seed.offers + 1, lastAge: age } };
    }
    case 'root-pass':
      if (root) return null;
      return { ...dreams, seed: { offers: seed.offers + 1, passed: [...new Set([...seed.passed, id])], lastAge: age } };
    case 'root-try':
      if (root?.id !== id || root.stage !== 'seed' || root.status !== 'growing') return null;
      return { ...dreams, roots: { ...root, stage: 'tried', tryAge: age, tryWay: descriptor.way ?? null, tryWith: descriptor.with ?? null,
        lastStepAge: age, milestones: milestone(root, age, `lần thử sức đầu tiên: ${descriptor.way}.`) } };
    case 'root-pause':
      if (root?.id !== id || root.stage !== 'seed' || root.status !== 'growing') return null;
      return { ...dreams, roots: { ...root, status: 'paused', pauseAge: age, pauseReason: descriptor.reason ?? 'other', lastStepAge: age,
        milestones: milestone(root, age, `gác lại ${REASONS[descriptor.reason ?? 'other']}.`) } };
    case 'root-cross': {
      if (root?.id !== id || !['seed', 'tried'].includes(root.stage) || root.status === 'dropped') return null;
      const base = { ...root, stage: 'crossed', lastStepAge: age };
      if (descriptor.choice === 'keep') return { ...dreams, roots: { ...base, status: 'growing', keptAge: age, pauseAge: null, pauseReason: null,
        milestones: milestone(root, age, `chọn giữ ${OBJECT[id]} ở quy mô nhỏ: ${descriptor.way}.`) } };
      if (descriptor.choice === 'pause') return { ...dreams, roots: { ...base, status: 'paused', pauseAge: root.status === 'paused' ? root.pauseAge ?? age : age,
        pauseReason: root.status === 'paused' ? root.pauseReason ?? descriptor.reason : descriptor.reason ?? 'other',
        milestones: milestone(root, age, `tạm gác ${OBJECT[id]} ${REASONS[descriptor.reason ?? 'other']}.`) } };
      if (descriptor.choice === 'drop') return { ...dreams, roots: { ...base, status: 'dropped', dropAge: age,
        milestones: milestone(root, age, `thôi hẳn ${OBJECT[id]}, không tiếc.`) } };
      return null;
    }
    case 'root-mid': {
      if (root?.id !== id || root.stage !== 'crossed' || root.status === 'dropped') return null;
      const way = descriptor.way || null;
      return { ...dreams, roots: { ...root, stage: 'mid', midAge: age, midWay: way, lastStepAge: age,
        ...(descriptor.resume ? { status: 'growing', pauseAge: null, pauseReason: null } : {}),
        milestones: way ? milestone(root, age, `${way}.`) : root.milestones } };
    }
    default:
      return null;
  }
}

// Bảng Ước mơ: tạm gác, giữ tiếp hoặc nhặt lại trước 55 tuổi. Không xóa dấu mốc cũ.
export function setRootStatus(dreams, status, age) {
  const root = dreams.roots;
  if (!root || age >= 55 || !['growing', 'paused'].includes(status) || root.status === status || ['returned', 'done'].includes(root.stage)) return null;
  const text = status === 'paused' ? `tự chọn tạm gác ${OBJECT[root.id]}.` : root.status === 'dropped' ? `nhặt lại ${OBJECT[root.id]}.` : `quay lại với ${OBJECT[root.id]}.`;
  return { ...dreams, roots: { ...root, status, ...(status === 'paused' ? { pauseAge: age, pauseReason: 'other' } : { pauseAge: null, pauseReason: null, dropAge: null }),
    milestones: milestone(root, age, text) } };
}

// ——— Từ 55 tuổi: lời gợi nhắc đúng chuyện cũ, và một kết thúc riêng cho người từng gieo mầm ———
export function rootSparkText(root, player, partnerName) {
  const recall = `${seedSentence(root, player)} ${turnSentence(root)}`.trim();
  if (root.id === 'music') {
    return root.dropAge != null
      ? `${recall} Ở tiệm đồ cũ, tôi thấy một cây đàn giống hệt cây đàn năm xưa. Tôi gảy thử một hợp âm, đứng tần ngần trước quầy.`
      : `${recall} Dọn kho, tôi thấy lại cây đàn cũ. Tôi gảy thử một hợp âm, tiếng đàn rè nhưng vẫn còn, và tôi ngồi ôm đàn khá lâu.`;
  }
  if (root.id === 'trip') {
    const companion = partnerName ? `${partnerName} hỏi tôi còn muốn đi những nơi từng ghi ở trang cuối vở không.`
      : root.tryWith === 'Bình' ? 'Bình gọi điện, nhắc chuyến xe khách đêm năm nào, hỏi tôi có muốn đi một lần thật xa.'
        : 'Bình, người bạn cùng lớp cũ, gọi điện hỏi tôi có muốn đi một chuyến thật xa.';
    return `${recall} ${companion}`;
  }
  return `${recall} Nhóm bạn ở quê gửi ảnh con đường làng, hỏi tôi còn nhớ không, và rủ về một chuyến.`;
}

export function rootJourneyChoice(root, player, scale) {
  // Kết thúc riêng chỉ dành cho mầm có người gợi cảm hứng cụ thể ở đời này.
  if (!['parent', 'school'].includes(root.sourceKind)) return null;
  const who = sourceLabel(root, player);
  const Who = capitalize(who);
  const role = roleOf(root);
  const alive = sourceAlive(root, player);
  const at = root.seedAge ?? 10;
  if (root.id === 'music') {
    if (!who) return { label: 'Đàn bản nhạc cô chép năm xưa', outcome: 'đàn bản nhạc cô giáo chép năm xưa',
      text: `Tôi đàn bản nhạc cô giáo chép cho năm tôi ${at} tuổi, tờ giấy kẻ ô đã ố vàng đặt trên giá. Đàn xong, tôi kể cho mọi người nghe về giờ âm nhạc ngày ấy.` };
    return alive
      ? { label: `Đàn bài ${role} dạy cho ${role} nghe`, outcome: `đàn bài năm xưa cho ${who} nghe`,
        text: `Tôi mời ${who} ngồi hàng đầu, đàn đúng đoạn nhạc ${role} dạy năm tôi ${at} tuổi. ${Who} gõ nhịp theo, tới đoạn cuối thì hát khẽ, mắt không rời tay tôi.` }
      : { label: `Đàn lại bài ${role} từng dạy`, outcome: `đàn lại bài ${who} dạy năm xưa để tưởng nhớ`,
        text: `Tôi đàn đoạn nhạc ${who} dạy năm tôi ${at} tuổi, chậm hơn ngày xưa. Mọi người im lặng nghe. Tôi nhớ đêm mất điện ấy, tiếng đàn và tiếng dế ngoài sân.` };
  }
  if (root.id === 'trip') {
    if (!who) return { label: 'Tìm một thác nước giữa đường', outcome: 'đứng dưới một thác nước như năm nào',
      text: `Giữa chuyến, tôi rẽ vào một khu rừng có thác. Đứng dưới chân thác, tôi nhớ chuyến dã ngoại năm ${at} tuổi, khi lần đầu biết mình muốn đi xa.` };
    return alive
      ? { label: `Gọi video cho ${role} từ chỗ đến`, outcome: `gọi video cho ${who} từ nơi đã hẹn`,
        text: `Tới nơi, tôi gọi video cho ${who}, quay một vòng cho ${role} xem. ${Who} nheo mắt nhìn, nói chỗ này giống bãi biển năm tôi ${at} tuổi.` }
      : { label: `Chụp ảnh như ${role} chụp năm xưa`, outcome: `chụp lại tấm ảnh giống năm ${who} chụp cho mình`,
        text: `Tôi đứng đúng kiểu năm ${at} tuổi, nhờ người lạ chụp giúp một tấm. Về nhà, tôi đặt tấm ảnh mới cạnh tấm ảnh ${who} chụp năm xưa.` };
  }
  const told = who && alive ? ` Tối đó tôi gọi kể cho ${who} nghe.` : '';
  return { label: 'Góp sức cho nơi cũ', outcome: 'góp sức cho nơi cũ',
    text: scale === 'large'
      ? `Tôi góp tiền sửa lại sân sinh hoạt hè năm xưa, gắn thêm mấy bóng đèn. Tối khánh thành, lũ trẻ trong làng chạy chơi tới khuya.${told}`
      : `Tôi mang về một tủ sách nhỏ cho nhà văn hóa, tự tay xếp từng cuốn. Mấy đứa trẻ ngồi đọc ngay trên bậc thềm.${told}` };
}

// Dòng tóm tắt hành trình cho bảng Ước mơ, tổng kết cuối đời và sổ các cuộc đời.
export function describeRootJourney(root) {
  if (!root) return '';
  return `${ROOT_ICONS[root.id]} Từ tuổi nhỏ · ${ROOT_NAMES[root.id]}: ${root.milestones.map(item => `${item.age} tuổi, ${item.text.replace(/\.$/u, '')}`).join('; ')}.`;
}
export const ROOT_STATUS_LABELS = { growing: 'Đang nuôi dưỡng', paused: 'Đang tạm gác', dropped: 'Đã buông' };
