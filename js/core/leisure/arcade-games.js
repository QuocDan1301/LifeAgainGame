import {
  BASKET_FINAL_SECONDS, basketPoints, CLAW_BOX, CLAW_CHUTE, CLAW_REACH, CLAW_SECONDS, CLAW_START, clampClaw, clawChuteCenter,
  clawTargets, cowTypes, formatPercent, gameOf, LASSO_FLIGHT, pickWeighted, plushOf, plushRarities, whackTargets,
} from "./game-center-data.js";

// Các trò chơi trong Game Center. Kéo bò có giao diện riêng (xem playCow); các trò khác nhận
// { stage, session, decide, progress, finish }:
// - decide(outcome): kết quả đã chốt (kéo bò, gắp thú) — lưu ngay để tải lại trang không đổi được.
// - progress(score): điểm hiện tại của trò tính giờ (bóng rổ, đập chuột).
// - finish(): hoạt ảnh kết thúc, Game Center tính thưởng.
// Hàm trả về stop() để dừng vòng lặp và gỡ sự kiện khi đóng popup giữa chừng.
const EMOJI_FONT = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';

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
const liveText = (text) => {
  const node = element("p", "game-live", text);
  node.setAttribute("aria-live", "polite");
  return node;
};

// Canvas sắc nét trên màn hình mật độ cao; vẽ theo tọa độ logic width × height.
function makeCanvas(width, height, label) {
  const canvas = element("canvas", "gc-canvas");
  const ratio = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", label);
  const ctx = canvas.getContext("2d");
  ctx.scale(ratio, ratio);
  return { canvas, ctx };
}
function drawEmoji(ctx, char, x, y, size, flip = false) {
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);
  // Emoji màu vẫn lấy độ trong suốt của fillStyle: dùng màu đặc để không bị mờ.
  ctx.fillStyle = "#000";
  ctx.font = `${size}px ${EMOJI_FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(char, 0, 0);
  ctx.restore();
}
function strokeLine(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
// Vòng lặp khung hình; step trả về false để dừng. dt bị chặn để tab ẩn lâu không làm vật thể "nhảy cóc".
function runLoop(step) {
  let last = performance.now();
  let frame = requestAnimationFrame(function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (step(dt) !== false) frame = requestAnimationFrame(tick);
  });
  return () => cancelAnimationFrame(frame);
}
// Phím cách/Enter trên một nút đang focus để trình duyệt tự bấm nút đó; các phím khác do trò chơi xử lý.
function listenKeys(onDown, onUp) {
  const down = (event) => {
    // Giữ phím không được tính là bấm liên tục.
    if (event.repeat && [" ", "Enter"].includes(event.key)) {
      event.preventDefault();
      return;
    }
    if ([" ", "Enter"].includes(event.key) && event.target.closest?.("button")) return;
    if (onDown(event)) event.preventDefault();
  };
  const up = (event) => onUp?.(event);
  document.addEventListener("keydown", down);
  document.addEventListener("keyup", up);
  return () => {
    document.removeEventListener("keydown", down);
    document.removeEventListener("keyup", up);
  };
}
function hud(...texts) {
  const node = element("div", "gc-hud");
  const parts = texts.map((text) => node.appendChild(element("span", "", text)));
  return { node, set: (index, text) => { if (parts[index].textContent !== text) parts[index].textContent = text; } };
}

export function playArcadeGame(gameId, hooks) {
  return { cow: playCow, claw: playClaw, basketball: playBasketball, whack: playWhack }[gameId](hooks);
}

// ---------- Kéo bò ----------
// Sân chơi liên tục: mỗi lần thả dây là một lượt riêng. begin() trừ 1 xu và bốc sẵn kết quả
// (session.outcome); phần còn lại chỉ diễn hoạt ảnh theo kết quả đó, resolve() cộng thưởng một lần.
function playCow({ stage, coins, begin, progress, resolve, exit }) {
  const W = 320, H = 400;
  const HAND = { x: 160, y: 344 };
  const HOME = { x: 160, y: 306 };
  const { canvas, ctx } = makeCanvas(W, H, "Đồng cỏ kéo bò: chạm vào một con bò để chọn, số trên đầu là xu thưởng");
  canvas.classList.add("gc-pasture");
  const status = liveText("Chạm vào một con bò để chọn mục tiêu.");
  const pullInfo = element("div", "gc-pull-info");
  const timer = element("span", "gc-pull-timer", "💪 Đang giằng co…");
  const bar = element("div", "gc-pull-bar");
  const fill = element("div", "gc-pull-fill");
  bar.setAttribute("role", "progressbar");
  bar.setAttribute("aria-label", "Tiến độ kéo bò");
  bar.setAttribute("aria-valuemin", "0");
  bar.setAttribute("aria-valuemax", "100");
  bar.append(fill);
  pullInfo.append(timer, bar);
  const pullButton = button("gc-pull-button", "", () => {});
  pullButton.append(element("span", "gc-pull-hand", "✊"), element("span", "gc-pull-label", "Nhấn để kéo cùng!"));
  const throwButton = button("shop-buy game-primary gc-action", "🪢 Thả dây · −1 xu", throwLasso);
  const leave = button("shop-back gc-leave", "🏁 Rời sân", () => exit());
  const legend = element("ul", "gc-legend");
  for (const type of cowTypes) legend.append(element("li", "", `${type.crown ? "👑" : ""}${type.icon} ${type.payout} xu · bắt ${formatPercent(type.catchChance)}`));
  stage.append(canvas, status, pullInfo, pullButton, throwButton, leave, legend);

  // Ba làn có phối cảnh: làn xa nhỏ và chậm hơn.
  const lanes = [
    { y: 152, dir: -1, scale: 0.78, speed: 34, wait: 0 },
    { y: 220, dir: 1, scale: 0.9, speed: 46, wait: 0.8 },
    { y: 288, dir: -1, scale: 1, speed: 40, wait: 1.6 },
  ];
  // Hoa rải cố định trên cỏ (giả ngẫu nhiên để không thành hàng).
  const noise = (n) => Math.abs(Math.sin(n * 12.9898) * 43758.5453) % 1;
  const flowers = Array.from({ length: 26 }, (_, i) => ({
    x: noise(i + 1) * W, y: 124 + noise(i + 101) * (H - 170), color: ["#ffffff", "#ffd6e7", "#fff2a8"][i % 3],
  }));
  let cows = [];
  let selected = null;
  let phase = "aim";
  let phaseTime = 0;
  let clock = 0;
  let session = null;
  let lasso = null;
  let pull = null;
  let particles = [];
  let banner = null;

  function spawn(lane) {
    const type = pickWeighted(cowTypes);
    const width = type.size * lane.scale;
    const entry = lane.dir > 0 ? -width : W + width;
    const last = cows.filter((cow) => cow.lane === lane && !cow.caught).at(-1);
    // Không cho bò mới chồng lên con vừa vào sân.
    if (last && Math.abs(last.x - entry) < (last.width + width) / 2 + 70) {
      lane.wait = 0.2;
      return;
    }
    cows.push({ lane, type, width, speed: lane.speed, x: entry, y: lane.y, bob: Math.random() * 6 });
    lane.wait = 2.4 + Math.random() * 2.4;
  }
  function moveCows(dt) {
    for (const cow of cows) {
      if (cow.fleeing) {
        cow.x += cow.lane.dir * cow.speed * 3 * dt;
        cow.y += (cow.lane.y - cow.y) * Math.min(1, dt * 4);
      } else if (!cow.caught) {
        cow.x += cow.lane.dir * cow.speed * dt;
      }
    }
    cows = cows.filter((cow) => (cow.caught && !cow.fleeing) || (cow.x > -100 && cow.x < W + 100));
    for (const lane of lanes) {
      lane.wait -= dt;
      if (lane.wait <= 0) spawn(lane);
    }
  }
  // Cho đàn bò đi trước vài giây để đồng cỏ đã có bò ngay khi vào sân.
  for (let t = 0; t < 8; t += 1 / 30) moveCows(1 / 30);

  const selectable = (cow) => !cow.caught && !cow.fleeing && cow.x > 24 && cow.x < W - 24;
  const dust = (x, y, count = 4) => {
    for (let i = 0; i < count; i += 1) {
      particles.push({ kind: "dust", x: x + (Math.random() - 0.5) * 20, y, vx: (Math.random() - 0.5) * 50, vy: -10 - Math.random() * 20, life: 0, max: 0.6, size: 4 + Math.random() * 4 });
    }
  };

  function updateButtons() {
    const aiming = phase === "aim";
    throwButton.hidden = !(aiming || phase === "throw" || phase === "miss");
    leave.hidden = !aiming && phase !== "caught" && phase !== "escaped" && phase !== "miss";
    pullInfo.hidden = pullButton.hidden = phase !== "pull";
    const enough = coins() >= 1;
    throwButton.disabled = !aiming || !selected || !enough;
    throwButton.textContent = !enough ? "🪙 Hết xu: hãy đổi thêm" : selected ? `🪢 Thả dây vào ${selected.type.name} · −1 xu` : "🪢 Chọn một con bò trước";
    leave.disabled = phase === "throw" || phase === "pull";
  }
  function select(cow) {
    if (phase !== "aim" || !cow) return;
    selected = cow;
    status.textContent = `Đã chọn ${cow.type.name}: thưởng ${cow.type.payout} xu, tỉ lệ bắt được ${formatPercent(cow.type.catchChance)}. Bấm Thả dây!`;
    updateButtons();
  }
  canvas.addEventListener("pointerdown", (event) => {
    if (phase !== "aim") return;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (W / rect.width);
    const y = (event.clientY - rect.top) * (H / rect.height);
    const near = cows.filter((cow) => selectable(cow) && Math.abs(cow.x - x) <= cow.width * 0.65 && Math.abs(cow.y - 8 - y) <= cow.width * 0.75)
      .sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y));
    if (near.length) select(near[0]);
  });
  // Phím mũi tên: chuyển mục tiêu theo vị trí từ trái sang phải.
  function cycle(step) {
    const options = cows.filter(selectable).sort((a, b) => a.x - b.x);
    if (!options.length) return;
    const index = options.indexOf(selected);
    select(options[index === -1 ? (step > 0 ? 0 : options.length - 1) : (index + step + options.length) % options.length]);
  }

  function throwLasso() {
    if (phase !== "aim" || !selected || !selectable(selected)) return;
    const target = selected;
    const started = begin(target.type.id);
    if (!started) {
      status.textContent = "Không đủ xu để thả dây.";
      updateButtons();
      return;
    }
    session = started;
    phase = "throw";
    phaseTime = 0;
    selected = null;
    // Dây bay tới chỗ bò sẽ có mặt sau LASSO_FLIGHT giây; kết quả đã bốc là trượt thì rơi lệch sang cạnh bò.
    const miss = session.outcome.result === "miss" ? (Math.random() < 0.5 ? -1 : 1) * target.width * 0.8 : 0;
    lasso = { from: { ...HAND }, to: { x: target.x + target.lane.dir * target.speed * LASSO_FLIGHT + miss, y: target.y }, target };
    status.textContent = "Dây đang bay…";
    updateButtons();
  }
  // Dây chạm đất: diễn theo kết quả đã bốc khi thả.
  function land() {
    const target = lasso.target;
    if (session.outcome.result !== "miss") {
      target.caught = true;
      phase = "pull";
      phaseTime = 0;
      // Thanh kéo chạy theo kịch bản: bắt được thì đầy thanh sau 2,5–5 giây; bò thoát thì lên tới
      // 55–85% rồi tụt về 0 và đứt dây sau 3–5 giây.
      const caught = session.outcome.result === "caught";
      pull = { cow: target, start: { x: target.x, y: target.y }, progress: 0, t: 0, caught,
        end: caught ? 2.5 + Math.random() * 2.5 : 3 + Math.random() * 2, peak: 55 + Math.random() * 30,
        bump: 0, nextStruggle: 0.6 + Math.random() * 0.6, jerk: 0, tension: 0.6, lean: 0 };
      session.phase = "pull";
      session.cow = target.type.id;
      progress(session, 0, true);
      dust(target.x, target.y + target.width * 0.35, 6);
      status.textContent = `Trúng ${target.type.name}! Bò đang giằng co, nhấn ✊ để kéo cùng!`;
      updateButtons();
      updatePullUi();
      pullButton.focus({ preventScroll: true });
      pullButton.scrollIntoView?.({ block: "nearest" });
    } else {
      resolve(session);
      session = null;
      phase = "miss";
      phaseTime = 0;
      dust(lasso.to.x, lasso.to.y + 16, 5);
      status.textContent = "Trượt rồi! Mất 1 xu. Chọn bò rồi thử lại nhé.";
      updateButtons();
    }
  }

  function tap() {
    if (phase !== "pull") return;
    const { cow } = pull;
    // Nhấn chỉ làm bò nhích lên một chút cho vui; kết quả đã chốt khi thả dây.
    pull.bump = Math.min(8, pull.bump + 2.5);
    pull.tension = 1;
    pull.lean = 1;
    if (Math.random() < 0.6) dust(cow.x, cow.y + cow.width * 0.4, 2);
    pullButton.classList.remove("is-tap");
    void pullButton.offsetWidth;
    pullButton.classList.add("is-tap");
  }
  function updatePullUi() {
    const value = Math.round(pull.progress);
    fill.style.width = `${pull.progress}%`;
    bar.setAttribute("aria-valuenow", String(value));
  }
  function stepPull(dt) {
    const { type } = pull.cow;
    pull.t += dt;
    pull.nextStruggle -= dt;
    // Bò giãy theo từng đợt, loại thưởng cao giãy mạnh hơn.
    if (pull.nextStruggle <= 0) {
      pull.jerk = 0.4 + type.struggle * 0.6;
      pull.nextStruggle = 0.6 + Math.random() * 0.6;
      dust(pull.cow.x, pull.cow.y + pull.cow.width * 0.4, 3);
    }
    const k = Math.min(1, pull.t / pull.end);
    const base = pull.caught ? 100 * (1 - (1 - k) ** 2) : pull.peak * Math.sin(Math.PI * k);
    const wobble = Math.sin(pull.t * 7) * 4 * (1 - k);
    pull.progress = Math.max(0, Math.min(pull.caught ? 99 : 95, base + wobble + pull.bump - pull.jerk * 6));
    pull.bump = Math.max(0, pull.bump - dt * 8);
    pull.jerk = Math.max(0, pull.jerk - dt * 3);
    pull.tension = Math.max(0.15, pull.tension - dt * 2.2);
    pull.lean = Math.max(0, pull.lean - dt * 5);
    // Bò trượt dần từ chỗ bị bắt về phía người chơi theo thanh tiến độ.
    const p = 1 - (1 - pull.progress / 100) ** 2;
    pull.cow.x = pull.start.x + (HOME.x - pull.start.x) * p;
    pull.cow.y = pull.start.y + (HOME.y - pull.start.y) * p;
    progress(session, Math.round(pull.progress));
    updatePullUi();
    if (k >= 1) {
      if (pull.caught) {
        pull.progress = 100;
        updatePullUi();
        win();
      } else {
        escape();
      }
    }
  }
  function win() {
    const { cow } = pull;
    resolve(session);
    session = null;
    phase = "caught";
    phaseTime = 0;
    for (let i = 0; i < Math.min(18, 6 + cow.type.payout); i += 1) {
      particles.push({ kind: "coin", x: cow.x, y: cow.y - 10, vx: (Math.random() - 0.5) * 220, vy: -260 - Math.random() * 180, life: 0, max: 1.3, size: 16 + Math.random() * 6 });
    }
    banner = { text: `+${cow.type.payout} xu!`, t: 0 };
    status.textContent = `🎉 Bắt được ${cow.type.name}! +${cow.type.payout} xu.`;
    updateButtons();
  }
  function escape() {
    const { cow } = pull;
    resolve(session);
    session = null;
    phase = "escaped";
    phaseTime = 0;
    cow.fleeing = true;
    dust(cow.x, cow.y + cow.width * 0.4, 8);
    status.textContent = `Ôi! ${cow.type.name} giãy đứt dây chạy mất.`;
    updateButtons();
  }

  function step(dt) {
    clock += dt;
    phaseTime += dt;
    moveCows(dt);
    if (selected && !selectable(selected)) {
      selected = null;
      if (phase === "aim") status.textContent = "Con bò đã chạy khỏi sân. Chọn con khác nhé!";
      updateButtons();
    }
    if (phase === "throw" && phaseTime >= LASSO_FLIGHT) land();
    else if (phase === "pull") stepPull(dt);
    else if (["miss", "caught", "escaped"].includes(phase) && phaseTime >= { miss: 0.7, caught: 1.6, escaped: 1.1 }[phase]) {
      if (phase === "caught") cows = cows.filter((cow) => cow !== pull.cow);
      phase = "aim";
      lasso = null;
      pull = null;
      updateButtons();
    }
    for (const particle of particles) {
      particle.life += dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      if (particle.kind === "coin") particle.vy += 620 * dt;
    }
    particles = particles.filter((particle) => particle.life < particle.max);
    if (banner) {
      banner.t += dt;
      if (banner.t > 1.4) banner = null;
    }
    draw();
  }

  // ---------- Vẽ ----------
  function drawScenery() {
    const sky = ctx.createLinearGradient(0, 0, 0, 110);
    sky.addColorStop(0, "#8fd3ff");
    sky.addColorStop(1, "#e3f6ff");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, 110);
    ctx.fillStyle = "#ffe066";
    ctx.beginPath();
    ctx.arc(276, 34, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgb(255 255 255 / 90%)";
    for (const [base, y, size] of [[40, 30, 1], [190, 52, 0.8], [330, 22, 1.1]]) {
      const x = ((base + clock * 8) % (W + 120)) - 60;
      ctx.beginPath();
      ctx.ellipse(x, y, 26 * size, 10 * size, 0, 0, Math.PI * 2);
      ctx.ellipse(x + 16 * size, y - 6 * size, 16 * size, 10 * size, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#9bd77a";
    ctx.beginPath();
    ctx.ellipse(70, 112, 130, 40, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = "#86cc66";
    ctx.beginPath();
    ctx.ellipse(260, 114, 140, 34, 0, Math.PI, 0);
    ctx.fill();
    const grass = ctx.createLinearGradient(0, 104, 0, H);
    grass.addColorStop(0, "#b2e68a");
    grass.addColorStop(1, "#68bb4c");
    ctx.fillStyle = grass;
    ctx.fillRect(0, 104, W, H - 104);
    ctx.strokeStyle = "#c08a54";
    ctx.lineWidth = 2;
    strokeLine(ctx, 0, 108, W, 108);
    strokeLine(ctx, 0, 116, W, 116);
    for (let x = 6; x < W; x += 22) strokeLine(ctx, x, 102, x, 120);
    for (const flower of flowers) {
      ctx.fillStyle = flower.color;
      ctx.beginPath();
      ctx.arc(flower.x, flower.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "rgb(150 110 60 / 18%)";
    for (const lane of lanes) {
      ctx.beginPath();
      ctx.ellipse(W / 2, lane.y + 24 * lane.scale, W * 0.62, 7 * lane.scale, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  function drawCoinTag(cow, x, y) {
    const text = String(cow.type.payout);
    const width = 22 + text.length * 8;
    const top = y - cow.width * 0.62 - 20;
    ctx.fillStyle = "#fff8d6";
    ctx.strokeStyle = cow.type.tag ?? "#d6ac45";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x - width / 2, top, width, 18, 9);
    ctx.fill();
    ctx.stroke();
    drawEmoji(ctx, "🪙", x - width / 2 + 10, top + 9.5, 12);
    ctx.fillStyle = "#6b4a12";
    ctx.font = 'bold 13px "Sriracha", cursive';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x + 7, top + 10);
  }
  function drawCow(cow, { x = cow.x, y = cow.y, scale = 1 } = {}) {
    const size = cow.width * scale;
    const { glow, crown, icon } = cow.type;
    ctx.fillStyle = "rgb(40 60 20 / 22%)";
    ctx.beginPath();
    ctx.ellipse(x, y + size * 0.42, size * 0.45, size * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
    if (glow) {
      ctx.save();
      ctx.shadowColor = glow;
      ctx.shadowBlur = 16;
      ctx.fillStyle = glow;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.ellipse(x, y + size * 0.05, size * 0.5, size * 0.38, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    // Biểu tượng bò quay mặt sang trái; lật lại khi bò đi sang phải.
    drawEmoji(ctx, icon, x, y, size, cow.lane.dir > 0);
    if (crown) drawEmoji(ctx, "👑", x, y - size * 0.5, size * 0.42);
    drawCoinTag(cow, x, y);
  }
  function drawRope(from, to, tension) {
    ctx.strokeStyle = "#8a5a2b";
    ctx.lineWidth = 2.5 + tension * 1.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    if (tension > 0.45) {
      // Dây căng: thẳng và rung nhẹ.
      const dx = to.x - from.x, dy = to.y - from.y;
      const length = Math.hypot(dx, dy) || 1;
      const nx = -dy / length, ny = dx / length;
      for (let i = 1; i <= 12; i += 1) {
        const k = i / 12;
        const wave = Math.sin(k * Math.PI) * Math.sin(clock * 60 + i) * 1.6 * tension;
        ctx.lineTo(from.x + dx * k + nx * wave, from.y + dy * k + ny * wave);
      }
    } else {
      // Dây chùng: võng xuống.
      ctx.quadraticCurveTo((from.x + to.x) / 2, Math.max(from.y, to.y) + 24 * (1 - tension), to.x, to.y);
    }
    ctx.stroke();
    ctx.lineCap = "butt";
  }
  function drawLoop(x, y, spin = 0) {
    ctx.strokeStyle = "#8a5a2b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(x, y, 13, 6 + 2 * Math.sin(spin), spin * 0.3, 0, Math.PI * 2);
    ctx.stroke();
  }
  function draw() {
    drawScenery();
    const pulled = pull?.cow;
    for (const cow of [...cows].sort((a, b) => a.y - b.y)) {
      if (cow === pulled && !cow.fleeing) continue;
      if (cow === selected) {
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(cow.x, cow.y + cow.width * 0.42, cow.width * 0.6, cow.width * 0.16, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      drawCow(cow, { y: cow.y + (cow.fleeing ? 0 : Math.sin(clock * 9 + cow.bob) * 1.2) });
    }
    // Mũi tên nhún nhảy trên con bò đang chọn.
    if (selected && phase === "aim") {
      drawEmoji(ctx, "👇", selected.x, selected.y - selected.width * 0.62 - 34 + Math.sin(clock * 6) * 3, 20);
    }
    if (pulled && !pulled.fleeing) {
      const shake = Math.sin(clock * 48) * (1 + 4 * pull.jerk) * (phase === "pull" ? 1 : 0);
      const p = phase === "pull" ? pull.progress / 100 : 1;
      const scale = (1 + (1 / pulled.lane.scale - 1) * p) * (phase === "caught" ? Math.max(0, 1 - phaseTime / 1.6) * 0.3 + 0.7 : 1);
      ctx.save();
      if (phase === "caught") ctx.globalAlpha = Math.max(0, 1 - phaseTime / 1.4);
      drawCow(pulled, { x: pulled.x + shake, scale });
      ctx.restore();
      if (phase === "pull") drawRope({ x: HAND.x, y: HAND.y - pull.lean * 3 }, { x: pulled.x + shake, y: pulled.y - 4 }, pull.tension);
    }
    if (lasso && phase === "throw") {
      const k = Math.min(1, phaseTime / LASSO_FLIGHT);
      const x = lasso.from.x + (lasso.to.x - lasso.from.x) * k;
      const y = lasso.from.y + (lasso.to.y - lasso.from.y) * k - Math.sin(Math.PI * k) * 70;
      drawRope(HAND, { x, y }, 0.2);
      drawLoop(x, y, clock * 14);
    } else if (lasso && phase === "miss") {
      const k = Math.min(1, phaseTime / 0.6);
      const x = lasso.to.x + (HAND.x - lasso.to.x) * k;
      const y = lasso.to.y + 16 + (HAND.y - lasso.to.y - 16) * k;
      drawRope(HAND, { x, y }, 0);
      drawLoop(x, y);
    }
    // Người chơi ở dưới cùng, ngả người khi kéo.
    ctx.fillStyle = "#a0703f";
    ctx.beginPath();
    ctx.ellipse(HAND.x, H - 14, 46, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    drawEmoji(ctx, "🤠", HAND.x, H - 36 + (pull?.lean ?? 0) * 3, 40);
    for (const particle of particles) {
      const fade = 1 - particle.life / particle.max;
      if (particle.kind === "dust") {
        ctx.fillStyle = `rgb(176 140 92 / ${0.55 * fade})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * (1 + particle.life * 2), 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.globalAlpha = Math.min(1, fade * 2);
        drawEmoji(ctx, "🪙", particle.x, particle.y, particle.size);
        ctx.globalAlpha = 1;
      }
    }
    if (banner) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, 2.5 - banner.t * 1.8);
      ctx.font = 'bold 34px "Sriracha", cursive';
      ctx.textAlign = "center";
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#ffffff";
      ctx.fillStyle = "#e08a00";
      const y = 200 - banner.t * 40;
      ctx.strokeText(banner.text, W / 2, y);
      ctx.fillText(banner.text, W / 2, y);
      ctx.restore();
    }
  }

  // Nhấn kéo: chạm/nhấn chuột tính ngay ở pointerdown; bàn phím (Enter/phím cách trên nút) qua click.
  pullButton.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    tap();
  });
  pullButton.addEventListener("click", (event) => { if (event.detail === 0) tap(); });
  updateButtons();
  draw();
  const stopLoop = runLoop(step);
  const stopKeys = listenKeys((event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      cycle(event.key === "ArrowLeft" ? -1 : 1);
      return true;
    }
    if (event.key !== " " && event.key !== "Enter") return false;
    if (phase === "pull") tap();
    else throwLasso();
    return true;
  });
  return () => {
    stopLoop();
    stopKeys();
  };
}

