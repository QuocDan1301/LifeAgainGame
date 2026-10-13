// May rủi của sự kiện thường ngày. Thứ tự lựa chọn được xoay vòng trong js/events/life-stories.js
// và độ lớn điểm do tác giả viết (xem docs/su-kien-doi-thuong/SO-TAY.md).
// May rủi khi chọn: chỉ số mà lựa chọn hướng tới (chỉ số được cộng nhiều nhất) càng cao thì
// càng dễ suôn sẻ. Suôn sẻ: phần được cộng thêm một nửa, cái giá giảm một nửa.
// Không trọn vẹn: phần được cộng còn một nửa. Lựa chọn chỉ có mất mát thì không đổi.
// Chỉ kết quả không trọn vẹn mới thêm một dòng giải thích vào lời kể.
export const LUCK_NOTES = {
  poor: "",
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
