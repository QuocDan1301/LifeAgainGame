import { collectCreatorAudienceYear } from '../achievements/achievement-progress.js';
import { maleNames, femaleNames } from "../core/character-data.js";
import { collectAssetIncome, getAssetYearProjection } from "../leisure/shop.js";
import { collectSideJobYear, shiftTypes } from "../career/side-jobs.js";
import { getStreetIncome } from "../career/street-work.js";
import { applyEmergency, collectIllnessYear } from "../stats/hospital.js";
import { collectLotteryYear } from "../leisure/lottery.js";
import { collectHomeLoanYear, collectStoryLoanYear } from '../core/story-transactions.js';
import { getAnnualSalaryPayment, formatSalary, retirePlayer, RETIREMENT_AGE } from "../career/career-salary.js";
import { REST_PROMOTION_DELAY, REST_RECOVERY, getAgingDecline, getHealthBand } from "../stats/health-rules.js";
import { collectMoodYear } from "../stats/mood-rules.js";
import { collectEmploymentYear, startEmploymentRecord } from "../career/job-loss.js";
import { collectFamilyYear } from "./family-members.js";
import { SCHOLARSHIP, collectCognitiveYear } from "../stats/intellect-rules.js";
import { collectAppearanceYear } from "../stats/appearance-rules.js";
import { createSchoolEntryReward } from "../education/school-rewards.js";
import { createGraduationNotice } from "../career/job-applications.js";
import { getStudyAbroadTuition, getStudyAbroadCountry, getStudyAbroadLivingCost } from "../education/study-abroad.js";
import { collectStatWearYear } from "../core/stat-budget.js";
import { getAnnualEconomy } from "../core/economy.js";

import { collectReformationYear } from '../events/crime-consequences.js';
import { getFamilyBudget, collectFamilyBudget } from './family-budget.js';
import { applyActivityGain } from '../core/stat-budget.js';
import { collectDevelopmentPassesYear } from '../stats/self-development.js';
export const getChildAge = (child, age) => child.initialAge + Math.max(0, age - child.joinedAtAge);

// Yearly game costs: 12 million at birth, increasing by 2 million per age.
export function getAnnualChildcareCost(age) {
  return Number.isInteger(age) && age >= 0 && age <= 18 ? 12_000_000 + age * 2_000_000 : 0;
}

