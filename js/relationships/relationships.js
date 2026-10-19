import { getDatingExpenses } from "./dating-expenses.js";
import { getChildActions, getChildActionBlock, interactWithChild } from "./child-interactions.js";
import { createFamilyConversation, rememberFamilyConversation } from "./family-conversations.js";
import { createChildConversation } from "./child-conversations.js";
import { getDatingPartners, addDatingPartnerUpdates, selectDatingPartnerUpdates, removeDatingPartnerUpdates } from './concurrent-dating.js';
import { maleNames, femaleNames } from "../core/character-data.js";
import { getEmploymentContext } from "../career/career-jobs.js";
import { ensureEventOpenMoji } from "../media/event-openmoji.js";
import { getChildAge, getAnnualChildcareCost } from "./family.js";
import { formatSalary } from "../career/career-salary.js";
import { initPanelTabs } from "../ui/panel-tabs.js";
import { MOOD_EFFECTS, PARTNER_ACTIONS, addMoodEffect } from "../stats/mood-rules.js";
import { CONDITIONS, RELATIVE_ACTIONS, getRelativeActionConfig, ensureRelatives, getPartnerAge, getRelativeAge } from "./family-members.js";
import { formatMoney } from "../core/money-format.js";
import { applyActivityGain } from "../core/stat-budget.js";
import { isInPrison } from "../events/crime.js";
import { getRomanceChance } from "../stats/appearance-rules.js";
import { getCasualRomanceNote } from "./casual-romance.js";

 
 
const PRISON_BLOCKED_RELATIVE = ["visit", "care"];
const PRISON_BLOCKED_PARTNER = ["together", "care"];
const PRISON_NOTE = "Đang thụ án: chưa thể làm việc này.";

const pick = (items, random) => items[Math.floor(random() * items.length)];
const integer = (min, max, random) => min + Math.floor(random() * (max - min + 1));
const surnames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Đặng", "Bùi", "Đỗ", "Hồ"];
const traits = ["ấm áp", "hài hước", "điềm tĩnh", "năng động", "chu đáo", "thẳng thắn", "sáng tạo", "kiên nhẫn", "lạc quan", "hơi nhút nhát"];
const reasons = [
  "thích cách tôi lắng nghe và nhớ những chuyện nhỏ của người khác",
  "ấn tượng vì tôi sẵn lòng giúp mọi người khi công việc rối lên",
  "thích sự hài hước của tôi, kể cả những câu đùa hơi nhạt",
  "quý cách tôi nhận lỗi và cố gắng làm tốt hơn mỗi ngày",
  "thấy tôi chân thành, nói được và cố gắng làm được",
  "rung động sau lần tôi hỏi thăm khi họ có một ngày mệt mỏi",
];

export function getZodiac(day, month) {
  const boundaries = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];
  const signs = ["Ma Kết", "Bảo Bình", "Song Ngư", "Bạch Dương", "Kim Ngưu", "Song Tử", "Cự Giải", "Sư Tử", "Xử Nữ", "Thiên Bình", "Bọ Cạp", "Nhân Mã", "Ma Kết"];
  return signs[month - 1 + (day >= boundaries[month - 1] ? 1 : 0)];
}

export function createAdmirer(player, age, random = Math.random) {
  const ownGender = player.gender === "female" ? "female" : "male";
  const otherGender = ownGender === "male" ? "female" : "male";
  const gendersByOrientation = {
    heterosexual: [otherGender],
    homosexual: [ownGender],
    bisexual: ["male", "female"],
    pansexual: ["male", "female"],
  };
  const eligibleGenders = gendersByOrientation[player.orientation] ?? ["male", "female"];
   
  const gender = eligibleGenders.length === 1
    ? eligibleGenders[0]
    : pick(eligibleGenders, random);
  const month = integer(1, 12, random);
  const day = integer(1, [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1], random);
  const firstTrait = pick(traits, random);
  const secondTrait = pick(traits.filter(trait => trait !== firstTrait), random);
  return {
    id: `admirer-${age}-${Math.floor(random() * 1e9)}`,
    name: `${pick(surnames, random)} ${pick(gender === "female" ? femaleNames : maleNames, random)}`,
    gender, birthDay: day, birthMonth: month, zodiac: getZodiac(day, month),
    ageAtMeeting: integer(Math.max(18, age - 4), age + 4, random), metAtAge: age,
    personality: `${firstTrait}, ${secondTrait}`, reason: pick(reasons, random),
    relationship: 80,
    workplace: player.careerPath?.id === "esports" && player.careerPath.school?.name
      ? `khu tập luyện của ${player.careerPath.school.name}`
      : getEmploymentContext(player.careerPath?.id).place,
    stats: {
      health: integer(30, 100, random), intelligence: integer(30, 100, random),
      happiness: integer(30, 100, random), appearance: integer(30, 100, random),
    },
  };
}

export function describePerson(person, currentAge = person.metAtAge) {
  const birthday = `${String(person.birthDay).padStart(2, "0")}/${String(person.birthMonth).padStart(2, "0")}`;
  const age = person.ageAtMeeting + Math.max(0, currentAge - person.metAtAge);
  return `${person.name} · ${person.gender === "female" ? "Nữ" : "Nam"} · ${age} tuổi\n🎂 Sinh nhật: ${birthday} · ${person.zodiac}\n✨ Tính cách: ${person.personality}\n💪 Sức khỏe ${person.stats.health}% · 🧠 Trí tuệ ${person.stats.intelligence}%\n❤️ Hạnh phúc ${person.stats.happiness}% · 👁️ Ngoại hình ${person.stats.appearance}%`;
}

export function canStartRelationship(player) {
  return !player.casualService && !(player.prison && player.prison.releaseAge > player.age) && getDatingPartners(player).length < 2 && player.marriedAtAge == null && player.isAlive !== false;
}

