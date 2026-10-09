import { maleNames, femaleNames } from "./character-data.js";
import { formatMoney, formatMoneyAmount } from "./money-format.js";
import { recordAchievementFlags } from "./achievements-data.js";
import { askConfirm } from "./confirm-dialog.js";
import { canStartRelationship, describePerson, getDatingUpdates, getZodiac } from "./relationships.js";

// Trung tâm mai mối: phí càng cao, chỉ số càng cao và chênh lệch tuổi (maxAgeGap) càng nhỏ.
export const matchmakingCenters = [
  { id: "basic", icon: "💌", name: "Mai mối Bình Dân", fee: 2_000_000, minStat: 30, maxStat: 70, maxAgeGap: 30 },
  { id: "kind", icon: "💐", name: "Duyên Lành", fee: 10_000_000, minStat: 45, maxStat: 85, maxAgeGap: 20 },
  { id: "premium", icon: "💎", name: "Tơ Hồng Cao Cấp", fee: 50_000_000, minStat: 60, maxStat: 95, maxAgeGap: 10 },
  { id: "royal", icon: "👑", name: "Hoàng Gia Matchmaking", fee: 200_000_000, minStat: 75, maxStat: 100, maxAgeGap: 5 },
];

export const DATING_MIN_AGE = 18;

const surnames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Đặng", "Bùi", "Đỗ", "Hồ"];
const traits = ["ấm áp", "hài hước", "điềm tĩnh", "năng động", "chu đáo", "thẳng thắn", "sáng tạo", "kiên nhẫn", "lạc quan", "hơi nhút nhát"];
const pick = (items, random) => items[Math.floor(random() * items.length)];
const integer = (min, max, random) => min + Math.floor(random() * (max - min + 1));

export const getCenter = (id) => matchmakingCenters.find((center) => center.id === id);

// Tạo người được giới thiệu theo giới tính người chơi chọn và mức chỉ số của trung tâm.
export function createMatch(player, center, gender, random = Math.random) {
  const age = player.age;
  const month = integer(1, 12, random);
  const day = integer(1, [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1], random);
  const firstTrait = pick(traits, random);
  const secondTrait = pick(traits.filter((trait) => trait !== firstTrait), random);
  const stat = () => integer(center.minStat, center.maxStat, random);
  return {
    id: `match-${center.id}-${age}-${Math.floor(random() * 1e9)}`,
    name: `${pick(surnames, random)} ${pick(gender === "female" ? femaleNames : maleNames, random)}`,
    gender, birthDay: day, birthMonth: month, zodiac: getZodiac(day, month),
    // Lớn hoặc nhỏ hơn nhân vật tối đa maxAgeGap tuổi, nhưng không dưới 18 tuổi.
    ageAtMeeting: integer(Math.max(DATING_MIN_AGE, age - center.maxAgeGap), age + center.maxAgeGap, random), metAtAge: age,
    personality: `${firstTrait}, ${secondTrait}`,
    reason: `được ${center.name} giới thiệu và thấy hợp với tôi ngay buổi gặp đầu`,
    relationship: 80,
    workplace: `trung tâm mai mối ${center.name}`,
    stats: { health: stat(), intelligence: stat(), happiness: stat(), appearance: stat() },
  };
}

