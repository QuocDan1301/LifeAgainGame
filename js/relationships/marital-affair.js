import { createAdmirer, getBreakupUpdates } from './relationships.js';
import { DATING_DISCOVERY_CHANCE } from './concurrent-dating.js';

export const AFFAIR_OPPORTUNITY_CHANCE = 0.15;
const art = { image: 'js/img/events/openmoji/1F494.svg', imageAlt: 'Lòng tin trong hôn nhân' };
const history = (player, age, type, text, person) => [
  ...(player.relationshipHistory ?? []), { age, type, text, ...(person ? { person } : {}) },
];

export function getActiveAffair(player) {
  return player.partner && player.marriedAtAge != null &&
    player.affair?.spouseId === player.partner.id ? player.affair : null;
}

function divorceUpdates(player, age, text) {
  const updates = getBreakupUpdates({ ...player, age });
  return { ...updates, affair: null, affairLastEventAge: age,
    relationshipHistory: [...(updates.relationshipHistory ?? []).slice(0, -1),
      { age, type: 'divorced', person: player.partner, text }] };
}

export function createMaritalAffairEvent(player, age, random = Math.random) {
  if (player.isAlive === false || age < 18 || !player.partner || player.marriedAtAge == null ||
      player.partner.isAlive === false || player.partner.deceased === true ||
      player.partner.stats?.health === 0 || player.affairLastEventAge >= age ||
      (player.prison && player.prison.releaseAge > age)) return null;
  const spouse = player.partner;
  const affair = getActiveAffair(player);
  const opportunities = player.affairOpportunityCount ?? Math.max(
    Number.isInteger(player.affairLastEventAge) ? 1 : 0,
    (player.relationshipHistory ?? []).filter(entry => entry.type === 'affair').length,
  );
  const event = { id: `marital-affair-${age}`, kind: 'marital-affair', category: 'love',
    age, priority: true, ...art };
  const choice = (label, title, text, effects, playerUpdates) => ({
    label, title, text, effects, playerUpdates: { ...playerUpdates, affairLastEventAge: age,
      ...(!affair ? { affairOpportunityCount: opportunities + 1 } : {}) }, ...art,
  });
  if (!affair) {
    if (opportunities >= 2 || age <= player.marriedAtAge || random() >= AFFAIR_OPPORTUNITY_CHANCE) return null;
    const person = createAdmirer(player, age, random);
    return { ...event, title: 'Một lời hẹn riêng',
      text: `${person.name}, người tôi quen ở ${person.workplace}, thường tìm tôi tâm sự. Hôm nay người ấy nói có tình cảm với tôi và muốn gặp riêng. Tôi biết mình đang có gia đình với ${spouse.name}.`,
      choices: [
        choice('Từ chối, giữ ranh giới', 'Giữ lời cam kết', 'Tôi nói rõ mình đã kết hôn và dừng những cuộc trò chuyện riêng tư.', { happiness: 1 }, { affair: null }),
        choice('Bắt đầu quan hệ bí mật', 'Một bí mật trong hôn nhân',
          `Tôi bắt đầu qua lại với ${person.name}, giấu ${spouse.name}. Từ năm sau, mỗi lần xét có 50% nguy cơ bị phát hiện.`, { happiness: 4 },
          { affair: { person, spouseId: spouse.id, startedAtAge: age },
            relationshipHistory: history(player, age, 'affair', `Tôi bắt đầu quan hệ bí mật với ${person.name} khi vẫn đang kết hôn với ${spouse.name}.`, person) }),
      ] };
  }
  if (age <= affair.startedAtAge) return null;
  const name = affair.person.name;
  if (random() >= DATING_DISCOVERY_CHANCE) return { ...event, title: 'Bí mật vẫn còn đó',
    text: `${spouse.name} chưa phát hiện chuyện tôi và ${name}. Mỗi lần giấu một cuộc hẹn, tôi lại phải tìm thêm một lời giải thích.`,
    choices: [
      choice('Chấm dứt quan hệ bí mật', 'Dừng lại', `Tôi kết thúc với ${name}. Việc dừng lại không xóa những gì tôi đã giấu bạn đời.`, { happiness: -3 },
        { affair: null, relationshipHistory: history(player, age, 'affair-ended', `Tôi chấm dứt quan hệ bí mật với ${name}.`, affair.person) }),
      choice('Tiếp tục giấu giếm', 'Thêm một năm che giấu', 'Tôi tiếp tục mối quan hệ bí mật. Nguy cơ bị phát hiện vẫn là 50% trong lần xét năm sau.', { happiness: -2 },
        { partner: { ...spouse, relationship: Math.max(0, (spouse.relationship ?? 80) - 5) } }),
    ] };
  const bond = spouse.relationship ?? 80;
  const canReconcile = bond >= 70;
  const discovery = `Tôi bị ${spouse.name} phát hiện quan hệ bí mật với ${name}.`;
  const divorce = `${spouse.name} và tôi ly hôn sau khi chuyện ngoại tình bị phát hiện. Con cái và trách nhiệm nuôi con vẫn tiếp tục.`;
  return { ...event, title: 'Tin nhắn không thể giấu',
    text: `${spouse.name} đã đọc được những tin nhắn giữa tôi và ${name}. Người ấy yêu cầu tôi nói thật và quyết định tương lai cuộc hôn nhân.`,
    choices: [
      choice('Nhận trách nhiệm, chấm dứt với người thứ ba và xin hàn gắn',
        canReconcile ? 'Một cơ hội để xây lại lòng tin' : 'Lời xin lỗi không giữ được hôn nhân',
        canReconcile ? `${spouse.name} đồng ý thử hàn gắn. Tôi kết thúc với ${name}; quan hệ vợ chồng giảm 35 điểm. Lòng tin cần thời gian để xây lại.`
          : `${spouse.name} không đồng ý tiếp tục. ${divorce}`, { happiness: canReconcile ? -12 : -5 },
        canReconcile ? { affair: null, partnerPromise: null,
          partner: { ...spouse, relationship: Math.max(0, bond - 35) },
          relationshipHistory: history(player, age, 'affair-discovered', `${discovery} Tôi nhận trách nhiệm và được đồng ý thử hàn gắn.`, affair.person) }
          : divorceUpdates(player, age, `${discovery} ${divorce}`)),
      choice('Tiếp tục chối bỏ', 'Lòng tin đổ vỡ', `${spouse.name} quyết định rời đi. ${divorce}`, { happiness: -8 },
        divorceUpdates(player, age, `${discovery} Tôi tiếp tục chối bỏ. ${divorce}`)),
      choice('Đồng ý ly hôn', 'Kết thúc hôn nhân', `Tôi chấp nhận ly hôn và chấm dứt quan hệ bí mật với ${name}. ${divorce}`, { happiness: -5 },
        divorceUpdates(player, age, `${discovery} Tôi đồng ý kết thúc hôn nhân.`)),
    ] };
}