export function createDatingEvent(player, age, random = Math.random) {
  if (!canStartRelationship(player) || player.datingActivitiesOnly) return null;
  if (player.casualLife) return createCasualDatingEvent(player, age, random);
  const person = createAdmirer(player, age, random);
  const working = player.employmentStatus === "employed";
  const setting = working ? `Trong một ngày làm việc tại ${person.workplace}`
    : `Trong lần ghé ${person.workplace} tìm cơ hội việc làm`;
  const image = new URL("../img/events/openmoji/color/svg/1F48C.svg", import.meta.url).href;
  const art = { image, imageAlt: "OpenMoji: Thư ngỏ lời làm quen",
    imageFallback: image, imageFallbackAlt: "OpenMoji: Thư ngỏ lời làm quen" };
  return {
    id: `a${age}-workplace-admirer`, kind: "workplace-dating", person,
    ...art,
    title: "💌 Có người để ý tôi!",
    text: `${setting}, ${person.name} ngỏ lời làm quen. Người ấy ${person.reason}. Tôi tưởng người ta hỏi tiến độ, hóa ra hỏi… mình có người yêu chưa!\n\n${describePerson(person)}\n\nTôi có muốn thử hẹn hò không?`,
    choices: [
      {
        label: "💞 Thử hẹn hò nhé!",
        acceptDating: true, title: "💞 Một mối quan hệ mới",
        text: `Tôi và ${person.name} đồng ý tìm hiểu nhau. Từ nay, giờ nghỉ không chỉ có cà phê mà còn có người để mong gặp!`,
        effects: { happiness: 3 }, confirmText: "Mở lòng thôi!",
        achievementIds: ["first-love"],
        logContent: `💞 Tôi bắt đầu hẹn hò với ${person.name} tại ${person.workplace}. Người ấy ${person.reason}.\n${describePerson(person)}`,
        logSummary: `💞 Bắt đầu hẹn hò với ${person.name}.`,
      },
      {
        label: "🤝 Mình làm bạn thôi!",
        acceptDating: false, title: "🤝 Một lời từ chối tử tế",
        text: `Tôi cảm ơn ${person.name} và nói rõ cảm xúc của mình. Người ấy tôn trọng quyết định; chúng tôi vẫn cư xử thân thiện.`,
        effects: {}, confirmText: "Tôn trọng nhau là được!",
      },
    ].map(branch => ensureEventOpenMoji({ ...branch, ...art })),
  };
}

export function getDatingUpdates(player, person, age) {
  const updates = addDatingPartnerUpdates(player, person, age);
  if (!Object.keys(updates).length) return {};
  return { ...updates, relationshipHistory: [...(player.relationshipHistory ?? []),
    { age, type: "dating", person, text: `Tôi bắt đầu hẹn hò với ${person.name}${player.partner ? '. Tôi hiện đang tìm hiểu hai người cùng lúc' : ''}.` }],
    marriageScheduleVersion: 2,
    ...(player.partner ? {} : { marriedAtAge: null, childProposalDeclines: 0, nextChildProposalAge: null,
      childProposalStopped: false, childProposalCompleted: false }) };
}

export function getRelationshipStartAge(player) {
  if (Number.isInteger(player.relationshipStartedAtAge)) return player.relationshipStartedAtAge;
  const beginning = [...(player.relationshipHistory ?? [])].reverse().find(entry =>
    entry.type === "dating" && entry.person?.id === player.partner?.id);
  return beginning?.age ?? player.partner?.metAtAge ?? player.age;
}

export function restoreMarriageSchedule(player, version = player.marriageScheduleVersion) {
  if (player.partner) {
    player.relationshipStartedAtAge = getRelationshipStartAge(player);
    if (player.marriedAtAge == null && !(player.marriageProposalDeclines > 0) && version !== 2) {
      player.nextMarriageProposalAge = player.relationshipStartedAtAge + 5;
    }
  }
  player.marriageScheduleVersion = 2;
}

export function createMarriageEvent(player, age) {
  if (!player.partner || player.marriedAtAge != null || player.isAlive === false) return null;
  // Check both schedules, independent of the person selected in the UI.
  const duePerson = getDatingPartners(player).find(person => {
    const context = { ...player, ...selectDatingPartnerUpdates(player, person.id) };
    return age >= (context.nextMarriageProposalAge ?? getRelationshipStartAge(context) + 5);
  });
  if (!duePerson) return null;
  player = { ...player, ...selectDatingPartnerUpdates(player, duePerson.id) };
  const dueAge = player.nextMarriageProposalAge ?? (getRelationshipStartAge(player) + 5);
  if (age < dueAge) return null;
  const person = player.partner;
  const askingAgain = (player.marriageProposalDeclines ?? 0) > 0;
  const image = new URL("../img/events/openmoji/color/svg/1F48C.svg", import.meta.url).href;
  return {
    id: `marriage-${person.id}-${askingAgain ? "retry" : "first"}`,
    kind: "marriage-proposal", person,
    title: askingAgain ? "💍 Mình đã sẵn sàng cưới chưa?" : "💍 Mình cưới nhau nhé?",
    text: askingAgain
      ? `${person.name} nhắc lại chuyện cưới hỏi sau thời gian chờ đợi: “Mình đã nói về việc này rồi. Bây giờ bạn có muốn cùng tôi xây dựng cuộc sống chung không?” Người ấy nói rõ rằng nếu tôi vẫn không muốn cưới, hai người sẽ chia tay vì mong muốn tương lai khác nhau.`
      : `Trong một buổi trò chuyện yên tĩnh, ${person.name} nắm tay tôi và hỏi: “Mình đã cùng nhau trải qua nhiều chuyện. Bạn có muốn cưới tôi và xây dựng cuộc sống chung không?” Tôi cần trả lời thật lòng về điều mình muốn.`,
    image, imageAlt: "Lời hỏi cưới từ người yêu", imageFallback: image,
    imageFallbackAlt: "Lời hỏi cưới từ người yêu",
    choices: [
      { label: getDatingPartners(player).length > 1 ? `💍 Cưới ${person.name}, kết thúc mối quan hệ còn lại` : "💍 Đồng ý, mình cưới nhau!", marriageDecision: "accept",
        title: "💍 Cùng nhau xây dựng gia đình",
        text: `Tôi đồng ý cưới ${person.name}.${getDatingPartners(player).length > 1 ? " Tôi nói rõ và kết thúc mối quan hệ còn lại trước khi cưới." : ""} Chúng tôi cùng bàn bạc, tổ chức một buổi lễ phù hợp và chính thức trở thành bạn đời. Một chương mới bắt đầu từ sự tự nguyện của cả hai.`,
        effects: { happiness: 5 }, confirmText: "Bắt đầu cuộc sống chung!" },
      { label: askingAgain ? "Không, tôi vẫn không muốn cưới" : "Tôi chưa muốn cưới",
        marriageDecision: "decline",
        title: askingAgain ? "💔 Hai người chọn hai con đường" : "💬 Cần thêm thời gian",
        text: askingAgain
          ? `${person.name} buồn nhưng nói rõ rằng không thể tiếp tục chờ đợi. Vì tôi vẫn không muốn cưới, người ấy quyết định chia tay và cắt đứt mối quan hệ.`
          : `Tôi nói thật rằng mình chưa muốn cưới. ${person.name} đồng ý cho cả hai thêm thời gian và hẹn sẽ nói lại chuyện này sau hai năm, khi tôi ${age + 2} tuổi.`,
        effects: { happiness: askingAgain ? -5 : -1 },
        confirmText: askingAgain ? "Chấp nhận chia tay" : "Dành thời gian suy nghĩ" },
    ].map(branch => ({ ...branch, image, imageAlt: "Câu chuyện tình cảm",
      imageFallback: image, imageFallbackAlt: "Câu chuyện tình cảm",
      achievementIds: branch.marriageDecision === "accept" ? ["married"] : [] })),
  };
}

