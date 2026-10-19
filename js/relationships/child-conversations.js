import { getChildAge } from './family.js';

// Trò chuyện với con: con mở lời theo tuổi và hoàn cảnh, người chơi chọn cách đáp.
// Cấu trúc giống trò chuyện với bố mẹ (family-conversations.js): có ghi nhớ và câu hỏi tiếp nối.
export const CHILD_MEMORY_LIMIT = 12;
export const CHILD_CONVERSATION_MIN_AGE = 3;
const answer = (id, label, reply, memory, bond = 0, happiness = 0, followUp = null) =>
  ({ id, label, reply, memory, bond, happiness, followUp });
const givenName = fullName => String(fullName ?? '').trim().split(/\s+/u).at(-1) || 'con';
const capitalize = text => `${text[0].toLocaleUpperCase('vi-VN')}${text.slice(1)}`;
// Mầm ước mơ riêng của từng đứa con: con tự bộc lộ, cách bố/mẹ đáp chỉ đổi mức độ, không xóa mong muốn.
const SEED_IDS = ['music', 'trip', 'homecoming'];
const seedChoice = (id, label, reply, memory, bond, happiness, interest, text) =>
  ({ ...answer(id, label, reply, memory, bond, happiness), dreamSeed: { id: SEED_TOPIC_ID, interest, text } });
