import { maleNames, femaleNames } from "./character-data.js";
import { collectAssetIncome } from "./shop.js";
import { collectSideJobYear } from "./side-jobs.js";
import { applyEmergency, collectIllnessYear } from "./hospital.js";
import { collectLotteryYear } from "./lottery.js";
import { getAnnualSalaryPayment, formatSalary } from "./career-salary.js";
import { REST_PROMOTION_DELAY, REST_RECOVERY, getAgingDecline, getHealthBand } from "./health-rules.js";
import { collectMoodYear } from "./mood-rules.js";
import { collectEmploymentYear, startEmploymentRecord } from "./job-loss.js";
import { collectFamilyYear } from "./family-members.js";
import { SCHOLARSHIP, collectCognitiveYear } from "./intellect-rules.js";
import { collectAppearanceYear } from "./appearance-rules.js";
import { createSchoolEntryReward } from "./school-rewards.js";
import { createGraduationNotice } from "./job-applications.js";

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
  const image = new URL("./img/events/openmoji/color/svg/1F9F8.svg", import.meta.url).href;
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
// thu nhập từ công việc (lương chính + làm thêm), nhưng không thấp hơn mức tối thiểu
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
  const share = income > 0 ? Math.round((income * config.rate) / 1000) * 1000 : 0;
  return Math.max(config.floor, share);
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
// Tuổi cao mà sức khỏe cạn thì ra đi vì tuổi già.
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
    const before = player.health;
    player.health = Math.max(0, before - decline);
    if (before !== player.health) lines.push(`🧓 Tuổi cao, sức khỏe suy giảm: Sức khỏe -${before - player.health}.`);
    if (player.health === 0) {
      player.isAlive = false;
      player.deathCause = "old-age";
      lines.push("🕯️ Cơ thể tuổi cao đã quá suy yếu và không còn gượng dậy được nữa.");
    }
  }
  return lines.length ? { content: lines.join("\n") } : null;
}