function getSingleMarriageUpdates(player, person, age, decision) {
  if (!player.partner || player.partner.id !== person?.id || player.marriedAtAge != null) return {};
  const history = [...(player.relationshipHistory ?? [])];
  if (decision === "accept") {
    history.push({ age, type: "married", person,
      text: `Tôi và ${person.name} đồng ý cưới và chính thức trở thành bạn đời.` });
    return { marriedAtAge: age, nextMarriageProposalAge: null,
      marriageProposalDeclines: 0, relationshipHistory: history,
      nextChildProposalAge: age + 5, childProposalDeclines: 0,
      childProposalStopped: false, childProposalCompleted: false };
  }
  if (decision !== "decline") return {};
  if (!(player.marriageProposalDeclines > 0)) {
    history.push({ age, type: "marriage-postponed", person,
      text: `Tôi chưa muốn cưới ${person.name}. Cả hai hẹn nói lại chuyện cưới hỏi sau hai năm.` });
    return { marriageProposalDeclines: 1, nextMarriageProposalAge: age + 2,
      relationshipHistory: history };
  }
  history.push({ age, type: "breakup", person,
    text: `${person.name} chia tay và cắt đứt mối quan hệ vì tôi tiếp tục từ chối cưới sau thời gian chờ đợi.` });
  return { moodEffects: addMoodEffect(player, "breakup", age), partnerPromise: null, partner: null, marriedAtAge: null, nextMarriageProposalAge: null,
    marriageProposalDeclines: 0, relationshipStartedAtAge: null,
    nextChildProposalAge: null, childProposalDeclines: 0,
    childProposalStopped: false, childProposalCompleted: false,
    datingActivitiesOnly: true, relationshipHistory: history };
}

export function getMarriageUpdates(player, person, age, decision) {
  if (player.marriedAtAge != null || !getDatingPartners(player).some(item => item.id === person?.id)) return {};
  const selected = selectDatingPartnerUpdates(player, person.id);
  const context = { ...player, ...selected };
  const updates = getSingleMarriageUpdates(context, context.partner, age, decision);
  if (!Object.keys(updates).length) return {};
  if (decision === 'accept') {
    const history = updates.relationshipHistory;
    return { ...selected, ...updates, otherPartners: [],
      relationshipHistory: [...history.slice(0, -1),
        ...getDatingPartners(context).filter(item => item.id !== person.id).map(item => ({
          age, type: 'breakup', person: item, text: `Tôi kết thúc mối quan hệ với ${item.name} trước khi cưới ${person.name}.`,
        })), history.at(-1)] };
  }
  return { ...selected, ...updates,
    ...(updates.partner === null ? removeDatingPartnerUpdates(context, person.id) : {}) };
}

export function getBreakupUpdates(player) {
  if (!player.partner || player.isAlive === false) return {};
  const person = player.partner;
  const text = player.marriedAtAge != null
    ? `Tôi và ${person.name} kết thúc hôn nhân.` : `Tôi chủ động chia tay ${person.name}.`;
  const grief = MOOD_EFFECTS.breakup;
  return { partner: null, marriedAtAge: null, relationshipStartedAtAge: null, partnerPromise: null,
    affair: null,
    happiness: Math.max(0, (player.happiness ?? 0) - grief.immediate),
    moodEffects: addMoodEffect(player, "breakup", player.age),
    nextMarriageProposalAge: null, marriageProposalDeclines: 0,
    nextChildProposalAge: null, childProposalDeclines: 0,
    childProposalStopped: false, childProposalCompleted: false, datingActivitiesOnly: true,
    relationshipHistory: [...(player.relationshipHistory ?? []),
      { age: player.age, type: "breakup", person, text }],
    ...removeDatingPartnerUpdates(player, person.id) };
}

