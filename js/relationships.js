import { maleNames, femaleNames } from "./character-data.js";
import { getEmploymentContext } from "./career-jobs.js";
import { ensureEventOpenMoji } from "./event-openmoji.js";
import { getChildAge, getAnnualChildcareCost } from "./family.js";
import { formatSalary } from "./career-salary.js";
import { initPanelTabs } from "./panel-tabs.js";

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
  return { partner: null, marriedAtAge: null, nextMarriageProposalAge: null,
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
  return { partner: null, marriedAtAge: null, relationshipStartedAtAge: null,
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
  function render() {
    current.textContent = state.player.partner
      ? `${state.player.marriedAtAge != null ? `💍 Đã kết hôn từ tuổi ${state.player.marriedAtAge}` : "💞 Đang hẹn hò"}\n💞 Quan hệ: ${state.player.partner.relationship ?? 80}%\n${describePerson(state.player.partner, state.player.age)}`
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
        "child-born": "👶", "adopted-child": "🧸", "child-discussion": "💬" })[entry.type] ?? "🍂"} ${entry.age} tuổi`;
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
    const log = { age: state.player.age, content: entry.text, summary: entry.text };
    state.logs.push(log);
    save();
    render();
    onChange(log);
  });
  document.getElementById("close-relationships").addEventListener("click", () => dialog.close());
}
