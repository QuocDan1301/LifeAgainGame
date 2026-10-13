import { getPlayerAnnualSalary } from '../career/career-salary.js';
import { getJobLossUpdates } from '../career/job-loss.js';
import { formatMoney } from './money-format.js';

// Gameplay prices, shared by preview, confirmation and annual accounting.
export const HOME_TERMS = {
  'story-home': { price: 1_500_000_000, deposit: 300_000_000, years: 15, rate: 0.06 },
  'story-small-home': { price: 900_000_000, deposit: 180_000_000, years: 15, rate: 0.06 },
};

export function prepareStoryChoice(choice, player, age) {
  const prepared = { ...choice };
  const flags = choice.flags ?? [];
  if (choice.salaryMonths) prepared.money = -Math.round((getPlayerAnnualSalary(player) || 60_000_000) * choice.salaryMonths / 12);
  prepared.playerUpdates = { ...(choice.playerUpdates ?? {}) };
  if (flags.includes('tu_nguyen_nghi')) Object.assign(prepared.playerUpdates, getJobLossUpdates(player, age, 'quit'));
  if (choice.lend) prepared.playerUpdates.storyLoans = [...(player.storyLoans ?? []), {
    id: choice.lend, principal: -prepared.money, outstanding: -prepared.money, lentAtAge: age,
    ...(choice.repayAfter ? { repaymentYears: choice.repayAfter, lastRepaidAge: age, amountRepaid: 0 } : {}),
  }];
  if (choice.repayLoan) {
    const loan = player.storyLoans?.find(item => item.id === choice.repayLoan && item.outstanding > 0);
    prepared.money = loan?.outstanding ?? 0;
    prepared.playerUpdates.storyLoans = (player.storyLoans ?? []).map(item => item === loan ? { ...item, outstanding: 0, repaidAtAge: age } : item);
  }
  if (choice.home) {
    const terms = HOME_TERMS[choice.home];
    const principal = terms.price - terms.deposit;
    const total = Math.round(principal * (1 + terms.rate * terms.years));
    const uid = `${choice.home}-${age}`;
    prepared.money = -terms.deposit;
    prepared.playerUpdates.purchases = [...(player.purchases ?? []), { id: choice.home, uid, boughtAtAge: age, purchasePrice: terms.price }];
    prepared.playerUpdates.homeLoans = [...(player.homeLoans ?? []), {
      id: uid, assetUid: uid, principal, outstanding: total, annualPayment: Math.ceil(total / terms.years),
      years: terms.years, startedAtAge: age, lastPaidAge: age, paymentsMade: 0,
    }];
    prepared.label += ` (giá ${formatMoney(terms.price)}; trả trước ${formatMoney(terms.deposit)}; vay ${formatMoney(principal)}; lãi đơn ${terms.rate * 100}%/năm; ${formatMoney(Math.ceil(total / terms.years))}/năm × ${terms.years} năm, từ tuổi ${age + 1})`;
  } else if (prepared.money < 0) prepared.label += ` (chi ${formatMoney(-prepared.money)})`;
  return prepared;
}

export const canAffordChoice = (player, choice) => !(choice.money < 0) || (player.money ?? 0) >= -choice.money;

// No inferred loans from legacy flags: only explicit contracts are collected.
export function collectHomeLoanYear(player, age) {
  const lines = [];
  let amount = 0;
  player.homeLoans = (player.homeLoans ?? []).map(loan => {
    if (!(loan.outstanding > 0) || age <= loan.startedAtAge || age <= loan.lastPaidAge) return loan;
    const dueYears = Math.min(age - loan.lastPaidAge, loan.years - loan.paymentsMade);
    if (dueYears <= 0) return loan;
    const payment = Math.min(loan.outstanding, loan.annualPayment * dueYears);
    amount += payment;
    const outstanding = loan.outstanding - payment;
    lines.push(`Trả góp nhà: -${formatMoney(payment)}; còn nợ ${formatMoney(outstanding)}.${outstanding === 0 ? ' Đã trả hết khoản vay.' : ''}`);
    return { ...loan, outstanding, paymentsMade: loan.paymentsMade + dueYears, lastPaidAge: age };
  });
  player.money -= amount;
  if (amount && player.money < 0) lines.push(`Ví thiếu ${formatMoney(-player.money)} sau nghĩa vụ trả nợ; số thiếu được ghi vào số dư âm.`);
  return lines.length ? { amount, content: lines.join('\n') } : null;
}

export function collectStoryLoanYear(player, age) {
  let amount = 0;
  player.storyLoans = (player.storyLoans ?? []).map(loan => {
    if (!loan.repaymentYears || loan.outstanding <= 0 || age <= loan.lastRepaidAge) return loan;
    const targetPaid = Math.floor(loan.principal * Math.min(loan.repaymentYears, age - loan.lentAtAge) / loan.repaymentYears);
    const payment = Math.max(0, Math.min(loan.outstanding, targetPaid - loan.amountRepaid));
    amount += payment;
    return { ...loan, outstanding: loan.outstanding - payment, amountRepaid: loan.amountRepaid + payment, lastRepaidAge: age };
  });
  player.money += amount;
  return amount ? { amount, content: `Nhận tiền trả khoản cho vay: +${formatMoney(amount)}.` } : null;
}
