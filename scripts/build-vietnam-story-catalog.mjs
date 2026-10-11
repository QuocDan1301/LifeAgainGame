import fs from 'node:fs';
import { getBaseAgeEvents, isPriorityEvent } from '../js/events.js';
import { createEverydayAdditions } from '../js/everyday-additions.js';
import { enrichEverydayRewards } from '../js/everyday-rewards.js';

const countWords = text => text.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
const clean = text => String(text ?? '').replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F\u200D]/gu, '').replace(/\s+/gu, ' ').trim();
function firstPerson(text) {
  const friends = [];
  text = String(text ?? '').replace(/(?:Bạn|bạn) (?:kia|ấy|khác|bên cạnh|cùng bàn|cùng đội|bè)|(?:một|Một|người|Người|các|Các|hội|Hội|tình|Tình) bạn|(?:với|cùng|nhờ) (?:một )?bạn(?=[,.! ]|$)/gu, value => {
    const key = `@@PERSON${friends.length}@@`; friends.push(value); return key;
  }).replace(/(?<!\p{L})Bạn(?!\p{L})/gu, 'Tôi').replace(/(?<!\p{L})bạn(?!\p{L})/gu, 'tôi')
    .replace(/Hai tôi/gu, 'Hai đứa tôi').replace(/hai tôi/gu, 'hai đứa')
    .replace(/@@PERSON(\d+)@@/gu, (_, index) => friends[Number(index)]);
  return clean(text).replace(/!+/gu, '.').replace(/\.{2,}/gu, '.')
    .replace(/Tôi mời tôi/gu, 'Một người bạn mời tôi')
    .replace(/Tôi nhận lời chúc, tôi/gu, 'Bạn ấy nhận lời chúc, tôi')
    .replace(/Tôi giải thích bằng những nước đi/gu, 'Bạn ấy giải thích bằng những nước đi')
    .replace(/Tôi nhận lời chúc/gu, 'Bạn ấy nhận lời chúc')
    .replace(/Tình tôi/gu, 'Tình bạn');
}

const additions = [
  ['Tờ giấy dùng hai mặt', 'Tôi tìm một tờ giấy để ghi vài điều cần nhớ. Mặt trước kín chữ, mặt sau vẫn trắng. Tôi lật lại, nhưng chữ bên kia hiện mờ dưới ánh sáng. Viết tiếp thì tiết kiệm giấy; lấy tờ khác dễ đọc hơn. Tôi đặt hai tờ cạnh nhau để chọn.', 'Dùng mặt sau', 'Tôi ghi vào mặt sau, không phải lấy giấy mới. Khi đọc lại, tôi xoay nhầm sang mặt cũ một lần rồi mới tìm đúng dòng vừa viết.', { intelligence: 2 }, 'Lấy tờ giấy mới', 'Tôi dùng tờ mới và đọc lại dễ hơn. Tờ cũ được gấp để riêng, lần sau có thể dùng cho những ghi chú không cần giữ lâu.', { happiness: 1 }],
  ['Cốc nước và chỗ đặt', 'Tôi đặt cốc nước cạnh chỗ ngồi rồi nhận ra mỗi lần lấy đồ đều phải đưa tay qua nó. Cốc chưa đổ, nhưng tôi đã chạm phải một lần. Đổi chỗ cốc thì phải dọn vài món; giữ nguyên thì tiện uống hơn. Tôi ngồi xuống xem nên sắp xếp thế nào.', 'Dọn chỗ cho cốc', 'Tôi dời mấy món và đặt cốc sang bên. Lúc cần uống lại đưa tay tới chỗ cũ, chạm đúng khoảng trống vừa dọn. Tôi phải sửa cả thói quen của mình.', { intelligence: 2 }, 'Cất đồ hay dùng ra trước', 'Tôi giữ cốc tại chỗ, lấy sẵn những món cần dùng. Không phải với qua cốc nữa, nhưng bàn hơi chật. Tôi dùng xong món nào cất món đó.', { happiness: 2 }],
  ['Một chỗ ngồi yên tĩnh', 'Tôi có một khoảng nghỉ và tìm chỗ ngồi. Ghế gần cửa thoáng nhưng người đi qua khá đông; phía trong yên hơn, phải đi thêm một đoạn. Tôi nhìn hai phía, chưa ngồi xuống ngay. Không có việc gấp, chỉ muốn nghỉ một lúc mà không phải đứng dậy nhường đường liên tục.', 'Ngồi phía trong', 'Tôi đi vào chỗ yên hơn, nghỉ được một lúc thoải mái. Tới khi định đứng dậy, tôi nhận ra mình đã ngồi lâu hơn dự tính và từ từ thu dọn.', { health: 2 }, 'Ngồi gần cửa', 'Tôi ngồi gần cửa, ngắm người qua lại cho vui. Có người hỏi chỗ bên cạnh còn trống không, tôi dịch sang một chút. Khoảng nghỉ có thêm một cuộc trò chuyện ngắn.', { happiness: 2 }],
  ['Một câu chưa hỏi', 'Tôi nghe một người nói tới chuyện mình chưa rõ. Mọi người vẫn trò chuyện, có vẻ ai cũng hiểu, nên tôi hơi ngại hỏi. Tôi nhớ được vài ý nhưng chưa nối chúng lại. Có thể hỏi ngay để khỏi đoán, hoặc ghi lại rồi tìm hiểu sau, khi không còn đông người như lúc này.', 'Hỏi ngay điều chưa rõ', 'Tôi hỏi ngắn gọn, người kia giải thích lại bằng một ví dụ. Một người bên cạnh cũng nói chưa hiểu đoạn ấy. Tôi thấy nhẹ nhõm vì không phải chỉ mình cần hỏi.', { intelligence: 3, happiness: 1 }, 'Ghi lại để tìm hiểu', 'Tôi ghi vài từ để tìm hiểu sau, giữ được nhịp trò chuyện. Lúc đọc lại mới thấy mình ghi thiếu một ý; tôi phải hỏi lại người kia bằng tin nhắn.', { intelligence: 2 }],
  ['Đồ cũ còn dùng được', 'Tôi tìm thấy một món đồ cũ khi sắp xếp lại góc để đồ. Nó vẫn dùng được, chỉ hơi bụi. Tôi đã quên nó ở đây nên gần đây cứ tìm món thay thế. Giữ lại thì cần lau và tìm chỗ dễ thấy hơn; cất tiếp thì góc này gọn nhanh nhưng có thể lại quên.', 'Lau rồi dùng lại', 'Tôi lau món đồ, thử thấy vẫn dùng được. Tôi đặt nó ở chỗ dễ nhìn, thấy vui vì chưa phải tìm món khác. Lần này tôi nhớ cả chỗ cất.', { happiness: 2, intelligence: 1 }, 'Ghi nhãn rồi cất', 'Tôi ghi rõ bên ngoài hộp và cất lại. Góc để đồ gọn hơn, nhưng tôi vẫn chưa dùng món ấy hôm nay. Ít nhất lần sau không cần mở cả đống hộp để tìm.', { intelligence: 2 }],
];

