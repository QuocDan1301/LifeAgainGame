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
import { getLivingShare } from "../core/living-share.js";

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
      gender, adopted, initialAge: adopted ? 5 : 0, joinedAtAge: age,
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
// Chi phí sinh hoạt: từ 23 tuổi (học xong, tự lo cho bản thân), mỗi năm trừ một phần
// thu nhập thường xuyên (lương chính, làm thêm, cho thuê; phần trên 200 triệu chi tỷ lệ cao hơn,
// xem core/living-share.js), nhưng không thấp hơn mức tối thiểu
// để sống, kể cả khi không có thu nhập.
export const LIVING_COST_MIN_AGE = 23;
export const LIVING_COST_RATE = 0.3;
export const LIVING_COST_FLOOR = 24_000_000;
// Từ tuổi tự lo sinh hoạt, kết thúc năm mà ví còn âm (đang nợ) thì phải sống tằn tiện, hạnh phúc giảm.
export const LIVING_SHORTFALL_HAPPINESS = 3;

// Học phí: mỗi năm học ở trường (đại học, học viện, cao đẳng) từ 18 đến 21 tuổi, tính cả năm nhập học.
// Academy Liên Quân, nhập ngũ và tự rèn luyện không mất học phí. Ví không đủ thì vẫn trừ, ví có thể âm.
export const TUITION_FIRST_AGE = 18;
export const TUITION_LAST_AGE = 21;
export const TUITION_PER_YEAR = 20_000_000;
const tuitionByCareer = { medicine: 40_000_000 };
export function getAnnualTuition(careerPath) {
  if (!careerPath?.school || careerPath.school.type === "academy") return 0;
  if (careerPath.id === "study-abroad") return getStudyAbroadCountry(careerPath)?.tuition ?? 0;
  return tuitionByCareer[careerPath.id] ?? TUITION_PER_YEAR;
}
// Mức sống tiết kiệm (giảm mức sống khi khó khăn): sàn và tỷ lệ chi thấp hơn, đổi lại hạnh phúc -1 mỗi năm.
export const LIVING_MODES = {
  normal: { label: "Bình thường", floor: LIVING_COST_FLOOR, rate: LIVING_COST_RATE, happiness: 0 },
  frugal: { label: "Tiết kiệm", floor: 16_000_000, rate: 0.2, happiness: -1 },
};
export function getLivingCost(age, income, mode = "normal") {
  if (!Number.isInteger(age) || age < LIVING_COST_MIN_AGE) return 0;
  const config = LIVING_MODES[mode] ?? LIVING_MODES.normal;
  return Math.max(config.floor, getLivingShare(income, config.rate));
}
// Sống tiết kiệm là cách xoay xở lúc khó khăn: mỗi năm bớt được tối đa 12 triệu so với mức bình thường,
// để người thu nhập cao không thể cắt 1/3 sinh hoạt phí chỉ với Hạnh phúc -1.
export const FRUGAL_MAX_SAVING = 12_000_000;
export function getYearLivingCost(careerPath, age, income, mode = "normal") {
  const cost = (living) => getStudyAbroadLivingCost(careerPath, age, income, living) || getLivingCost(age, income, living);
  const normal = cost("normal");
  return mode === "frugal" ? Math.max(cost("frugal"), normal - FRUGAL_MAX_SAVING) : normal;
}

// Nợ (ví âm) từ tuổi tự lo sinh hoạt bị tính lãi mỗi năm trên số nợ mang sang đầu năm,
// nên vay để học hay để tiêu đều có giá. Thời sinh viên (trước 23 tuổi) chưa tính lãi.
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

// Sức khỏe trong năm: cấp cứu sau biến cố, nghỉ dưỡng (hồi phục, lùi xét nâng bậc) và suy giảm vì tuổi cao.
// Tuổi cao: sức khỏe suy giảm dần (tối thiểu 1); nguy cơ ra đi do checkOldAgeDeath quyết định.
function collectHealthYear(player, age) {
  const lines = [];
  // Biến cố trong năm làm sức khỏe về 0 mà không phải lựa chọn tử vong (death): nhập viện cấp cứu.
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
    // Suy giảm tuổi già giữ tối thiểu 1: sự kiện "không gây tử vong" (bị thương còn 1) không bị
    // tuổi tác kết liễu ngay cuối năm. Ra đi vì tuổi già do nguy cơ mỗi năm quyết định
    // (getOldAgeDeathChance), vốn đã cao gấp nhiều lần khi sức khỏe nguy kịch.
    const before = player.health;
    player.health = Math.max(Math.min(1, before), before - decline);
    if (before !== player.health) lines.push(`🧓 Tuổi cao, sức khỏe suy giảm: Sức khỏe -${before - player.health}.`);
  }
  return lines.length ? { content: lines.join("\n") } : null;
}

