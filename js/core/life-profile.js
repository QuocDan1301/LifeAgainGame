import { saveGame } from "./save-store.js";
import { getDatingPartners } from '../relationships/concurrent-dating.js';
import { formatMoney, formatMoneyText } from "./money-format.js";
import { getShopItem } from "../leisure/shop.js";
import { getLicenseType } from "../career/licenses.js";
import { destinations } from "../leisure/travel.js";
import { applyActivityGain } from "./stat-budget.js";
import { getDisease } from "../stats/hospital.js";
import { getCareerProfile } from "../career/career-jobs.js";
import { RETIREMENT_AGE } from "../career/career-salary.js";
import { describeJobLossCause } from "../career/job-loss.js";
import { getRelativeAge } from "../relationships/family-members.js";
import { initPanelTabs } from "../ui/panel-tabs.js";

const node = (tag, text) => {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = formatMoneyText(text);
  return element;
};

// Trang tổng kết khi nhân vật qua đời: chân dung, nguyên nhân, chỉ số cuối đời,
// sự nghiệp, tài sản để lại, gia đình và những dấu ấn trong đời.
function describeDeathCause(player) {
  const disease = getDisease(player.deathCause);
  if (disease) return `🩺 Ra đi vì ${disease.name} chuyển nặng đến mức nguy kịch khi chưa được điều trị.`;
  if (player.deathCause === "old-age") {
    const info = player.oldAgeDeath;
    return info && info.health >= 50
      ? `🕯️ Ra đi thanh thản khi tuổi đã cao. Dù sức khỏe vẫn còn ${info.health}%, ở tuổi ${player.age} nguy cơ ra đi mỗi năm khoảng ${Math.round(info.chance * 100)}%.`
      : "🕯️ Ra đi thanh thản khi tuổi đã cao.";
  }
  if (player.deathCause === "exhaustion") return "🚑 Ra đi vì cơ thể kiệt quệ sau nhiều lần làm việc quá sức.";
  if (player.deathCause === "event" && player.deathEvent) return `🍂 Khép lại sau biến cố: ${player.deathEvent}.`;
  if (player.ending === "fulfilled") return "🌅 Khép lại một cuộc đời trọn vẹn.";
  if (player.ending === "cold") return "🌑 Ra đi lặng lẽ, ít người ở bên.";
  return "🍂 Sức khỏe cạn dần rồi khép lại hành trình.";
}

// Bảng "nhãn — giá trị"; bỏ qua dòng không có giá trị.
function factList(rows) {
  const list = node("dl");
  list.className = "death-facts";
  for (const [label, value] of rows) {
    if (!value) continue;
    list.append(node("dt", label), node("dd", value));
  }
  return list;
}

function summarySection(icon, title, ...content) {
  const section = node("section");
  section.className = "dialog-card death-section";
  section.append(node("h3", `${icon} ${title}`), ...content);
  return section;
}

