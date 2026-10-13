import { openMojiArt } from '../media/event-art.js';
import { getDatingPartners, selectDatingPartnerUpdates, removeDatingPartnerUpdates } from './concurrent-dating.js';

const art = () => openMojiArt('1F494', 'Cuộc đối chất tình cảm');
const line = (speaker, text, role = 'partner') => ({ speaker, text, role });
const reply = (label, response, nextStep) => ({ label, response, nextStep });

// Dialogue state is serializable. Choices before the ending never mutate the player.
export function createDatingDramaStep(player, age, step = 1, saved = {}) {
  const people = saved.people ?? getDatingPartners(player).map(person => ({
    id: person.id, name: person.name, relationship: person.relationship ?? 80,
  }));
  if (people.length !== 2) return null;
  const [a, b] = people;
  const drama = { ...saved, people, step, replies: [...(saved.replies ?? [])] };
  const event = { id: `dating-discovery-${age}-${step}`, age, kind: 'dating-discovery', category: 'love',
    priority: true, datingDrama: drama, ...art() };
  if (step === 1) return { ...event, title: 'Chiếc ghế thứ ba',
    text: `Tôi đến quán theo lời hẹn của ${a.name}. ${b.name} đã ngồi ở đó. Trên bàn là hai chiếc điện thoại, cùng mở một đoạn tin nhắn của tôi. Chiếc ghế còn lại được kéo ra, nhưng không ai mời tôi ngồi.`,
    dialogueLines: [
      line(a.name, 'Tối thứ bảy, bạn nói phải về thăm nhà. Vậy người ngồi cạnh bạn trong tấm ảnh này là ai?'),
      line(b.name, `Đừng bảo ${a.name} chỉ là bạn. Bạn cũng từng nói với tôi: “Mình chỉ có nhau thôi.”`),
      line(a.name, 'Hôm nay nói hết ở đây. Đừng để chúng tôi phải tự ghép thêm một câu chuyện nữa.'),
    ], choices: [
      reply('“Đúng. Tôi đang quen cả hai. Tôi đã giấu chuyện đó.”', 'honest', 2),
      reply('“Hai người hiểu nhầm rồi. Chúng tôi chỉ là bạn.”', 'deny', 2),
      reply('“Hai người kiểm tra điện thoại của tôi để làm gì?”', 'attack', 2),
    ] };
  if (step === 2) {
    const first = drama.replies[0];
    const denial = first === 'deny';
    return { ...event, title: denial ? 'Dấu thời gian không biết nói dối' : first === 'attack' ? 'Một câu hỏi bị trả ngược' : 'Lời xin lỗi chưa đủ',
      text: denial ? `${b.name} phóng to ảnh chụp màn hình. Ngày, giờ và những lời tôi từng viết hiện lên rất rõ. ${a.name} đặt chiếc điện thoại xuống, nhẹ đến mức tôi nghe được tiếng quạt trên trần.`
        : first === 'attack' ? `${a.name} đẩy chiếc điện thoại về phía tôi. ${b.name} không nhìn màn hình nữa, chỉ nhìn thẳng vào mặt tôi.`
          : `Tôi kéo ghế ngồi xuống. ${a.name} dịch chiếc cốc ra xa. Lời thú nhận khiến căn bàn yên đi, nhưng không làm khoảng cách giữa chúng tôi ngắn lại.`,
      dialogueLines: denial ? [
        line(b.name, '“Anh nhớ em”, “Chỉ có em thôi”. Bạn thường nhắn thế với bạn bè à?'),
        line(a.name, 'Chúng tôi hỏi vì muốn nghe bạn nói thật. Bạn lại chọn để bằng chứng nói thay.'),
      ] : first === 'attack' ? [
        line(a.name, 'Tôi hỏi về việc bạn nói dối. Bạn trả lời bằng cách trách tôi phát hiện ra nó?'),
        line(b.name, 'Đây là cuộc nói chuyện, không phải phiên tòa để bạn tìm người đổ lỗi.'),
      ] : [
        line(a.name, 'Tôi cần biết bạn xin lỗi vì đã làm tổn thương chúng tôi, hay vì bị phát hiện.'),
        line(b.name, 'Trong những cuộc hẹn đó, có lần nào bạn định tự nói ra không?'),
      ], choices: denial ? [
        reply('“Tôi vừa nói dối thêm. Tôi xin nhận hết trách nhiệm.”', 'own', 3),
        reply('“Ảnh chụp tin nhắn không nói lên tất cả.”', 'double-down', 3),
        reply('“Tôi chỉ chưa biết phải chọn ai, đừng ép tôi.”', 'excuse', 3),
      ] : [
        reply('“Hai người không có lỗi. Tôi đã làm sai, không có lý do để bào chữa.”', 'own', 3),
        reply('“Tôi có tình cảm với cả hai, như vậy cũng là sai sao?”', 'excuse', 3),
        reply('“Nếu được quan tâm đủ, tôi đã không tìm người khác.”', 'blame', 3),
      ] };
  }
  if (step === 3) {
    const harsh = ['double-down', 'blame'].includes(drama.replies[1]);
    return { ...event, title: 'Đừng gọi đó là một cuộc thi',
      text: `${a.name} đứng dậy một thoáng rồi ngồi lại. ${b.name} gỡ tay khỏi mép bàn. Cả hai chờ tôi nói, nhưng lần này tôi hiểu: lời mình nói không quyết định thay cho họ.`,
      dialogueLines: [
        line(a.name, harsh ? 'Bạn vừa làm tổn thương chúng tôi, rồi còn muốn chúng tôi nhận lỗi thay. Tôi không muốn nghe lời hứa nữa.'
          : 'Nếu tiếp tục, tôi cần một mối quan hệ rõ ràng. Nhưng đừng nghĩ bạn chọn tôi thì tôi bắt buộc phải ở lại.'),
        line(b.name, 'Chúng tôi không phải hai phương án để bạn giữ dự phòng. Bạn muốn gì thì nói, chúng tôi cũng sẽ tự quyết định.'),
      ], choices: [
        reply(`“Tôi muốn tiếp tục với ${a.name}. Tôi sẽ kết thúc với ${b.name}.”`, `choose:${a.id}`, 4),
        reply(`“Tôi muốn tiếp tục với ${b.name}. Tôi sẽ kết thúc với ${a.name}.”`, `choose:${b.id}`, 4),
        reply('“Tôi không thể giữ cả hai bằng những lời hứa nữa. Tôi xin dừng lại.”', 'leave', 4),
        reply('“Tôi không muốn mất ai. Chúng ta cứ tiếp tục như trước được không?”', 'keep-both', 4),
      ] };
  }
  if (step !== 4) return null;
  const wanted = drama.replies[2]?.startsWith('choose:') ? drama.replies[2].slice(7) : null;
  const person = people.find(item => item.id === wanted);
  const admitted = drama.replies[1] === 'own';
  const honest = drama.replies[0] === 'honest';
  const loss = honest && admitted ? 20 : 35;
  // A partner may refuse. Truth after another lie requires more existing trust.
  const accepted = person && admitted && drama.replies[0] !== 'attack' &&
    person.relationship >= (honest ? 70 : 90);
  const keepId = accepted ? wanted : null;
  const hurt = accepted ? 5 : drama.replies[2] === 'leave' ? 10 : 15;
  const history = [...(player.relationshipHistory ?? []),
    { age, type: 'discovery', text: `${a.name} và ${b.name} đối chất với tôi về việc hẹn hò cả hai. ${honest ? 'Tôi thú nhận ngay.' : 'Cách tôi đối đáp khiến lòng tin bị tổn thương thêm.'}` },
    ...people.filter(item => item.id !== keepId).map(item => ({ age, type: 'breakup', person: getDatingPartners(player).find(current => current.id === item.id) ?? item,
      text: `${item.name} và tôi kết thúc mối quan hệ sau cuộc đối chất.` }))];
  const selected = keepId ? selectDatingPartnerUpdates(player, keepId) : {};
  const updates = keepId ? { ...selected,
    partner: { ...selected.partner, relationship: Math.max(0, person.relationship - loss) }, otherPartners: [] }
    : { ...removeDatingPartnerUpdates({ ...player, otherPartners: [] }, player.partner?.id), otherPartners: [], datingActivitiesOnly: true };
  const outcome = accepted ? `Tôi và ${person.name} tiếp tục, nhưng không thể coi như chưa có chuyện gì. Quan hệ -${loss}%.`
    : drama.replies[2] === 'leave' ? 'Tôi chia tay cả hai. Những cuộc hẹn khép lại, còn trách nhiệm về cách mình đã cư xử thì không.'
      : 'Cả hai quyết định rời đi. Tôi không còn người yêu; lần này không có một người nào để giữ làm phương án còn lại.';
  const dialogueLines = accepted ? [
    line(person.name, 'Tôi chưa tha thứ. Tôi chỉ đồng ý thử thêm một lần. Đừng dùng lời hứa để thay cho việc làm.'),
    line(people.find(item => item.id !== keepId).name, 'Tôi nghe đủ rồi. Đừng nhắn rằng bạn vẫn nhớ tôi sau khi bước ra khỏi đây.'),
    line(player.name || 'Tôi', 'Tôi hiểu. Tôi sẽ tôn trọng quyết định đó.', 'player'),
  ] : drama.replies[2] === 'leave' ? [
    line(a.name, 'Ít nhất hôm nay bạn đã ngừng hứa những điều mình không làm được.'),
    line(b.name, 'Tôi không muốn giữ liên lạc. Bạn hãy tôn trọng điều đó.'),
  ] : [
    line(a.name, 'Tôi không muốn là người được chọn sau khi bạn bị phát hiện. Tôi chọn rời đi.'),
    line(b.name, drama.replies[2] === 'keep-both' ? 'Bạn vẫn muốn giữ mọi thứ như cũ. Nhưng chúng tôi không còn muốn ở trong câu chuyện đó nữa.'
      : 'Một lời thú nhận không xóa được những lần nói dối. Tôi cũng dừng ở đây.'),
  ];
  return { ...event, title: accepted ? 'Một cơ hội có điều kiện' : 'Hai chiếc ghế trống',
    text: accepted ? `${person.name} im lặng rất lâu trước khi trả lời. Người còn lại cầm điện thoại lên, không mở màn hình.`
      : 'Tiếng ghế kéo trên nền gạch vang lên. Tôi nhìn hai chiếc cốc còn nguyên, lần đầu không tìm được một câu để níu lại.',
    dialogueLines, choices: [{ label: accepted ? 'Tôn trọng ranh giới, bắt đầu xây dựng lại lòng tin' : 'Chấp nhận quyết định của cả hai',
      title: accepted ? 'Lòng tin cần được xây lại' : 'Cuộc đối chất khép lại', text: outcome,
      effects: { happiness: -hurt }, playerUpdates: { ...updates, concurrentDatingLastEventAge: age,
        relationshipHistory: history }, confirmText: 'Khép lại cuộc nói chuyện', ...art() }] };
}