export function initRelationships(state, save = () => {}, onChange = () => {}) {
  const button = document.getElementById("relationships");
  const dialog = document.getElementById("relationships-dialog");
   
  const selectTab = initPanelTabs(dialog, document.getElementById("relationship-tabs"));
  const current = document.getElementById("relationship-current");
  const history = document.getElementById("relationship-history");
  const breakup = document.getElementById("breakup-relationship");
  const confirmation = document.getElementById("breakup-confirmation");
  const actions = document.createElement("div");
  actions.id = "relationship-actions";
  actions.className = "shop-groups relationship-actions";
  current.after(actions);

   
   
  function act(type) {
    const player = state.player;
    const partner = player.partner;
    if (!partner || player.isAlive === false) return;
    if (isInPrison(player) && PRISON_BLOCKED_PARTNER.includes(type)) return;
    const done = player.partnerActions ?? {};
    if (done[type] === player.age) return;
    const promise = player.partnerPromise?.partnerId === partner.id ? player.partnerPromise : null;
    let text;
    if (type === "care") {
      player.health = Math.max(1, (player.health ?? 0) - 2);
      player.partner = { ...partner, relationship: Math.min(100, (partner.relationship ?? 80) + 3), caredAt: player.age,
        interactions: { ...(partner.interactions ?? {}), cares: (partner.interactions?.cares ?? 0) + 1 } };
      text = `🩺 Tôi dành thời gian chăm sóc ${partner.name} lúc ốm yếu. Quan hệ +3% · Sức khỏe -2.`;
    } else if (type === "space") {
      if (promise) return;
      player.partnerPromise = { partnerId: partner.id, madeAt: player.age, dueAge: player.age + PARTNER_ACTIONS.promiseYears };
      text = `🤫 Tôi xin ${partner.name} cho mình chút không gian riêng và hẹn sẽ nói chuyện lại trước sinh nhật ${player.partnerPromise.dueAge + 1} tuổi.`;
    } else {
      const reward = PARTNER_ACTIONS[type];
      const beforeRelationship = partner.relationship ?? 80;
      const happinessGain = applyActivityGain(player, "happiness", reward.happiness);
      player.partner = { ...partner, relationship: Math.min(100, beforeRelationship + reward.relationship) };
      const gains = [
        happinessGain ? `Hạnh phúc +${happinessGain}` : "",
        player.partner.relationship > beforeRelationship ? `Quan hệ +${player.partner.relationship - beforeRelationship}%` : "",
      ].filter(Boolean).join(" · ");
      text = (type === "talk"
        ? `💬 Tôi và ${partner.name} ngồi trò chuyện, kể cho nhau nghe những điều trong lòng.`
        : `🌿 Tôi và ${partner.name} dành trọn một ngày cho nhau, không điện thoại, không công việc.`) +
        (type === "talk" && promise ? " Tôi đã giữ lời hẹn nói chuyện." : "") + (gains ? ` ${gains}.` : "");
      if (type === "talk" && promise) player.partnerPromise = null;
      const counter = type === "talk" ? "talks" : "together";
      player.partner = { ...player.partner, interactions: { ...(player.partner.interactions ?? {}), [counter]: (player.partner.interactions?.[counter] ?? 0) + 1 } };
    }
    player.partnerActions = { ...done, [type]: player.age };
    const log = { age: player.age, content: text, summary: text };
    state.logs.push(log);
    save();
    render();
    onChange(log);
  }

  function renderActions() {
    actions.replaceChildren();
    const player = state.player;
    const partner = player.partner;
    if (!partner || player.isAlive === false) return;
    const done = player.partnerActions ?? {};
    const promise = player.partnerPromise?.partnerId === partner.id ? player.partnerPromise : null;
    const option = (type, label, note, disabled) => {
      const node = document.createElement("button");
      node.type = "button";
      node.className = "shop-group relationship-action";
      node.dataset.action = type;
      node.textContent = label;
      const small = document.createElement("span");
      small.className = "side-job-note";
      const jailed = isInPrison(player) && PRISON_BLOCKED_PARTNER.includes(type);
      small.textContent = jailed ? PRISON_NOTE : note;
      node.append(small);
      node.disabled = disabled || jailed;
      node.addEventListener("click", () => act(type));
      actions.append(node);
    };
    option("talk", "💬 Trò chuyện, tâm sự",
      done.talk === player.age ? "Đã trò chuyện năm nay." : `Hạnh phúc +${PARTNER_ACTIONS.talk.happiness}, Quan hệ +${PARTNER_ACTIONS.talk.relationship}%${promise ? " · giữ lời hẹn" : ""}. Mỗi năm một lần.`,
      done.talk === player.age);
    option("together", "🌿 Dành thời gian cùng nhau",
      done.together === player.age ? "Đã dành thời gian cùng nhau năm nay." : `Hạnh phúc +${PARTNER_ACTIONS.together.happiness}, Quan hệ +${PARTNER_ACTIONS.together.relationship}%. Mỗi năm một lần.`,
      done.together === player.age);
    if (["weak", "severe"].includes(partner.condition)) {
      option("care", `🩺 Chăm sóc ${partner.name}`, done.care === player.age
        ? "Đã chăm sóc năm nay."
        : `${partner.name} đang ${CONDITIONS[partner.condition].label.toLowerCase()}. Quan hệ +3%, Sức khỏe của bạn -2 vì vất vả. Giúp ích nhưng không bảo đảm khỏi bệnh.`,
        done.care === player.age);
    }
    option("space", "🤫 Xin không gian riêng, hẹn trò chuyện sau",
      promise ? `Đã hẹn: trò chuyện trước sinh nhật ${promise.dueAge + 1} tuổi để giữ lời.` : `Không bị trừ quan hệ nếu giữ lời hẹn; bỏ hẹn thì Quan hệ -${PARTNER_ACTIONS.brokenPromise}%.`,
      Boolean(promise) || done.space === player.age);
  }

  const family = document.getElementById("relationship-family");
  const conversationDialog = document.getElementById("family-conversation-dialog");
  const conversationBody = document.getElementById("family-conversation-body");
  let conversationDraft = null;
  const conversationText = (text, className) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    if (className) paragraph.className = className;
    return paragraph;
  };
  function openFamilyConversation(relative, type) {
    if (conversationDialog.open) return;
    const scene = createFamilyConversation(state.player, relative, type);
    if (!scene) return;
    conversationDraft = scene;
    document.getElementById("family-conversation-title").textContent = scene.title;
    conversationBody.replaceChildren(conversationText(scene.greeting));
    if (scene.recall) conversationBody.append(conversationText(scene.recall, "family-conversation-recall"));
    const prompt = conversationText(scene.prompt);
    prompt.id = "family-conversation-prompt";
    conversationBody.append(prompt);
    const choices = document.createElement("div");
    choices.className = "family-conversation-choices";
    for (const choice of scene.choices) {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "shop-group";
      option.dataset.familyChoice = choice.id;
      option.textContent = choice.label;
      option.addEventListener("click", () => {
        if (!conversationDialog.open || conversationDraft !== scene) return;
        const result = relativeAction(relative.id, type, { sceneId: scene.id, age: scene.age, choiceId: choice.id });
        conversationDraft = null;
        if (!result) {
          conversationDialog.close();
          return;
        }
        conversationBody.replaceChildren(conversationText(`Bạn: “${choice.label}”`));
        const reply = conversationText(result.reply);
        reply.id = "family-conversation-prompt";
        conversationBody.append(reply, conversationText("Câu chuyện đã được lưu trong kỷ niệm chung.", "side-job-note"));
        const back = document.createElement("button");
        back.type = "button";
        back.className = "shop-group";
        back.textContent = "Về với gia đình";
        back.addEventListener("click", () => conversationDialog.close());
        conversationBody.append(back);
        back.focus();
      });
      choices.append(option);
    }
    const cost = getRelativeActionConfig(state.player, type).cost;
    conversationBody.append(choices, conversationText(cost
      ? `Chuyến thăm tốn ${formatMoney(cost)}. Chỉ tính khi bạn chọn câu trả lời; đóng lại để quay về.`
      : "Chọn cách đáp lời để tiếp tục. Đóng lại sẽ chưa tính lượt tương tác.", "side-job-note"));
    conversationDialog.showModal();
    conversationDialog.scrollTop = 0;
  }
  // Trò chuyện với con dùng chung hộp “Chuyện nhà” với bố mẹ.
  function openChildConversation(child) {
    if (conversationDialog.open) return;
    const scene = createChildConversation(state.player, child);
    if (!scene) return;
    conversationDraft = scene;
    document.getElementById("family-conversation-title").textContent = scene.title;
    conversationBody.replaceChildren(conversationText(scene.greeting));
    if (scene.recall) conversationBody.append(conversationText(scene.recall, "family-conversation-recall"));
    const prompt = conversationText(scene.prompt);
    prompt.id = "family-conversation-prompt";
    conversationBody.append(prompt);
    const choices = document.createElement("div");
    choices.className = "family-conversation-choices";
    for (const choice of scene.choices) {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "shop-group";
      option.dataset.childChoice = choice.id;
      option.textContent = choice.label;
      option.addEventListener("click", () => {
        if (!conversationDialog.open || conversationDraft !== scene) return;
        const log = interactWithChild(state.player, child.id, "talk", { sceneId: scene.id, age: scene.age, choiceId: choice.id });
        conversationDraft = null;
        if (!log) {
          conversationDialog.close();
          return;
        }
        state.logs.push(log);
        save();
        render();
        onChange(log);
        conversationBody.replaceChildren(conversationText(`Bạn: “${choice.label}”`));
        const reply = conversationText(choice.reply);
        reply.id = "family-conversation-prompt";
        conversationBody.append(reply, conversationText("Câu chuyện đã được lưu trong kỷ niệm cùng con.", "side-job-note"));
        const back = document.createElement("button");
        back.type = "button";
        back.className = "shop-group";
        back.textContent = "Về với gia đình";
        back.addEventListener("click", () => conversationDialog.close());
        conversationBody.append(back);
        back.focus();
      });
      choices.append(option);
    }
    conversationBody.append(choices, conversationText("Chọn cách đáp lời để tiếp tục. Đóng lại sẽ chưa tính lượt trò chuyện năm nay.", "side-job-note"));
    conversationDialog.showModal();
    conversationDialog.scrollTop = 0;
  }
  document.getElementById("close-family-conversation").addEventListener("click", () => conversationDialog.close());
  conversationDialog.addEventListener("close", () => {
    if (conversationDialog.open) return;
    conversationDraft = null;
    if (dialog.open) {
      const heading = document.getElementById("relationship-family-title");
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  });
  dialog.addEventListener("close", () => {
    if (conversationDialog.open) conversationDialog.close();
  });
  function renderSharedMemories(card, relative) {
    const memories = relative.conversationMemories;
    if (!Array.isArray(memories) || !memories.length) return;
    const details = document.createElement("details");
    details.className = "family-shared-memories";
    const heading = document.createElement("summary");
    heading.textContent = `Kỷ niệm chung · ${memories.length} câu chuyện gần đây`;
    const list = document.createElement("ol");
    for (const memory of [...memories].reverse()) {
      const item = document.createElement("li");
      item.textContent = `${memory.age} tuổi · ${memory.memory} ${memory.reply}`;
      list.append(item);
    }
    details.append(heading, list);
    card.append(details);
  }
  function relativeAction(id, type, conversationAnswer = null) {
    const player = state.player;
    const relative = (player.relatives ?? []).find((entry) => entry.id === id);
    const config = getRelativeActionConfig(player, type);
    if (!relative?.alive || !config || player.isAlive === false || relative.done?.[type] === player.age) return;
    if (isInPrison(player) && PRISON_BLOCKED_RELATIVE.includes(type)) return;
    if (config.cost && player.money < config.cost) return;
    let conversation = null;
    if (["call", "visit"].includes(type)) {
      if (!conversationAnswer) return openFamilyConversation(relative, type);
      const scene = createFamilyConversation(player, relative, type);
      if (!scene || conversationAnswer.age !== player.age || scene.id !== conversationAnswer.sceneId) return;
      conversation = rememberFamilyConversation(relative, scene, conversationAnswer.choiceId);
      if (!conversation) return;
    }
    const next = { ...relative, done: { ...(relative.done ?? {}), [type]: player.age }, interactions: { ...(relative.interactions ?? {}) } };
    if (conversation) next.conversationMemories = conversation.memories;
    const who = `${relative.role.toLowerCase()} ${relative.name}`;
    const count = (key) => { next.interactions[key] = (next.interactions[key] ?? 0) + 1; };
    let text;
    if (type === "postpone") {
      next.promise = { dueAge: player.age + 1 };
      text = `🗓️ Tôi xin ${who} hẹn lần sau vì đang bận, hứa sẽ gọi hoặc về thăm trước sinh nhật ${player.age + 2} tuổi.`;
    } else {
      player.money -= config.cost;
      const oldBond = next.bond ?? 70;
      next.bond = Math.max(0, Math.min(100, oldBond + config.bond + (conversation?.choice.bond ?? 0)));
      const bondGain = next.bond - oldBond;
      const happiness = (config.happiness ?? 0) + (conversation?.choice.happiness ?? 0);
      let happinessGain = 0;
      if (happiness > 0) happinessGain = applyActivityGain(player, "happiness", happiness);
      else if (happiness < 0) {
        const before = player.happiness ?? 0;
        player.happiness = Math.max(0, before + happiness);
        happinessGain = player.happiness - before;
      }
      if (config.health) player.health = Math.max(1, (player.health ?? 0) + config.health);
      const kept = next.promise && ["call", "visit"].includes(type);
      if (kept) next.promise = null;
      if (type === "call") { count("calls"); text = player.age < 18 ? `🤗 Tôi chơi và trò chuyện cùng ${who}.` : `📞 Tôi gọi điện hỏi thăm ${who}.`; }
      if (type === "visit") { count("visits"); text = player.age < 18 ? `🏠 Tôi dành thời gian bên ${who}, cùng ăn cơm và chơi ở nhà.` : `🏠 Tôi về thăm ${who}, cả nhà ăn cơm và trò chuyện đến khuya.`; }
      if (type === "care") { count("cares"); next.caredAt = player.age; next.careBy = "self"; text = `🩺 Tôi trực tiếp chăm sóc ${who} khi đang ${CONDITIONS[next.condition].label.toLowerCase()}.`; }
      if (type === "helper") { count("helpers"); next.caredAt = player.age; next.careBy = "helper"; text = `🤝 Tôi nhờ người hỗ trợ chăm sóc ${who} hằng ngày.`; }
      if (type === "treatment") {
        count("treatments");
        next.treatedAt = player.age;
        next.condition = "weak";
        text = `💊 Tôi tìm nơi điều trị cho ${who}; bệnh tình đã đỡ hơn (còn yếu, cần tiếp tục chăm sóc).`;
      }
      if (conversation) text += ` Tôi chọn: “${conversation.choice.label}”. ${conversation.choice.reply}`;
      const parts = [config.cost ? `Tiền -${formatMoney(config.cost)}` : "", `Gắn kết ${bondGain >= 0 ? "+" : ""}${bondGain}`,
        happinessGain ? `Hạnh phúc ${happinessGain >= 0 ? "+" : ""}${happinessGain}` : "", config.health ? `Sức khỏe ${config.health}` : "", kept ? "giữ lời hẹn" : ""];
      text += ` ${parts.filter(Boolean).join(" · ")}.`;
    }
    player.relatives = player.relatives.map((entry) => (entry.id === id ? next : entry));
    const log = { age: player.age, content: text, summary: text };
    state.logs.push(log);
    save();
    render();
    onChange(log);
    return conversation ? { reply: conversation.choice.reply } : null;
  }
  function renderFamily() {
    if (!family) return;
    family.replaceChildren();
    const player = state.player;
    ensureRelatives(player);
    if ((player.age ?? 0) < 6) {
      const note = document.createElement("p");
      note.className = "side-job-intro";
      note.textContent = "Từ 6 tuổi, bạn có thể tương tác với gia đình.";
      family.append(note);
    }
    for (const relative of player.relatives) {
      const card = document.createElement("article");
      card.className = `family-member${relative.alive ? "" : " is-passed"}`;
      const title = document.createElement("h4");
      const info = document.createElement("p");
      if (!relative.alive) {
        title.textContent = `🕯️ ${relative.role} ${relative.name}`;
        info.textContent = relative.passedBeforeTracking ? "Đã mất từ trước." : `Đã mất khi bạn ${relative.diedAtAge} tuổi, hưởng thọ ${getRelativeAge(relative, player.age)}.`;
        card.append(title, info);
        renderSharedMemories(card, relative);
        family.append(card);
        continue;
      }
      const condition = CONDITIONS[relative.condition ?? "healthy"];
      title.textContent = `${relative.role === "Bố" ? "👨" : "👩"} ${relative.role} ${relative.name} · ${getRelativeAge(relative, player.age)} tuổi`;
      info.textContent = `💞 Gắn kết: ${relative.bond}% · ${condition.icon} Sức khỏe: ${condition.label}` +
        (relative.promise ? `\n🗓️ Đã hẹn: gọi hoặc về thăm trước sinh nhật ${relative.promise.dueAge + 1} tuổi.` : "");
      const actions = document.createElement("div");
      actions.className = "family-actions";
      for (const type of Object.keys(RELATIVE_ACTIONS)) {
        const config = getRelativeActionConfig(player, type);
        if (!config) continue;
        if (config.needsCare && !["weak", "severe"].includes(relative.condition)) continue;
        if (config.needsSevere && relative.condition !== "severe") continue;
        if (type === "postpone" && relative.promise) continue;
        const done = relative.done?.[type] === player.age;
        const short = config.cost > 0 && player.money < config.cost;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "shop-group relationship-action";
        button.dataset.relative = relative.id;
        button.dataset.action = type;
        button.textContent = config.label;
        const note = document.createElement("span");
        note.className = "side-job-note";
        const jailed = isInPrison(player) && PRISON_BLOCKED_RELATIVE.includes(type);
        note.textContent = done ? "Đã làm năm nay." : jailed ? PRISON_NOTE : short ? `Cần ${formatMoney(config.cost)}. Gọi điện vẫn miễn phí.`
          : [config.cost ? formatMoney(config.cost) : "Miễn phí", ["call", "visit"].includes(type) ? "Trò chuyện có lựa chọn · lưu kỷ niệm chung" : config.bond ? `Gắn kết +${config.bond}` : "",
            type === "care" ? "Sức khỏe của bạn -2" : "", type === "postpone" ? "Không bị trừ nếu giữ lời hẹn" : "",
            config.needsCare ? "Giúp ích nhưng không bảo đảm khỏi bệnh" : ""].filter(Boolean).join(" · ");
        button.append(note);
        button.disabled = done || short || jailed || player.isAlive === false;
        button.addEventListener("click", () => relativeAction(relative.id, type));
        actions.append(button);
      }
      card.append(title, info, actions);
      renderSharedMemories(card, relative);
      family.append(card);
    }
    if (player.partner) {
      const partner = player.partner;
      const card = document.createElement("article");
      card.className = "family-member";
      const condition = CONDITIONS[partner.condition ?? "healthy"];
      const title = document.createElement("h4");
      title.textContent = `💞 ${player.marriedAtAge != null ? "Bạn đời" : "Người yêu"} ${partner.name} · ${getPartnerAge(partner, player.age)} tuổi`;
      const info = document.createElement("p");
      info.textContent = `💞 Quan hệ: ${partner.relationship ?? 80}% · ${condition.icon} Sức khỏe: ${condition.label}. Trò chuyện, chăm sóc ở tab Hiện tại.`;
      card.append(title, info);
      family.append(card);
    }
     
    const friends = document.createElement("article");
    friends.className = "family-member";
    const friendsTitle = document.createElement("h4");
    friendsTitle.textContent = "👫 Bạn bè";
    const friendsInfo = document.createElement("p");
    friendsInfo.textContent = (player.friends ?? []).length
      ? "Trò chuyện mỗi năm một lần để giữ tình bạn: thân thiết +3%, Hạnh phúc +1."
      : "Chưa có người bạn mới nào được ghi lại.";
     
    const friendButtons = (player.friends ?? []).map((friend) => {
      const talked = friend.talkedAt === player.age;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "shop-group relationship-action";
      button.dataset.action = "friend-talk";
      button.dataset.friend = friend.id;
      button.textContent = `💬 Trò chuyện với ${friend.name}`;
      const note = document.createElement("span");
      note.className = "side-job-note";
      note.textContent = `Quen từ ${friend.since} tuổi · thân thiết ${friend.bond ?? 50}%${talked ? " · đã trò chuyện năm nay" : ""}`;
      button.append(note);
      button.disabled = talked || player.isAlive === false;
      button.addEventListener("click", () => {
        const current = (state.player.friends ?? []).find((entry) => entry.id === friend.id);
        if (!current || current.talkedAt === state.player.age || state.player.isAlive === false) return;
        const bond = Math.min(100, (current.bond ?? 50) + 3);
        state.player.friends = state.player.friends.map((entry) => (entry.id === friend.id ? { ...entry, bond, talkedAt: state.player.age } : entry));
        const gained = applyActivityGain(state.player, "happiness", 1);
        const text = `💬 Tôi hẹn ${friend.name} đi uống nước, kể nhau nghe chuyện dạo này. Thân thiết +${bond - (current.bond ?? 50)}%${gained ? " · Hạnh phúc +1" : ""}.`;
        const log = { age: state.player.age, content: text, summary: text };
        state.logs.push(log);
        save();
        render();
        onChange(log);
      });
      return button;
    });
    const reachOut = document.createElement("button");
    reachOut.type = "button";
    reachOut.className = "shop-group relationship-action";
    reachOut.dataset.action = "reach-out";
    reachOut.textContent = "🙋 Chủ động kết nối";
    const reachNote = document.createElement("span");
    reachNote.className = "side-job-note";
    const reached = player.reachOutAge === player.age;
    reachNote.textContent = reached
      ? "Đã chủ động kết nối năm nay."
      : "Miễn phí, mỗi năm một lần: tham gia câu lạc bộ, nhắn hỏi thăm người quen. Hạnh phúc +1, tăng cơ hội làm quen năm sau.";
    reachOut.append(reachNote);
    reachOut.disabled = reached || player.isAlive === false || player.age < 6;
    if (player.age < 6) reachNote.textContent = "Từ 6 tuổi, bạn có thể chủ động làm quen bạn mới.";
    else if (player.age < 18 && !reached) reachNote.textContent = "Làm quen bạn cùng lớp hoặc tham gia hoạt động nhóm. Miễn phí, mỗi năm một lần; Hạnh phúc +1.";
    reachOut.addEventListener("click", () => {
      if (state.player.age < 6 || state.player.reachOutAge === state.player.age || state.player.isAlive === false) return;
      state.player.reachOutAge = state.player.age;
      const gained = applyActivityGain(state.player, "happiness", 1) ? " Hạnh phúc +1." : "";
      const text = state.player.age < 18 ? `🙋 Tôi chủ động làm quen bạn cùng lớp và tham gia hoạt động nhóm.${gained}` : `🙋 Tôi chủ động tham gia một câu lạc bộ và nhắn hỏi thăm vài người quen.${gained}`;
      const log = { age: state.player.age, content: text, summary: text };
      state.logs.push(log);
      save();
      render();
      onChange(log);
    });
    friends.append(friendsTitle, friendsInfo, ...friendButtons, reachOut);
    family.append(friends);
  }

  function render() {
    let picker = document.getElementById('dating-partner-picker');
    if (!picker) {
      picker = document.createElement('div');
      picker.id = 'dating-partner-picker';
      picker.className = 'shop-groups';
      current.before(picker);
    }
    picker.replaceChildren();
    const people = getDatingPartners(state.player);
    picker.hidden = people.length < 2;
    for (const person of people) {
      const choice = document.createElement('button');
      choice.type = 'button';
      choice.className = 'shop-group';
      choice.dataset.partnerId = person.id;
      choice.textContent = `${person.name} · Quan hệ ${person.relationship ?? 80}%${person.id === state.player.partner?.id ? ' · Đang chọn' : ''}`;
      choice.disabled = person.id === state.player.partner?.id || state.player.isAlive === false;
      choice.addEventListener('click', () => {
        if (state.player.isAlive === false || state.pendingEvent) return;
        Object.assign(state.player, selectDatingPartnerUpdates(state.player, person.id));
        save();
        render();
      });
      picker.append(choice);
    }
    if (people.length > 1) {
      const note = document.createElement('p');
      note.className = 'side-job-intro';
      note.textContent = 'Bạn đang hẹn hò hai người. Chọn người để trò chuyện, tặng quà hoặc chia tay. Mỗi năm có 25% khả năng chuyện này bị phát hiện; cưới một người sẽ kết thúc mối quan hệ còn lại.';
      picker.append(note);
    }
    renderActions();
    renderFamily();
    current.textContent = state.player.partner
      ? `${state.player.marriedAtAge != null ? `💍 Đã kết hôn từ tuổi ${state.player.marriedAtAge}` : "💞 Đang hẹn hò"}\n💞 Quan hệ: ${state.player.partner.relationship ?? 80}%\n${describePerson(state.player.partner, state.player.age)}`
      : state.player.widowedAtAge != null
        ? `🕯️ Bạn đã góa từ năm ${state.player.widowedAtAge} tuổi. Những kỷ niệm hôn nhân vẫn còn trong tab Kỷ niệm.`
        : state.player.datingActivitiesOnly
        ? "Bạn đang độc thân sau chia tay."
        : "Bạn chưa hẹn hò với ai. Mọi cuộc gặp gỡ đều có thời điểm riêng!";
    if (state.player.marriedAtAge != null && state.player.affair?.spouseId === state.player.partner?.id) {
      current.textContent += `\n🤫 Quan hệ bí mật: ${state.player.affair.person.name} · từ tuổi ${state.player.affair.startedAtAge}. Nguy cơ bị phát hiện: 50% mỗi lần xét năm mới.`;
    }
    const datingExpenses = getDatingExpenses(state.player, (state.player.age ?? 0) + 1);
    if (datingExpenses.length) {
      current.textContent += `\n💸 Hẹn hò năm tới: ${datingExpenses.map(charge => `${charge.name}: ${formatMoney(charge.amount)}`).join(" · ")}.\nMỗi năm dao động 6–24 triệu/người, tự trừ khi sang tuổi mới; quà tặng và hoạt động riêng tính thêm. Dừng khi chia tay hoặc kết hôn.`;
    }
    history.replaceChildren();
    breakup.hidden = !state.player.partner || state.player.isAlive === false;
    confirmation.hidden = true;
    const children = document.getElementById("relationship-children");
    children.replaceChildren();
    for (const child of state.player.children ?? []) {
      const item = document.createElement("li");
      const age = getChildAge(child, state.player.age);
      const bond = Number.isFinite(child.relationship) ? child.relationship : Number.isFinite(child.bond) ? child.bond : 80;
      item.textContent = `${child.name} · ${child.adopted ? "Con nuôi" : "Con ruột"} · ${age} tuổi · Gắn kết ${Math.max(0, Math.min(100, bond))}% · ${age <= 18 ? `Chi phí: ${formatSalary(getAnnualChildcareCost(age))}/năm` : "Đã hết thời gian tính phí nuôi con"}`;
      const childActions = document.createElement("div");
      childActions.className = "family-actions";
      for (const [type, action] of Object.entries(getChildActions(state.player, child))) {
        const option = document.createElement("button");
        option.type = "button";
        option.className = "shop-group relationship-action";
        option.dataset.child = child.id;
        option.dataset.action = type;
        option.textContent = action.label;
        const note = document.createElement("span");
        note.className = "side-job-note";
        const blocked = getChildActionBlock(state.player, child, type);
        note.textContent = blocked || (action.conversation
          ? `Miễn phí · Con mở lời, bạn chọn cách đáp · Gắn kết +${action.bond}%, tăng hoặc giảm thêm tùy câu trả lời · Mỗi năm một lần.`
          : `${action.cost ? formatMoney(action.cost) : "Miễn phí"} · Gắn kết +${action.bond}% · Hạnh phúc tối đa +${action.happiness} · Mỗi năm một lần.`);
        option.disabled = Boolean(blocked);
        option.append(note);
        option.addEventListener("click", () => {
          if (action.conversation) return openChildConversation(child);
          const log = interactWithChild(state.player, child.id, type);
          if (!log) return;
          state.logs.push(log);
          save();
          render();
          onChange(log);
        });
        childActions.append(option);
      }
      item.append(childActions);
      if (child.memories?.length) {
        const memories = document.createElement("details");
        memories.className = "family-shared-memories";
        const heading = document.createElement("summary");
        heading.textContent = "Kỷ niệm cùng con";
        const list = document.createElement("ol");
        for (const memory of [...child.memories].reverse()) {
          const entry = document.createElement("li");
          entry.textContent = `${memory.age} tuổi · ${memory.text}`;
          list.append(entry);
        }
        memories.append(heading, list);
        item.append(memories);
      }
      children.append(item);
    }
    for (const entry of state.player.relationshipHistory ?? []) {
      const item = document.createElement("li");
      const title = document.createElement("strong");
      title.textContent = `${({ dating: "💞", married: "💍", "marriage-postponed": "💬", breakup: "💔",
        affair: "🤫", "affair-ended": "💔", "affair-discovered": "💔", divorced: "💔",
        "child-born": "👶", "adopted-child": "🧸", "child-discussion": "💬", widowed: "🕯️", farewell: "🕯️" })[entry.type] ?? "🍂"} ${entry.age} tuổi`;
      const content = document.createElement("p");
      content.textContent = entry.text + (entry.type === "dating" ? `\n${describePerson(entry.person, entry.age)}` : "");
      item.append(title, content);
      history.append(item);
    }
  }
  button.addEventListener("click", () => {
    if (document.querySelector("dialog[open]")) return;
    render();
    selectTab();
    dialog.showModal();
  });
  breakup.addEventListener("click", () => {
    if (!state.player.partner) return;
    document.getElementById("breakup-question").textContent =
      `Bạn muốn ${state.player.marriedAtAge != null ? "kết thúc hôn nhân" : "chia tay"} với ${state.player.partner.name}?${(state.player.children ?? []).length ? " Chi phí nuôi con vẫn tiếp tục." : ""}`;
    confirmation.hidden = false;
  });
  document.getElementById("cancel-breakup").addEventListener("click", () => { confirmation.hidden = true; });
  document.getElementById("confirm-breakup").addEventListener("click", () => {
    const updates = getBreakupUpdates(state.player);
    if (!Object.hasOwn(updates, "partner")) return;
    Object.assign(state.player, updates);
    const entry = state.player.relationshipHistory.at(-1);
    const grief = MOOD_EFFECTS.breakup;
    const text = `${entry.text} Hạnh phúc -${grief.immediate}; nỗi buồn còn ảnh hưởng ${grief.yearly.length} năm tới, nhẹ dần theo thời gian.`;
    const log = { age: state.player.age, content: text, summary: text };
    state.logs.push(log);
    save();
    render();
    onChange(log);
  });
  document.getElementById("close-relationships").addEventListener("click", () => dialog.close());
}

