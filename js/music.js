// Nhạc nền tự soạn, phát bằng Web Audio API: không cần file nhạc, không vướng bản quyền.
// Giai điệu hộp nhạc nhẹ nhàng trên vòng hợp âm C – G – Am – F, có hợp âm nền và bass ấm.
// Trình duyệt chỉ cho phát âm thanh sau lần chạm/bấm đầu tiên nên nhạc bắt đầu từ lúc đó.

const STORAGE_KEY = "lifeAgainMusic";
const TEMPO = 76; // nhịp mỗi phút
const EIGHTH = 60 / TEMPO / 2; // độ dài một móc đơn (giây)
const VOLUME = 0.22;
const LOOKAHEAD = 0.35; // lên lịch trước bao nhiêu giây
const TICK_MS = 90;

// 8 ô nhịp; mỗi ô: hợp âm nền, nốt bass, 8 nốt móc đơn của giai điệu (null = nghỉ).
const BARS = [
  { pad: [60, 64, 67], bass: 36, melody: [76, null, 79, null, 84, null, 79, null] },
  { pad: [59, 62, 67], bass: 43, melody: [74, null, 79, null, 83, null, 81, 79] },
  { pad: [57, 60, 64], bass: 45, melody: [72, null, 76, null, 81, null, 79, 76] },
  { pad: [57, 60, 65], bass: 41, melody: [77, null, 81, null, 84, null, null, null] },
  { pad: [60, 64, 67], bass: 36, melody: [79, null, 76, 79, 84, null, 86, null] },
  { pad: [59, 62, 67], bass: 43, melody: [83, null, 79, null, 74, null, 79, null] },
  { pad: [57, 60, 65], bass: 41, melody: [81, null, 84, null, 77, null, 81, 79] },
  { pad: [55, 62, 65], bass: 43, melody: [74, null, null, null, 71, null, null, null] },
];

const frequency = (midi) => 440 * 2 ** ((midi - 69) / 12);

let enabled = readPreference();
let context = null;
let master = null;
let reverb = null;
let timer = null;
let nextTime = 0;
let step = 0; // vị trí móc đơn trong cả vòng nhạc
let loop = 0;
const listeners = new Set();

function readPreference() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

function savePreference() {
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    // Không lưu được thì chỉ áp dụng cho lần chơi này.
  }
}

// Tiếng vang nhẹ tạo từ nhiễu tắt dần, cho cảm giác không gian ấm.
function createReverb(ctx) {
  const seconds = 2.6;
  const length = Math.floor(ctx.sampleRate * seconds);
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel += 1) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2.4;
  }
  const node = ctx.createConvolver();
  node.buffer = impulse;
  return node;
}

function setupAudio() {
  if (context) return true;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return false;
  context = new AudioContextClass();
  master = context.createGain();
  master.gain.value = 0;
  const tone = context.createBiquadFilter();
  tone.type = "lowpass";
  tone.frequency.value = 5200;
  master.connect(tone).connect(context.destination);
  reverb = createReverb(context);
  const wet = context.createGain();
  wet.gain.value = 0.32;
  reverb.connect(wet).connect(master);
  return true;
}

// Gửi một nguồn âm vào cả đường khô và đường vang.
function route(node, dry = 1, wet = 1) {
  const dryGain = context.createGain();
  dryGain.gain.value = dry;
  node.connect(dryGain).connect(master);
  const wetGain = context.createGain();
  wetGain.gain.value = wet;
  node.connect(wetGain).connect(reverb);
}

// Hộp nhạc: sóng sin trong trẻo kèm một chút bồi âm, tắt dần tự nhiên.
function playBell(midi, time, level = 0.16) {
  const envelope = context.createGain();
  envelope.gain.setValueAtTime(0.0001, time);
  envelope.gain.exponentialRampToValueAtTime(level, time + 0.012);
  envelope.gain.exponentialRampToValueAtTime(0.0001, time + 1.6);
  for (const [ratio, amount] of [[1, 1], [2, 0.22], [3.01, 0.06]]) {
    const osc = context.createOscillator();
    osc.type = "sine";
    osc.frequency.value = frequency(midi) * ratio;
    const gain = context.createGain();
    gain.gain.value = amount;
    osc.connect(gain).connect(envelope);
    osc.start(time);
    osc.stop(time + 1.7);
  }
  route(envelope, 0.85, 0.6);
}

