 
 
 
 
 
 
 
 
export const STAT_IDS = ["health", "intelligence", "happiness", "appearance"];
export const STAT_LABELS = { health: "Sức khỏe", intelligence: "Trí tuệ", happiness: "Hạnh phúc", appearance: "Ngoại hình" };
export const ACTIVITY_CAP_FROM = 70;
export const ACTIVITY_GAIN_CAP = 8;
export const STAT_WEAR = { minAge: 18, maxAge: 74, from: 70, step: 10 };
export const ACTIVITY_SLOTS_PER_YEAR = 6;

const slotsUsed = (player) => (player.activitySlots?.age === player.age ? player.activitySlots.used ?? 0 : 0);
export const getActivitySlotsLeft = (player) => Math.max(0, ACTIVITY_SLOTS_PER_YEAR - slotsUsed(player));
 
export function useActivitySlot(player) {
  if (!getActivitySlotsLeft(player)) return false;
  player.activitySlots = { age: player.age, used: slotsUsed(player) + 1 };
  return true;
}
export const describeActivitySlots = (player) => getActivitySlotsLeft(player)
  ? `⏳ Thời gian rảnh năm nay: còn ${getActivitySlotsLeft(player)}/${ACTIVITY_SLOTS_PER_YEAR} lượt (ăn uống, rèn luyện, làm đẹp, du lịch).`
  : `⏳ Đã dùng hết ${ACTIVITY_SLOTS_PER_YEAR} lượt thời gian rảnh năm nay. Sang năm sẽ có lượt mới.`;
export const NO_SLOT_LABEL = "⏳ Hết thời gian rảnh";

const usageOf = (player) => (player.activityGains?.age === player.age ? player.activityGains : { age: player.age });
const used = (player, stat) => usageOf(player)[stat] ?? 0;

 
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

 
export function getActivityRoom(player, stat) {
  if ((Number(player[stat]) || 0) < ACTIVITY_CAP_FROM) return Infinity;
  return Math.max(0, Math.min(ACTIVITY_GAIN_CAP - used(player, stat), 100 - (Number(player[stat]) || 0)));
}

 
export function describeActivityRoom(player, stats = STAT_IDS) {
  const capped = stats.filter((stat) => (Number(player[stat]) || 0) >= ACTIVITY_CAP_FROM && player[stat] < 100);
  const full = stats.filter((stat) => (Number(player[stat]) || 0) >= 100);
  const parts = capped.map((stat) => `${STAT_LABELS[stat]} còn +${getActivityRoom(player, stat)}`);
  if (full.length) parts.push(`${full.map((stat) => STAT_LABELS[stat]).join(", ")} đã tối đa`);
  return `${describeActivitySlots(player)} Từ ${ACTIVITY_CAP_FROM} trở lên, mỗi chỉ số tăng tối đa ${ACTIVITY_GAIN_CAP} điểm/năm nhờ hoạt động` +
    (parts.length ? ` (năm nay: ${parts.join(" · ")}).` : ".");
}

 
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
