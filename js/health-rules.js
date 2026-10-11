// Cấu hình tập trung cho cơ chế phụ thuộc Sức khỏe. Các con số là thông số gameplay,
// không phải mô phỏng y khoa.

// Ngưỡng sức khỏe: 70–100 tốt, 40–69 khá, 20–39 yếu, 1–19 nguy kịch, 0 cạn kiệt.
export const HEALTH_BANDS = [
  { id: "good", min: 70, label: "Tốt" },
  { id: "fair", min: 40, label: "Khá" },
  { id: "weak", min: 20, label: "Yếu" },
  { id: "critical", min: 1, label: "Nguy kịch" },
  { id: "empty", min: -Infinity, label: "Cạn kiệt" },
];
export const getHealthBand = (health) => HEALTH_BANDS.find((band) => (Number(health) || 0) >= band.min);

// Nhận việc (làm thêm hoặc xin việc chính) theo sức khỏe.
const hasAnyJob = (player) => player.employmentStatus === "employed" || (player.sideJobs ?? []).length > 0;
export function getJobHealthRule(player) {
  const band = getHealthBand(player.health);
  if (band.id === "critical" || band.id === "empty") {
    return { allowed: false, message: `🛑 Sức khỏe ${player.health}% đang nguy kịch: chưa thể nhận thêm việc. Hãy nghỉ dưỡng hoặc hồi phục trước.` };
  }
  if (band.id === "weak" && hasAnyJob(player)) {
    return { allowed: false, message: `⚠️ Sức khỏe ${player.health}% đang yếu: không nhận thêm việc khi đã có việc. Hồi phục lên từ 40% để nhận thêm.` };
  }
  if (band.id === "weak") {
    return { allowed: true, warning: `⚠️ Sức khỏe ${player.health}% đang yếu: dễ phải nghỉ ốm và mất bớt thu nhập.` };
  }
  if (band.id === "fair" && hasAnyJob(player)) {
    return { allowed: true, warning: `⚠️ Sức khỏe ${player.health}%: nhận thêm việc sẽ hao sức nhanh hơn, nên theo dõi sức khỏe.` };
  }
  return { allowed: true };
}

// Làm thêm (trả theo ca) khi sức khỏe yếu: có thể phải nghỉ ốm một phần ca trong năm.
// Nghỉ ốm thì mất phần lương và phần hao sức của các ca đã nghỉ.
export const SICK_LEAVE = { weak: { chance: 0.35, missed: 0.5 }, critical: { chance: 0.7, missed: 0.5 } };

// Sức khỏe về 0 vì làm quá sức hoặc vì bệnh chưa tới mức nguy kịch: nhập viện cấp cứu,
// không tự động tử vong. Viện phí cấp cứu luôn bị trừ (ví có thể âm).
// Cấp cứu lặp lại trong `window` năm là dấu hiệu cơ thể kiệt quệ: lần thứ 2 có 25% nguy cơ tử vong,
// từ lần thứ 3 là 50%. Nhờ vậy làm quá sức liên tục không thể kéo dài vô thời hạn.
export const EMERGENCY = { cost: 10_000_000, healthAfter: 10, window: 5, repeatDeathChance: [0, 0.25, 0.5] };
export const getRecentEmergencies = (player, age) => (player.emergencyAges ?? []).filter((at) => age - at < EMERGENCY.window).length;
export const getEmergencyDeathChance = (player, age) =>
  EMERGENCY.repeatDeathChance[Math.min(getRecentEmergencies(player, age), EMERGENCY.repeatDeathChance.length - 1)];

// Nghỉ dưỡng một năm: hồi phục nhiều hơn khi sức khỏe thấp, tạm ngưng ca làm thêm (không lương,
// không hao sức), bệnh vẫn tiến triển nhưng hao sức giảm một nửa, xét nâng bậc lùi 1 năm.
export const REST_RECOVERY = { empty: 15, critical: 15, weak: 10, fair: 6, good: 3 };
export const REST_ILLNESS_LOSS_RATE = 0.5;
export const REST_PROMOTION_DELAY = 1;