let SEED_TOPIC_ID = null;
function seedScene(dream, kid, name, me, Me) {
  SEED_TOPIC_ID = dream;
  const young = kid < 12;
  if (dream === 'music') return young ? {
    title: 'Cửa hàng nhạc cụ',
    prompt: `Lần nào đi ngang cửa hàng nhạc cụ, ${name} cũng đứng lại nhìn. Hôm nay con kéo tay bạn: “${Me} ơi, con muốn học đàn.”`,
    choices: [
      seedChoice('encourage', 'Hứa cho con đi học thử', `${name} nhảy cẫng lên, cả tối hỏi bao giờ được đi học.`, 'Tôi hứa cho con đi học đàn thử.', 2, 1, 'eager', `xin ${me} cho đi học đàn.`),
      seedChoice('toy', 'Cho con tập đàn đồ chơi trước', `${name} ôm cây đàn đồ chơi đi khắp nhà, bấm đi bấm lại một giai điệu.`, 'Tôi mua cho con cây đàn đồ chơi để tập trước.', 1, 1, 'eager', `xin ${me} cho đi học đàn.`),
      seedChoice('later', 'Nói để lớn hơn rồi tính', `${name} gật đầu, nhưng lần sau đi ngang cửa hàng vẫn đứng lại nhìn.`, 'Tôi hẹn con lớn hơn rồi mới cho học đàn.', 0, 0, 'quiet', 'mê tiếng đàn mà chưa dám xin học.'),
    ],
  } : {
    title: 'Tiếng đàn trong phòng con',
    prompt: `${name} tự học đàn qua video, đêm nào cũng gảy khe khẽ trong phòng. Hôm nay con hỏi: “${Me} có thấy con đàn được không?”`,
    choices: [
      seedChoice('listen', 'Ngồi nghe con đàn trọn một bài', `${name} đàn hơi run, sai hai chỗ, nhưng đàn tới cuối. Con nhìn bạn, chờ một lời khen thật.`, 'Tôi ngồi nghe con đàn trọn một bài.', 2, 1, 'eager', `xin ${me} cho đi học đàn.`),
      seedChoice('praise', 'Khen rồi nhắc con ngủ sớm', `${name} cười, cất đàn. Đêm sau tiếng đàn vẫn vang lên, nhỏ hơn một chút.`, 'Tôi khen con rồi nhắc con ngủ sớm.', 1, 0, 'quiet', 'mê tiếng đàn mà chưa dám xin học.'),
      seedChoice('study', 'Bảo con lo học trước đã', `${name} im lặng, cất đàn vào gầm giường. Thỉnh thoảng bạn vẫn nghe tiếng đàn rất khẽ lúc nửa đêm.`, 'Tôi bảo con lo học trước đã.', -1, 0, 'quiet', 'mê tiếng đàn mà chưa dám xin học.'),
    ],
  };
  if (dream === 'trip') return young ? {
    title: 'Tấm bản đồ trên sàn',
    prompt: `${name} trải tấm bản đồ ra sàn, lấy bút khoanh tròn những nơi muốn tới. “Lớn lên con sẽ đi hết chỗ này.”`,
    choices: [
      seedChoice('story', 'Kể con nghe một nơi mình từng đến', `${name} nằm sấp nghe, hỏi tới tận giờ ngủ, rồi khoanh thêm một vòng nữa.`, 'Tôi kể cho con nghe về một nơi mình từng đến.', 2, 1, 'eager', 'trải bản đồ ra sàn, đánh dấu những nơi muốn tới.'),
      seedChoice('wall', 'Treo bản đồ lên tường cho con', `Tấm bản đồ lên tường, ${name} đứng ngắm mãi, sáng nào cũng tìm một tên nơi mới.`, 'Tôi treo tấm bản đồ lên tường phòng con.', 1, 1, 'eager', 'trải bản đồ ra sàn, đánh dấu những nơi muốn tới.'),
      seedChoice('tidy', 'Bảo con cất gọn kẻo rách', `${name} gấp bản đồ cất vào cặp. Bạn thấy con hay lôi ra xem ở trường.`, 'Tôi bảo con cất tấm bản đồ cho gọn.', 0, 0, 'quiet', 'hay ngồi xem sách ảnh về những miền đất xa.'),
    ],
  } : {
    title: 'Trại hè ở tỉnh xa',
    prompt: `${name} xin đi trại hè ở một tỉnh xa, lần đầu đi không có người nhà. Con nói đã để dành được một nửa tiền.`,
    choices: [
      seedChoice('support', 'Cho đi, góp phần tiền còn lại', `${name} gọi về mỗi tối, kể một nơi mới. Về nhà, con nói muốn đi xa hơn nữa.`, 'Tôi cho con đi trại hè và góp phần tiền còn thiếu.', 2, 1, 'eager', 'trải bản đồ ra sàn, đánh dấu những nơi muốn tới.'),
      seedChoice('call', 'Cho đi, dặn gọi về mỗi tối', `${name} đi một tuần, tối nào cũng gọi đúng giờ, kể không ngừng.`, 'Tôi cho con đi trại hè, dặn gọi về mỗi tối.', 1, 0, 'eager', 'trải bản đồ ra sàn, đánh dấu những nơi muốn tới.'),
      seedChoice('next', 'Bảo năm sau hẵng đi', `${name} cất phong bì tiền vào ngăn kéo, ghi lên đó: năm sau.`, 'Tôi bảo con năm sau hẵng đi trại hè xa.', -1, 0, 'quiet', 'hay ngồi xem sách ảnh về những miền đất xa.'),
    ],
  };
  return young ? {
    title: 'Mùa hè ở quê',
    prompt: `Về quê dịp hè, ${name} theo lũ trẻ trong xóm ra đồng cả ngày. Hôm phải về, con đòi ở lại thêm một tuần.`,
    choices: [
      seedChoice('stay', 'Cho con ở lại thêm', `${name} ở lại một tuần, về nhà đen nhẻm, kể chuyện bắt cá không dứt.`, 'Tôi cho con ở lại quê thêm một tuần.', 2, 1, 'eager', 'chỉ mong tới hè để được về quê.'),
      seedChoice('promise', 'Hứa hè sau lại về', `${name} ngoéo tay, cả năm đếm ngày tới hè.`, 'Tôi hứa với con hè sau lại về quê.', 1, 1, 'eager', 'chỉ mong tới hè để được về quê.'),
      seedChoice('class', 'Bảo phải về đi học thêm', `${name} lên xe, ngoái nhìn mãi con đường đất. Tối đó con hỏi bao giờ lại về.`, 'Tôi bảo con phải về đi học thêm.', -1, 0, 'quiet', `thích nghe ${me} kể chuyện quê.`),
    ],
  } : {
    title: 'Bài tập về làng quê',
    prompt: `${name} làm bài tập về lịch sử làng quê, hỏi người lớn đủ chuyện, ghi kín cả cuốn vở. Con hỏi ${me} có chuyện gì về quê để kể không.`,
    choices: [
      seedChoice('visit', 'Chở con về quê tìm tư liệu', `Hai người về quê một ngày, ${name} chụp ảnh đình làng, hỏi chuyện mấy cụ trong xóm.`, 'Tôi chở con về quê tìm tư liệu cho bài tập.', 2, 1, 'eager', 'chỉ mong tới hè để được về quê.'),
      seedChoice('tell', 'Kể con nghe chuyện quê mình', `${name} ghi chép không sót chữ nào, rồi hỏi thêm về những người mình chưa từng gặp.`, 'Tôi kể cho con nghe chuyện quê mình.', 2, 0, 'quiet', `thích nghe ${me} kể chuyện quê.`),
      seedChoice('short', 'Nhắc con đừng mất nhiều thời gian', `${name} làm xong bài trong một buổi, nhưng vẫn giữ cuốn vở ghi chép kỹ.`, 'Tôi nhắc con đừng dành quá nhiều thời gian cho bài tập.', -1, 0, 'quiet', `thích nghe ${me} kể chuyện quê.`),
    ],
  };
}

