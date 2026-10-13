import { formatMoney } from "../core/money-format.js";
import { addChoiceIcon } from "./event-emotions.js";
import { isServing } from "../career/street-work.js";

// Các mức án và xác suất là quy tắc hư cấu của game.
export const CRIMES = [
  { id: "theft", name: "Trộm cắp", reward: 8_000_000, risk: 0.35, years: 2, fine: 5_000_000 },
  { id: "fraud", name: "Lừa đảo", reward: 35_000_000, risk: 0.55, years: 4, fine: 20_000_000 },
  { id: "robbery", name: "Cướp tài sản", reward: 75_000_000, risk: 0.75, years: 7, fine: 40_000_000 },
];
export const isInPrison = player => Boolean(player.prison && player.prison.releaseAge > player.age);
const isStudyingAbroad = player => player.careerPath?.id === "study-abroad" &&
  player.abroadProgress?.phase !== "graduated" && !player.abroadDestinationChosenAtAge;
export function crimeRisk(player, crime) {
  return Math.min(0.95, crime.risk + (player.criminalRecord?.length ?? 0) * 0.1 + (player.crimeHeat ?? 0) * 0.01);
}

export function commitCrime(player, id, random = Math.random) {
  const crime = CRIMES.find(item => item.id === id);
  if (!crime || player.isAlive === false || player.age < 18 || isInPrison(player) ||
      player.crimeActionAge === player.age || isServing(player) || isStudyingAbroad(player)) return null;
  const risk = crimeRisk(player, crime);
  player.crimeActionAge = player.age;
  player.lifePath = "dark";
  player.crimeHeat = Math.min(30, (player.crimeHeat ?? 0) + 5);
  player.happiness = Math.max(0, player.happiness - 5);
  if (random() >= risk) {
    player.money += crime.reward;
    return `🌑 Tôi đã ${crime.name.toLowerCase()}, kiếm được ${formatMoney(crime.reward)}. Chưa bị bắt, nhưng nỗi lo bị phát hiện vẫn đeo bám. Hạnh phúc -5.`;
  }
  const years = crime.years + (player.criminalRecord?.length ? 1 : 0);
  player.money -= crime.fine;
  player.prison = { enteredAge: player.age, releaseAge: player.age + years, crime: crime.name, years };
  player.criminalRecord = [...(player.criminalRecord ?? []), { crime: crime.name, age: player.age, years }];
  player.job = null;
  player.employmentStatus = "unemployed";
  player.careerLevel = 0;
  player.sideJobs = [];
  player.streetJobs = [];
  for (const key of ["layoffDue", "contractEndAge", "contractNoticeAge", "contractEnding", "jobWarning", "employedSince"]) delete player[key];
  return `🚔 Tôi bị bắt vì ${crime.name.toLowerCase()}, chịu án ${years} năm tù và bồi thường ${formatMoney(crime.fine)}. Mất việc, dừng làm thêm. Dự kiến ra tù ở tuổi ${player.prison.releaseAge}. Hạnh phúc -5.`;
}

export function createPrisonEvent(player, age) {
  if (!isInPrison(player)) return null;
  if (age >= player.prison.releaseAge) return {
    id: "prison-release", kind: "prison", title: "Ngày trở về", text: "Cánh cổng trại giam mở ra. Tôi đã chấp hành xong án, nhưng tiền án và những lựa chọn cũ vẫn là một phần cuộc đời.",
    choices: [
      { label: "Làm lại cuộc đời", text: "Tôi quyết định sống lương thiện và tìm việc mới.", effects: { happiness: 10 }, playerUpdates: { prison: null, lifePath: "reformed", crimeHeat: 0 } },
      { label: "Vẫn chọn con đường xấu", text: "Tôi vẫn muốn kiếm tiền bằng con đường cũ. Tái phạm sẽ dễ bị bắt và chịu án dài hơn.", effects: { happiness: -5 }, playerUpdates: { prison: null, lifePath: "dark" } },
    ],
  };
  return {
    id: "prison-year", kind: "prison", title: "Một năm sau song sắt",
    text: `Tôi đang thụ án vì ${player.prison.crime.toLowerCase()}. Sau năm này còn ${player.prison.releaseAge - age} năm nữa mới được tự do.`,
    choices: [
      { label: "Chăm chỉ cải tạo, đọc sách", text: "Tôi học cách chịu trách nhiệm và dành thời gian đọc sách.", effects: { intelligence: 3, happiness: 2 }, playerUpdates: { lifePath: "reformed", crimeHeat: Math.max(0, (player.crimeHeat ?? 0) - 3) } },
      { label: "Tập luyện, giữ sức khỏe", text: "Tôi tập thể dục trong khu sinh hoạt để giữ sức khỏe.", effects: { health: 3, happiness: 1 } },
      { label: "Gây gổ trong trại", text: "Tôi bị kỷ luật vì gây gổ. Những ngày trong trại càng nặng nề.", effects: { health: -8, happiness: -8 }, playerUpdates: { lifePath: "dark" } },
    ],
  };
}