export function createChildProposalEvent(player, age) {
  if (!player.partner || player.marriedAtAge == null || player.isAlive === false ||
      player.childProposalStopped || player.childProposalCompleted) return null;
  if (age < (player.nextChildProposalAge ?? player.marriedAtAge + 5)) return null;
  const adopted = player.gender === player.partner.gender;
  const retry = (player.childProposalDeclines ?? 0) > 0;
  const topic = adopted ? "nhận con nuôi" : "sinh con";
  const image = new URL("../img/events/openmoji/color/svg/1F9F8.svg", import.meta.url).href;
  const initialAge = adopted ? 5 : 0;
  return {
    id: `child-proposal-${player.partner.id}-${retry ? "retry" : "first"}`,
    kind: "child-proposal", person: player.partner,
    title: `🧸 ${retry ? "Mình nói lại chuyện" : "Mình có muốn"} ${topic}${retry ? " nhé?" : " không?"}`,
    text: `${player.partner.name} ${retry ? "nhắc lại" : "mở lời về"} chuyện ${topic}: “Bạn có muốn chúng mình cùng nuôi dạy một đứa trẻ không?” ${adopted ? "Hai người dự định nhận nuôi một bé 5 tuổi." : "Hai người cùng bàn về việc chào đón một em bé."}\n\nChi phí nuôi con bắt đầu từ ${formatSalary(getAnnualChildcareCost(initialAge))}/năm, tăng 2.000.000 VNĐ mỗi tuổi và được tính đến hết năm con 18 tuổi.`,
    image, imageAlt: "Trò chuyện về việc nuôi con", imageFallback: image,
    imageFallbackAlt: "Trò chuyện về việc nuôi con",
    choices: [
      { label: adopted ? "Đồng ý, cùng nhận con nuôi!" : "Đồng ý, mình sinh con nhé!",
        childDecision: "accept", title: adopted ? "🧸 Đón con nuôi về nhà" : "👶 Gia đình đón em bé",
        text: adopted ? `Tôi và ${player.partner.name} đồng ý nhận nuôi một bé 5 tuổi. Chúng tôi đón con về nhà và cùng nhận trách nhiệm chăm sóc, nuôi dạy con.`
          : `Tôi và ${player.partner.name} cùng quyết định sinh con. Gia đình chào đón một em bé và bắt đầu hành trình chăm sóc, nuôi dạy con.`,
        effects: { happiness: 5 }, achievementIds: ["first-child"], confirmText: "Chào đón con!" },
      { label: retry ? "Tôi vẫn không muốn có con" : "Tôi chưa muốn có con", childDecision: "decline",
        title: retry ? "💬 Khép lại chuyện con cái" : "💬 Cần thêm thời gian suy nghĩ",
        text: retry ? `${player.partner.name} buồn vì tôi tiếp tục không đồng ý. Người ấy quyết định không đề cập chuyện ${topic} nữa. Chúng tôi vẫn ở bên nhau, nhưng kế hoạch có con được khép lại.`
          : `Tôi nói thật rằng mình chưa sẵn sàng. ${player.partner.name} đồng ý chờ và sẽ hỏi lại sau hai năm, khi tôi ${age + 2} tuổi.`,
        effects: { happiness: retry ? -3 : -1 }, achievementIds: [], confirmText: "Tôn trọng quyết định của nhau" },
    ].map(branch => ({ ...branch, image, imageAlt: "Quyết định về chuyện con cái",
      imageFallback: image, imageFallbackAlt: "Quyết định về chuyện con cái" })),
  };
}

export function getChildProposalUpdates(player, person, age, decision, random = Math.random) {
  if (!player.partner || player.partner.id !== person?.id || player.marriedAtAge == null ||
      player.childProposalStopped || player.childProposalCompleted) return {};
  const history = [...(player.relationshipHistory ?? [])];
  if (decision === "accept") {
    const adopted = player.gender === person.gender;
    const gender = random() < 0.5 ? "male" : "female";
    const names = gender === "female" ? femaleNames : maleNames;
    const child = { id: `child-${person.id}-${age}`, name: names[Math.floor(random() * names.length)],
      gender, adopted, relationship: 80, initialAge: adopted ? 5 : 0, joinedAtAge: age,
      coParent: { id: person.id, name: person.name }, lastCarePaidAtAge: null };
    history.push({ age, type: adopted ? "adopted-child" : "child-born", person,
      text: `${adopted ? "Gia đình nhận nuôi" : "Gia đình chào đón"} con ${child.name}${adopted ? ", 5 tuổi" : ", mới sinh"}.` });
    return { children: [...(player.children ?? []), child], childProposalCompleted: true,
      nextChildProposalAge: null, childProposalDeclines: 0, relationshipHistory: history };
  }
  if (decision !== "decline") return {};
  const stopped = (player.childProposalDeclines ?? 0) > 0;
  history.push({ age, type: "child-discussion", person,
    text: stopped ? `Tôi tiếp tục không đồng ý có con. ${person.name} buồn và không muốn hỏi chuyện con cái nữa.`
      : `Tôi chưa muốn có con. ${person.name} hẹn sẽ hỏi lại sau hai năm.` });
  return { childProposalDeclines: stopped ? 2 : 1, childProposalStopped: stopped,
    nextChildProposalAge: stopped ? null : age + 2, relationshipHistory: history,
    ...(stopped ? { partner: { ...person, stats: { ...person.stats,
      happiness: Math.max(0, (person.stats?.happiness ?? 50) - 5) } } } : {}) };
}