export function completeLifeYear(player, age, updates = {}, schoolReward) {
  // Sự kiện khiến nhân vật qua đời: chỉ ghi nhận kết quả, năm đó không còn lương hay chi phí.
  if (updates.isAlive === false) {
    Object.assign(player, updates, { age });
    return { childcare: { amount: 0, charges: [], content: "" } };
  }
  migrateChildcareDebt(player, updates);
  const employment = collectEmploymentYear(player, age);
  const schooling = schoolReward === undefined ? createSchoolEntryReward(player, age, updates) : schoolReward;
  const yearUpdates = schooling && !player.schoolRewardsReceived?.[schooling.id]
    ? { ...updates, ...schooling.updates } : updates;
  const childcare = getChildcareExpenses(player, age, updates);
  // Lương tính theo bậc trước khi áp kết quả sự kiện (nâng bậc có hiệu lực từ năm sau).
  const payment = getAnnualSalaryPayment(player, age, yearUpdates);
  Object.assign(player, yearUpdates, { age });
  startEmploymentRecord(player, age);
  // Người thân già đi, tình trạng sức khỏe thay đổi (có thông báo trước khi nguy kịch).
  const family = collectFamilyYear(player, age);
  // Sức khỏe và bệnh trước: qua đời trong năm thì không ghi thêm thu nhập hay chi phí sau dòng tử vong.
  const health = collectHealthYear(player, age);
  const illness = player.isAlive === false ? null : collectIllnessYear(player, age);
  // Tuổi cao: có thể suy giảm trí tuệ nhẹ, ít hơn nếu năm qua có đọc sách, học hay trò chuyện.
  const cognition = player.isAlive === false ? null : collectCognitiveYear(player, age);
  const looks = player.isAlive === false ? null : collectAppearanceYear(player, age);
  const aging = cognition && looks ? { content: `${cognition.content}\n${looks.content}` } : cognition ?? looks;
  if (player.isAlive === false) {
    return { childcare: { amount: 0, charges: [], content: "" }, employment, family, health, illness, cognition: aging };
  }
  // Tinh thần: hồi phục từ hỗ trợ, tác động kéo dài của biến cố, lời hẹn với người yêu, năm hạnh phúc thấp.
  const mood = collectMoodYear(player, age);
  if (payment) {
    player.money += payment.amount;
    player.lastSalaryAge = age;
  }
  const salary = payment;
  // Lãi vật nuôi, cho thuê và kinh doanh cộng sau khi kết quả sự kiện đã ghi đè tiền trong ví.
  const livestock = collectAssetIncome(player, age);
  const sideJobs = collectSideJobYear(player, age);
  // Kiệt quệ vì làm quá sức có thể khép lại cuộc đời: không ghi thêm khoản nào sau dòng tử vong.
  if (player.isAlive === false) {
    return { salary, childcare: { amount: 0, charges: [], content: "" }, health, illness, livestock, sideJobs };
  }
  const lottery = collectLotteryYear(player, age);
  const graduation = createGraduationNotice(player, age);
  // Học phí, sinh hoạt phí và chi phí nuôi con luôn được trừ đủ; ví không đủ thì thành số âm (nợ).
  const fullTuition = age >= TUITION_FIRST_AGE && age <= TUITION_LAST_AGE ? getAnnualTuition(player.careerPath) : 0;
  // Học bổng khuyến khích: năm học có Trí tuệ từ 80 được giảm học phí.
  const scholarship = fullTuition && (player.intelligence ?? 0) >= SCHOLARSHIP.minIntellect;
  const tuitionAmount = scholarship ? Math.round((fullTuition * (1 - SCHOLARSHIP.rate)) / 1000) * 1000 : fullTuition;
  const tuition = tuitionAmount
    ? { amount: tuitionAmount, content: `🎓 Học phí năm học tại ${player.careerPath.school.name}: -${formatSalary(tuitionAmount)}` +
      (scholarship ? ` (học bổng khuyến khích giảm ${Math.round(SCHOLARSHIP.rate * 100)}% nhờ kết quả học tập tốt).` : ".") }
    : null;
  if (tuition) player.money -= tuition.amount;
  const livingAmount = getLivingCost(age, (salary?.amount ?? 0) + (sideJobs?.amount ?? 0), player.livingMode);
  const living = livingAmount
    ? { amount: livingAmount, content: `🏠 Chi phí sinh hoạt (ăn ở, đi lại, hóa đơn): -${formatSalary(livingAmount)}.` }
    : null;
  if (living) player.money -= living.amount;
  if (childcare.amount) {
    player.money -= childcare.amount;
    player.children = (player.children ?? []).map(child => childcare.charges.some(charge => charge.id === child.id)
      ? { ...child, lastCarePaidAtAge: age } : child);
  }
  // Nợ thời sinh viên chưa bị phạt; từ tuổi tự lo sinh hoạt mà cuối năm ví còn âm thì phải sống tằn tiện.
  if (living && player.money < 0) {
    player.happiness = Math.max(0, (player.happiness ?? 0) - LIVING_SHORTFALL_HAPPINESS);
    living.content += ` Ví đang âm ${formatSalary(-player.money)} nên phải sống tằn tiện (Hạnh phúc -${LIVING_SHORTFALL_HAPPINESS}).`;
  }
  if (living && player.livingMode === "frugal") {
    player.happiness = Math.max(0, (player.happiness ?? 0) + LIVING_MODES.frugal.happiness);
    living.content += ` Đang sống tiết kiệm (Hạnh phúc ${LIVING_MODES.frugal.happiness}).`;
  }
  return { salary, childcare, schooling, tuition, employment, family, health, mood, livestock, sideJobs, living, illness, lottery, graduation, cognition: aging };
}

// Dự báo năm tới: thu nhập (lương, làm thêm) và chi phí bắt buộc (sinh hoạt, nuôi con, học phí).
export function forecastNextYear(player) {
  const age = (player.age ?? 0) + 1;
  const salary = player.employmentStatus === "employed" && player.layoffDue !== age && player.contractEndAge !== age
    ? getAnnualSalaryPayment(player, age)?.amount ?? 0 : 0;
  const sideJobs = player.restYear === age ? 0 : (player.sideJobs ?? [])
    .reduce((sum, job) => sum + (job.startedAtAge < age ? ({ "part-time": 12_000_000, "full-time": 72_000_000 })[job.shift] ?? 0 : 0), 0);
  const income = salary + sideJobs;
  const living = getLivingCost(age, income, player.livingMode);
  const childcare = getChildcareExpenses(player, age).amount ?? 0;
  const baseTuition = age >= TUITION_FIRST_AGE && age <= TUITION_LAST_AGE ? getAnnualTuition(player.careerPath) : 0;
  const tuition = (player.intelligence ?? 0) >= SCHOLARSHIP.minIntellect ? Math.round((baseTuition * (1 - SCHOLARSHIP.rate)) / 1000) * 1000 : baseTuition;
  const costs = living + childcare + tuition;
  return { age, income, costs, living, childcare, tuition, after: (player.money ?? 0) + income - costs };
}