// ---------- Gắp thú ----------
// Máy nhìn từ trên xuống, dùng chung giữa các lượt. Mỗi lượt: begin() trừ 3 xu; lockIn() chốt kết quả
// khi bắt đầu hạ càng; finish() cộng quà / trả thú về máy đúng một lần. Lượt đang chơi (vị trí càng,
// thời gian còn lại, giai đoạn, kết quả) nằm trong session nên đóng hay tải lại vẫn chơi tiếp được.
function playClaw({ stage, machine, session, coins, cost, begin, persist, lockIn, finish, exit }) {
  const W = 320, H = 320, LIFT = 26, SPEED = 140;
  const { canvas, ctx } = makeCanvas(W, H, "Máy gắp thú nhìn từ trên xuống: bóng tròn là vùng gắp, cửa nhận quà ở góc dưới trái");
  canvas.classList.add("gc-claw-canvas");
  const info = hud(`⏱️ ${CLAW_SECONDS} giây`, "🎯 Chưa chạm thú");
  const status = liveText("");
  const result = element("div", "gc-claw-result");
  result.hidden = true;
  const stock = element("p", "gc-claw-stock");
  const startButton = button("shop-buy game-primary gc-action gc-claw-start", "", start);
  const leave = button("shop-back gc-leave", "🏁 Rời máy", () => exit());
  const controls = element("div", "gc-claw-controls");
  const pad = element("div", "gc-dpad");
  const arrows = {};
  for (const [key, label, name, dx, dy] of [["up", "▲", "Lên", 0, -1], ["left", "◀", "Sang trái", -1, 0],
    ["right", "▶", "Sang phải", 1, 0], ["down", "▼", "Xuống", 0, 1]]) {
    const node = button(`game-option gc-move gc-dpad-${key}`, label, () => {});
    node.setAttribute("aria-label", name);
    arrows[key] = { node, dx, dy };
    pad.append(node);
  }
  const grabButton = button("shop-buy game-primary gc-grab", "GẮP", grab);
  controls.append(pad, grabButton);
  stage.append(info.node, canvas, status, result, controls, startButton, leave, stock);

  const pressed = new Set();
  let current = session();
  let phase = current ? (current.phase === "drop" ? "drop" : "aim") : "preview";
  const claw = { x: current?.claw?.x ?? CLAW_START.x, y: current?.claw?.y ?? CLAW_START.y, h: 1, open: 1 };
  let anim = null;
  let carried = null;
  let falling = [];
  let wiggle = null;
  let saveClock = 0;
  let sway = 0;
  // Càng lắc lư khi đang căn (tới 11px ngang, 9px dọc, nhịp không đều); vị trí gắp thật là chỗ bóng tròn nằm lúc bấm GẮP.
  const aimPoint = () => (phase === "aim"
    ? clampClaw(claw.x + 8 * Math.sin(sway * 2.8) + 3 * Math.sin(sway * 5.3 + 2), claw.y + 7 * Math.sin(sway * 2.1 + 1) + 2 * Math.sin(sway * 4.4))
    : { x: claw.x, y: claw.y });
  const items = () => machine().items;
  const itemOf = (uid) => items().find((item) => item.uid === uid) ?? null;
  // Thú ở cửa / rơi lại: chỉ là hình vẽ, dữ liệu máy được cập nhật trong finish().
  const pellets = Array.from({ length: 70 }, (_, i) => ({
    x: CLAW_BOX.left + ((i * 71) % (CLAW_BOX.right - CLAW_BOX.left)), y: CLAW_BOX.top + ((i * 113) % (CLAW_BOX.bottom - CLAW_BOX.top)),
    color: ["#ffd1e1", "#cfe8ff", "#fff1a8", "#d6f5c6", "#e6d8ff"][i % 5],
  }));

  function describeStock() {
    const counts = new Map();
    for (const item of items()) counts.set(item.id, (counts.get(item.id) ?? 0) + 1);
    const parts = [...counts].map(([id, count]) => `${plushOf(id).icon}×${count}`);
    stock.textContent = parts.length
      ? `Trong máy (${items().length} con): ${parts.join(" ")} · Căn chuẩn: ${Object.values(plushRarities).map((rarity) => `${rarity.label.toLowerCase()} ${formatPercent(rarity.grab)}`).join(", ")}.`
      : "Máy đã hết thú. Sang tuổi mới máy sẽ được bổ sung!";
  }
  function updateUi() {
    const aiming = phase === "aim";
    controls.hidden = phase === "preview";
    for (const { node } of Object.values(arrows)) node.disabled = !aiming;
    grabButton.disabled = !aiming;
    startButton.hidden = phase !== "preview";
    leave.hidden = phase !== "preview";
    const enough = coins() >= cost;
    startButton.disabled = !enough || !items().length;
    startButton.textContent = !items().length ? "Máy đã hết thú" : enough ? `▶️ Chơi — ${cost} xu` : `🪙 Không đủ xu (cần ${cost})`;
    if (phase === "preview") {
      info.set(0, `⏱️ ${CLAW_SECONDS} giây`);
      if (!status.textContent) status.textContent = "Xem các món trong máy rồi bấm Chơi.";
    }
    describeStock();
  }
  function start() {
    if (phase !== "preview") return;
    const next = begin();
    if (!next) {
      status.textContent = `Không đủ xu: mỗi lượt cần ${cost} xu.`;
      return updateUi();
    }
    current = next;
    claw.x = current.claw.x;
    claw.y = current.claw.y;
    claw.h = 1;
    claw.open = 1;
    phase = "aim";
    result.hidden = true;
    status.textContent = "Đưa bóng tròn tới giữa thú bông rồi bấm GẮP!";
    updateUi();
    grabButton.focus({ preventScroll: true });
  }
  // Bắt đầu hạ càng: khóa điều khiển và chốt kết quả (lưu ngay).
  function grab() {
    if (phase !== "aim") return;
    pressed.clear();
    const point = aimPoint();
    current.claw = { x: Math.round(point.x), y: Math.round(point.y) };
    current.timeLeft = Math.max(0, current.timeLeft);
    const outcome = lockIn(current);
    if (!outcome) return;
    phase = "drop";
    startDrop();
  }
  function startDrop() {
    const outcome = current.outcome;
    claw.x = current.claw.x;
    claw.y = current.claw.y;
    claw.h = 1;
    claw.open = 1;
    anim = { step: "descend", t: 0, outcome };
    status.textContent = "Càng đang hạ xuống…";
    updateUi();
  }
  function done() {
    const settled = finish(current);
    current = null;
    phase = "preview";
    carried = null;
    anim = null;
    claw.x = CLAW_START.x;
    claw.y = CLAW_START.y;
    claw.h = 1;
    claw.open = 1;
    if (settled) {
      result.hidden = false;
      result.className = `gc-claw-result ${settled.win ? "is-win" : "is-lose"}`;
      result.replaceChildren(element("strong", "", settled.title), element("span", "", settled.text));
      status.textContent = settled.title;
    }
    updateUi();
    startButton.focus({ preventScroll: true });
  }
  // Di chuyển càng tới đích với tốc độ cố định; trả về true khi tới nơi.
  function moveClaw(target, dt, speed = 130) {
    const dx = target.x - claw.x, dy = target.y - claw.y;
    const distance = Math.hypot(dx, dy);
    const step = speed * dt;
    if (distance <= step) {
      claw.x = target.x;
      claw.y = target.y;
      return true;
    }
    claw.x += (dx / distance) * step;
    claw.y += (dy / distance) * step;
    return false;
  }
  function stepAnim(dt) {
    const { outcome } = anim;
    anim.t += dt;
    const item = outcome.uid ? itemOf(outcome.uid) : null;
    if (anim.step === "descend") {
      claw.h = Math.max(0, 1 - anim.t / 0.8);
      if (claw.h === 0) Object.assign(anim, { step: "close", t: 0 });
    } else if (anim.step === "close") {
      claw.open = Math.max(0, 1 - anim.t / 0.35);
      if (anim.t >= 0.45) {
        if (item && (outcome.result === "caught" || outcome.result === "slipped")) carried = { item, x: claw.x, y: claw.y };
        Object.assign(anim, { step: "lift", t: 0 });
        status.textContent = carried ? "Càng đang nâng lên…" : "Càng nâng lên…";
      }
    } else if (anim.step === "lift") {
      claw.h = Math.min(1, anim.t / 0.8);
      // Càng quệt qua thú nhưng không giữ được: thú lắc nhẹ tại chỗ.
      wiggle = outcome.result === "missed" && item && anim.t < 0.35 ? { uid: item.uid, dx: Math.sin(anim.t * 40) * 3 } : null;
      if (claw.h === 1) {
        if (outcome.result === "caught") Object.assign(anim, { step: "carry", t: 0 });
        else if (outcome.result === "slipped") Object.assign(anim, { step: "toSlip", t: 0 });
        else Object.assign(anim, { step: "end", t: 0 });
      }
    } else if (anim.step === "carry") {
      if (moveClaw(clawChuteCenter(), dt)) Object.assign(anim, { step: "release", t: 0 });
    } else if (anim.step === "toSlip") {
      // Tuột giữa đường: khi càng tới phía trên điểm rơi thì thú rơi lại vào máy.
      if (!carried) {
        Object.assign(anim, { step: "end", t: 0 });
      } else if (moveClaw(outcome.slipTo, dt)) {
        falling.push({ item: carried.item, x: claw.x, y: claw.y, t: 0 });
        carried = null;
        claw.open = 0.5;
        status.textContent = "Ối, thú tuột khỏi càng!";
        Object.assign(anim, { step: "end", t: 0 });
      }
    } else if (anim.step === "release") {
      claw.open = Math.min(1, anim.t / 0.3);
      if (anim.t >= 0.3 && carried) {
        falling.push({ item: carried.item, x: claw.x, y: claw.y, t: 0, chute: true });
        carried = null;
      }
      // Chỉ nhận quà khi thú đã rơi vào cửa.
      if (anim.t >= 0.9) return done();
    } else if (anim.step === "end") {
      if (anim.t >= 0.9) return done();
    }
    if (carried) {
      carried.x = claw.x;
      carried.y = claw.y;
    }
  }
  function step(dt) {
    if (phase === "aim") {
      let dx = 0, dy = 0;
      for (const key of pressed) {
        dx += arrows[key].dx;
        dy += arrows[key].dy;
      }
      if (dx || dy) {
        const length = Math.hypot(dx, dy);
        Object.assign(claw, clampClaw(claw.x + (dx / length) * SPEED * dt, claw.y + (dy / length) * SPEED * dt));
      }
      current.timeLeft -= dt;
      sway += dt;
      current.claw = { x: Math.round(claw.x), y: Math.round(claw.y) };
      info.set(0, `⏱️ ${Math.max(0, Math.ceil(current.timeLeft))} giây`);
      const [target] = clawTargets(items(), aimPoint());
      // Chỉ báo đang chạm con nào, không lộ tỉ lệ: người chơi phải tự căn cho chuẩn.
      info.set(1, target ? `🎯 Đang chạm ${plushOf(target.item.id).icon}` : "🎯 Chưa chạm thú");
      saveClock += dt;
      if (saveClock >= 1) {
        saveClock = 0;
        persist();
      }
      if (current.timeLeft <= 0) {
        status.textContent = "Hết giờ! Càng tự gắp tại chỗ.";
        grab();
      }
    } else if (phase === "drop" && anim) {
      stepAnim(dt);
    }
    for (const drop of falling) drop.t += dt;
    falling = falling.filter((drop) => drop.t < 0.6);
    draw();
  }

  // ---------- Vẽ ----------
  function drawPlush(plush, x, y, scale = 1, lifted = 0) {
    const size = plush.radius * 2.1 * scale;
    ctx.fillStyle = `rgb(60 30 70 / ${0.18 + 0.1 * (1 - lifted)})`;
    ctx.beginPath();
    ctx.ellipse(x + 2 + lifted * 6, y + plush.radius * 0.55 + lifted * LIFT, plush.radius * 0.9, plush.radius * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    if (plush.rarity === "rare") {
      ctx.save();
      ctx.shadowColor = "#ffd23f";
      ctx.shadowBlur = 14;
      drawEmoji(ctx, plush.icon, x, y, size);
      ctx.restore();
    } else {
      drawEmoji(ctx, plush.icon, x, y, size);
    }
  }
  function drawClaw() {
    const scale = 0.85 + 0.35 * claw.h;
    const { x, y: ground } = aimPoint();
    const y = ground - claw.h * LIFT;
    ctx.strokeStyle = "#5a5f6b";
    ctx.lineCap = "round";
    ctx.lineWidth = 4 * scale;
    for (const angle of [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6]) {
      const reach = (10 + 9 * claw.open) * scale;
      const tipX = x + Math.cos(angle) * reach;
      const tipY = y + Math.sin(angle) * reach;
      strokeLine(ctx, x, y, tipX, tipY);
      ctx.fillStyle = "#3d424d";
      ctx.beginPath();
      ctx.arc(tipX, tipY, 2.6 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.lineCap = "butt";
    ctx.fillStyle = "#9aa3b5";
    ctx.strokeStyle = "#5a5f6b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 8 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  function draw() {
    const floor = ctx.createLinearGradient(0, 0, 0, H);
    floor.addColorStop(0, "#ffe9f3");
    floor.addColorStop(1, "#ece2ff");
    ctx.fillStyle = floor;
    ctx.fillRect(0, 0, W, H);
    for (const pellet of pellets) {
      ctx.fillStyle = pellet.color;
      ctx.beginPath();
      ctx.arc(pellet.x, pellet.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = "#b9a3e8";
    ctx.lineWidth = 4;
    ctx.strokeRect(CLAW_BOX.left - 6, CLAW_BOX.top - 6, CLAW_BOX.right - CLAW_BOX.left + 12, CLAW_BOX.bottom - CLAW_BOX.top + 12);
    // Cửa nhận quà
    const chute = ctx.createRadialGradient(clawChuteCenter().x, clawChuteCenter().y, 6, clawChuteCenter().x, clawChuteCenter().y, CLAW_CHUTE.size * 0.7);
    chute.addColorStop(0, "#1b1530");
    chute.addColorStop(1, "#4b3a8a");
    ctx.fillStyle = chute;
    ctx.beginPath();
    ctx.roundRect(CLAW_CHUTE.x, CLAW_CHUTE.y, CLAW_CHUTE.size, CLAW_CHUTE.size, 12);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 10px "Sriracha", cursive';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🎁 CỬA", clawChuteCenter().x, CLAW_CHUTE.y + 12);
    ctx.fillText("NHẬN QUÀ", clawChuteCenter().x, CLAW_CHUTE.y + CLAW_CHUTE.size - 12);
    const hidden = new Set([carried?.item, ...falling.map((drop) => drop.item)]);
    for (const item of [...items()].sort((a, b) => a.y - b.y)) {
      if (hidden.has(item)) continue;
      drawPlush(plushOf(item.id), item.x + (wiggle?.uid === item.uid ? wiggle.dx : 0), item.y);
    }
    for (const drop of falling) {
      const plush = plushOf(drop.item.id);
      const k = Math.min(1, drop.t / 0.5);
      if (drop.chute) {
        // Thú rơi vào cửa: nhỏ dần và mờ đi.
        ctx.globalAlpha = 1 - k;
        drawPlush(plush, drop.x, drop.y + 6 * k, 1 - 0.6 * k);
        ctx.globalAlpha = 1;
      } else {
        drawPlush(plush, drop.x, drop.y - (1 - k) * LIFT, 1 + 0.2 * (1 - k), 1 - k);
      }
    }
    // Bóng tròn dưới càng = vùng gắp.
    ctx.fillStyle = "rgb(40 20 60 / 22%)";
    ctx.strokeStyle = phase === "aim" ? "rgb(255 255 255 / 90%)" : "rgb(255 255 255 / 50%)";
    ctx.lineWidth = 2;
    ctx.save();
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    const point = aimPoint();
    ctx.arc(point.x, point.y, CLAW_REACH, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    if (phase === "aim") {
      const [target] = clawTargets(items(), point);
      if (target) {
        ctx.strokeStyle = "#2e9e44";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(target.item.x, target.item.y, plushOf(target.item.id).radius + 3, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    if (carried) drawPlush(plushOf(carried.item.id), carried.x, carried.y - claw.h * LIFT + 6, 1 + 0.15 * claw.h, claw.h);
    drawClaw();
  }

  // Giữ nút / phím để di chuyển; nhả ra thì dừng.
  for (const [key, { node }] of Object.entries(arrows)) {
    node.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      if (phase !== "aim") return;
      pressed.add(key);
      node.setPointerCapture?.(event.pointerId);
    });
    for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) {
      node.addEventListener(type, () => {
        if (pressed.delete(key)) persist();
      });
    }
    // Bấm bằng bàn phím trên nút: nhích một đoạn.
    node.addEventListener("click", (event) => {
      if (event.detail !== 0 || phase !== "aim") return;
      Object.assign(claw, clampClaw(claw.x + arrows[key].dx * 10, claw.y + arrows[key].dy * 10));
    });
  }
  const keyMap = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
  const stopKeys = listenKeys((event) => {
    if (keyMap[event.key]) {
      if (phase === "aim") pressed.add(keyMap[event.key]);
      return true;
    }
    if ((event.key === " " || event.key === "Enter") && phase === "aim") {
      grab();
      return true;
    }
    return false;
  }, (event) => {
    if (keyMap[event.key] && pressed.delete(keyMap[event.key])) persist();
  });

  if (phase === "drop") startDrop();
  else if (phase === "aim") status.textContent = `Tiếp tục lượt đang chơi: còn ${Math.max(0, Math.ceil(current.timeLeft))} giây để căn.`;
  updateUi();
  draw();
  const stopLoop = runLoop(step);
  return () => {
    stopLoop();
    stopKeys();
    pressed.clear();
  };
}

// ---------- Bóng rổ ----------
function playBasketball({ stage, progress, finish }) {
  const W = 320, H = 300, HOOP_Y = 86, BALL_Y = 262, CENTER = W / 2;
  const FLIGHT = 0.55, COOLDOWN = 0.7, TOLERANCE = 18, DURATION = gameOf("basketball").duration;
  const { canvas, ctx } = makeCanvas(W, H, "Sân bóng rổ: rổ chạy qua lại, bóng ném thẳng lên từ giữa sân");
  const info = hud(`⏱️ ${DURATION} giây`, "🏀 0 điểm");
  const status = liveText("Bấm Ném khi rổ chạy tới giữa!");
  const shootButton = button("shop-buy game-primary gc-action", "🏀 Ném", shoot);
  stage.append(info.node, canvas, status, shootButton);
  canvas.addEventListener("pointerdown", shoot);

  let elapsed = 0;
  let swing = 0;
  let hoopX = CENTER;
  let score = 0;
  let cooldown = 0;
  let over = false;
  let endWait = 0;
  let finalShown = false;
  let shots = [];
  let pops = [];

  function shoot() {
    if (over || cooldown > 0) return;
    shots.push({ t: 0, state: "fly" });
    cooldown = COOLDOWN;
  }
  function step(dt) {
    if (!over) {
      elapsed += dt;
      cooldown -= dt;
      swing += dt * (1.3 + 1.8 * Math.min(1, elapsed / DURATION));
      hoopX = CENTER + 112 * Math.sin(swing);
    }
    const left = Math.max(0, DURATION - elapsed);
    for (const shot of shots) {
      shot.t += dt;
      if (shot.state === "fly" && shot.t >= FLIGHT) {
        shot.t = 0;
        if (over) {
          shot.state = "gone";
        } else if (Math.abs(hoopX - CENTER) <= TOLERANCE) {
          const points = basketPoints(left);
          score += points;
          progress(score);
          shot.state = "in";
          pops.push({ x: hoopX, t: 0, text: `+${points}` });
        } else {
          shot.state = "out";
          shot.dir = hoopX > CENTER ? -1 : 1;
        }
      }
      if ((shot.state === "in" && shot.t > 0.45) || (shot.state === "out" && shot.t > 0.6)) shot.state = "gone";
    }
    shots = shots.filter((shot) => shot.state !== "gone");
    for (const pop of pops) pop.t += dt;
    pops = pops.filter((pop) => pop.t < 0.7);
    info.set(0, `⏱️ ${Math.ceil(left)} giây`);
    info.set(1, `🏀 ${score} điểm`);
    const final = !over && left <= BASKET_FINAL_SECONDS;
    stage.classList.toggle("is-final", final);
    if (final && !finalShown) {
      finalShown = true;
      status.textContent = "🔥 5 giây cuối: mỗi quả +3 điểm!";
    }
    if (!over && elapsed >= DURATION) {
      over = true;
      shootButton.disabled = true;
      status.textContent = `Hết giờ! Bạn được ${score} điểm.`;
    }
    if (over) {
      endWait += dt;
      if (endWait > 0.9) {
        finish();
        return false;
      }
    }
    draw();
  }
  function draw() {
    const wall = ctx.createLinearGradient(0, 0, 0, H);
    wall.addColorStop(0, "#ffe9c7");
    wall.addColorStop(0.7, "#ffd9a0");
    wall.addColorStop(0.7, "#d99a5b");
    wall.addColorStop(1, "#b9773d");
    ctx.fillStyle = wall;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgb(255 255 255 / 35%)";
    ctx.lineWidth = 2;
    for (let x = 20; x < W; x += 40) strokeLine(ctx, x, H * 0.7, x - 10, H);
    ctx.save();
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = "rgb(23 57 75 / 25%)";
    strokeLine(ctx, CENTER, HOOP_Y + 6, CENTER, BALL_Y - 18);
    ctx.restore();
    // Bảng rổ và lưới đi theo rổ.
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#5a6b78";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(hoopX - 43, HOOP_Y - 60, 86, 56, 6);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#e0453a";
    ctx.strokeRect(hoopX - 16, HOOP_Y - 34, 32, 24);
    ctx.strokeStyle = "rgb(255 255 255 / 90%)";
    ctx.lineWidth = 1.5;
    for (let i = -2; i <= 2; i += 1) strokeLine(ctx, hoopX + i * 10, HOOP_Y + 2, hoopX + i * 6, HOOP_Y + 30);
    strokeLine(ctx, hoopX - 16, HOOP_Y + 16, hoopX + 16, HOOP_Y + 16);
    for (const shot of shots) {
      let x = CENTER, y, size = 30, alpha = 1;
      if (shot.state === "fly") {
        const p = shot.t / FLIGHT;
        y = BALL_Y + (HOOP_Y - 8 - BALL_Y) * (1 - (1 - p) * (1 - p));
        size = 30 - 8 * p;
      } else if (shot.state === "in") {
        x = hoopX;
        y = HOOP_Y - 8 + 60 * (shot.t / 0.45);
        size = 22;
        alpha = 1 - shot.t / 0.45;
      } else {
        const p = shot.t / 0.6;
        x = CENTER + shot.dir * 90 * p;
        y = HOOP_Y - 8 - 30 * Math.sin(Math.PI * p) + 80 * p * p;
        size = 22;
        alpha = 1 - p;
      }
      ctx.globalAlpha = Math.max(0, alpha);
      drawEmoji(ctx, "🏀", x, y, size);
      ctx.globalAlpha = 1;
    }
    ctx.strokeStyle = "#f2701d";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(hoopX, HOOP_Y, 24, 5, 0, 0, Math.PI * 2);
    ctx.stroke();
    if (!over) {
      ctx.globalAlpha = cooldown > 0 ? 0.35 : 1;
      drawEmoji(ctx, "🏀", CENTER, BALL_Y, 30);
      ctx.globalAlpha = 1;
    }
    ctx.font = `bold 20px "Sriracha", cursive`;
    ctx.textAlign = "center";
    for (const pop of pops) {
      ctx.fillStyle = `rgb(40 140 60 / ${1 - pop.t / 0.7})`;
      ctx.fillText(pop.text, pop.x, HOOP_Y - 70 - 30 * pop.t);
    }
  }

  draw();
  const stopLoop = runLoop(step);
  const stopKeys = listenKeys((event) => {
    if (event.key !== " " && event.key !== "Enter") return false;
    shoot();
    return true;
  });
  return () => {
    stopLoop();
    stopKeys();
  };
}

// ---------- Đập chuột ----------
function playWhack({ stage, progress, finish }) {
  const DURATION = gameOf("whack").duration;
  const info = hud(`⏱️ ${DURATION} giây`, "🔨 0 điểm");
  const status = liveText("Đập chuột, né bom và mèo!");
  const grid = element("div", "gc-holes");
  stage.append(info.node, grid, status);

  let elapsed = 0;
  let score = 0;
  let spawnIn = 300;
  let over = false;
  let endWait = 0;
  const holes = Array.from({ length: 9 }, (_, index) => {
    const node = button("gc-hole", "", () => {});
    const mole = element("span", "gc-mole");
    mole.setAttribute("aria-hidden", "true");
    node.append(element("span", "gc-hole-key", String(index + 1)), mole);
    node.setAttribute("aria-label", `Hang ${index + 1}: trống`);
    const hole = { node, mole, target: null, until: 0 };
    node.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      hit(hole);
    });
    node.addEventListener("click", (event) => { if (event.detail === 0) hit(hole); });
    grid.append(node);
    return hole;
  });

  function show(hole, target, now) {
    const ratio = Math.min(1, elapsed / DURATION);
    hole.target = target;
    hole.until = now + target.stay * (1 - 0.3 * ratio);
    hole.mole.textContent = target.icon;
    hole.node.classList.toggle("is-gold", Boolean(target.gold));
    hole.node.classList.add("is-up");
    hole.node.setAttribute("aria-label", `Hang ${holes.indexOf(hole) + 1}: ${target.label}`);
  }
  function hide(hole) {
    hole.target = null;
    hole.node.classList.remove("is-up", "is-gold");
    hole.node.setAttribute("aria-label", `Hang ${holes.indexOf(hole) + 1}: trống`);
  }
  function hit(hole) {
    if (over || !hole.target) return;
    const { points } = hole.target;
    score = Math.max(0, score + points);
    progress(score);
    const pop = element("span", `gc-pop ${points > 0 ? "is-plus" : "is-minus"}`, points > 0 ? `+${points}` : `−${-points}`);
    pop.setAttribute("aria-hidden", "true");
    hole.node.append(pop);
    pop.addEventListener("animationend", () => pop.remove());
    hole.node.classList.remove("is-hit", "is-wrong");
    void hole.node.offsetWidth;
    hole.node.classList.add(points > 0 ? "is-hit" : "is-wrong");
    if (points < 0) status.textContent = `Ối, đập nhầm ${hole.target.label.toLowerCase()}! −${-points} điểm`;
    hide(hole);
    info.set(1, `🔨 ${score} điểm`);
  }
  function step(dt) {
    if (!over) {
      elapsed += dt;
      const now = elapsed * 1000;
      const ratio = Math.min(1, elapsed / DURATION);
      for (const hole of holes) if (hole.target && now >= hole.until) hide(hole);
      spawnIn -= dt * 1000;
      if (spawnIn <= 0) {
        spawnIn = 700 - 380 * ratio + Math.random() * 120;
        const empty = holes.filter((hole) => !hole.target);
        if (holes.length - empty.length < (ratio < 0.4 ? 2 : 3)) {
          show(empty[Math.floor(Math.random() * empty.length)], pickWeighted(whackTargets), now);
        }
      }
      info.set(0, `⏱️ ${Math.ceil(Math.max(0, DURATION - elapsed))} giây`);
      if (elapsed >= DURATION) {
        over = true;
        holes.forEach((hole) => {
          hide(hole);
          hole.node.disabled = true;
        });
        status.textContent = `Hết giờ! Bạn được ${score} điểm.`;
      }
    } else {
      endWait += dt;
      if (endWait > 0.9) {
        finish();
        return false;
      }
    }
  }

  const stopLoop = runLoop(step);
  const stopKeys = listenKeys((event) => {
    const index = Number(event.key) - 1;
    if (!(index >= 0 && index < 9)) return false;
    hit(holes[index]);
    return true;
  });
  return () => {
    stopLoop();
    stopKeys();
  };
}