export function createCasualDatingEvent(player, age, random = Math.random) {
  if (!player.casualLife || age < 18 || !canStartRelationship(player) || player.datingActivitiesOnly) return null;
  const person = createAdmirer(player, age, random);
  const accepted = random() < getRomanceChance(player);
  const job = (player.streetJobs ?? []).find(entry => (player.purchases ?? []).some(item => item.id ===
    (entry.id === "noodle-seller" ? "noodle-cart" : "motorbike")));
  const meeting = job?.id === "noodle-seller" ? "Một người quen thường ghé xe hủ tiếu bắt chuyện với tôi."
    : job?.id === "motorbike-taxi" ? "Trong lúc nghỉ giữa những cuốc xe, tôi gặp một người quen ở quán nước."
    : "Trong một buổi gặp bạn bè ở khu phố, tôi gặp một người có thể trò chuyện rất tự nhiên.";
  const note = getCasualRomanceNote(player);
  return { id: `casual-romance-${age}`, kind: "workplace-dating", category: "love", person,
    title: "💌 Chuyện tình trên con đường riêng", text: `${meeting} Người ấy tên ${person.name}. Chúng tôi nói về sở thích và những dự định sắp tới.\n\n${describePerson(person)}\n\n${note}`,
    choices: [
      { label: "💞 Ngỏ lời tìm hiểu nghiêm túc", acceptDating: accepted,
        title: accepted ? "💞 Có người đồng hành" : "🤝 Người ấy muốn làm bạn trước",
        text: accepted ? `${person.name} đồng ý tìm hiểu. Người ấy trân trọng sự chân thành của tôi; bằng cấp không quyết định tất cả. Chúng tôi hẹn nhau cùng cố gắng cho những ngày sắp tới.`
          : `${person.name} muốn làm bạn trước. ${note} Tôi tôn trọng quyết định, thay vì hứa những điều mình chưa làm được.`,
        effects: { happiness: accepted ? 5 : -2 }, achievementIds: accepted ? ["first-love"] : [] },
      { label: "💬 Chia sẻ thật lòng, làm bạn trước", text: `Tôi kể thật cuộc sống của mình. ${person.name} lắng nghe; chúng tôi giữ liên lạc mà không vội đặt tên cho mối quan hệ.`,
        effects: { happiness: 3 }, playerUpdates: { friends: [...(player.friends ?? []), { id: person.id, name: person.name, gender: person.gender, since: age, bond: 55 }] } },
      { label: "🧭 Tập trung ổn định cuộc sống", text: "Tôi chưa ngỏ lời. Tôi muốn chăm sóc cuộc sống của mình và giữ liên lạc với người ấy bằng sự chân thành.", effects: { intelligence: 2 } },
    ] };
}
