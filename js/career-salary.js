import { formatMoney } from "./money-format.js";

// Fixed yearly income in VNĐ for game balance, ordered by career levels 1–3.
export const careerAnnualSalaries = {
  acting: [96_000_000, 240_000_000, 720_000_000],
  military: [84_000_000, 144_000_000, 240_000_000],
  singing: [96_000_000, 240_000_000, 720_000_000],
  painting: [84_000_000, 180_000_000, 420_000_000],
  medicine: [144_000_000, 300_000_000, 600_000_000],
  programming: [120_000_000, 240_000_000, 480_000_000],
  accounting: [96_000_000, 180_000_000, 300_000_000],
  law: [120_000_000, 264_000_000, 540_000_000],
  teaching: [84_000_000, 144_000_000, 240_000_000],
  football: [120_000_000, 360_000_000, 1_200_000_000],
  psychology: [96_000_000, 192_000_000, 360_000_000],
  esports: [120_000_000, 300_000_000, 900_000_000],
  tiktok: [96_000_000, 240_000_000, 600_000_000],
  youtube: [120_000_000, 300_000_000, 840_000_000],
  business: [108_000_000, 216_000_000, 480_000_000],
  finance: [132_000_000, 264_000_000, 600_000_000],
  mechanical: [96_000_000, 180_000_000, 336_000_000],
  architecture: [120_000_000, 240_000_000, 480_000_000],
  fashion: [96_000_000, 216_000_000, 480_000_000],
  marketing: [108_000_000, 240_000_000, 540_000_000],
  tourism: [96_000_000, 180_000_000, 300_000_000],
  culinary: [84_000_000, 180_000_000, 420_000_000],
  general: [96_000_000, 180_000_000, 300_000_000],
};

export function getCareerAnnualSalary(careerId, level) {
  if (!Number.isInteger(level) || level < 1 || level > 3) return 0;
  return (careerAnnualSalaries[careerId] ?? careerAnnualSalaries.general)[level - 1];
}

export function getPlayerAnnualSalary(player) {
  if (player.employmentStatus !== "employed" || player.isAlive === false) return 0;
  return getCareerAnnualSalary(player.careerPath?.id, player.careerLevel);
}

export const formatSalary = formatMoney;

export function getAnnualSalaryPayment(player, age, updates = {}) {
  // Existing workers use their current rank; newly hired workers receive
  // their first salary as soon as the employment result is confirmed.
  const alreadyWorking = Boolean(getPlayerAnnualSalary(player));
  const worker = alreadyWorking ? player : { ...player, ...updates };
  const annualAmount = getPlayerAnnualSalary(worker);
  if (!annualAmount || !Number.isInteger(age) || age < player.age || player.lastSalaryAge >= age) return null;
  const years = alreadyWorking ? Math.max(1, age - Math.max(player.age, player.lastSalaryAge ?? player.age)) : 1;
  const amount = annualAmount * years;
  const rank = worker.job || `bậc ${worker.careerLevel}`;
  return { age, amount, annualAmount, years, rank,
    content: `💰 Nhận lương ${years > 1 ? `${years} năm` : "năm"} ở bậc ${rank}: +${formatSalary(amount)}.` };
}

// Resolve event money first, then add salary separately so a purchase or bonus
// cannot overwrite annual income. Snapshot the old rank before promotion.
export function completeCareerYear(player, age, updates = {}) {
  const payment = getAnnualSalaryPayment(player, age, updates);
  Object.assign(player, updates, { age });
  if (payment) {
    player.money += payment.amount;
    player.lastSalaryAge = age;
  }
  return payment;
}
