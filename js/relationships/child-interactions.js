import { getChildAge } from './family.js';
import { applyActivityGain } from '../core/stat-budget.js';
import { isInPrison } from '../events/crime.js';
import { createChildConversation, rememberChildConversation, CHILD_CONVERSATION_MIN_AGE } from './child-conversations.js';

export function getChildActions(player, child) {
  const age = getChildAge(child, player.age);
  return {
    talk: { label: age < 3 ? '🤗 Ôm ấp, vỗ về con' : '💬 Trò chuyện, lắng nghe con', cost: 0, bond: 4, happiness: 1,
      conversation: age >= CHILD_CONVERSATION_MIN_AGE,
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

// A conversation answer comes from the dialog: it must match this year's scene for this child.
export function interactWithChild(player, id, type, conversationAnswer = null) {
  const child = (player.children ?? []).find(entry => entry.id === id);
  if (!child || getChildActionBlock(player, child, type)) return null;
  const action = getChildActions(player, child)[type];
  let conversation = null;
  if (conversationAnswer) {
    if (type !== 'talk' || conversationAnswer.age !== player.age) return null;
    const scene = createChildConversation(player, child);
    if (!scene || scene.id !== conversationAnswer.sceneId) return null;
    conversation = rememberChildConversation(child, scene, conversationAnswer.choiceId);
    if (!conversation) return null;
  }
  const previous = Number.isFinite(child.relationship) ? child.relationship : Number.isFinite(child.bond) ? child.bond : 80;
  const bond = Math.max(0, Math.min(100, previous));
  const relationship = Math.max(0, Math.min(100, bond + action.bond + (conversation?.choice.bond ?? 0)));
  player.money = (player.money ?? 0) - action.cost;
  const mood = action.happiness + (conversation?.choice.happiness ?? 0);
  let happiness = 0;
  if (mood > 0) happiness = applyActivityGain(player, 'happiness', mood);
  else if (mood < 0) {
    const before = player.happiness ?? 0;
    player.happiness = Math.max(0, before + mood);
    happiness = player.happiness - before;
  }
  const gain = relationship - bond;
  const story = conversation ? `${action.text} Tôi chọn: “${conversation.choice.label}”. ${conversation.choice.reply}` : action.text;
  const text = `${story} Gắn kết ${gain >= 0 ? '+' : ''}${gain}%${happiness ? ` · Hạnh phúc ${happiness > 0 ? '+' : ''}${happiness}` : ''}${action.cost ? ` · Chi phí ${action.cost.toLocaleString('vi-VN')} VNĐ` : ''}.`;
  const memory = { age: player.age, text: conversation ? `${conversation.choice.memory} ${conversation.choice.reply}` : text };
  player.children = player.children.map(entry => entry.id === id ? { ...entry, relationship,
    actions: { ...entry.actions, [type]: player.age },
    memories: [...(entry.memories ?? []), memory].slice(-12),
    ...(conversation ? { conversationMemories: conversation.memories } : {}),
    // Mầm ước mơ của riêng đứa con này, ghi một lần; không dùng chung với bố/mẹ hay anh chị em.
    ...(conversation?.choice.dreamSeed && !entry.dreamSeed
      ? { dreamSeed: { ...conversation.choice.dreamSeed, age: getChildAge(entry, player.age), recordedAtParentAge: player.age } } : {}) } : entry);
  return { age: player.age, content: text, summary: text };
}