// Hợp âm nền: hai sóng tam giác lệch nhẹ, lọc mềm, vào ra chậm.
function playPad(notes, time, duration) {
  const envelope = context.createGain();
  envelope.gain.setValueAtTime(0.0001, time);
  envelope.gain.linearRampToValueAtTime(0.045, time + 0.8);
  envelope.gain.setValueAtTime(0.045, time + duration - 0.3);
  envelope.gain.linearRampToValueAtTime(0.0001, time + duration + 1);
  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 900;
  filter.connect(envelope);
  for (const midi of notes) {
    for (const detune of [-6, 6]) {
      const osc = context.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = frequency(midi);
      osc.detune.value = detune;
      osc.connect(filter);
      osc.start(time);
      osc.stop(time + duration + 1.1);
    }
  }
  route(envelope, 0.7, 0.8);
}

function playBass(midi, time, duration) {
  const envelope = context.createGain();
  envelope.gain.setValueAtTime(0.0001, time);
  envelope.gain.exponentialRampToValueAtTime(0.11, time + 0.04);
  envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
  const osc = context.createOscillator();
  osc.type = "sine";
  osc.frequency.value = frequency(midi);
  osc.connect(envelope);
  osc.start(time);
  osc.stop(time + duration + 0.05);
  route(envelope, 1, 0.2);
}

function scheduleStep(time) {
  const barIndex = Math.floor(step / 8) % BARS.length;
  const beat = step % 8;
  const bar = BARS[barIndex];
  if (beat === 0) playPad(bar.pad, time, EIGHTH * 8);
  if (beat === 0 || beat === 4) playBass(bar.bass, time, EIGHTH * 3.6);
  const note = bar.melody[beat];
  // Vòng chẵn: giai điệu thưa hơn và thấp một quãng tám để nghe không nhàm.
  const sparse = loop % 2 === 1;
  if (note !== null && (!sparse || beat % 4 === 0)) playBell(sparse ? note - 12 : note, time, sparse ? 0.13 : 0.16);
  step += 1;
  if (step % (BARS.length * 8) === 0) loop += 1;
}

function scheduler() {
  while (nextTime < context.currentTime + LOOKAHEAD) {
    scheduleStep(nextTime);
    nextTime += EIGHTH;
  }
}

function start() {
  if (!enabled || document.hidden || !setupAudio()) return;
  context.resume?.();
  if (!timer) {
    nextTime = context.currentTime + 0.1;
    timer = setInterval(scheduler, TICK_MS);
  }
  master.gain.cancelScheduledValues(context.currentTime);
  master.gain.setTargetAtTime(VOLUME, context.currentTime, 0.6);
}

function stop() {
  if (!context) return;
  clearInterval(timer);
  timer = null;
  master.gain.cancelScheduledValues(context.currentTime);
  master.gain.setTargetAtTime(0, context.currentTime, 0.15);
  setTimeout(() => {
    if (!timer) context.suspend?.();
  }, 600);
}

function notify() {
  for (const listener of listeners) listener(enabled);
  document.querySelectorAll("[data-music-toggle]").forEach(render);
}

function render(button) {
  button.setAttribute("aria-pressed", String(enabled));
  button.setAttribute("aria-label", enabled ? "Tắt nhạc nền" : "Bật nhạc nền");
  button.title = enabled ? "Tắt nhạc nền" : "Bật nhạc nền";
  const icon = button.querySelector("[data-music-icon]");
  const label = button.querySelector("[data-music-label]");
  if (icon) icon.textContent = enabled ? "🔊" : "🔇";
  if (label) label.textContent = enabled ? "Nhạc nền: Bật" : "Nhạc nền: Tắt";
}

export const isMusicEnabled = () => enabled;

export function setMusicEnabled(value) {
  enabled = Boolean(value);
  savePreference();
  if (enabled) start();
  else stop();
  notify();
}

export function onMusicChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

let initialized = false;
export function initMusic() {
  if (initialized) return;
  initialized = true;
  // Nút bật/tắt: mọi phần tử có data-music-toggle (bến xe, cài đặt trong game).
  document.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-music-toggle]");
    if (button) setMusicEnabled(!enabled);
  });
  document.querySelectorAll("[data-music-toggle]").forEach(render);
  // Lần chạm/bấm đầu tiên mở khóa âm thanh của trình duyệt.
  const unlock = () => {
    if (enabled) start();
    if (context && context.state === "running") {
      window.removeEventListener("pointerdown", unlock, true);
      window.removeEventListener("keydown", unlock, true);
    }
  };
  window.addEventListener("pointerdown", unlock, true);
  window.addEventListener("keydown", unlock, true);
  // Tạm dừng khi chuyển tab hoặc khóa màn hình để đỡ tốn pin.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else if (enabled && context) start();
  });
}