export function initCrime(state, ui) {
  const activities = document.getElementById("activities-dialog");
  const button = document.createElement("button");
  button.type = "button";
  button.id = "activity-crime";
  button.innerHTML = '<span class="activity-icon" aria-hidden="true">🌑</span><span class="activity-text"><span class="activity-title">Con đường xấu / Nhà tù</span><span class="activity-note">Từ 18 tuổi · Lựa chọn sai có thể đánh đổi tự do</span></span>';
  document.getElementById("activity-shopping").before(button);
  const dialog = document.createElement("dialog");
  dialog.id = "crime-dialog";
  dialog.setAttribute("aria-labelledby", "crime-title");
  document.body.append(dialog);
  function render(message = "") {
    dialog.replaceChildren();
    const heading = document.createElement("h2");
    heading.id = "crime-title";
    heading.textContent = isInPrison(state.player) ? "⛓️ Đang thụ án" : "🌑 Con đường xấu";
    const status = document.createElement("p");
    status.textContent = message || (isInPrison(state.player)
      ? `Đang thụ án vì ${state.player.prison.crime.toLowerCase()}. Ra tù ở tuổi ${state.player.prison.releaseAge}. Bấm + Tuổi để trải qua từng năm cải tạo.`
      : `Tiền án: ${(state.player.criminalRecord ?? []).length}. Mỗi năm chỉ được chọn một hành vi. Các mức án là quy tắc hư cấu của game.`);
    dialog.append(heading, status);
    for (const crime of CRIMES) {
      const action = document.createElement("button");
      action.type = "button";
      action.textContent = addChoiceIcon(`${crime.name} · ${formatMoney(crime.reward)} · Nguy cơ bắt ${Math.round(crimeRisk(state.player, crime) * 100)}% · Án ${crime.years + (state.player.criminalRecord?.length ? 1 : 0)} năm`);
      action.disabled = state.player.age < 18 || state.player.isAlive === false || isInPrison(state.player) ||
        state.pendingEvent !== null || state.player.crimeActionAge === state.player.age || isServing(state.player) || isStudyingAbroad(state.player);
      action.addEventListener("click", () => {
        const content = commitCrime(state.player, crime.id);
        if (!content) return;
        const log = { age: state.player.age, content, summary: content };
        state.logs.push(log);
        ui.save();
        ui.renderLogEntry(log);
        ui.renderMoney();
        ui.renderStats();
        ui.renderEducation();
        render(content);
      });
      dialog.append(action);
    }
    if (state.player.age < 18) status.textContent = "Con đường này chỉ mở từ 18 tuổi.";
    if (isStudyingAbroad(state.player)) status.textContent = "Hãy hoàn thành hành trình du học trước khi chọn con đường này.";
    const close = document.createElement("button");
    close.type = "button";
    close.textContent = "Đóng";
    close.addEventListener("click", () => dialog.close());
    dialog.append(close);
  }
  button.addEventListener("click", () => { activities.close(); render(); dialog.showModal(); });
  activities.addEventListener("click", event => {
    const target = event.target.closest("button");
    if (!isInPrison(state.player) || !target || target.id === "close-activities" || target === button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    activities.close();
    render("Trong tù, tôi không thể tham gia các hoạt động bên ngoài. Bấm + Tuổi để tiếp tục cải tạo.");
    dialog.showModal();
  }, true);
}