export function getChildcareExpenses(player, age, updates = {}) {
  const charges = [];
  for (const child of updates.children ?? player.children ?? []) {
    const firstYear = Math.max(child.joinedAtAge,
      child.lastCarePaidAtAge == null ? Math.max(player.age + 1, child.joinedAtAge) : child.lastCarePaidAtAge + 1);
    let amount = 0;
    for (let year = firstYear; year <= age; year++) amount += getAnnualChildcareCost(getChildAge(child, year));
    if (amount) charges.push({ id: child.id, name: child.name, amount });
  }
  const amount = charges.reduce((sum, charge) => sum + charge.amount, 0);
  return { age, amount, charges,
    content: amount ? `🧸 Chi phí nuôi con: -${formatSalary(amount)} (${charges.map(charge => charge.name).join(", ")}).` : "" };
}

// Every birthday pays income, then childcare, whether or not a story appears.
 
 
 
 
export const LIVING_COST_MIN_AGE = 23;
export const LIVING_COST_RATE = 0;
export const LIVING_COST_FLOOR = 0;
 
export const LIVING_SHORTFALL_HAPPINESS = 3;

 
 
export const TUITION_FIRST_AGE = 18;
export const TUITION_LAST_AGE = 21;
export const TUITION_PER_YEAR = 20_000_000;
const tuitionByCareer = { medicine: 40_000_000, teaching: 0 };
export function getAnnualTuition(careerPath) {
  if (!careerPath?.school || careerPath.school.type === "academy") return 0;
  if (careerPath.id === "study-abroad") return getStudyAbroadCountry(careerPath)?.tuition ?? 0;
  return tuitionByCareer[careerPath.id] ?? TUITION_PER_YEAR;
}
 
export const LIVING_MODES = {
  normal: { label: "Bình thường", floor: LIVING_COST_FLOOR, rate: LIVING_COST_RATE, happiness: 0 },
  frugal: { label: "Cơ bản", floor: 0, rate: 0, happiness: 0 },
  comfortable: { label: "Tiện nghi", extra: 36_000_000, happiness: 1 },
  luxury: { label: "Cao cấp", extra: 120_000_000, happiness: 2 },
};
export function describeYearLivingCost(careerPath, age) {
  const country = getStudyAbroadCountry(careerPath);
  if (country && age >= 18 && age <= 21) return `${formatSalary(country.living)}/năm trong thời gian học`;
  return "Không thu sinh hoạt phí theo thu nhập; thuế, bảo hiểm và thuê nhà được tách riêng";
}

export function getLivingCost(age, income, mode = "normal") {
  if (!Number.isInteger(age) || age < 22) return 0;
  return LIVING_MODES[mode]?.extra ?? 0;
}
 
 
export const FRUGAL_MAX_SAVING = 0;
export function getYearLivingCost(careerPath, age, income, mode = "normal", player = null) {
  const extendedStudy = player && age >= 22 && getStudyAbroadTuition(player, age) > 0;
  const studentCost = extendedStudy ? getStudyAbroadCountry(careerPath)?.living ?? 0 : getStudyAbroadLivingCost(careerPath, age);
  return studentCost + getLivingCost(age, income, mode);
}

 
 
export const DEBT_INTEREST_RATE = 0.06;
export function getDebtInterest(age, money) {
  if (!Number.isInteger(age) || age < LIVING_COST_MIN_AGE || !(money < 0)) return 0;
  return Math.round((-money * DEBT_INTEREST_RATE) / 1000) * 1000;
}

export function migrateChildcareDebt(player, updates) {
  const debt = player.childcareDebt ?? 0;
  if (debt > 0) {
    player.money -= debt;
    if (typeof updates?.money === "number") updates.money -= debt;
  }
  player.childcareDebt = 0;
  return debt;
}

 
 
