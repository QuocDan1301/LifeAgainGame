// Cân bằng sự kiện thường ngày. Giữ nguyên các lựa chọn do tác giả viết: trước đây lựa chọn
// thứ hai bị thay bằng câu "rủi ro" chung chung đoán theo từ khóa, vừa lệch truyện vừa lộ
// đáp án. Ở đây chỉ giới hạn độ lớn điểm thưởng/cái giá và xáo thứ tự cố định theo sự kiện.
// Phần may rủi được tính lúc người chơi chọn (xem rollEverydayLuck).
const MAX_GAIN = 4;
const MAX_LOSS = 5;
const MAX_CHILD_LOSS = 3;

const hashOf = (text) => Array.from(text).reduce((hash, char) => (hash * 31 + char.codePointAt(0)) >>> 0, 0);

export function balanceEverydayChoices(event, age) {
  if (event.everydayDifficultyApplied) return event;
  const maxLoss = age < 6 ? MAX_CHILD_LOSS : MAX_LOSS;
  const choices = event.choices.map((choice) => ({
    ...choice,
    effects: Object.fromEntries(Object.entries(choice.effects ?? {}).map(([stat, value]) => [
      stat, value < 0 ? Math.max(-maxLoss, value) : Math.min(MAX_GAIN, value),
    ])),
  }));
  // Lựa chọn có lợi nhất không luôn đứng đầu. Thứ tự ổn định khi tải lại, không dùng Math.random.
  const offset = hashOf(event.id ?? `${age}:${event.title}`) % choices.length;
  choices.push(...choices.splice(0, offset));
  return { ...event, choices, everydayDifficultyApplied: true };
}

// May rủi khi chọn: chỉ số mà lựa chọn hướng tới (chỉ số được cộng nhiều nhất) càng cao thì
// càng dễ suôn sẻ. Suôn sẻ: phần được cộng thêm một nửa, cái giá giảm một nửa.
// Không trọn vẹn: phần được cộng còn một nửa. Lựa chọn chỉ có mất mát thì không đổi.
// Chỉ kết quả không trọn vẹn mới thêm một dòng giải thích vào lời kể.
export const LUCK_NOTES = {
  poor: "🌧️ Có điều, kết quả không trọn vẹn như mong muốn.",
};
export function rollEverydayLuck(choice, player, random = Math.random) {
  const gains = Object.entries(choice.effects ?? {}).filter(([, value]) => value > 0);
  if (!gains.length) return choice;
  const [mainStat] = gains.reduce((best, entry) => (entry[1] > best[1] ? entry : best));
  const skill = Math.max(0, Math.min(100, Number(player?.[mainStat]) || 0));
  const roll = random();
  const luck = roll < 0.15 + skill / 500 ? "great" : roll >= 0.65 + skill / 500 ? "poor" : null;
  if (!luck) return choice;
  const effects = Object.fromEntries(Object.entries(choice.effects).map(([stat, value]) => [
    stat,
    luck === "great"
      ? (value > 0 ? value + Math.ceil(value / 2) : Math.trunc(value / 2))
      : (value > 0 ? Math.max(1, Math.floor(value / 2)) : value),
  ]));
  return { ...choice, effects, text: LUCK_NOTES[luck] ? `${choice.text}\n${LUCK_NOTES[luck]}` : choice.text, luck };
}