export function completeLifeYear(player, age, updates = {}, schoolReward) {
  // Sự kiện khiến nhân vật qua đời: chỉ ghi nhận kết quả, năm đó không còn lương hay chi phí.
  if (updates.isAlive === false) {
    Object.assign(player, updates, { age });
    return { childcare: { amount: 0, charges: [], content: "" } };
  }
  // Năm thụ án (kể cả năm ra tù): không có lương, làm thêm, học phí hay sinh hoạt phí bên ngoài; không thu tiền
  // cho thuê, không tốn chi phí thú cưng; trả góp nhà tạm ngừng và lịch trả lùi lại (không trừ dồn khi ra tù).
  // Vẫn trả chi phí nuôi con và lãi nợ.
  if ((player.prison && player.prison.releaseAge > player.age) ||
      (updates.prison && updates.prison.releaseAge > age)) {
    const childcare = getChildcareExpenses(player, age, updates);
    const interest = getDebtInterest(age, player.money);
    Object.assign(player, updates, { age });
    const family = collectFamilyYear(player, age);
    const health = collectHealthYear(player, age);
    const illness = player.isAlive === false ? null : collectIllnessYear(player, age);
    const notes = [];
    if (player.isAlive !== false) {
      player.money -= childcare.amount + interest;
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
  // Lãi tính trên số nợ mang sang từ năm trước, trước mọi khoản thu chi của năm nay.
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
  // Lương tính theo bậc trước khi áp kết quả sự kiện (nâng bậc có hiệu lực từ năm sau).
  const payment = getAnnualSalaryPayment(player, age, yearUpdates);
  Object.assign(player, yearUpdates, { age });
  startEmploymentRecord(player, age);
  // Người thân già đi, tình trạng sức khỏe thay đổi (có thông báo trước khi nguy kịch).
  const family = collectFamilyYear(player, age);
  // Sức khỏe và bệnh trước: qua đời trong năm thì không ghi thêm thu nhập hay chi phí sau dòng tử vong.
  const yearHealth = collectHealthYear(player, age);
  const illness = player.isAlive === false ? null : collectIllnessYear(player, age);
  // Tuổi cao: có thể suy giảm trí tuệ nhẹ, ít hơn nếu năm qua có đọc sách, học hay trò chuyện.
  const cognition = player.isAlive === false ? null : collectCognitiveYear(player, age);
  const looks = player.isAlive === false ? null : collectAppearanceYear(player, age);
  const aging = cognition && looks ? { content: `${cognition.content}\n${looks.content}` } : cognition ?? looks;
  if (player.isAlive === false) {
    return { childcare: { amount: 0, charges: [], content: "" }, employment, family, health: yearHealth, illness, cognition: aging };
  }
  // Tinh thần: hồi phục từ hỗ trợ, tác động kéo dài của biến cố, lời hẹn với người yêu, năm hạnh phúc thấp.
  const mood = collectMoodYear(player, age);
  if (payment) {
    player.money += payment.amount;
    player.lastSalaryAge = age;
  }
  const salary = payment;
  // Lãi vật nuôi, cho thuê và kinh doanh cộng sau khi kết quả sự kiện đã ghi đè tiền trong ví.
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
  // Kiệt quệ vì làm quá sức có thể khép lại cuộc đời: không ghi thêm khoản nào sau dòng tử vong.
  if (player.isAlive === false) {
    return { salary, childcare: { amount: 0, charges: [], content: "" }, health: yearHealth, illness, livestock, sideJobs };
  }
  const lottery = collectLotteryYear(player, age);
  const graduation = createGraduationNotice(player, age);
  // Học phí, sinh hoạt phí và chi phí nuôi con luôn được trừ đủ; ví không đủ thì thành số âm (nợ).
  const fullTuition = player.careerPath?.id === 'study-abroad' ? getStudyAbroadTuition(player, age) : age >= TUITION_FIRST_AGE && age <= TUITION_LAST_AGE ? getAnnualTuition(player.careerPath) : 0;
  // Học bổng khuyến khích: năm học có Trí tuệ từ 80 được giảm học phí.
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
  const livingAmount = getYearLivingCost(player.careerPath, age, (salary?.amount ?? 0) + (sideJobs?.amount ?? 0) + (assetIncome?.recurringIncome ?? 0), player.livingMode);
  const living = livingAmount || interestAmount
    ? { amount: livingAmount, content: livingAmount ? `🏠 Chi phí sinh hoạt (ăn ở, đi lại, hóa đơn): -${formatSalary(livingAmount)}.` : "" }
    : null;
  if (living) player.money -= living.amount;
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
  // Nợ thời sinh viên chưa bị phạt; từ tuổi tự lo sinh hoạt mà cuối năm ví còn âm thì phải sống tằn tiện.
  if (livingAmount && player.money < 0) {
    player.happiness = Math.max(0, (player.happiness ?? 0) - LIVING_SHORTFALL_HAPPINESS);
    living.content += ` Ví đang âm ${formatSalary(-player.money)} nên phải sống tằn tiện (Hạnh phúc -${LIVING_SHORTFALL_HAPPINESS}).`;
  }
  if (livingAmount && player.livingMode === "frugal") {
    player.happiness = Math.max(0, (player.happiness ?? 0) + LIVING_MODES.frugal.happiness);
    living.content += ` Đang sống tiết kiệm (Hạnh phúc ${LIVING_MODES.frugal.happiness}).`;
  }
  // Cuối năm: chỉ số cao hao mòn theo năm tháng (18–74 tuổi), phải giữ gìn bằng hoạt động mỗi năm.
  // Tính sau học phí để mốc học bổng xét theo chỉ số trong năm học.
  const wear = collectStatWearYear(player, age);
  const health = yearHealth && wear ? { content: `${yearHealth.content}\n${wear.content}` } : yearHealth ?? wear;
  return { salary, childcare, schooling, tuition, employment, family, health, mood, livestock, sideJobs, living, illness, lottery, graduation, cognition: aging };
}

// Dự báo năm tới: thu nhập (lương, làm thêm) và chi phí bắt buộc (sinh hoạt, nuôi con, học phí).
export function forecastNextYear(player) {
  const age = (player.age ?? 0) + 1;
  // Năm thụ án tính như completeLifeYear: chỉ còn chi phí nuôi con và lãi nợ.
  if (player.prison && player.prison.releaseAge > (player.age ?? 0)) {
    const interest = getDebtInterest(age, player.money ?? 0);
    const childcare = getChildcareExpenses(player, age).amount ?? 0;
    return { age, income: 0, costs: interest + childcare, living: 0, interest, childcare, tuition: 0, mortgage: 0, upkeep: 0,
      assets: 0, repayments: 0, after: (player.money ?? 0) - interest - childcare };
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
  const living = getYearLivingCost(player.careerPath, age, recurringIncome, player.livingMode);
  const interest = getDebtInterest(age, player.money ?? 0);
  const childcare = getChildcareExpenses(player, age).amount ?? 0;
  const baseTuition = player.careerPath?.id === 'study-abroad' ? getStudyAbroadTuition(player, age) : age >= TUITION_FIRST_AGE && age <= TUITION_LAST_AGE ? getAnnualTuition(player.careerPath) : 0;
  const tuition = (player.intelligence ?? 0) >= SCHOLARSHIP.minIntellect ? Math.round((baseTuition * (1 - SCHOLARSHIP.rate)) / 1000) * 1000 : baseTuition;
  const mortgage = (player.homeLoans ?? []).reduce((sum, loan) => sum +
    (loan.outstanding > 0 && age > loan.lastPaidAge ? Math.min(loan.outstanding, loan.annualPayment) : 0), 0);
  const costs = living + interest + childcare + tuition + mortgage + assets.upkeep;
  return { age, income, costs, living, interest, childcare, tuition, mortgage, upkeep: assets.upkeep, assets: assets.recurringIncome, repayments, after: (player.money ?? 0) + income - costs };
}
