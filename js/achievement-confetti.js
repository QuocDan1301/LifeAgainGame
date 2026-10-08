export function celebrateAchievement(dialog) {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (motion.matches) return () => {};

  const layer = document.createElement("div");
  layer.className = "achievement-confetti";
  layer.setAttribute("aria-hidden", "true");
  dialog.append(layer);

  const animations = [];
  let stopped = false;
  const stop = () => {
    if (stopped) return;
    stopped = true;
    motion.removeEventListener("change", onMotionChange);
    animations.forEach((animation) => animation.cancel());
    layer.remove();
  };
  const onMotionChange = () => { if (motion.matches) stop(); };
  motion.addEventListener("change", onMotionChange);

  const colors = ["#ffcc33", "#ff668c", "#35bde8", "#8d72ef", "#64c98b", "#ff9248"];
  const width = window.innerWidth;
  const height = window.innerHeight;
  for (let index = 0; index < 64; index++) {
    const piece = document.createElement("span");
    piece.className = "achievement-confetti-piece";
    piece.style.backgroundColor = colors[index % colors.length];
    piece.style.borderRadius = index % 4 === 0 ? "50%" : "2px";
    layer.append(piece);

    const fromLeft = index % 2 === 0;
    const startX = width * (fromLeft ? 0.15 : 0.85);
    const startY = height * 0.6;
    const peakX = width * (0.15 + Math.random() * 0.7);
    const peakY = height * (0.02 + Math.random() * 0.25);
    const drift = (Math.random() - 0.5) * width * 0.3;
    const rotation = (Math.random() - 0.5) * 1080;
    animations.push(piece.animate([
      { transform: `translate3d(${startX}px, ${startY}px, 0) rotate(0deg)`, opacity: 0, offset: 0 },
      { opacity: 1, offset: 0.08 },
      { transform: `translate3d(${peakX}px, ${peakY}px, 0) rotate(${rotation * 0.35}deg)`, opacity: 1, offset: 0.3, easing: "ease-in" },
      { transform: `translate3d(${peakX + drift}px, ${height + 24}px, 0) rotate(${rotation}deg)`, opacity: 0, offset: 1 },
    ], {
      duration: 2200 + Math.random() * 900,
      delay: Math.random() * 180,
      easing: "ease-out",
      fill: "both",
    }));
  }
  Promise.allSettled(animations.map((animation) => animation.finished)).then(stop);
  return stop;
}