export function renderLifeSummary(state) {
  const player = state.player;
  const dialog = document.getElementById("death-dialog");
  dialog.dataset.ending = player.ending ?? "";
  document.getElementById("death-title").textContent = player.ending === "cold"
    ? "🌑 Ra đi trong lạnh lẽo"
    : player.ending === "fulfilled" ? "🏆 Kết thúc viên mãn" : "🕊️ Hành trình đã khép lại";
  document.getElementById("death-content").textContent = describeDeathCause(player);
  const container = document.getElementById("death-summary");
  container.replaceChildren();

  // Chân dung và thông tin chính.
  const hero = node("div");
  hero.className = "death-hero";
  const portrait = node("img");
  portrait.src = document.getElementById("avt").src;
  portrait.alt = `Chân dung ${player.name}`;
  portrait.className = "life-summary-portrait";
  const identity = node("div");
  identity.className = "death-identity";
  const lifespan = node("p");
  lifespan.className = "death-lifespan";
  lifespan.append(node("strong", String(player.age)), node("span", " năm cuộc đời"));
  identity.append(node("p", player.name), node("p", [player.gender === "female" ? "♀ Nữ" : "♂ Nam", player.province].filter(Boolean).join(" · ")), lifespan);
  identity.children[0].className = "death-name";
  identity.children[1].className = "death-origin";
  hero.append(portrait, identity);

  // Chỉ số cuối đời.
  const stats = node("div");
  stats.className = "death-stats";
  for (const [icon, label, value] of [["💪", "Sức khỏe", player.health], ["🧠", "Trí tuệ", player.intelligence],
    ["❤️", "Hạnh phúc", player.happiness], ["👁️", "Ngoại hình", player.appearance]]) {
    const tile = node("div");
    tile.className = "death-stat";
    const bar = node("span");
    bar.className = "death-stat-bar";
    bar.style.setProperty("--value", `${Math.max(0, Math.min(100, value ?? 0))}%`);
    tile.append(node("span", `${icon} ${label}`), node("strong", `${value ?? 0}%`), bar);
    stats.append(tile);
  }

  // Sự nghiệp và học vấn.
  const jobName = player.job && player.job !== "Thất nghiệp"
    ? player.job.replace(/^\p{Extended_Pictographic}\S*\s+/u, "") : "";
  // Tên công việc chính là tên bậc nghề, nên chỉ ghi thêm bậc hiện tại trên tổng số bậc.
  const ranks = getCareerProfile(player.careerPath?.id)?.ranks ?? [];
  const rank = player.careerLevel > 0 && ranks.length ? `Bậc ${player.careerLevel}/${ranks.length}` : "";
  const licenses = (player.licenses ?? []).map((license) => getLicenseType(license.id))
    .filter(Boolean).map((type) => `${type.icon} ${type.name}`);
  const retired = jobName && player.age >= RETIREMENT_AGE;
  const lastJob = (player.jobHistory ?? []).at(-1);
  const pastJobs = (player.jobHistory ?? [])
    .map((entry) => `${entry.title?.replace(/^\p{Extended_Pictographic}\S*\s+/u, "") ?? "Công việc"} (${describeJobLossCause(entry.cause)} lúc ${entry.age} tuổi)`);
  const career = factList([
    ["Công việc", jobName
      ? `${jobName}${rank ? ` · ${rank}` : ""}${retired ? " · đã nghỉ hưu" : ""}`
      : lastJob ? "Không có công việc chính lúc cuối đời" : "Chưa có công việc chính thức"],
    ["Nước làm việc", player.workCountryName || ""],
    ["Du học", player.overseasEducation ? `${player.overseasEducation.program} · ${player.overseasEducation.countryName}` : ""],
    ["Đã từng làm", pastJobs.join(", ")],
    ["Học vấn", [player.careerPath?.school?.name, player.careerPath?.field && `Ngành ${player.careerPath.field}`].filter(Boolean).join(" · ")],
    ["Bằng lái", licenses.join(", ")],
  ]);

  // Tài sản để lại (giá trị tính theo giá mua).
  const owned = [...(player.livestock ?? []), ...(player.purchases ?? [])];
  const counts = new Map();
  for (const entry of owned) counts.set(entry.id, (counts.get(entry.id) ?? 0) + 1);
  const items = [...counts].map(([id, count]) => [getShopItem(id), count]).filter(([item]) => item);
  const assetValue = items.reduce((sum, [item, count]) => sum + item.price * count, 0);
  const assets = factList([
    [(player.money ?? 0) < 0 ? "Khoản nợ còn lại" : "Tiền trong ví", formatMoney(Math.abs(player.money ?? 0))],
    ["Nợ vay nhà", formatMoney((player.homeLoans ?? []).reduce((sum, loan) => sum + loan.outstanding, 0))],
    ["Khoản cho vay chưa thu", formatMoney((player.storyLoans ?? []).reduce((sum, loan) => sum + loan.outstanding, 0))],
    ["Tài sản", items.length
      ? items.map(([item, count]) => `${item.icon} ${item.name}${count > 1 ? ` ×${count}` : ""}`).join(", ")
      : "Không có tài sản đứng tên"],
    ["Giá trị tài sản", assetValue ? `${formatMoney(assetValue)} (theo giá mua)` : ""],
  ]);

  // Gia đình.
  const children = player.children ?? [];
  const widowed = [...(player.relationshipHistory ?? [])].reverse().find((entry) => entry.type === "widowed");
  const lateSpouse = widowed?.person?.name;
  const pastLoves = (player.relationshipHistory ?? []).filter((entry) => entry.type === "dating"
    && entry.person?.name && !getDatingPartners(player).some(person => person.id === entry.person.id) && entry.person.name !== lateSpouse).map((entry) => entry.person.name);
  const parents = (player.relatives ?? []).map((relative) => relative.alive
    ? `${relative.role} ${relative.name} (${getRelativeAge(relative, player.age)} tuổi)`
    : relative.passedBeforeTracking
      ? `${relative.role} ${relative.name} (đã mất từ trước)`
      : `${relative.role} ${relative.name} (mất khi bạn ${relative.diedAtAge} tuổi)`);
  const family = factList([
    ["Cha mẹ", parents.join(", ")],
    [player.marriedAtAge != null ? "Bạn đời" : "Người yêu", player.partner
      ? `${player.marriedAtAge != null ? player.partner.name : getDatingPartners(player).map(person => person.name).join(", ")}${player.marriedAtAge != null ? ` · kết hôn năm ${player.marriedAtAge} tuổi` : ""}` : ""],
    ["Người bạn đời đã khuất", lateSpouse ? `${lateSpouse} · góa từ năm ${widowed.age} tuổi` : ""],
    ["Bạn bè", (player.friends ?? []).map((friend) => friend.name).join(", ")],
    ["Con cái", children.length
      ? children.map((child) => `${child.name}${child.adopted ? " (con nuôi)" : ""}`).join(", ") : "Không có con"],
    ["Mối tình cũ", [...new Set(pastLoves)].join(", ")],
  ]);
  if (!player.partner && !pastLoves.length && !lateSpouse) family.prepend(node("dt", "Tình duyên"), node("dd", "Sống một mình, tự do theo cách riêng"));

  // Dấu ấn trong đời.
  const trips = Object.keys(player.tripsTaken ?? {}).map((id) => destinations.find((place) => place.id === id))
    .filter(Boolean).map((place) => `${place.icon} ${place.name}`);
  const plushes = Object.values(player.arcade?.plushes ?? {}).reduce((sum, entry) => sum + (entry.count ?? 0), 0);
  const marks = factList([
    ["Đã đi du lịch", trips.join(", ")],
    ["Kỷ niệm", player.memories?.length ? `${player.memories.length} trang kỷ niệm` : ""],
    ["Kỷ vật", (player.keepsakes ?? []).map((item) => item.name).join(", ")],
    ["Tưởng nhớ", (player.familyMemories ?? []).map((memory) => `${memory.role} ${memory.name}: ${memory.text}`).join("\n")],
    ["Thú bông", plushes ? `${plushes} thú bông trong bộ sưu tập` : ""],
    ["Nhật ký", `${new Set(state.logs.map((log) => log.age)).size} năm có ghi chép`],
  ]);

  container.append(hero,
    summarySection("📊", "Chỉ số cuối đời", stats),
    summarySection("💼", "Sự nghiệp & học vấn", career),
    summarySection("💰", "Tài sản để lại", assets),
    summarySection("👨‍👩‍👧", "Gia đình", family),
    summarySection("✨", "Dấu ấn cuộc đời", marks));
  container.scrollTop = 0;
  dialog.scrollTop = 0;
}