export function initMatchmaking(state, { renderMoney, renderStats, renderLogEntry, checkAchievements }) {
  const $ = (id) => document.getElementById(id);
  const dialog = $("love-dialog");
  const body = $("love-body");

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const button = (className, text, onClick) => {
    const node = element("button", className, text);
    node.type = "button";
    node.addEventListener("click", onClick);
    return node;
  };
  const focusFirst = () => (body.querySelector(".shop-group:not(:disabled), .shop-buy:not(:disabled)")
    ?? body.querySelector("button:not(:disabled)"))?.focus({ preventScroll: true });
  const backToActivities = () => button("shop-back", "← Quay lại Hoạt động", () => {
    dialog.close();
    $("activities-dialog").showModal();
  });
  const wallet = () => element("p", "shop-wallet", `Ví hiện có: ${formatMoney(state.player.money)}`);
  const save = () => localStorage.setItem("lifeAgainSave", JSON.stringify(state));
  const record = (content, summary = content) => {
    const log = { age: state.player.age, content, summary };
    state.logs.push(log);
    save();
    renderMoney();
    renderStats();
    renderLogEntry(log);
  };

  function renderCenters() {
    const player = state.player;
    body.replaceChildren(backToActivities(), wallet());
    if (!canStartRelationship(player)) {
      const partner = player.partner?.name ?? "người ấy";
      body.append(element("p", "license-age-note", player.marriedAtAge != null
        ? `💍 Bạn đã kết hôn với ${partner}. Trung tâm mai mối chỉ dành cho người đang độc thân.`
        : `💞 Bạn đang hẹn hò với ${partner}. Trung tâm mai mối chỉ dành cho người đang độc thân.`));
    } else if (player.age < DATING_MIN_AGE) {
      body.append(element("p", "license-age-note",
        `🔞 Bạn cần đủ ${DATING_MIN_AGE} tuổi mới được đến trung tâm mai mối. Còn ${DATING_MIN_AGE - player.age} năm nữa nhé!`));
    }
    const allowed = canStartRelationship(player) && player.age >= DATING_MIN_AGE;
    const list = element("div", "shop-groups");
    for (const center of matchmakingCenters) {
      const choice = button("shop-group love-center", `${center.icon} ${center.name} · ${formatMoney(center.fee)}/lần`,
        () => renderGender(center));
      choice.dataset.center = center.id;
      choice.disabled = !allowed;
      choice.append(element("span", "side-job-note",
        `Chỉ số ${center.minStat}–${center.maxStat}% · Chênh lệch tuổi tối đa ${center.maxAgeGap} tuổi (từ 18 tuổi)`));
      list.append(choice);
    }
    body.append(list);
  }

  function renderGender(center) {
    const card = element("section", "dialog-card");
    card.append(element("h3", "", `${center.icon} ${center.name}`),
      element("p", "side-job-intro", `Phí mỗi lần giới thiệu: ${formatMoney(center.fee)}. Bạn muốn hẹn hò với:`));
    const list = element("div", "shop-items");
    for (const [gender, label] of [["male", "👨 Nam"], ["female", "👩 Nữ"]]) {
      const affordable = state.player.money >= center.fee;
      const choice = button("shop-buy love-gender", affordable ? label : `${label} · Không đủ tiền`, () => introduce(center, gender));
      choice.dataset.gender = gender;
      choice.disabled = !affordable;
      list.append(choice);
    }
    card.append(list);
    body.replaceChildren(button("shop-back", "← Quay lại chọn trung tâm", () => { renderCenters(); focusFirst(); }), wallet(), card);
    focusFirst();
  }

  // Trả phí rồi nhận hồ sơ một người ngẫu nhiên.
  function introduce(center, gender) {
    askConfirm(
      `${center.icon} Nhờ ${center.name} giới thiệu?`,
      `Phí giới thiệu: ${formatMoney(center.fee)}.\nTrung tâm sẽ giới thiệu một người ${gender === "female" ? "nữ" : "nam"} phù hợp với bạn.`,
      "Trả phí và gặp mặt",
      () => {
        if (state.player.money < center.fee || !canStartRelationship(state.player)) return;
        state.player.money -= center.fee;
        const person = createMatch(state.player, center, gender);
        record(`💌 Trả phí cho ${center.name} để được giới thiệu người hẹn hò: Tiền -${formatMoneyAmount(center.fee)} VNĐ.`);
        renderProfile(center, gender, person);
      },
    );
  }

  function renderProfile(center, gender, person) {
    const card = element("section", "dialog-card love-profile");
    card.append(element("h3", "", `${person.gender === "female" ? "👩" : "👨"} Hồ sơ được giới thiệu`),
      element("p", "love-profile-text", describePerson(person)));
    const actions = element("div", "license-actions");
    actions.append(
      button("shop-buy love-accept", "💞 Đồng ý hẹn hò", () => {
        if (!canStartRelationship(state.player)) return;
        Object.assign(state.player, getDatingUpdates(state.player, person, state.player.age));
        state.player.happiness = Math.min(100, state.player.happiness + 3);
        recordAchievementFlags(state, ["first-love"]);
        record(`💞 Tôi bắt đầu hẹn hò với ${person.name}, người được ${center.name} giới thiệu.\n${describePerson(person)}`,
          `💞 Bắt đầu hẹn hò với ${person.name} qua ${center.name}. Hạnh phúc +3`);
        checkAchievements();
        const done = element("section", "dialog-card");
        done.append(element("h3", "", "💞 Một mối quan hệ mới"),
          element("p", "love-profile-text", `Bạn và ${person.name} bắt đầu tìm hiểu nhau. Xem chi tiết trong mục Quan hệ nhé!`));
        body.replaceChildren(backToActivities(), done);
        focusFirst();
      }),
      button("license-answer love-another", `🔁 Gặp người khác · ${formatMoney(center.fee)}`, () => introduce(center, gender)),
      button("shop-back", "🙅 Từ chối", () => { renderGender(center); }),
    );
    actions.querySelector(".love-another").disabled = state.player.money < center.fee;
    card.append(actions);
    body.replaceChildren(wallet(), card);
    focusFirst();
  }

  $("activity-love").addEventListener("click", () => {
    if (state.player.isAlive === false) return;
    $("activities-dialog").close();
    renderCenters();
    dialog.showModal();
    focusFirst();
  });
  $("close-love").addEventListener("click", () => dialog.close());
}