function collectHealthYear(player, age) {
  const lines = [];
   
  if (player.health <= 0) lines.push(applyEmergency(player, "Biến cố trong năm khiến sức khỏe cạn kiệt.", age));
  if (player.isAlive === false) return { content: lines.join("\n") };
  if (player.restYear === age) {
    const before = player.health;
    player.health = Math.min(100, before + REST_RECOVERY[getHealthBand(before).id]);
    let line = `🛌 Một năm nghỉ dưỡng: Sức khỏe +${player.health - before}.`;
    if (player.employmentStatus === "employed" && Number.isInteger(player.nextPromotionAge)) {
      player.nextPromotionAge = Math.max(player.nextPromotionAge, age) + REST_PROMOTION_DELAY;
      line += ` Công việc chính vẫn giữ lương; xét nâng bậc lùi đến ${player.nextPromotionAge} tuổi.`;
    }
    lines.push(line);
  }
  const decline = getAgingDecline(age);
  if (decline) {
     
     
     
    const before = player.health;
    player.health = Math.max(Math.min(1, before), before - decline);
    if (before !== player.health) lines.push(`🧓 Tuổi cao, sức khỏe suy giảm: Sức khỏe -${before - player.health}.`);
  }
  return lines.length ? { content: lines.join("\n") } : null;
}