const pick = (list, seed, avoid) => {
  const free = list.filter(item => item !== avoid);
  const pool = free.length ? free : list;
  return pool[Math.abs(seed) % pool.length];
};

export function createChildConversation(player, child) {
  if (!child || player?.isAlive === false || child.alive === false || child.isAlive === false) return null;
  const age = player.age ?? 0;
  const kid = getChildAge(child, age);
  if (kid < CHILD_CONVERSATION_MIN_AGE) return null;
  const name = givenName(child.name);
  const me = player.gender === 'female' ? 'mẹ' : 'bố';
  const Me = capitalize(me);
  const memories = Array.isArray(child.conversationMemories) ? child.conversationMemories : [];
  const last = memories.at(-1);
  const jailed = Boolean(player.prison && player.prison.releaseAge > age);
  const bond = Number.isFinite(child.relationship) ? child.relationship : Number.isFinite(child.bond) ? child.bond : 80;
  const elderly = age >= 70 || (player.health ?? 100) < 40;
  const struggling = (player.money ?? 0) < 0 || (age < 62 && ['unemployed', 'declined'].includes(player.employmentStatus));
  // Đổi theo từng năm của người chơi để các chủ đề luân phiên; mỗi đứa con có nhịp riêng.
  const seed = age + [...String(child.id ?? '')].reduce((sum, char) => sum + char.codePointAt(0), 0);
  const greeting = jailed ? `Đến giờ thăm gặp, ${name} ngồi xuống phía bên kia tấm kính.`
    : kid < 6 ? `${name} trèo lên lòng bạn, tay vẫn cầm món đồ chơi.`
      : kid < 12 ? `Buổi tối, ${name} kéo ghế ngồi cạnh bạn ở bàn học.`
        : kid < 18 ? `Bạn gõ cửa phòng ${name}. Một lúc sau cửa mới hé.`
          : kid < 26 ? `${name} gọi điện về, giọng còn lẫn tiếng xe ngoài đường.`
            : `${name} ghé nhà, mang theo túi trái cây, ngồi xuống chiếc ghế quen.`;
  let topic, title, prompt, choices;

  if (last?.followUp === 'worry') {
    topic = 'follow-up-worry'; title = 'Chuyện con kể lần trước';
    prompt = `“${Me} còn nhớ chuyện con kể lần trước không?” ${name} hỏi, như muốn biết bạn có thật sự để tâm.`;
    choices = [
      answer('ask', 'Hỏi chuyện ấy giờ ra sao', `${name} kể tiếp, lần này dài hơn. Có đoạn con tự nhận ra cách gỡ, bạn chỉ cần gật đầu.`, `Tôi hỏi lại chuyện con từng lo, và con kể tiếp phần còn dang dở.`, 2, 1),
      answer('thought', 'Kể điều mình đã nghĩ từ hôm ấy', `${name} ngạc nhiên vì ${me} vẫn nghĩ về chuyện của con. “Con tưởng ${me} quên rồi.”`, `Tôi kể cho con những gì mình nghĩ thêm sau lần con tâm sự.`, 2),
      answer('forgot', 'Thú nhận đã quên, xin con kể lại', `${name} hơi cụt hứng, nhưng vẫn kể lại từ đầu. Lần này bạn nghe không bỏ sót câu nào.`, `Tôi thú nhận đã quên chuyện con kể và xin con kể lại.`, 0),
    ];
  } else if (last?.followUp === 'dream') {
    topic = 'follow-up-dream'; title = 'Điều con đang theo đuổi';
    prompt = `“Cái việc con kể với ${me} lần trước ấy, con vẫn đang làm.” ${name} khoe, rồi chờ xem bạn nói gì.`;
    choices = [
      answer('progress', 'Hỏi con đã làm tới đâu', `${name} kể từng bước nhỏ, cả lần làm hỏng. Bạn thấy con nói về nó với ánh mắt khác hẳn.`, `Tôi hỏi con về điều con đang theo đuổi và nghe con kể từng bước.`, 2, 1),
      answer('support', 'Hứa sẽ đến xem hoặc ủng hộ', `“${Me} hứa rồi đấy nhé.” ${name} cười, ghi ngày vào điện thoại như sợ bạn quên.`, `Tôi hứa sẽ ủng hộ điều con đang theo đuổi.`, 2, 1),
      answer('doubt', 'Nhắc con nghĩ thực tế hơn', `${name} im một lúc rồi nói con biết rồi. Câu chuyện chuyển sang chuyện khác nhanh hơn bạn muốn.`, `Tôi nhắc con nghĩ thực tế hơn về điều con đang theo đuổi.`, -1),
    ];
  } else if (last?.followUp === 'distance') {
    topic = 'follow-up-distance'; title = 'Sau lần nặng lời';
    prompt = `${name} ngồi xuống nhưng vẫn giữ khoảng cách. Lần trước hai người nói chuyện không vui, và cả hai đều còn nhớ.`;
    choices = [
      answer('sorry', 'Xin lỗi con vì lần trước', `${name} nhìn bạn khá lâu rồi gật đầu. “Con cũng có lỗi.” Không khí giữa hai người dịu xuống.`, `Tôi xin lỗi con vì lần nói chuyện trước đã làm con buồn.`, 3, 1),
      answer('ask', 'Hỏi hôm nay con muốn nói gì', `${name} chọn một chuyện nhỏ để kể. Cả hai cẩn thận với lời của mình, nhưng không ai bỏ đi.`, `Tôi để con chọn điều muốn nói sau lần hai người nặng lời.`, 2),
      answer('quiet', 'Ngồi cạnh con, chưa cần nói', `Hai người ngồi cạnh nhau một lúc. Trước khi đứng dậy, ${name} khẽ chạm vai bạn.`, `Tôi ngồi cạnh con mà chưa cần nói gì sau lần căng thẳng.`, 1, 1),
    ];
  } else if (jailed && kid >= 6) {
    topic = 'prison-visit'; title = 'Giờ thăm gặp';
    prompt = `${name} áp tay lên tấm kính, hỏi nhỏ: “Bao giờ ${me} về?” Người cán bộ nhắc chỉ còn ít phút.`;
    choices = [
      answer('truth', 'Nói thật ngày mãn hạn', `${name} đếm trên ngón tay rồi gật đầu. “Con sẽ đánh dấu trên lịch.”`, `Tôi nói thật với con ngày mình mãn hạn tù.`, 2),
      answer('school', 'Hỏi chuyện con ở nhà, ở trường', `${name} kể vội đủ thứ chuyện cho kịp giờ. Lúc đứng dậy, con nói lần sau sẽ kể tiếp.`, `Trong giờ thăm gặp, tôi hỏi con về những ngày ở nhà và ở trường.`, 2, 1),
      answer('stop', 'Bảo con đừng đến thăm nữa', `${name} sững lại, mắt đỏ hoe. Con không cãi, chỉ quay đi khi hết giờ.`, `Tôi bảo con đừng đến thăm mình trong trại nữa.`, -5, -2, 'distance'),
    ];
  } else if (child.adopted && kid >= 6 && bond >= 40 && !memories.some(memory => memory.topic === 'origin' && memory.choiceId === 'truth') &&
      age - (memories.filter(memory => memory.topic === 'origin').at(-1)?.age ?? -99) >= 3) {
    // Con nuôi hỏi về nơi ở trước đây; chưa được kể thật thì vài năm sau con hỏi lại.
    topic = 'origin'; title = 'Câu hỏi về ngày trước';
    prompt = `${name} cầm tờ bài tập vẽ cây gia đình, hỏi nhỏ: “Trước khi về nhà mình, con ở đâu?” Con nhìn bạn, chờ một câu trả lời thật.`;
    choices = [
      answer('truth', 'Kể thật những gì mình biết', `Bạn kể về nơi con ở trước đây và ngày đầu đón con về. ${name} nghe hết, rồi hỏi thêm về hôm ấy.`, `Tôi kể thật cho con nghe về nơi con ở trước khi về nhà mình.`, 3, 1),
      answer('later', 'Hứa kể đầy đủ khi con lớn hơn', `${name} gật đầu, nhưng gấp tờ bài tập lại khá chậm. “${Me} hứa rồi nhé.”`, `Tôi hứa sẽ kể đầy đủ về quá khứ khi con lớn hơn.`, 1),
      answer('avoid', 'Lảng sang chuyện khác', `${name} không hỏi nữa. Tối đó con vẽ cây gia đình chỉ có một cành.`, `Tôi lảng đi khi con hỏi về nơi con ở trước đây.`, -3, -1, 'distance'),
    ];
  } else if (kid >= 6 && kid < 18 && !child.dreamSeed && seed % 3 === 0) {
    const idSum = [...String(child.id ?? '')].reduce((sum, char) => sum + char.codePointAt(0), 0);
    const scene = seedScene(SEED_IDS[idSum % SEED_IDS.length], kid, name, me, Me);
    topic = `seed-${SEED_TOPIC_ID}`; title = scene.title; prompt = scene.prompt; choices = scene.choices;
  } else if (bond < 40) {
    topic = 'rebuilding'; title = 'Khoảng cách giữa hai người';
    prompt = `Câu chuyện cứ đứt quãng. ${name} nói: “${Me} hỏi con mấy câu như hỏi người ngoài.”`;
    choices = [
      answer('why', 'Hỏi điều gì làm con thấy xa', `${name} nói một hơi, có câu làm bạn đau. Bạn không cãi lại, và lần này con không bỏ đi giữa chừng.`, `Tôi hỏi con điều gì khiến hai người xa nhau và nghe hết câu trả lời.`, 3, 0, 'worry'),
      answer('share', 'Kể chuyện của mình trước', `Bạn kể một chuyện nhỏ trong ngày. ${name} nghe, rồi kể lại một chuyện của con. Câu chuyện chưa dài, nhưng đã có qua có lại.`, `Tôi mở lời bằng chuyện của mình để con thấy dễ nói hơn.`, 1, 1),
      answer('later', 'Xin để lần sau nói tiếp', `${name} nhún vai. “Lần nào cũng lần sau.” Nhưng con vẫn chào bạn trước khi đi.`, `Tôi xin để lần sau mới nói chuyện kỹ với con.`, 0),
    ];
  } else if (kid < 6) {
    topic = pick(['moon', 'nap', 'ants'], seed, last?.topic);
    title = 'Câu hỏi vì sao';
    prompt = topic === 'moon' ? `“${Me} ơi, sao mặt trăng cứ đi theo con?” ${name} hỏi, mắt tròn xoe chờ câu trả lời.`
      : topic === 'nap' ? `“Sao con phải ngủ trưa mà ${me} thì không?” ${name} hỏi, chân vẫn đá đá vào thành giường.`
        : `${name} ngồi xổm nhìn hàng kiến bò qua sân. “Mấy con kiến đi đâu vậy ${me}?”`;
    choices = [
      answer('explain', 'Giải thích thật đơn giản', `${name} nghe chăm chú, rồi đem đi kể lại cho cả nhà, sai mất một nửa nhưng rất tự tin.`, `Tôi giải thích cho con một câu hỏi vì sao bằng những lời thật đơn giản.`, 2, 1),
      answer('wonder', 'Hỏi lại con nghĩ vì sao', `${name} nghĩ ra một lý do rất riêng của con. Bạn ghi câu ấy vào sổ, định sau này kể cho con nghe.`, `Tôi hỏi lại con nghĩ vì sao và ghi lại câu trả lời ngộ nghĩnh của con.`, 2, 1),
      answer('later', 'Bảo con để mai hỏi tiếp', `${name} xịu mặt một chút, rồi chạy đi chơi. Câu hỏi ấy con không nhắc lại nữa.`, `Tôi hẹn con để mai trả lời câu hỏi vì sao.`, 0),
    ];
  } else if (kid < 12) {
    topic = pick(['friend', 'test'], seed, last?.topic);
    title = topic === 'friend' ? 'Chuyện ở lớp' : 'Bài kiểm tra trong cặp';
    prompt = topic === 'friend' ? `“Hôm nay bạn cùng bàn không chơi với con nữa.” ${name} vừa nói vừa vẽ nguệch ngoạc lên tờ giấy.`
      : `Bạn thấy tờ bài kiểm tra điểm thấp ${name} giấu dưới đáy cặp. Con đứng nhìn bạn, tay nắm chặt quai cặp.`;
    choices = topic === 'friend' ? [
      answer('ask', 'Hỏi con chuyện gì đã xảy ra', `${name} kể một mạch, có đoạn tự cười vì thấy chuyện cũng không lớn lắm. Con nói mai sẽ thử bắt chuyện lại.`, `Tôi hỏi con chuyện ở lớp và để con kể hết.`, 2, 1, 'worry'),
      answer('story', 'Kể hồi nhỏ mình cũng từng vậy', `${name} tròn mắt: “${Me} cũng bị à?” Con hỏi thêm đủ thứ về hồi bạn đi học.`, `Tôi kể cho con chuyện hồi nhỏ mình cũng từng bị bạn giận.`, 2, 1),
      answer('brush', 'Bảo con chơi với bạn khác', `${name} gật đầu nhưng im lặng, lấy bút tô đen cả góc tờ giấy.`, `Tôi khuyên con chơi với bạn khác cho xong chuyện.`, 0),
    ] : [
      answer('hard', 'Hỏi con phần nào khó', `${name} chỉ vào mấy câu sai, giọng nhỏ dần. Hai người ngồi làm lại từng câu tới giờ ngủ.`, `Tôi hỏi con phần nào khó thay vì hỏi vì sao điểm thấp.`, 2, 1),
      answer('honest', 'Nói thật mình hơi buồn, rồi cùng ôn', `${name} xin lỗi vì đã giấu. Bạn nói lần sau cứ đưa ${me} xem, điểm thấp cũng được.`, `Tôi nói thật cảm xúc của mình và hẹn cùng con ôn bài.`, 2),
      answer('scold', 'Mắng con vì đã giấu bài', `${name} khóc, chạy vào phòng đóng cửa. Tối đó con không ra ăn cơm.`, `Tôi mắng con vì đã giấu bài kiểm tra.`, -5, -1, 'distance'),
    ];
  } else if (kid < 18) {
    topic = pick(['belong', 'drawing'], seed, last?.topic);
    title = topic === 'belong' ? 'Một câu hỏi khó' : 'Điều con muốn học';
    prompt = topic === 'belong' ? `${name} dạo này ít nói, về nhà là vào phòng. Hôm nay con hỏi: “${Me} có bao giờ thấy mình không thuộc về đâu không?”`
      : `“Con muốn học vẽ thay vì học thêm toán.” ${name} nói nhanh, như sợ bị ngắt lời.`;
    choices = topic === 'belong' ? [
      answer('truth', 'Kể thật một lần mình từng thấy vậy', `${name} ngồi xuống mép giường, nghe bạn kể. Rồi con kể chuyện của con, chậm rãi, lần đầu tiên sau nhiều tháng.`, `Tôi kể cho con một lần mình từng thấy lạc lõng, và con kể lại chuyện của con.`, 3, 1, 'worry'),
      answer('ask', 'Hỏi con đang gặp chuyện gì', `${name} nhún vai, nói không có gì. Nhưng con không đóng cửa ngay, ngồi lại thêm một lúc.`, `Tôi hỏi con đang gặp chuyện gì, con chưa kể nhưng vẫn ngồi lại.`, 1),
      answer('dismiss', 'Bảo con đừng nghĩ linh tinh', `${name} ừ một tiếng rồi đeo tai nghe. Cánh cửa phòng khép lại nhẹ nhàng hơn bạn tưởng, và điều đó còn khó chịu hơn.`, `Tôi bảo con đừng nghĩ linh tinh, lo học đi.`, -5, -1, 'distance'),
    ] : [
      answer('curious', 'Hỏi con thích vẽ điều gì', `${name} mở điện thoại cho bạn xem mấy bức vẽ chưa từng khoe ai. Bạn nhận ra con đã vẽ rất lâu rồi.`, `Tôi hỏi con thích vẽ điều gì và được xem những bức vẽ con giấu kín.`, 2, 1, 'dream'),
      answer('trial', 'Đề nghị thử một học kỳ', `${name} đồng ý thử một học kỳ rồi cùng xem lại. Hai người viết điều kiện ra giấy, ký tên như hợp đồng.`, `Tôi đề nghị con thử học vẽ một học kỳ rồi cùng xem lại.`, 2, 0, 'dream'),
      answer('practical', 'Nói vẽ khó kiếm sống', `${name} gật đầu, không cãi. Cuối tuần ấy con vẫn đi học thêm toán, nhưng không kể gì về lớp học nữa.`, `Tôi nói với con rằng vẽ khó kiếm sống.`, -5, -1, 'distance'),
    ];
  } else if (kid < 26) {
    topic = pick(['leaving', 'first-job'], seed, last?.topic);
    title = topic === 'leaving' ? 'Con muốn ra ở riêng' : 'Công việc đầu tiên';
    prompt = topic === 'leaving' ? `${name} kể muốn thuê một phòng nhỏ gần chỗ học, chỗ làm, tự lo tiền nhà. “Con muốn thử tự đứng một mình.”`
      : `“Công việc đầu tiên khó hơn con tưởng.” ${name} kể về một ngày bị nhắc nhở trước mặt mọi người.`;
    choices = topic === 'leaving' ? [
      answer('budget', 'Giúp con tính tiền nhà, tiền ăn', `Hai người ngồi tính từng khoản trên tờ giấy. ${name} gạch bớt mấy thứ, nói vậy mới biết ở riêng không dễ.`, `Tôi giúp con tính chuyện tiền nhà, tiền ăn khi con muốn ra ở riêng.`, 2, 1),
      answer('miss', 'Nói sẽ nhớ con, nhưng ủng hộ', `${name} ôm bạn một cái thật lâu. “Cuối tuần con vẫn về ăn cơm.”`, `Tôi nói mình sẽ nhớ con nhưng ủng hộ con ra ở riêng.`, 3, 1),
      answer('stay', 'Khuyên con ở nhà thêm vài năm', `${name} im lặng, nói sẽ nghĩ thêm. Bạn biết con đã nghĩ khá lâu trước khi mở lời.`, `Tôi khuyên con ở nhà thêm vài năm cho đỡ tốn.`, 0, 0, 'worry'),
    ] : [
      answer('listen', 'Lắng nghe hết, chưa vội khuyên', `${name} kể một hồi rồi tự thở ra: “Nói ra thấy nhẹ hơn rồi.” Bạn chỉ nói thêm một câu: mệt thì cứ gọi về.`, `Tôi lắng nghe con kể về công việc đầu tiên mà chưa vội khuyên.`, 2, 1, 'worry'),
      answer('story', 'Kể lần đầu đi làm của mình', `${name} bật cười khi nghe bạn kể lần đầu đi làm vụng về. “Vậy mà ${me} cũng qua được.”`, `Tôi kể cho con nghe lần đầu đi làm vụng về của mình.`, 2, 1),
      answer('endure', 'Bảo con chịu khó, ai cũng vậy', `${name} ừ một tiếng. Cuộc gọi kết thúc sớm hơn thường lệ.`, `Tôi bảo con chịu khó vì ai đi làm cũng vậy.`, 0),
    ];
  } else if (elderly) {
    topic = 'care'; title = 'Con lo cho mình';
    prompt = `${name} nhìn bạn đi chậm từ bếp ra rồi nói: “Hay ${me} để con thuê người giúp việc nhà, hoặc về ở gần con cho tiện?”`;
    choices = [
      answer('independent', 'Cảm ơn, mình vẫn muốn tự lo', `${name} không ép, chỉ xin bạn tối nào cũng gọi một cuộc. Con lưu sẵn số của mình lên màn hình điện thoại bạn.`, `Tôi cảm ơn con và nói mình vẫn muốn tự lo cuộc sống.`, 1),
      answer('partly', 'Nhận một phần, nhờ con ghé thường hơn', `${name} thở phào. Từ đó cuối tuần nào con cũng ghé, có khi chỉ để nấu một nồi canh.`, `Tôi nhận một phần sự giúp đỡ và nhờ con ghé thăm thường hơn.`, 3, 1),
      answer('snap', 'Gắt rằng mình chưa già tới mức đó', `${name} im lặng, cúi xuống gọt nốt quả táo. Lúc về, con đứng ở cửa khá lâu mới đi.`, `Tôi gắt với con khi con lo cho sức khỏe của mình.`, -4, -1, 'distance'),
    ];
  } else if (struggling) {
    topic = 'hard-times'; title = 'Con hỏi thăm';
    prompt = `“Dạo này ${me} ổn không? Con nghe nói mọi chuyện không được suôn sẻ.” ${name} hỏi khẽ, như sợ làm bạn ngại.`;
    choices = [
      answer('honest', 'Kể thật, dặn con đừng lo', `${name} nghe hết, không nói gì to tát. Cuối buổi, con chỉ nói: “Có gì ${me} nhớ gọi con.”`, `Tôi kể thật với con về những ngày khó khăn của mình.`, 2, 1, 'worry'),
      answer('fine', 'Nói mọi chuyện vẫn ổn', `${name} biết là không ổn, nhưng không hỏi thêm. Trước khi về, con lặng lẽ đổ đầy bình nước trong bếp.`, `Tôi nói với con rằng mọi chuyện vẫn ổn.`, 0),
      answer('plan', 'Nhờ con cùng tính chuyện chi tiêu', `Hai người ngồi xem lại các khoản chi. ${name} chỉ ra mấy chỗ có thể bớt, cẩn thận để bạn không thấy bị dạy đời.`, `Tôi nhờ con cùng tính lại chuyện chi tiêu.`, 2),
    ];
  } else {
    topic = pick(['adult-life', 'old-photo', 'decision'], seed, last?.topic);
    title = topic === 'adult-life' ? 'Chuyện của người lớn' : topic === 'old-photo' ? 'Tấm ảnh ngày con còn nhỏ' : 'Một quyết định lớn';
    prompt = topic === 'adult-life' ? `${name} kể chuyện công việc, chuyện nhà cửa, rồi ngập ngừng: “Có lúc con thấy mình chạy mãi mà không biết để làm gì.”`
      : topic === 'old-photo' ? `${name} lật album cũ, dừng ở tấm ảnh chụp con hồi nhỏ. “Hồi đó nuôi con, ${me} có mệt không?”`
        : `“Con đang phân vân chuyện đổi việc, chuyển chỗ ở.” ${name} hỏi ý bạn, nhưng giọng đã nghiêng về một phía.`;
    choices = topic === 'adult-life' ? [
      answer('ask', 'Hỏi điều gì làm con mệt nhất', `${name} kể một hồi rồi tự dừng lại: “Hóa ra con chỉ cần có người nghe.”`, `Tôi hỏi con điều gì đang làm con mệt nhất.`, 2, 1, 'worry'),
      answer('story', 'Kể mình vượt qua quãng ấy thế nào', `${name} hỏi thêm vài câu, rồi ghi lại một điều bạn nói vào điện thoại.`, `Tôi kể cho con nghe mình đã vượt qua quãng mệt mỏi như thế nào.`, 2, 1),
      answer('rest', 'Rủ con cuối tuần về nghỉ ngơi', `Cuối tuần ấy ${name} về, ngủ trưa một giấc dài trên chiếc giường cũ. Bạn nấu món con thích hồi nhỏ.`, `Tôi rủ con về nhà nghỉ ngơi một cuối tuần.`, 1, 1),
    ] : topic === 'old-photo' ? [
      answer('truth', 'Kể thật những năm vất vả', `${name} nghe lặng đi. “Vậy mà con chẳng biết gì.” Con cất tấm ảnh vào ví.`, `Tôi kể thật cho con nghe những năm vất vả khi nuôi con.`, 2, 1),
      answer('joy', 'Kể một kỷ niệm vui hồi con bé', `Hai người cười tới chảy nước mắt vì một chuyện con đã quên sạch. ${name} chụp lại tấm ảnh để gửi cho bạn bè xem.`, `Tôi kể cho con một kỷ niệm vui hồi con còn bé.`, 2, 1),
      answer('shrug', 'Nói qua loa rằng ai cũng vậy', `${name} gật đầu, lật sang trang khác. Câu chuyện dừng ở đó.`, `Tôi nói qua loa rằng nuôi con ai cũng vậy.`, 0),
    ] : [
      answer('heart', 'Hỏi con thật lòng muốn gì', `${name} nghĩ một lúc rồi nói ra điều con chưa dám nói với ai. Quyết định vẫn là của con, nhưng con nhẹ nhõm hơn.`, `Tôi hỏi con thật lòng muốn gì trước một quyết định lớn.`, 2, 1, 'dream'),
      answer('worry', 'Nói nỗi lo của mình, để con quyết', `${name} nghe hết nỗi lo của bạn, gật đầu. “Con sẽ tính thêm phần đó.”`, `Tôi nói nỗi lo của mình rồi để con tự quyết.`, 2),
      answer('caution', 'Khuyên con đừng mạo hiểm', `${name} cảm ơn, nhưng đổi chủ đề khá nhanh. Bạn đoán con đã quyết từ trước khi hỏi.`, `Tôi khuyên con đừng mạo hiểm thay đổi.`, -2),
    ];
  }
  const recall = last ? `${name} vẫn nhớ chuyện năm bạn ${last.age} tuổi: ${last.memory.replace(/^Tôi /u, 'Bạn ')}` : null;
  return { id: `${child.id}:${age}:${topic}:${last?.id ?? 'first'}`, childId: child.id, age, childAge: kid, topic, title,
    greeting, recall, prompt, choices };
}

export function rememberChildConversation(child, scene, choiceId) {
  const choice = scene?.choices.find(item => item.id === choiceId);
  if (!choice || scene.childId !== child?.id) return null;
  const old = Array.isArray(child.conversationMemories) ? child.conversationMemories : [];
  const memory = { id: `${scene.age}:${scene.topic}:${choice.id}`, age: scene.age, topic: scene.topic, choiceId: choice.id,
    label: choice.label, memory: choice.memory, reply: choice.reply, followUp: choice.followUp };
  return { choice, memory, memories: [...old, memory].slice(-CHILD_MEMORY_LIMIT) };
}