const childhoodAlternatives = [
  ['Đồ chơi kêu đúng lúc', 'Tôi đang ngồi trên thảm, người chăm sóc đặt cạnh tôi một món đồ chơi kêu chíp. Tôi chạm thử, nó kêu lên làm người ấy quay lại. Khi người ấy vừa quay đi, tôi lại chạm thêm lần nữa. Món đồ chơi khá nhỏ, nhưng đang gọi người lớn giỏi hơn tôi.', 'Chạm đồ chơi thêm lần nữa', 'Tôi thử chạm ở vài chỗ khác nhau, tìm được chỗ làm nó kêu. Người chăm sóc quay lại, ngồi xuống chơi cùng; tiếng chíp vẫn đều đặn vang lên.', { intelligence: 2, happiness: 1 }, 'Đưa đồ chơi nhờ làm mẫu', 'Tôi chìa đồ chơi, người chăm sóc bóp giúp rồi đưa lại. Tôi thử theo, bật cười khi nghe tiếng kêu. Người ấy chưa kịp đứng lên, tôi đã chìa ra lần nữa.', { happiness: 3 }],
  ['Khối gỗ không chịu đứng', 'Tôi có mấy khối gỗ trên thảm, muốn đặt chúng lên nhau. Mỗi lần thêm một khối, cả chồng nghiêng rồi đổ. Người lớn ngồi cạnh đưa tôi khối to hơn, bảo thử đặt bên dưới. Tôi còn thích khối nhỏ đang cầm, nên chưa quyết định đổi ngay sang khối khác.', 'Đổi khối to xuống dưới', 'Tôi đổi khối to xuống dưới, chồng gỗ đứng được lâu hơn. Khi nó vẫn đổ, tôi lấy lại từng khối để thử tiếp, không phải tìm đồ chơi khác.', { intelligence: 3 }, 'Nhờ người lớn giữ hộ', 'Người lớn giữ một bên, tôi xếp thêm cho cao rồi vỗ tay. Vừa rút tay ra, chồng gỗ lại đổ. Tôi kéo bàn tay ấy về chỗ cũ.', { happiness: 3 }],
  ['Bức tranh có con mèo', 'Tôi xem một tấm tranh có mèo, xe và quả bóng cùng người chăm sóc. Người ấy chỉ từng hình rồi đọc tên. Tôi thích tiếng mèo kêu nên cứ chỉ lại hình mèo. Đọc tới quả bóng, người ấy chờ tôi nhìn; tôi vẫn chưa muốn bỏ qua con vật mình vừa tìm được.', 'Chỉ sang hình mới', 'Tôi nhìn thêm xe và bóng, tập nhận những hình khác nhau. Người chăm sóc đọc lại tên. Tới hình mèo, tôi chỉ ngay, lần này không cần chờ được nhắc.', { intelligence: 2 }, 'Chỉ mèo, nhờ kêu lại', 'Tôi chỉ mèo để người chăm sóc kêu thêm. Người ấy kêu nhỏ, tôi lại chỉ. Cuối cùng tiếng mèo to dần, có người ở gần tưởng trong phòng có mèo thật.', { happiness: 3 }],
  ['Ngủ tới lượt mình', 'Tới giờ nghỉ, người chăm sóc đặt chiếc gối cạnh tôi, hát một đoạn ngắn. Tôi ôm gối nghe, mắt nhắm dần. Người ấy định dừng thì tôi mở mắt, nên lại hát tiếp. Chưa hết lần hát thứ hai, tôi ngủ ngon; người lớn vẫn hát thêm một câu để chắc tôi đã ngủ thật.', 'Ôm gối ngủ', 'Tôi ngủ một giấc ngon, dậy thoải mái hơn. Người chăm sóc ngồi cạnh nhắc tôi đã ngủ được lâu, tôi nhìn chiếc gối rồi còn muốn ôm thêm.', { health: 2 }, 'Nghỉ yên một lúc', 'Tôi nằm nghỉ trên gối, được người chăm sóc ở cạnh. Không phải chơi tiếp ngay, tôi thoải mái nhìn quanh trước khi ngồi dậy tìm món đồ quen.', { happiness: 2 }],
  ['Thìa đã tới, miệng chưa mở', 'Người chăm sóc đưa tới một thìa thức ăn mềm. Tôi nhìn kỹ rồi mới mở miệng. Người ấy cũng mở miệng theo để dỗ; tôi quay sang nhìn mặt người ấy, quên luôn thìa trước mắt. Khi tôi chịu ăn, người lớn mừng quá ăn theo động tác một lần nữa, dù thìa không tới lượt mình.', 'Thử một thìa', 'Tôi thử thức ăn, làm quen với vị mới trong lúc người chăm sóc ở cạnh. Người ấy chờ tôi nuốt xong mới đưa thêm, không cần vội ăn hết.', { health: 2 }, 'Đợi quen rồi ăn', 'Người chăm sóc cho tôi nhìn chiếc thìa thêm một lúc rồi mới thử lại. Tôi ăn chậm hơn, nhưng không bị thúc giục và vẫn có người kiên nhẫn ngồi cạnh.', { happiness: 2 }],
];