export function completeLifeYear(player, age, updates = {}, schoolReward) {
   
  if (updates.isAlive === false) {
    Object.assign(player, updates, { age });
    return { childcare: { amount: 0, charges: [], content: "" } };
  }
   
  const prisonYear = Boolean((player.prison && player.prison.releaseAge > player.age) ||
    (updates.prison && updates.prison.releaseAge > age));
  const budget = getFamilyBudget({ ...player, ...updates }, age, { skipDating: prisonYear });
   
   
   
  if (prisonYear) {
    const childcare = getChildcareExpenses(player, age, updates);
    const interest = getDebtInterest(age, player.money);
    Object.assign(player, updates, { age });
    const family = collectFamilyYear(player, age);
    const health = collectHealthYear(player, age);
    const illness = player.isAlive === false ? null : collectIllnessYear(player, age);
    const notes = [];
    if (player.isAlive !== false) {
      player.money -= childcare.amount + interest;
      const familyBudget = collectFamilyBudget(player, age, budget);
      if (familyBudget) notes.push(familyBudget.content);
      player.children = (player.children ?? []).map(child => childcare.charges.some(charge => charge.id === child.id)
        ? { ...child, lastCarePaidAtAge: age } : child);
      if (interest) notes.push(`🏦 Lãi nợ trong năm thụ án: -${formatSalary(interest)}.`);
      const due = (loan) => loan.outstanding > 0 && age > loan.startedAtAge && age > loan.lastPaidAge;
      if ((player.homeLoans ?? []).some(due)) {
        player.homeLoans = player.homeLoans.map(loan => due(loan) ? { ...loan, lastPaidAge: age } : loan);
        notes.push("🏠 Trả góp nhà tạm ngừng trong năm thụ án; lịch trả lùi lại một năm.");
      }
      if (getAssetYearProjection(player, age).recurringIncome) notes.push("🔑 Năm thụ án không thu được tiền cho thuê hay lãi kinh doanh.");
    }
    return { childcare: player.isAlive === false ? { amount: 0, charges: [], content: "" } : childcare,
      family, health, illness,
      living: notes.length ? { content: notes.join("\n") } : null };
  }
  migrateChildcareDebt(player, updates);
   
  const interestAmount = getDebtInterest(age, player.money);
  retirePlayer(player, age);
  if (player.employmentStatus === 'retired') {
    updates = { ...updates };
    // Legacy pending work results cannot reopen a retired career.
    for (const key of ['employmentStatus', 'job', 'careerLevel', 'nextPromotionAge', 'jobWarning',
      'layoffDue', 'contractEndAge', 'contractNoticeAge', 'contractEnding', 'employedSince', 'careerSwitchOpen']) delete updates[key];
  }
  const moneyBeforeEmployment = player.money;
  const employment = collectEmploymentYear(player, age);
  const eventUpdates = typeof updates.money === 'number'
    ? { ...updates, money: updates.money + player.money - moneyBeforeEmployment } : updates;
  const schooling = schoolReward === undefined ? createSchoolEntryReward(player, age, eventUpdates) : schoolReward;
  const yearUpdates = schooling && !player.schoolRewardsReceived?.[schooling.id]
    ? { ...eventUpdates, ...schooling.updates } : eventUpdates;
  const childcare = getChildcareExpenses(player, age, updates);
   
  const payment = getAnnualSalaryPayment(player, age, yearUpdates);
  Object.assign(player, yearUpdates, { age });
  startEmploymentRecord(player, age);
   
  const family = collectFamilyYear(player, age);
   
  const yearHealth = collectHealthYear(player, age);
  const illness = player.isAlive === false ? null : collectIllnessYear(player, age);
   
  const cognition = player.isAlive === false ? null : collectCognitiveYear(player, age);
  const looks = player.isAlive === false ? null : collectAppearanceYear(player, age);
  const aging = cognition && looks ? { content: `${cognition.content}\n${looks.content}` } : cognition ?? looks;
  if (player.isAlive === false) {
    return { childcare: { amount: 0, charges: [], content: "" }, employment, family, health: yearHealth, illness, cognition: aging };
  }
   
  const mood = collectMoodYear(player, age);
  if (payment) {
    player.money += payment.amount;
    player.lastSalaryAge = age;
    const audience = collectCreatorAudienceYear(player, age, payment);
    if (audience) payment.content += `\n${audience.content}`;
  }
  const salary = payment;
   
  const assetIncome = collectAssetIncome(player, age);
  const repayment = collectStoryLoanYear(player, age);
  const assets = assetIncome && repayment
    ? { amount: assetIncome.amount + repayment.amount, content: `${assetIncome.content}\n${repayment.content}` }
    : assetIncome ?? repayment;
  const mortgage = collectHomeLoanYear(player, age);
  const livestock = assets && mortgage
    ? { amount: assets.amount - mortgage.amount, content: `${assets.content}\n${mortgage.content}` }
    : assets ?? mortgage;
  const sideJobs = collectSideJobYear(player, age);
   
  if (player.isAlive === false) {
    return { salary, childcare: { amount: 0, charges: [], content: "" }, health: yearHealth, illness, livestock, sideJobs };
  }
  collectReformationYear(player, age);
  const lottery = collectLotteryYear(player, age);
  const graduation = createGraduationNotice(player, age);
   
  const fullTuition = player.careerPath?.id === 'study-abroad' ? getStudyAbroadTuition(player, age) : age >= TUITION_FIRST_AGE && age <= TUITION_LAST_AGE ? getAnnualTuition(player.careerPath) : 0;
   
  const scholarship = fullTuition && (player.intelligence ?? 0) >= SCHOLARSHIP.minIntellect;
  const tuitionAmount = scholarship ? Math.round((fullTuition * (1 - SCHOLARSHIP.rate)) / 1000) * 1000 : fullTuition;
  const tuition = tuitionAmount
    ? { amount: tuitionAmount, content: `🎓 Học phí năm học tại ${player.careerPath.school.name}: -${formatSalary(tuitionAmount)}` +
      (scholarship ? ` (học bổng khuyến khích giảm ${Math.round(SCHOLARSHIP.rate * 100)}% nhờ kết quả học tập tốt).` : ".") }
    : null;
  if (tuition) {
    player.money -= tuition.amount;
    if (player.money < 0) tuition.content += ` Ví còn thiếu ${formatSalary(-player.money)}: đây là nợ học phí, thu nhập về sau sẽ trả dần. Bạn vẫn tiếp tục học.`;
  }
  const livingAmount = getYearLivingCost(player.careerPath, age, (salary?.amount ?? 0) + (sideJobs?.amount ?? 0) + (assetIncome?.recurringIncome ?? 0), player.livingMode, player);
  const previousIncome = player.economyIncomeYear?.age === age ? player.economyIncomeYear : null;
  const economyIncome = {
    salary: (salary?.amount ?? 0) + (previousIncome?.salary ?? 0),
    sideIncome: (sideJobs?.amount ?? 0) + (previousIncome?.sideIncome ?? 0),
    assetIncome: (assetIncome?.recurringIncome ?? 0) + (previousIncome?.assetIncome ?? 0),
    retired: salary?.retired === true,
  };
  const economy = getAnnualEconomy(player, age, economyIncome);
  const economyAlreadyPaid = player.economyPaidAge >= age;
  if (!economyAlreadyPaid) {
    // Hiring may already have withheld salary deductions earlier this year.
    player.money -= economy.total - (previousIncome?.paidIncomeTax ?? 0) - (previousIncome?.paidInsurance ?? 0);
    player.economyPaidAge = age;
    player.economyIncomeYear = { age, ...economyIncome, paidIncomeTax: economy.incomeTax, paidInsurance: economy.insurance };
  }
  const familyBudget = collectFamilyBudget(player, age, budget);
  const living = livingAmount || interestAmount || familyBudget || (!economyAlreadyPaid && economy.total)
    ? { amount: livingAmount, content: livingAmount ? `🧺 Chi phí học xa nhà hoặc tiện nghi tự chọn: -${formatSalary(livingAmount)}.` : "" }
    : null;
  if (living) {
    player.money -= living.amount;
    if (!economyAlreadyPaid && economy.content) {
      const paidEarlier = (previousIncome?.paidIncomeTax ?? 0) + (previousIncome?.paidInsurance ?? 0);
      living.content = [living.content, economy.content,
        paidEarlier ? `🧾 Trong tổng thuế và bảo hiểm năm nay, ${formatSalary(paidEarlier)} đã khấu trừ khi nhận việc nên không thu lại.` : "",
      ].filter(Boolean).join("\n");
    }
    living.economy = economyAlreadyPaid ? null : economy;
  }
  if (familyBudget) living.content = [living.content, familyBudget.content].filter(Boolean).join("\n");
  if (interestAmount) {
    player.money -= interestAmount;
    living.interest = interestAmount;
    living.content = [living.content, `🏦 Lãi nợ ${Math.round(DEBT_INTEREST_RATE * 100)}%/năm trên khoản ví âm mang sang: -${formatSalary(interestAmount)}.`].filter(Boolean).join("\n");
  }
  if (childcare.amount) {
    player.money -= childcare.amount;
    player.children = (player.children ?? []).map(child => childcare.charges.some(charge => charge.id === child.id)
      ? { ...child, lastCarePaidAtAge: age } : child);
  }
   
  if (living && player.money < 0) {
    player.happiness = Math.max(0, (player.happiness ?? 0) - LIVING_SHORTFALL_HAPPINESS);
    living.content += ` Ví đang âm ${formatSalary(-player.money)} nên phải sống tằn tiện (Hạnh phúc -${LIVING_SHORTFALL_HAPPINESS}).`;
  }

  const comfort = LIVING_MODES[player.livingMode]?.happiness ?? 0;
  if (livingAmount && comfort > 0 && player.money >= 0) {
    const gained = applyActivityGain(player, 'happiness', comfort);
    living.content += ` Mức sống ${LIVING_MODES[player.livingMode].label.toLowerCase()}: Hạnh phúc +${gained} (theo giới hạn năm).`;
  }
   
   
  const passes = collectDevelopmentPassesYear(player, age);
  const wear = collectStatWearYear(player, age);
  let health = yearHealth && wear ? { content: `${yearHealth.content}\n${wear.content}` } : yearHealth ?? wear;
  if (passes) health = health ? { ...health, content: `${health.content}\n${passes.content}` } : passes;
  return { salary, childcare, schooling, tuition, employment, family, health, mood, livestock, sideJobs, living, illness, lottery, graduation, cognition: aging };
}

 
export function forecastNextYear(player) {
  const age = (player.age ?? 0) + 1;
  const budget = getFamilyBudget(player, age);
  const familyBudget = budget.amount;
  const dating = budget.charges.filter(charge => charge.kind === "dating").reduce((sum, charge) => sum + charge.amount, 0);
   
  if (player.prison && player.prison.releaseAge > (player.age ?? 0)) {
    const interest = getDebtInterest(age, player.money ?? 0);
    const childcare = getChildcareExpenses(player, age).amount ?? 0;
    return { age, income: 0, costs: interest + childcare + familyBudget, living: 0, rent: 0, tax: 0, insurance: 0, economy: getAnnualEconomy(player, age), interest, childcare, familyBudget, dating, tuition: 0, mortgage: 0, upkeep: 0,
      assets: 0, repayments: 0, after: (player.money ?? 0) - interest - childcare - familyBudget };
  }
  const forecastWorker = { ...player };
  retirePlayer(forecastWorker, age);
  const salary = forecastWorker.employmentStatus === "retired" || (forecastWorker.employmentStatus === "employed" && forecastWorker.layoffDue !== age && forecastWorker.contractEndAge !== age)
    ? getAnnualSalaryPayment(forecastWorker, age)?.amount ?? 0 : 0;
  const sideJobs = player.restYear === age || age >= RETIREMENT_AGE ? 0 : (player.sideJobs ?? [])
    .reduce((sum, job) => sum + (job.startedAtAge < age ? shiftTypes[job.shift]?.salary ?? 0 : 0), 0);
  const assets = getAssetYearProjection(player, age);
  const repayments = (player.storyLoans ?? []).reduce((sum, loan) => {
    if (!loan.repaymentYears || loan.outstanding <= 0 || age <= loan.lastRepaidAge) return sum;
    const target = Math.floor(loan.principal * Math.min(loan.repaymentYears, age - loan.lentAtAge) / loan.repaymentYears);
    return sum + Math.max(0, Math.min(loan.outstanding, target - loan.amountRepaid));
  }, 0);
  const recurringIncome = salary + sideJobs + getStreetIncome(player, age) + assets.recurringIncome;
  const income = recurringIncome + repayments;
  const living = getYearLivingCost(player.careerPath, age, recurringIncome, player.livingMode, player);
  const interest = getDebtInterest(age, player.money ?? 0);
  const childcare = getChildcareExpenses(player, age).amount ?? 0;
  const baseTuition = player.careerPath?.id === 'study-abroad' ? getStudyAbroadTuition(player, age) : age >= TUITION_FIRST_AGE && age <= TUITION_LAST_AGE ? getAnnualTuition(player.careerPath) : 0;
  const tuition = (player.intelligence ?? 0) >= SCHOLARSHIP.minIntellect ? Math.round((baseTuition * (1 - SCHOLARSHIP.rate)) / 1000) * 1000 : baseTuition;
  const mortgage = (player.homeLoans ?? []).reduce((sum, loan) => sum +
    (loan.outstanding > 0 && age > loan.lastPaidAge ? Math.min(loan.outstanding, loan.annualPayment) : 0), 0);
  const economy = getAnnualEconomy(player, age, { salary, sideIncome: sideJobs + getStreetIncome(player, age), assetIncome: assets.recurringIncome, retired: forecastWorker.employmentStatus === "retired" });
  const costs = living + economy.total + interest + childcare + tuition + mortgage + assets.upkeep + familyBudget;
  return { age, income, costs, living, economy, rent: economy.rent, tax: economy.tax, insurance: economy.insurance, interest, childcare, familyBudget, dating, tuition, mortgage, upkeep: assets.upkeep, assets: assets.recurringIncome, repayments, after: (player.money ?? 0) + income - costs };
}
