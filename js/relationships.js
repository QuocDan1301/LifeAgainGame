import { maleNames, femaleNames } from "./character-data.js";
import { getEmploymentContext } from "./career-jobs.js";
import { ensureEventOpenMoji } from "./event-openmoji.js";
import { getChildAge, getAnnualChildcareCost } from "./family.js";
import { formatSalary } from "./career-salary.js";
import { initPanelTabs } from "./panel-tabs.js";
import { MOOD_EFFECTS, PARTNER_ACTIONS, addMoodEffect } from "./mood-rules.js";
import { CONDITIONS, RELATIVE_ACTIONS, getRelativeActionConfig, ensureRelatives, getPartnerAge, getRelativeAge } from "./family-members.js";
import { formatMoney } from "./money-format.js";

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
  // Song tính / toàn tính: mỗi lần ngỏ lời chọn nam hoặc nữ với xác suất 50/50.
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
  return !player.partner && player.marriedAtAge == null && player.isAlive !== false;
}

export function createDatingEvent(player, age, random = Math.random) {
  if (!canStartRelationship(player) || player.datingActivitiesOnly) return null;
  const person = createAdmirer(player, age, random);
  const working = player.employmentStatus === "employed";
  const setting = working ? `Trong một ngày làm việc tại ${person.workplace}`
    : `Trong lần ghé ${person.workplace} tìm cơ hội việc làm`;
  const image = new URL("./img/events/openmoji/color/svg/1F48C.svg", import.meta.url).href;
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
  if (!canStartRelationship(player) || !person) return {};
  const history = [...(player.relationshipHistory ?? [])];
  history.push({ age, type: "dating", person,
    text: `Tôi bắt đầu hẹn hò với ${person.name} tại ${person.workplace}. Người ấy ${person.reason}.` });
  return { partner: person, relationshipHistory: history, marriedAtAge: null,
    relationshipStartedAtAge: age, marriageScheduleVersion: 2,
    marriageProposalDeclines: 0, nextMarriageProposalAge: age + 5,
    childProposalDeclines: 0, nextChildProposalAge: null,
    childProposalStopped: false, childProposalCompleted: false };
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
  const dueAge = player.nextMarriageProposalAge ?? (getRelationshipStartAge(player) + 5);
  if (age < dueAge) return null;
  const person = player.partner;
  const askingAgain = (player.marriageProposalDeclines ?? 0) > 0;
  const image = new URL("./img/events/openmoji/color/svg/1F48C.svg", import.meta.url).href;
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
      { label: "💍 Đồng ý, mình cưới nhau!", marriageDecision: "accept",
        title: "💍 Cùng nhau xây dựng gia đình",
        text: `Tôi đồng ý cưới ${person.name}. Chúng tôi cùng bàn bạc, tổ chức một buổi lễ phù hợp và chính thức trở thành bạn đời. Một chương mới bắt đầu từ sự tự nguyện của cả hai.`,
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

export function getMarriageUpdates(player, person, age, decision) {
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

export function getBreakupUpdates(player) {
  if (!player.partner || player.isAlive === false) return {};
  const person = player.partner;
  const text = player.marriedAtAge != null
    ? `Tôi và ${person.name} kết thúc hôn nhân.` : `Tôi chủ động chia tay ${person.name}.`;
  const grief = MOOD_EFFECTS.breakup;
  return { partner: null, marriedAtAge: null, relationshipStartedAtAge: null, partnerPromise: null,
    happiness: Math.max(0, (player.happiness ?? 0) - grief.immediate),
    moodEffects: addMoodEffect(player, "breakup", player.age),
    nextMarriageProposalAge: null, marriageProposalDeclines: 0,
    nextChildProposalAge: null, childProposalDeclines: 0,
    childProposalStopped: false, childProposalCompleted: false, datingActivitiesOnly: true,
    relationshipHistory: [...(player.relationshipHistory ?? []),
      { age: player.age, type: "breakup", person, text }] };
}

export function initRelationships(state, save = () => {}, onChange = () => {}) {
  const button = document.getElementById("relationships");
  const dialog = document.getElementById("relationships-dialog");
  // Mỗi mục một tab như popup Tài sản, để popup không dài ra khi có nhiều con hay nhiều mốc tình cảm.
  const selectTab = initPanelTabs(dialog, document.getElementById("relationship-tabs"));
  const current = document.getElementById("relationship-current");
  const history = document.getElementById("relationship-history");
  const breakup = document.getElementById("breakup-relationship");
  const confirmation = document.getElementById("breakup-confirmation");
  const actions = document.createElement("div");
  actions.id = "relationship-actions";
  actions.className = "shop-groups relationship-actions";
  current.after(actions);

  // Trò chuyện và dành thời gian cùng nhau: mỗi lựa chọn một lần mỗi năm. Xin không gian riêng
  // kèm lời hẹn trò chuyện sau; giữ lời hẹn thì không bị trừ quan hệ.
  function act(type) {
    const player = state.player;
    const partner = player.partner;
    if (!partner || player.isAlive === false) return;
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
      const beforeHappiness = player.happiness;
      const beforeRelationship = partner.relationship ?? 80;
      player.happiness = Math.min(100, beforeHappiness + reward.happiness);
      player.partner = { ...partner, relationship: Math.min(100, beforeRelationship + reward.relationship) };
      const gains = [
        player.happiness > beforeHappiness ? `Hạnh phúc +${player.happiness - beforeHappiness}` : "",
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
      small.textContent = note;
      node.append(small);
      node.disabled = disabled;
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
  function relativeAction(id, type) {
    const player = state.player;
    const relative = (player.relatives ?? []).find((entry) => entry.id === id);
    const config = getRelativeActionConfig(player, type);
    if (!relative?.alive || !config || player.isAlive === false || relative.done?.[type] === player.age) return;
    if (config.cost && player.money < config.cost) return;
    const next = { ...relative, done: { ...(relative.done ?? {}), [type]: player.age }, interactions: { ...(relative.interactions ?? {}) } };
    const who = `${relative.role.toLowerCase()} ${relative.name}`;
    const count = (key) => { next.interactions[key] = (next.interactions[key] ?? 0) + 1; };
    let text;
    if (type === "postpone") {
      next.promise = { dueAge: player.age + 1 };
      text = `🗓️ Tôi xin ${who} hẹn lần sau vì đang bận, hứa sẽ gọi hoặc về thăm trước sinh nhật ${player.age + 2} tuổi.`;
    } else {
      player.money -= config.cost;
      next.bond = Math.min(100, (next.bond ?? 70) + config.bond);
      if (config.happiness) player.happiness = Math.min(100, (player.happiness ?? 0) + config.happiness);
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
      const parts = [config.cost ? `Tiền -${formatMoney(config.cost)}` : "", `Gắn kết +${config.bond}`,
        config.happiness ? `Hạnh phúc +${config.happiness}` : "", config.health ? `Sức khỏe ${config.health}` : "", kept ? "giữ lời hẹn" : ""];
      text += ` ${parts.filter(Boolean).join(" · ")}.`;
    }
    player.relatives = player.relatives.map((entry) => (entry.id === id ? next : entry));
    const log = { age: player.age, content: text, summary: text };
    state.logs.push(log);
    save();
    render();
    onChange(log);
  }
  function renderFamily() {
    if (!family) return;
    family.replaceChildren();
    const player = state.player;
    ensureRelatives(player);
    for (const relative of player.relatives) {
      const card = document.createElement("article");
      card.className = `family-member${relative.alive ? "" : " is-passed"}`;
      const title = document.createElement("h4");
      const info = document.createElement("p");
      if (!relative.alive) {
        title.textContent = `🕯️ ${relative.role} ${relative.name}`;
        info.textContent = relative.passedBeforeTracking ? "Đã mất từ trước." : `Đã mất khi bạn ${relative.diedAtAge} tuổi, hưởng thọ ${getRelativeAge(relative, player.age)}.`;
        card.append(title, info);
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
        note.textContent = done ? "Đã làm năm nay." : short ? `Cần ${formatMoney(config.cost)}. Gọi điện vẫn miễn phí.`
          : [config.cost ? formatMoney(config.cost) : "Miễn phí", config.bond ? `Gắn kết +${config.bond}` : "",
            type === "care" ? "Sức khỏe của bạn -2" : "", type === "postpone" ? "Không bị trừ nếu giữ lời hẹn" : "",
            config.needsCare ? "Giúp ích nhưng không bảo đảm khỏi bệnh" : ""].filter(Boolean).join(" · ");
        button.append(note);
        button.disabled = done || short || player.isAlive === false;
        button.addEventListener("click", () => relativeAction(relative.id, type));
        actions.append(button);
      }
      card.append(title, info, actions);
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
    // Bạn bè từ những lời làm quen, và cách chủ động kết nối (không phụ thuộc ngoại hình).
    const friends = document.createElement("article");
    friends.className = "family-member";
    const friendsTitle = document.createElement("h4");
    friendsTitle.textContent = "👫 Bạn bè";
    const friendsInfo = document.createElement("p");
    friendsInfo.textContent = (player.friends ?? []).length
      ? "Trò chuyện mỗi năm một lần để giữ tình bạn: thân thiết +3%, Hạnh phúc +1."
      : "Chưa có người bạn mới nào được ghi lại.";
    // Mỗi người bạn: độ thân thiết và lượt trò chuyện một lần mỗi năm.
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
        const before = state.player.happiness ?? 0;
        state.player.happiness = Math.min(100, before + 1);
        const text = `💬 Tôi hẹn ${friend.name} đi uống nước, kể nhau nghe chuyện dạo này. Thân thiết +${bond - (current.bond ?? 50)}%${state.player.happiness > before ? " · Hạnh phúc +1" : ""}.`;
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
      state.player.happiness = Math.min(100, (state.player.happiness ?? 0) + 1);
      const text = state.player.age < 18 ? "🙋 Tôi chủ động làm quen bạn cùng lớp và tham gia hoạt động nhóm. Hạnh phúc +1." : "🙋 Tôi chủ động tham gia một câu lạc bộ và nhắn hỏi thăm vài người quen. Hạnh phúc +1.";
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
    renderActions();
    renderFamily();
    current.textContent = state.player.partner
      ? `${state.player.marriedAtAge != null ? `💍 Đã kết hôn từ tuổi ${state.player.marriedAtAge}` : "💞 Đang hẹn hò"}\n💞 Quan hệ: ${state.player.partner.relationship ?? 80}%\n${describePerson(state.player.partner, state.player.age)}`
      : state.player.widowedAtAge != null
        ? `🕯️ Bạn đã góa từ năm ${state.player.widowedAtAge} tuổi. Những kỷ niệm hôn nhân vẫn còn trong tab Kỷ niệm.`
        : state.player.datingActivitiesOnly
        ? "Bạn đang độc thân sau chia tay."
        : "Bạn chưa hẹn hò với ai. Mọi cuộc gặp gỡ đều có thời điểm riêng!";
    history.replaceChildren();
    breakup.hidden = !state.player.partner || state.player.isAlive === false;
    confirmation.hidden = true;
    const children = document.getElementById("relationship-children");
    children.replaceChildren();
    for (const child of state.player.children ?? []) {
      const item = document.createElement("li");
      const age = getChildAge(child, state.player.age);
      item.textContent = `${child.name} · ${child.adopted ? "Con nuôi" : "Con ruột"} · ${age} tuổi · ${age <= 18 ? `Chi phí: ${formatSalary(getAnnualChildcareCost(age))}/năm` : "Đã hết thời gian tính phí nuôi con"}`;
      children.append(item);
    }
    for (const entry of state.player.relationshipHistory ?? []) {
      const item = document.createElement("li");
      const title = document.createElement("strong");
      title.textContent = `${({ dating: "💞", married: "💍", "marriage-postponed": "💬", breakup: "💔",
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