// Tuổi già: sức khỏe suy giảm dần mỗi năm.
export const AGING_DECLINE = [
  { from: 85, loss: 2 },
  { from: 75, loss: 1 },
];
export const getAgingDecline = (age) => AGING_DECLINE.find((entry) => age >= entry.from)?.loss ?? 0;

// Nguy cơ qua đời vì tuổi già trong năm tới: xét tuổi, sức khỏe và bệnh chưa điều trị.
const OLD_AGE_BASE = [
  { from: 100, chance: 0.45 },
  { from: 98, chance: 0.25 },
  { from: 90, chance: 0.08 },
  { from: 80, chance: 0.03 },
  { from: 70, chance: 0.01 },
];
const OLD_AGE_HEALTH_FACTOR = { good: 0.5, fair: 1, weak: 2, critical: 3.5, empty: 5 };
const OLD_AGE_ILLNESS_FACTOR = { severe: 1.5, critical: 2.5 };
export const OLD_AGE_MAX_CHANCE = 0.95;
export function getOldAgeDeathChance(age, health, illnessStages = []) {
  if (age >= 106) return 1;
  const base = OLD_AGE_BASE.find((entry) => age >= entry.from)?.chance ?? 0;
  if (!base) return 0;
  const illness = illnessStages.reduce((factor, stage) => factor * (OLD_AGE_ILLNESS_FACTOR[stage] ?? 1), 1);
  return Math.min(OLD_AGE_MAX_CHANCE, base * OLD_AGE_HEALTH_FACTOR[getHealthBand(health).id] * illness);
}

// Ngành Bóng đá cần thể lực: dưới mức này không được chọn học ở tuổi 18 và không qua phỏng vấn.
export const FOOTBALL_MIN_HEALTH = 60;
export const failsFootballFitness = (careerId, health) => careerId === "football" && (Number(health) || 0) < FOOTBALL_MIN_HEALTH;

export const formatChance = (chance) => `${Math.round(chance * 100)}%`;

// Hồi phục miễn phí trong Phát triển bản thân → Sức khỏe: mỗi hoạt động một lần mỗi năm,
// sức khỏe càng thấp hồi phục càng nhiều, nhưng không thể bấm mãi để lên 100.
export const RECOVERY_ACTIVITIES = [
  { id: "rest", icon: "🛌", name: "Nghỉ ngơi, ngủ đủ giấc", description: "Miễn phí. Tắt điện thoại sớm, ngủ đủ và để cơ thể tự hồi phục.",
    gain: { empty: 5, critical: 5, weak: 4, fair: 2, good: 1 } },
  { id: "walk", icon: "🚶", name: "Đi bộ nhẹ", description: "Miễn phí. Đi bộ chậm quanh nhà mỗi chiều, vừa sức với người đang yếu.",
    gain: { empty: 3, critical: 3, weak: 3, fair: 2, good: 1 } },
];
// Gym là tập nặng: khi sức khỏe yếu hoặc đang bệnh nặng, hiệu quả còn một nửa và có cảnh báo.
// Yoga là tập nhẹ: khi sức khỏe yếu được cộng thêm để hỗ trợ hồi phục.
export const HEAVY_TRAINING = { ids: ["gym"], weakRate: 0.5 };
export const LIGHT_TRAINING = { ids: ["yoga"], weakBonus: 1 };
export const isWeakForTraining = (health) => ["weak", "critical", "empty"].includes(getHealthBand(health).id);

// Sự kiện vận động/cứu người: đủ sức khỏe mới tự dìu người bị nạn; yếu thì vẫn có lối gọi cứu hộ.
// Sức khỏe cao không cứu được lựa chọn chắc chắn nguy hiểm (ví dụ chui vào giàn giáo đang sập).
export const RESCUE_CARRY_MIN_HEALTH = 40;
