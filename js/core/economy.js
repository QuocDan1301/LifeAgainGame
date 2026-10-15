import { getShopItem, getLeaseEndAge } from '../leisure/shop.js';
import { formatMoney } from './money-format.js';
import { getStudyAbroadCountry } from '../education/study-abroad.js';

// Quy ước cân bằng game, không phải bảng thuế hoặc bảo hiểm ngoài đời.
export const PERSONAL_ALLOWANCE = 120_000_000;
export const DEPENDENT_ALLOWANCE = 36_000_000;
export const INSURANCE_RATE = 0.08;
export const INSURANCE_SALARY_CAP = 360_000_000;
export const ASSET_ALLOWANCE = 12_000_000;
export const ASSET_TAX_RATE = 0.05;
export const PROPERTY_TAX_RATE = 0.001;
export const HOME_ALLOWANCE = 1_000_000_000;
export const ANNUAL_RENT = 24_000_000;
export const OVERSEAS_ANNUAL_RENT = 36_000_000;
export const INCOME_TAX_BANDS = [
  [60_000_000, 0.05], [180_000_000, 0.10], [360_000_000, 0.15],
  [600_000_000, 0.20], [1_200_000_000, 0.25], [Infinity, 0.30],
];
const money = value => Math.max(0, Number.isFinite(value) ? value : 0);
const round = value => Math.round(value / 1000) * 1000;

export function getIncomeTax(taxableIncome) {
  let previous = 0;
  let tax = 0;
  for (const [ceiling, rate] of INCOME_TAX_BANDS) {
    tax += Math.max(0, Math.min(money(taxableIncome), ceiling) - previous) * rate;
    if (taxableIncome <= ceiling) break;
    previous = ceiling;
  }
  return round(tax);
}

export function getResidence(player, age) {
  return (player.purchases ?? []).find(entry => {
    const item = getShopItem(entry.id);
    if (!item?.residential || (entry.boughtAtAge ?? 0) > age) return false;
    // A unit leased out for this accounting year cannot also be lived in.
    return !(Number.isInteger(entry.rentedAtAge) && entry.rentedAtAge <= age && age <= getLeaseEndAge(entry));
  }) ?? null;
}

export function getRent(player, age) {
  const startAge = player.careerPath?.id === 'casual' ? 18 : 22;
  const stillStudyingAbroad = player.careerPath?.id === "study-abroad" &&
    ["studying", "remediation"].includes(player.abroadProgress?.phase) &&
    player.employmentStatus !== "employed" && !player.abroadDestinationChosenAtAge;
  if (age < startAge || stillStudyingAbroad || player.isAlive === false ||
      (player.prison && player.prison.releaseAge > (player.age ?? age)) || getResidence(player, age)) return 0;
  return getStudyAbroadCountry(player.careerPath) ? OVERSEAS_ANNUAL_RENT : ANNUAL_RENT;
}

export function collectHiringDeductions(player, age, payment) {
  if (!payment || payment.retired) return null;
  const previous = player.economyIncomeYear?.age === age
    ? player.economyIncomeYear : { age, salary: 0, sideIncome: 0, assetIncome: 0, paidIncomeTax: 0, paidInsurance: 0 };
  const salary = previous.salary + payment.amount;
  const due = getAnnualEconomy(player, age, { salary, sideIncome: previous.sideIncome, assetIncome: previous.assetIncome });
  const incomeTax = Math.max(0, due.incomeTax - previous.paidIncomeTax);
  const insurance = Math.max(0, due.insurance - previous.paidInsurance);
  player.money -= incomeTax + insurance;
  player.economyIncomeYear = { ...previous, salary, paidIncomeTax: due.incomeTax, paidInsurance: due.insurance };
  const content = [
    insurance ? `🛡️ Bảo hiểm trên lương nhận việc: -${formatMoney(insurance)}.` : "",
    incomeTax ? `🧾 Thuế thu nhập cá nhân năm nay sau giảm trừ: -${formatMoney(incomeTax)}.` : "",
  ].filter(Boolean).join("\n");
  return { amount: incomeTax + insurance, incomeTax, insurance, content };
}

export function getAnnualEconomy(player, age, { salary = 0, sideIncome = 0, assetIncome = 0, retired = false } = {}) {
  const zero = { insurance: 0, incomeTax: 0, assetTax: 0, propertyTax: 0, rent: 0, tax: 0, total: 0, taxableIncome: 0, dependentDeduction: 0, content: '' };
  if (player.isAlive === false || (player.prison && player.prison.releaseAge > (player.age ?? age))) return zero;
  const insurance = retired ? 0 : round(Math.min(money(salary), INSURANCE_SALARY_CAP) * INSURANCE_RATE);
  const dependents = (player.children ?? []).filter(child => {
    const childAge = child.initialAge + Math.max(0, age - child.joinedAtAge);
    return child.alive !== false && childAge >= 0 && childAge <= 18;
  }).length;
  const dependentDeduction = dependents * DEPENDENT_ALLOWANCE;
  const taxableIncome = Math.max(0, (retired ? 0 : money(salary)) + money(sideIncome) - insurance - PERSONAL_ALLOWANCE - dependentDeduction);
  const incomeTax = getIncomeTax(taxableIncome);
  const assetTax = round(Math.max(0, money(assetIncome) - ASSET_ALLOWANCE) * ASSET_TAX_RATE);
  const propertyValue = (player.purchases ?? []).reduce((sum, entry) => {
    const item = getShopItem(entry.id);
    return sum + (item?.group === 'realestate' && (entry.boughtAtAge ?? 0) <= age ? item.price : 0);
  }, 0);
  const propertyTax = round(Math.max(0, propertyValue - (getResidence(player, age) ? HOME_ALLOWANCE : 0)) * PROPERTY_TAX_RATE);
  const rent = getRent(player, age);
  const tax = incomeTax + assetTax + propertyTax;
  const lines = [
    insurance ? `🛡️ Bảo hiểm theo lương (8%, có trần): -${formatMoney(insurance)}.` : '',
    incomeTax ? `🧾 Thuế thu nhập cá nhân lũy tiến sau giảm trừ: -${formatMoney(incomeTax)}.` : '',
    assetTax ? `🏪 Thuế thu nhập tài sản sinh lời (5% phần vượt 12 triệu/năm): -${formatMoney(assetTax)}.` : '',
    propertyTax ? `🏘️ Thuế bất động sản: -${formatMoney(propertyTax)}.` : '',
    rent ? `🔑 Thuê nhà: -${formatMoney(rent)}/năm. Có nhà để ở sẽ không phải thuê.` : '',
  ].filter(Boolean);
  return { insurance, incomeTax, assetTax, propertyTax, rent, tax, total: insurance + tax + rent, taxableIncome, dependentDeduction, content: lines.join('\n') };
}
