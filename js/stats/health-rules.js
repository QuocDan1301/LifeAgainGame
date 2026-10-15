 
 

 
export const HEALTH_BANDS = [
  { id: "good", min: 70, label: "Tốt" },
  { id: "fair", min: 40, label: "Khá" },
  { id: "weak", min: 20, label: "Yếu" },
  { id: "critical", min: 1, label: "Nguy kịch" },
  { id: "empty", min: -Infinity, label: "Cạn kiệt" },
];
export const getHealthBand = (health) => HEALTH_BANDS.find((band) => (Number(health) || 0) >= band.min);

 
const hasAnyJob = (player) => player.employmentStatus === "employed" || (player.sideJobs ?? []).length > 0 || (player.streetJobs ?? []).length > 0;
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

 
 
export const SICK_LEAVE = { weak: { chance: 0.35, missed: 0.5 }, critical: { chance: 0.7, missed: 0.5 } };

 
 
 
 
export const EMERGENCY = { cost: 10_000_000, healthAfter: 10, window: 5, repeatDeathChance: [0, 0.25, 0.5] };
export const getRecentEmergencies = (player, age) => (player.emergencyAges ?? []).filter((at) => age - at < EMERGENCY.window).length;
export const getEmergencyDeathChance = (player, age) =>
  EMERGENCY.repeatDeathChance[Math.min(getRecentEmergencies(player, age), EMERGENCY.repeatDeathChance.length - 1)];

 
 
export const REST_RECOVERY = { empty: 15, critical: 15, weak: 10, fair: 6, good: 3 };
export const REST_ILLNESS_LOSS_RATE = 0.5;
export const REST_PROMOTION_DELAY = 1;

 
export const AGING_DECLINE = [
  { from: 85, loss: 2 },
  { from: 75, loss: 1 },
];
export const getAgingDecline = (age) => AGING_DECLINE.find((entry) => age >= entry.from)?.loss ?? 0;

 
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

 
export const FOOTBALL_MIN_HEALTH = 60;
export const failsFootballFitness = (careerId, health) => careerId === "football" && (Number(health) || 0) < FOOTBALL_MIN_HEALTH;

export const formatChance = (chance) => `${Math.round(chance * 100)}%`;

 
 
export const RECOVERY_ACTIVITIES = [
  { id: "rest", icon: "🛌", name: "Nghỉ ngơi, ngủ đủ giấc", description: "Miễn phí. Tắt điện thoại sớm, ngủ đủ và để cơ thể tự hồi phục.",
    gain: { empty: 5, critical: 5, weak: 4, fair: 2, good: 1 } },
  { id: "walk", icon: "🚶", name: "Đi bộ nhẹ", description: "Miễn phí. Đi bộ chậm quanh nhà mỗi chiều, vừa sức với người đang yếu.",
    gain: { empty: 3, critical: 3, weak: 3, fair: 2, good: 1 } },
];
 
 
export const HEAVY_TRAINING = { ids: ["gym"], weakRate: 0.5 };
export const LIGHT_TRAINING = { ids: ["yoga"], weakBonus: 1 };
export const isWeakForTraining = (health) => ["weak", "critical", "empty"].includes(getHealthBand(health).id);

 
 
export const RESCUE_CARRY_MIN_HEALTH = 40;
