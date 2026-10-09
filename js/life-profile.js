import { achievements, meetsAchievement } from "./achievements-data.js";

const node = (tag, text) => {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  return element;
};

export function renderLifeSummary(state) {
  const player = state.player;
  document.getElementById("death-title").textContent = player.ending === "cold"
    ? "🌑 Ra đi trong lạnh lẽo"
    : player.ending === "fulfilled" ? "🏆 Kết thúc viên mãn" : "Hành trình đã khép lại";
  const container = document.getElementById("death-summary");
  container.replaceChildren();
  const portrait = node("img");
  portrait.src = document.getElementById("avt").src;
  portrait.alt = `Chân dung ${player.name}`;
  portrait.className = "life-summary-portrait";
  container.append(portrait, node("p", `${player.name} · Tuổi thọ: ${player.age} tuổi`));
  container.append(node("h3", "Những mối quan hệ"));
  const relations = node("ul");
  if (player.partner) relations.append(node("li", `${player.marriedAtAge != null ? "Bạn đời" : "Người yêu"}: ${player.partner.name}`));
  for (const child of player.children ?? []) relations.append(node("li", `Con: ${child.name}`));
  for (const previous of player.relationshipHistory ?? []) {
    relations.append(node("li", `${previous.person?.name ?? previous.name ?? "Mối quan hệ cũ"} · ${previous.age} tuổi · ${previous.text ?? "Một người từng đồng hành"}`));
  }
  if (!relations.children.length) relations.append(node("li", "Những người thân quen đã đi qua cuộc đời tôi."));
  container.append(relations, node("h3", "Thành tựu trong cuộc đời này"));
  const ids = new Set(player.lifeAchievementIds ?? []);
  const earned = node("ul");
  for (const achievement of achievements) {
    if (ids.has(achievement.id) || meetsAchievement(achievement, player)) {
      earned.append(node("li", `${achievement.icon} ${achievement.title}`));
    }
  }
  if (!earned.children.length) earned.append(node("li", "Những câu chuyện trong nhật ký vẫn là điều tôi để lại."));
  container.append(earned);
}

export function initLifeProfile(state, { renderStats, renderLogEntry, checkAchievements }) {
  const dialog = document.getElementById("life-profile-dialog");
  document.getElementById("assets").addEventListener("click", () => {
    if (document.querySelector("dialog[open]")) return;
    const items = document.getElementById("life-keepsakes");
    items.replaceChildren();
    for (const item of state.player.keepsakes ?? []) {
      items.append(node("li", `${item.name} · ${item.receivedAtAge} tuổi${item.description ? ` — ${item.description}` : ""}`));
    }
    if (!items.children.length) items.append(node("li", "Chưa có kỷ vật."));
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
    if (!memories.children.length) memories.append(node("p", "Các trang kỷ niệm sẽ được lưu sau những dấu mốc đặc biệt."));
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
    player.intelligence = Math.min(100, player.intelligence + 1);
    player.happiness = Math.min(100, player.happiness + 1);
    player.lastRepairLessonAge = player.age;
    const log = { age: player.age, content: "🛠️ Tôi dạy sửa đồ miễn phí cho hàng xóm. Mỗi món đồ được sửa lại cũng nối thêm một câu chuyện giữa mọi người.", summary: "Dạy sửa đồ miễn phí cho hàng xóm." };
    state.logs.push(log);
    localStorage.setItem("lifeAgainSave", JSON.stringify(state));
    renderStats();
    renderLogEntry(log);
    checkAchievements();
    refresh();
  });
  refresh();
}
