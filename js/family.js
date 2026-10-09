import { maleNames, femaleNames } from "./character-data.js";
import { collectAssetIncome } from "./shop.js";
import { collectSideJobYear } from "./side-jobs.js";
import { collectIllnessYear } from "./hospital.js";
import { completeCareerYear, formatSalary } from "./career-salary.js";
import { createSchoolEntryReward } from "./school-rewards.js";

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
// thu nhập từ công việc (lương chính + làm thêm). Không có thu nhập thì không bị trừ.
export const LIVING_COST_MIN_AGE = 23;
export const LIVING_COST_RATE = 0.3;
export function getLivingCost(age, income) {
  if (!Number.isInteger(age) || age < LIVING_COST_MIN_AGE || !(income > 0)) return 0;
  return Math.round((income * LIVING_COST_RATE) / 1000) * 1000;
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

export function completeLifeYear(player, age, updates = {}, schoolReward) {
  migrateChildcareDebt(player, updates);
  const schooling = schoolReward === undefined ? createSchoolEntryReward(player, age, updates) : schoolReward;
  const yearUpdates = schooling && !player.schoolRewardsReceived?.[schooling.id]
    ? { ...updates, ...schooling.updates } : updates;
  const childcare = getChildcareExpenses(player, age, updates);
  const salary = completeCareerYear(player, age, yearUpdates);
  // Lãi vật nuôi, cho thuê và kinh doanh cộng sau khi kết quả sự kiện đã ghi đè tiền trong ví.
  const livestock = collectAssetIncome(player, age);
  const sideJobs = collectSideJobYear(player, age);
  const illness = collectIllnessYear(player, age);
  const livingAmount = getLivingCost(age, (salary?.amount ?? 0) + (sideJobs?.amount ?? 0));
  const living = livingAmount
    ? { amount: livingAmount, content: `🏠 Chi phí sinh hoạt (ăn ở, đi lại, hóa đơn): -${formatSalary(livingAmount)}.` }
    : null;
  if (living) player.money -= living.amount;
  if (childcare.amount) {
    player.money -= childcare.amount;
    player.children = (player.children ?? []).map(child => childcare.charges.some(charge => charge.id === child.id)
      ? { ...child, lastCarePaidAtAge: age } : child);
  }
  return { salary, childcare, schooling, livestock, sideJobs, living, illness };
}