export function initLifeProfile(state, { renderStats, renderLogEntry, checkAchievements }) {
  const dialog = document.getElementById("life-profile-dialog");

  // Thanh tab: mỗi loại tài sản một tab kèm số món, chỉ hiện thẻ đang chọn để popup không dài ra.
  const selectTab = initPanelTabs(dialog, document.getElementById("life-tabs"));

  document.getElementById("assets").addEventListener("click", () => {
    if (document.querySelector("dialog[open]")) return;
    const items = document.getElementById("life-keepsakes");
    items.replaceChildren();
    for (const item of state.player.keepsakes ?? []) {
      items.append(node("li", `${item.name} · ${item.receivedAtAge} tuổi${item.description ? ` — ${item.description}` : ""}`));
    }
    const memories = document.getElementById("life-memories");
    memories.replaceChildren();
    for (const memory of state.player.memories ?? []) {
      const card = node("figure");
      card.append(node("h4", `${memory.title} · ${memory.receivedAtAge} tuổi`));
      if (memory.photos?.length) {
        const pair = node("div");
        pair.className = "memory-photo-pair";
        for (const photo of memory.photos) {
          const frame = node("section");
          frame.append(node("h5", photo.title));
          for (const person of photo.portraits) {
            const image = node("img");
            image.src = person.image;
            image.alt = `${person.name} · ${photo.title}`;
            frame.append(image);
          }
          pair.append(frame);
        }
        card.append(pair);
      } else {
        const image = node("img");
        image.src = memory.image;
        image.alt = memory.title;
        card.append(image);
      }
      card.append(node("figcaption", memory.text));
      if (memory.people?.length) card.append(node("p", `Cùng: ${memory.people.join(", ")}`));
      memories.append(card);
    }
    selectTab();
    dialog.showModal();
  });
  document.getElementById("close-life-profile").addEventListener("click", () => dialog.close());
  const teach = document.getElementById("activity-repair-lessons");
  const feedback = document.getElementById("activity-repair-feedback");
  if (!teach || !feedback) return;
  const refresh = () => {
    teach.hidden = !(state.player.unlockedActivities ?? []).includes("free-repair-lessons");
    teach.disabled = state.player.isAlive === false || Boolean(state.pendingEvent) || state.player.lastRepairLessonAge === state.player.age;
    feedback.textContent = !teach.hidden && state.player.lastRepairLessonAge === state.player.age
      ? "Bạn đã dạy một buổi trong năm nay. Năm sau có thể tiếp tục." : "";
  };
  document.getElementById("activities").addEventListener("click", refresh);
  teach.addEventListener("click", () => {
    refresh();
    if (teach.hidden || teach.disabled) return;
    const player = state.player;
    applyActivityGain(player, "intelligence", 1);
    applyActivityGain(player, "happiness", 1);
    player.lastRepairLessonAge = player.age;
    const log = { age: player.age, content: "🛠️ Tôi dạy sửa đồ miễn phí cho hàng xóm. Mỗi món đồ được sửa lại cũng nối thêm một câu chuyện giữa mọi người.", summary: "Dạy sửa đồ miễn phí cho hàng xóm." };
    state.logs.push(log);
    saveGame(state);
    renderStats();
    renderLogEntry(log);
    checkAchievements();
    refresh();
  });
  refresh();
}
