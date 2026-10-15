import { collectCreatorAudienceYear } from '../achievements/achievement-progress.js';
import { getStudyAbroadCountry } from "../education/study-abroad.js";
import { formatMoney } from "../core/money-format.js";

 
 
 
 
 
export const careerAnnualSalaries = {
  "study-abroad": [180_000_000, 360_000_000, 540_000_000],
  acting: [96_000_000, 240_000_000, 600_000_000],
  military: [96_000_000, 168_000_000, 360_000_000],
  singing: [96_000_000, 240_000_000, 600_000_000],
  painting: [84_000_000, 180_000_000, 420_000_000],
  medicine: [144_000_000, 300_000_000, 600_000_000],
  programming: [120_000_000, 240_000_000, 480_000_000],
  accounting: [96_000_000, 192_000_000, 360_000_000],
  law: [120_000_000, 264_000_000, 540_000_000],
  teaching: [96_000_000, 168_000_000, 360_000_000],
  football: [120_000_000, 300_000_000, 720_000_000],
  psychology: [96_000_000, 192_000_000, 360_000_000],
  esports: [120_000_000, 264_000_000, 660_000_000],
  tiktok: [96_000_000, 216_000_000, 540_000_000],
  youtube: [120_000_000, 264_000_000, 600_000_000],
  business: [108_000_000, 216_000_000, 480_000_000],
  finance: [132_000_000, 264_000_000, 600_000_000],
  mechanical: [96_000_000, 192_000_000, 360_000_000],
  architecture: [120_000_000, 240_000_000, 480_000_000],
  fashion: [96_000_000, 216_000_000, 480_000_000],
  marketing: [108_000_000, 240_000_000, 540_000_000],
  tourism: [96_000_000, 192_000_000, 360_000_000],
  culinary: [84_000_000, 180_000_000, 420_000_000],
  general: [96_000_000, 180_000_000, 300_000_000],
};
export const ATHLETE_CAREERS = ["football", "esports"];
export const ATHLETE_PEAK_END = 35;
export const ATHLETE_LATE_RATE = 0.6;

export function getCareerAnnualSalary(careerId, level, careerPath = null) {
  if (!Number.isInteger(level) || level < 1 || level > 3) return 0;
  const country = getStudyAbroadCountry(careerPath);
  if (careerId === 'study-abroad' && country) return country.salaries[level - 1];
  return (careerAnnualSalaries[careerId] ?? careerAnnualSalaries.general)[level - 1];
}

export function getPlayerAnnualSalary(player, age = player.age) {
  if (player.employmentStatus !== "employed" || player.isAlive === false) return 0;
  const salary = getCareerAnnualSalary(player.careerPath?.id, player.careerLevel, player.careerPath);
  return ATHLETE_CAREERS.includes(player.careerPath?.id) && age > ATHLETE_PEAK_END
    ? Math.round((salary * ATHLETE_LATE_RATE) / 1000) * 1000 : salary;
}

export const formatSalary = formatMoney;

 
export const RETIREMENT_AGE = 62;
export const PENSION_RATE = 0.5;

export function getAnnualSalaryPayment(player, age, updates = {}) {
  // Existing workers use their current rank; newly hired workers receive
  // their first salary as soon as the employment result is confirmed.
  const alreadyWorking = Boolean(getPlayerAnnualSalary(player));
  // Quitting takes effect immediately; promotions still affect next year.
  const worker = updates.employmentStatus && updates.employmentStatus !== "employed"
    ? { ...player, ...updates } : alreadyWorking ? player : { ...player, ...updates };
  if (worker.isAlive === false) return null;
  const annualAmount = worker.employmentStatus === "retired"
    ? worker.pensionAnnualAmount / PENSION_RATE : getPlayerAnnualSalary(worker, age);
  if (!annualAmount || !Number.isInteger(age) || age < player.age || player.lastSalaryAge >= age) return null;
  const years = alreadyWorking ? Math.max(1, age - Math.max(player.age, player.lastSalaryAge ?? player.age)) : 1;
  const rank = worker.job || `bậc ${worker.careerLevel}`;
  const yearsText = years > 1 ? `${years} năm` : "năm";
  if (age >= RETIREMENT_AGE) {
    const pension = Math.round((annualAmount * PENSION_RATE) / 1000) * 1000;
    const amount = pension * years;
    const farewell = age === RETIREMENT_AGE ? `Nghỉ hưu sau những năm làm ${rank}. ` : "";
    return { age, amount, annualAmount: pension, years, rank, retired: true,
      content: `🌅 ${farewell}Nhận lương hưu ${yearsText}: +${formatSalary(amount)}.` };
  }
  const amount = annualAmount * years;
  return { age, amount, annualAmount, years, rank, careerId: worker.careerPath?.id, careerLevel: worker.careerLevel,
    content: `💰 Nhận lương ${yearsText} ở bậc ${rank}: +${formatSalary(amount)}.` +
      (ATHLETE_CAREERS.includes(worker.careerPath?.id) && age > ATHLETE_PEAK_END
        ? ` Đã qua tuổi thi đấu đỉnh cao, bạn chuyển sang huấn luyện và bình luận (${Math.round(ATHLETE_LATE_RATE * 100)}% lương bậc).` : "") };
}

// Resolve event money first, then add salary separately so a purchase or bonus
// cannot overwrite annual income. Snapshot the old rank before promotion.
export function completeCareerYear(player, age, updates = {}) {
  retirePlayer(player, age);
  const payment = getAnnualSalaryPayment(player, age, updates);
  Object.assign(player, updates, { age });
  if (payment) {
    player.money += payment.amount;
    player.lastSalaryAge = age;
    const audience = collectCreatorAudienceYear(player, age, payment);
    if (audience) payment.content += `\n${audience.content}`;
  }
  return payment;
}

// Preserve a pension basis once, then clear all active employment obligations.
export function retirePlayer(player, age = player.age) {
  if (age < RETIREMENT_AGE) return;
  if (player.employmentStatus === "employed") {
    player.pensionAnnualAmount = Math.round(getPlayerAnnualSalary(player) * PENSION_RATE / 1000) * 1000;
    player.retiredJob = player.job;
    player.employmentStatus = "retired";
    player.job = "Nghỉ hưu";
    player.retiredAtAge ??= age;
  }
  if (player.employmentStatus === "retired") Object.assign(player, {
    nextPromotionAge: null, jobWarning: null, layoffDue: null, layoffSeverance: null,
    contractEndAge: null, contractNoticeAge: null, contractEnding: null, employedSince: null,
    careerSwitchOpen: false,
  });
}
