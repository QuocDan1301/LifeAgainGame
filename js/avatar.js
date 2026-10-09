import { getOrientationLabel, getOrientationSymbol } from "./special-event-24.js";
const interactiveAvatars = new WeakSet();
const avatarStages = [
  { maxAge: 3, file: "0-3" },
  { maxAge: 5, file: "4-5" },
  { maxAge: 10, file: "6-10" },
  { maxAge: 14, file: "11-14" },
  { maxAge: 17, file: "15-17" },
  { maxAge: 21, file: "18-21" },
  { maxAge: 30, file: "22-30" },
  { maxAge: 50, file: "31-50" },
  { maxAge: 70, file: "51-70" },
  { maxAge: 100, file: "71-100" },
  { maxAge: Infinity, file: "101-105" },
];

export function getAvatarSource(player) {
  const isFemale = player.gender === "female";
  const age = Number.isFinite(player.age) ? Math.max(0, player.age) : 0;
  const stage = avatarStages.find(item => age <= item.maxAge);
  return new URL(`../img/${isFemale ? "Nu" : "Nam"}/${isFemale ? "nu" : "nam"}_${stage.file}.png`, import.meta.url).href;
}

export function renderAvatar(player) {
  const genderLabel = document.getElementById("player-gender");
  if (genderLabel) {
    const symbol = getOrientationSymbol(player.orientation, player.gender);
    const gender = `${symbol} ${player.gender === "female" ? "Nữ" : "Nam"}`;
    const orientation = getOrientationLabel(player.orientation, player.gender);
    genderLabel.textContent = gender + (orientation ? ` - ${orientation}` : "");
  }
  const image = document.getElementById("avt");
  if (!image) return;

  const isFemale = player.gender === "female";

  const age = Number.isFinite(player.age) ? Math.max(0, player.age) : 0;

  const src = getAvatarSource(player);

  // Chỉ thay ảnh khi bước sang giai đoạn mới.
  if (image.src !== src) {
    image.src = src;
  }

  const description = `Chân dung nhân vật ${isFemale ? "nữ" : "nam"}, ${age} tuổi`;

  const container = image.closest(".avatar");

  if (container) {
    container.setAttribute("aria-label", `${description}, nhấn để chào`);
    container.dataset.young = String(age <= 5);
    container.dataset.alive = String(player.isAlive !== false);
    container.disabled = player.isAlive === false;
    if (!interactiveAvatars.has(container)) {
      interactiveAvatars.add(container);
      let greeting;
      container.addEventListener("click", () => {
        if (container.disabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        greeting?.cancel();
        greeting = image.animate([
          { transform: "translateY(0) rotate(0) scale(1)" },
          { transform: "translateY(-10px) rotate(-9deg) scale(1.08)", offset: 0.3 },
          { transform: "translateY(-6px) rotate(9deg) scale(1.05)", offset: 0.55 },
          { transform: "translateY(-3px) rotate(-5deg) scale(1.02)", offset: 0.8 },
          { transform: "translateY(0) rotate(0) scale(1)" },
        ], { duration: 750, easing: "ease-in-out" });
      });
    }
    image.alt = "";
  } else {
    image.alt = description;
  }
}