// Keep the source scene and its payoff; never pad stories to a word quota.
function concise(text) {
  return firstPerson(text);
}
function requirements(text, age) {
  const required = [];
  if (/đồng nghiệp|công việc|công ty|tăng ca|lương về|đi làm|nơi làm|văn phòng|dự án nhóm cuối học phần/iu.test(text) && age >= 22) required.push('employed');
  if (/chuyên ngành|học phần|giảng viên|sinh viên|câu lạc bộ trường/iu.test(text) && age >= 18) required.push('student');
  if (/người yêu|bạn đời|người thương|vợ|chồng/iu.test(text)) required.push('partner');
  if (/con tôi|con của tôi|con nhỏ|con cái/iu.test(text)) required.push('children');
  if (/(?<!\p{L})(ba|bố)(?!\p{L})/iu.test(text)) required.push('father');
  if (/(?<!\p{L})mẹ(?!\p{L})/iu.test(text)) required.push('mother');
  if (/ông bà|bà nội|bà ngoại|ông nội|ông ngoại|cháu nội|cháu ngoại|con cháu/iu.test(text)) required.push('extendedFamily');
  if (/xe máy|xe đạp|xe mình|xe tôi|vị trí xe|gửi xe|đạp xe/iu.test(text)) required.push('vehicle');
  if (/phòng trọ|tiền trọ/iu.test(text)) required.push('rental');
  if (/đi bộ|chạy bộ|leo dốc|đạp xe|thể dục|vận động|dã ngoại/iu.test(text) && age >= 50) required.push('mobile');
  return [...new Set(required)];
}
function fallback(age, slot) {
  const bank = age <= 5 ? childhoodAlternatives : additions;
  const [title, text, labelA, textA, effectsA, labelB, textB, effectsB] = bank[slot];
  return { id: `vietnam-${age}-${slot + 1}`, title, text, choices: [
    { label: labelA, title, text: textA, effects: effectsA },
    { label: labelB, title, text: textB, effects: effectsB },
  ] };
}
function polish(source, age, slot, fallbackOnly = false) {
  const title = clean(source.title || `Chuyện tuổi ${age}`);
  const raw = firstPerson(source.text);
  const required = fallbackOnly ? [] : requirements([raw, ...source.choices.map(c => c.text)].join(' '), age);
  const text = concise(raw);
  let choices = source.choices.slice(0, 3).map((choice, index) => ({
    label: /^Tôi /u.test(firstPerson(choice.label)) ? firstPerson(choice.label) : `Tôi ${firstPerson(choice.label).replace(/^\p{Lu}/u, char => char.toLocaleLowerCase('vi-VN'))}`,
    title,
    text: concise(choice.text),
    effects: { ...choice.effects },
    ...(choice.money ? { money: choice.money } : {}),
    achievementIds: choice.achievementIds ?? [],
  }));
  if (choices.length < 2) choices = fallback(age, slot).choices.map(c => ({ ...c, text: concise(c.text) }));
  // Comparable actions with identical rewards now have distinct, modest tradeoffs.
  if (JSON.stringify(choices[0].effects) === JSON.stringify(choices[1].effects) && choices[0].money === choices[1].money) {
    choices[1].effects = { happiness: 1 + slot % 2 };
    if (JSON.stringify(choices[0].effects) === JSON.stringify(choices[1].effects)) choices[1].effects = { intelligence: 1 };
  }
  const passive = slot >= 3;
  const selected = choices[(age + slot) % choices.length];
  const originalOutcome = firstPerson(source.choices[(age + slot) % source.choices.length]?.text || selected.text);
  // Automatic scenes need context and a payoff, not the unused decision prompt.
  const opening = raw.match(/^.*?[.!?](?:[”"])?(?=\s|$)/u)?.[0] || raw;
  const passiveText = passive ? concise(`${opening} ${originalOutcome}`) : null;
  const expression = content => /cười|buồn cười/iu.test(content) ? '😂' : /buồn|mệt|ngại|tiếc|khó chịu/iu.test(content) ? '😅' : '🙂';
  choices = choices.map(choice => ({ ...choice, text: `${choice.text} ${expression(choice.text)}` }));
  const minMoney = Math.max(0, ...choices.map(c => -(c.money ?? 0)));
  return {
    id: source.id || `vietnam-${age}-${slot + 1}`,
    age, title, text: passive ? `${passiveText} ${expression(passiveText)}` : `${text} ${expression(text)}`,
    mode: passive ? 'automatic' : 'choice',
    conditions: { age, alive: true, required, minimumMoney: minMoney },
    conditionText: `Tuổi ${age}; còn sống${required.length ? '; ' + required.join(', ') : ''}${minMoney ? `; có ít nhất ${minMoney.toLocaleString('vi-VN')} VNĐ` : ''}.`,
    choices: passive ? [{ ...selected, label: 'Đồng ý', text: `${passiveText} ${expression(passiveText)}` }] : choices,
  };
}

const excludedAges = new Set([15, 16, 22, 24, 25, 105]);

const catalog = {}, backups = {};
for (let age = 1; age <= 105; age++) {
  if (excludedAges.has(age)) continue;
  const source = [...(getBaseAgeEvents(age, undefined, {}) ?? []), ...createEverydayAdditions(age)]
    .filter(event => !isPriorityEvent(event) && !event.specialId && event.choices?.length >= 2)
    .map(event => enrichEverydayRewards({ ...event, category: 'everyday' }, age));
  catalog[age] = Array.from({ length: 5 }, (_, slot) => polish(source[slot] ?? fallback(age, slot), age, slot));
  backups[age] = Array.from({ length: 5 }, (_, slot) => polish(fallback(age, slot), age, slot, true));
}
const output = `// Concise game-source scenes without word-count padding.\n// Rebuild with scripts/build-vietnam-story-catalog.mjs.\nexport const vietnamStories = ${JSON.stringify(catalog, null, 2)};\nexport const vietnamStoryFallbacks = ${JSON.stringify(backups, null, 2)};\n`;
fs.writeFileSync(new URL('../js/vietnam-story-data.js', import.meta.url), output);
console.log(`Built ${Object.values(catalog).flat().length} scenes and condition-safe alternatives.`);
