import { getChildAge } from './family.js';
import { applyActivityGain } from '../core/stat-budget.js';
import { isInPrison } from '../events/crime.js';

export function getChildActions(player, child) {
  const age = getChildAge(child, player.age);
  return {
    talk: { label: age < 3 ? '🤗 Ôm ấp, vỗ về con' : '💬 Trò chuyện, lắng nghe con', cost: 0, bond: 4, happiness: 1,
      text: age < 3 ? `Tôi ôm ấp và vỗ về ${child.name}, đáp lại từng tiếng bi bô của con.` : `Tôi lắng nghe ${child.name} kể chuyện và chia sẻ những điều con đang lo nghĩ.` },
    together: { label: age < 6 ? '🧸 Chơi cùng con' : age < 18 ? '🌳 Đi chơi cùng con' : '🍲 Ăn cơm cùng con', cost: age < 6 ? 0 : 200_000, bond: 5, happiness: 2,
      text: age < 6 ? `Tôi dành thời gian chơi cùng ${child.name}.` : age < 18 ? `Tôi và ${child.name} cùng đi chơi, có thêm một kỷ niệm vui.` : `Tôi và ${child.name} cùng ăn cơm, hỏi han cuộc sống của nhau.` },
    ...(age >= 6 && age < 18 ? { study: { label: '📚 Đồng hành việc học', cost: 0, bond: 3, happiness: 1,
      text: `Tôi cùng ${child.name} tìm cách giải bài khó, động viên con thay vì chỉ hỏi điểm số.` } } : {}),
    gift: { label: age < 6 ? '🎁 Tặng đồ chơi cho con' : age < 18 ? '🎁 Tặng sách, quà cho con' : '🎁 Tặng quà cho con', cost: 500_000, bond: 3, happiness: 1,
      text: `Tôi chọn một món quà phù hợp với sở thích của ${child.name}.` },
  };
}

export function getChildActionBlock(player, child, type) {
  const action = getChildActions(player, child)[type];
  if (!action) return 'Hoạt động chưa phù hợp với tuổi của con.';
  if (player.isAlive === false) return 'Cuộc đời đã kết thúc.';
  if (child.alive === false || child.isAlive === false) return 'Con đã qua đời.';
  if (child.actions?.[type] === player.age) return 'Đã làm năm nay.';
  if (isInPrison(player) && (type !== 'talk' || getChildAge(child, player.age) < 3)) return 'Không thể thực hiện khi đang ở tù.';
  if (action.cost > 0 && !(player.money >= action.cost)) return 'Chưa đủ tiền cho hoạt động này.';
  return '';
}

export function interactWithChild(player, id, type) {
  const child = (player.children ?? []).find(entry => entry.id === id);
  if (!child || getChildActionBlock(player, child, type)) return null;
  const action = getChildActions(player, child)[type];
  const previous = Number.isFinite(child.relationship) ? child.relationship : Number.isFinite(child.bond) ? child.bond : 80;
  const bond = Math.max(0, Math.min(100, previous));
  const relationship = Math.min(100, bond + action.bond);
  player.money = (player.money ?? 0) - action.cost;
  const happiness = applyActivityGain(player, 'happiness', action.happiness);
  const text = `${action.text} Gắn kết +${relationship - bond}%${happiness ? ` · Hạnh phúc +${happiness}` : ''}${action.cost ? ` · Chi phí ${action.cost.toLocaleString('vi-VN')} VNĐ` : ''}.`;
  const memory = { age: player.age, text };
  player.children = player.children.map(entry => entry.id === id ? { ...entry, relationship,
    actions: { ...entry.actions, [type]: player.age },
    memories: [...(entry.memories ?? []), memory].slice(-12) } : entry);
  return { age: player.age, content: text, summary: text };
}
