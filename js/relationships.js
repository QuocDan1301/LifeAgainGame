import { maleNames, femaleNames } from "./character-data.js";
import { getEmploymentContext } from "./career-jobs.js";
import { ensureEventGif } from "./event-gifs.js";

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
  const gender = player.orientation === "homosexual" ? ownGender
    : player.orientation === "heterosexual" ? otherGender
      : pick(["male", "female"], random);
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

export function createDatingEvent(player, age, random = Math.random) {
  if (player.partner) return null;
  const person = createAdmirer(player, age, random);
  const working = player.employmentStatus === "employed";
  const setting = working ? `Trong một ngày làm việc tại ${person.workplace}`
    : `Trong lần ghé ${person.workplace} tìm cơ hội việc làm`;
  const image = new URL("./img/events/stickers/1F48C.svg", import.meta.url).href;
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
    ].map(branch => ensureEventGif({ ...branch, ...art })),
  };
}

export function getDatingUpdates(player, person, age) {
  if (player.partner) return {};
  const history = [...(player.relationshipHistory ?? [])];
  history.push({ age, type: "dating", person,
    text: `Tôi bắt đầu hẹn hò với ${person.name} tại ${person.workplace}. Người ấy ${person.reason}.` });
  return { partner: person, relationshipHistory: history };
}

export function initRelationships(state) {
  const button = document.getElementById("relationships");
  const dialog = document.getElementById("relationships-dialog");
  const current = document.getElementById("relationship-current");
  const history = document.getElementById("relationship-history");
  button.addEventListener("click", () => {
    if (document.querySelector("dialog[open]")) return;
    current.textContent = state.player.partner
      ? `💞 Đang hẹn hò\n${describePerson(state.player.partner, state.player.age)}`
      : "Bạn chưa hẹn hò với ai. Mọi cuộc gặp gỡ đều có thời điểm riêng!";
    history.replaceChildren();
    for (const entry of state.player.relationshipHistory ?? []) {
      const item = document.createElement("li");
      const title = document.createElement("strong");
      title.textContent = `${entry.type === "dating" ? "💞" : "🍂"} ${entry.age} tuổi`;
      const content = document.createElement("p");
      content.textContent = entry.text + (entry.type === "dating" ? `\n${describePerson(entry.person, entry.age)}` : "");
      item.append(title, content);
      history.append(item);
    }
    dialog.showModal();
  });
  document.getElementById("close-relationships").addEventListener("click", () => dialog.close());
}
