// Giữ chỉ số cao phải bỏ công mỗi năm, không thể mua một lần rồi giữ mãi ở 100.
// - Dưới 70: hoạt động (ăn uống, rèn luyện, du lịch, làm đẹp, vui chơi, trò chuyện) tăng chỉ số bình thường.
// - Từ 70 trở lên: mỗi chỉ số chỉ tăng thêm tối đa ACTIVITY_GAIN_CAP điểm mỗi năm nhờ hoạt động.
// - Từ 18 đến 74 tuổi: chỉ số trên 70 hao mòn mỗi năm (bận rộn, áp lực, thời gian), càng cao hao càng nhiều.
// Kết quả sự kiện, nghỉ dưỡng và phần thưởng nhập học không bị giới hạn này.
// Các con số là thông số gameplay.
export const STAT_IDS = ["health", "intelligence", "happiness", "appearance"];
export const STAT_LABELS = { health: "Sức khỏe", intelligence: "Trí tuệ", happiness: "Hạnh phúc", appearance: "Ngoại hình" };
export const ACTIVITY_CAP_FROM = 70;
export const ACTIVITY_GAIN_CAP = 8;
export const STAT_WEAR = { minAge: 18, maxAge: 74, from: 70, step: 10 };

const usageOf = (player) => (player.activityGains?.age === player.age ? player.activityGains : { age: player.age });
const used = (player, stat) => usageOf(player)[stat] ?? 0;

// Số điểm thực nhận nếu hoạt động cộng `amount` vào `stat` (không thay đổi nhân vật).
function split(player, stat, amount) {
  const value = Math.max(0, Math.min(100, Number(player[stat]) || 0));
  if (!(amount > 0)) return { below: 0, above: 0 };
  const below = Math.max(0, Math.min(amount, ACTIVITY_CAP_FROM - value));
  const room = Math.max(0, ACTIVITY_GAIN_CAP - used(player, stat));
  const above = Math.max(0, Math.min(amount - below, room, 100 - value - below));
  return { below, above };
}
export function previewActivityGain(player, stat, amount) {
  const { below, above } = split(player, stat, amount);
  return below + above;
}

// Cộng điểm từ hoạt động, trả về số điểm thực nhận.
export function applyActivityGain(player, stat, amount) {
  const { below, above } = split(player, stat, amount);
  const before = Number(player[stat]) || 0;
  player[stat] = Math.min(100, before + below + above);
  if (above) {
    const usage = usageOf(player);
    player.activityGains = { ...usage, [stat]: (usage[stat] ?? 0) + above };
  }
  return player[stat] - before;
}

// Điểm còn tăng được trong năm cho một chỉ số đã từ 70 (Infinity nếu còn dưới 70).
export function getActivityRoom(player, stat) {
  if ((Number(player[stat]) || 0) < ACTIVITY_CAP_FROM) return Infinity;
  return Math.max(0, Math.min(ACTIVITY_GAIN_CAP - used(player, stat), 100 - (Number(player[stat]) || 0)));
}

// Dòng ghi chú cho các màn hoạt động: chỉ nêu những chỉ số đã chạm vùng giới hạn.
export function describeActivityRoom(player, stats = STAT_IDS) {
  const capped = stats.filter((stat) => (Number(player[stat]) || 0) >= ACTIVITY_CAP_FROM && player[stat] < 100);
  const full = stats.filter((stat) => (Number(player[stat]) || 0) >= 100);
  const parts = capped.map((stat) => `${STAT_LABELS[stat]} còn +${getActivityRoom(player, stat)}`);
  if (full.length) parts.push(`${full.map((stat) => STAT_LABELS[stat]).join(", ")} đã tối đa`);
  return `Từ ${ACTIVITY_CAP_FROM} trở lên, mỗi chỉ số tăng tối đa ${ACTIVITY_GAIN_CAP} điểm/năm nhờ hoạt động` +
    (parts.length ? ` (năm nay: ${parts.join(" · ")}).` : ".");
}

// Hao mòn một chỉ số trong năm: 71–80 mất 1, 81–90 mất 2, 91–100 mất 3.
export const getStatWear = (value) =>
  value > STAT_WEAR.from ? Math.ceil((value - STAT_WEAR.from) / STAT_WEAR.step) : 0;

export function collectStatWearYear(player, age) {
  if (!Number.isInteger(age) || age < STAT_WEAR.minAge || age > STAT_WEAR.maxAge || player.isAlive === false) return null;
  const changes = [];
  for (const stat of STAT_IDS) {
    const loss = getStatWear(Number(player[stat]) || 0);
    if (!loss) continue;
    player[stat] -= loss;
    changes.push(`${STAT_LABELS[stat]} -${loss}`);
  }
  return changes.length
    ? { content: `⏳ Năm tháng bận rộn, chỉ số cao cần được giữ gìn: ${changes.join(" · ")}.` }
    : null;
}
