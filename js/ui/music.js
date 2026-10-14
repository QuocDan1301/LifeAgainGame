// Nhạc nền và hiệu ứng âm thanh tự soạn, phát bằng Web Audio API: không cần file, không vướng bản quyền.
// Nhạc nền: mỗi bối cảnh một bản (bến xe/cuộc đời, Trò chơi, từng trò, Game Center…), dữ liệu ở music-themes.js;
// vào màn nào thì tự chuyển sang bản hợp với màn đó, ra lại thì về bản chính.
// Hiệu ứng: mỗi loại sự kiện có một âm thanh riêng khi popup bật lên; mỗi lần bấm, chọn, mở/đóng popup có tiếng tương tác.
// Trình duyệt chỉ cho phát âm thanh sau lần chạm/bấm đầu tiên nên âm thanh bắt đầu từ lúc đó.

import { MUSIC_THEMES, THEME_RULES } from "./music-themes.js";

const STORAGE_KEY = "lifeAgainMusic";
const SFX_STORAGE_KEY = "lifeAgainSfx";
const VOLUME = 0.22;
const PAD_LEVEL = 0.06; // âm lượng hợp âm nền
const SFX_VOLUME = 0.5; // âm lượng hiệu ứng sự kiện
const LOOKAHEAD = 0.35; // lên lịch trước bao nhiêu giây
const TICK_MS = 90;


const frequency = (midi) => 440 * 2 ** ((midi - 69) / 12);

let enabled = readPreference(STORAGE_KEY);
let sfxEnabled = readPreference(SFX_STORAGE_KEY);
let context = null;
let master = null; // đường nhạc nền
let reverb = null;
let sfxBus = null; // đường hiệu ứng, bật/tắt riêng với nhạc nền
let sfxReverb = null;
let timer = null;
let themeName = "home";
// Mỗi bản đang phát là một giọng có đường âm lượng riêng; lúc đổi bản, giọng cũ nhỏ dần trong khi giọng mới to dần.
let voices = [];
let activeVoice = null;
// Đường âm thanh của giọng đang được lên lịch (route() đưa nốt nhạc nền vào đây thay vì thẳng vào master).
let musicBus = null;
let musicSend = null;
const listeners = new Set();

function readPreference(key) {
  try {
    return localStorage.getItem(key) !== "off";
  } catch {
    return true;
  }
}

function savePreference(key, value) {
  try {
    localStorage.setItem(key, value ? "on" : "off");
  } catch {
    // Không lưu được thì chỉ áp dụng cho lần chơi này.
  }
}

// Tiếng vang nhẹ tạo từ nhiễu tắt dần, cho cảm giác không gian ấm.
function createImpulse(ctx) {
  const seconds = 2.6;
  const length = Math.floor(ctx.sampleRate * seconds);
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel += 1) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2.4;
  }
  return impulse;
}

function createReverb(impulse, bus, amount) {
  const node = context.createConvolver();
  node.buffer = impulse;
  const wet = context.createGain();
  wet.gain.value = amount;
  node.connect(wet).connect(bus);
  return node;
}

function setupAudio() {
  if (context) return true;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return false;
  context = new AudioContextClass();
  const tone = context.createBiquadFilter();
  tone.type = "lowpass";
  tone.frequency.value = 5200;
  tone.connect(context.destination);
  master = context.createGain();
  master.gain.value = 0;
  master.connect(tone);
  sfxBus = context.createGain();
  sfxBus.gain.value = SFX_VOLUME;
  sfxBus.connect(tone);
  const impulse = createImpulse(context);
  reverb = createReverb(impulse, master, 0.32);
  sfxReverb = createReverb(impulse, sfxBus, 0.35);
  return true;
}

// Gửi một nguồn âm vào cả đường khô và đường vang (của nhạc nền hoặc của hiệu ứng).
function route(node, dry = 1, wet = 1, sfx = false) {
  const dryGain = context.createGain();
  dryGain.gain.value = dry;
  node.connect(dryGain).connect(sfx ? sfxBus : (musicBus ?? master));
  const wetGain = context.createGain();
  wetGain.gain.value = wet;
  node.connect(wetGain).connect(sfx ? sfxReverb : (musicSend ?? reverb));
}

// ---------- Nhạc nền ----------

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
function playPad(notes, time, duration, level = PAD_LEVEL) {
  const envelope = context.createGain();
  envelope.gain.setValueAtTime(0.0001, time);
  envelope.gain.linearRampToValueAtTime(level, time + 0.8);
  envelope.gain.setValueAtTime(level, time + duration - 0.3);
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

// Một nốt tổng hợp của nhạc nền (đi đường nhạc nền, khác sfxNote đi đường hiệu ứng).
function musicNote(midi, time, {
  type = "sine", level = 0.12, attack = 0.01, decay = 0.6, harmonics = [[1, 1]], cutoff = 0,
  bend = 0, tremolo = 0, hold = 0, dry = 0.85, wet = 0.5,
} = {}) {
  const envelope = context.createGain();
  envelope.gain.setValueAtTime(0.0001, time);
  envelope.gain.exponentialRampToValueAtTime(level, time + attack);
  if (hold) envelope.gain.setValueAtTime(level, time + attack + hold);
  envelope.gain.exponentialRampToValueAtTime(0.0001, time + attack + hold + decay);
  let input = envelope;
  if (cutoff) {
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoff, time);
    filter.frequency.exponentialRampToValueAtTime(Math.max(300, cutoff * 0.35), time + attack + hold + decay);
    filter.connect(envelope);
    input = filter;
  }
  const end = time + attack + hold + decay + 0.05;
  let lfo = null;
  if (tremolo) {
    // Rung âm lượng (vibraphone): điều biến một tầng khuếch đại riêng.
    const shaker = context.createGain();
    shaker.gain.value = 1;
    lfo = context.createOscillator();
    lfo.frequency.value = 5.2;
    const depth = context.createGain();
    depth.gain.value = tremolo;
    lfo.connect(depth).connect(shaker.gain);
    shaker.connect(input);
    input = shaker;
    lfo.start(time);
    lfo.stop(end);
  }
  for (const [ratio, amount] of harmonics) {
    const osc = context.createOscillator();
    osc.type = type;
    osc.frequency.value = frequency(midi) * ratio;
    // Luyến (đàn tranh): nốt vào thấp hơn một chút rồi trượt lên đúng cao độ.
    if (bend) {
      osc.detune.setValueAtTime(-bend, time);
      osc.detune.exponentialRampToValueAtTime(-1, time + 0.12);
    }
    const gain = context.createGain();
    gain.gain.value = amount;
    osc.connect(gain).connect(input);
    osc.start(time);
    osc.stop(end);
  }
  route(envelope, dry, wet);
}

// Nhạc cụ giai điệu (giá trị đã cân âm lượng để các bản nghe to tương đương nhau).
const LEADS = {
  bell: (midi, time, level = 0.16) => playBell(midi, time, level),
  epiano: (midi, time) => musicNote(midi, time, { harmonics: [[1, 1], [2, 0.18], [3, 0.05]], level: 0.13, decay: 1.1, wet: 0.45 }),
  vibes: (midi, time) => musicNote(midi, time, { harmonics: [[1, 1], [4, 0.12]], level: 0.12, decay: 0.9, tremolo: 0.35, wet: 0.5 }),
  harp: (midi, time) => musicNote(midi, time, { type: "triangle", harmonics: [[1, 1], [2, 0.2]], level: 0.13, decay: 1.2, wet: 0.6 }),
  harpsichord: (midi, time) => musicNote(midi, time, { type: "sawtooth", level: 0.05, decay: 0.45, cutoff: 3600, wet: 0.35 }),
  zither: (midi, time) => musicNote(midi, time, { type: "triangle", harmonics: [[1, 1], [2, 0.3], [3, 0.08]], level: 0.13, decay: 1.3, bend: 60, wet: 0.55 }),
  chip: (midi, time) => musicNote(midi, time, { type: "square", level: 0.035, decay: 0.16, hold: 0.04, dry: 1, wet: 0.12 }),
  chipThin: (midi, time) => musicNote(midi, time, { type: "square", level: 0.03, decay: 0.09, dry: 1, wet: 0.08 }),
  banjo: (midi, time) => musicNote(midi, time, { type: "sawtooth", harmonics: [[1, 1], [2, 0.3]], level: 0.04, decay: 0.32, cutoff: 3000, wet: 0.2 }),
  marimba: (midi, time) => musicNote(midi, time, { harmonics: [[1, 1], [4, 0.25], [9.2, 0.05]], level: 0.15, decay: 0.38, wet: 0.35 }),
  brass: (midi, time) => musicNote(midi, time, { type: "sawtooth", level: 0.05, attack: 0.02, hold: 0.06, decay: 0.22, cutoff: 2600, wet: 0.25 }),
};

// Âm nền theo kiểu của từng bản.
function playThemePad(theme, chord, time, eighth) {
  const level = theme.padLevel ?? PAD_LEVEL;
  if (theme.pad === "warm") playPad(chord, time, eighth * 8, level);
  else if (theme.pad === "organ") chord.forEach((midi) => musicNote(midi, time, { harmonics: [[1, 1], [2, 0.4], [4, 0.1]], level: level * 0.6, attack: 0.25, hold: eighth * 6, decay: 0.8, wet: 0.7 }));
  else if (theme.pad === "drone") chord.forEach((midi) => musicNote(midi, time, { type: "triangle", level, attack: 0.6, hold: eighth * 6, decay: 1.2, wet: 0.8 }));
}
// Bass theo kiểu của từng bản; bass là một nốt hoặc 8 ô.
function playThemeBass(theme, bar, beat, time, eighth) {
  const note = Array.isArray(bar.bass) ? bar.bass[beat] : (beat === 0 || beat === 4 ? bar.bass : null);
  switch (theme.bassVoice) {
    case "walk":
      if (note != null) musicNote(note, time, { type: "triangle", level: 0.16, decay: eighth * 1.8, wet: 0.15 });
      break;
    case "pluck":
      if (note != null) musicNote(note, time, { type: "triangle", level: 0.15, decay: eighth * 1.4, wet: 0.15 });
      break;
    case "pedal":
      // Bass harpsichord: nốt gốc rồi quãng tám xen kẽ mỗi phách.
      if (beat % 2 === 0) musicNote(bar.bass + (beat % 4 === 2 ? 12 : 0), time, { type: "sawtooth", level: 0.035, decay: eighth * 1.6, cutoff: 1400, wet: 0.25 });
      break;
    case "boomchick":
      // Bùm (nốt gốc) – chách (hợp âm ngắn) – bùm (quãng năm) – chách.
      if (beat === 0 || beat === 4) musicNote(bar.bass + (beat === 4 ? 7 : 0), time, { type: "triangle", level: 0.17, decay: eighth * 1.5, wet: 0.1 });
      if (theme.pad === "strum" && (beat === 2 || beat === 6)) bar.chord.forEach((midi, i) => musicNote(midi + 12, time + i * 0.012, { type: "sawtooth", level: (theme.padLevel ?? 0.05) * 0.5, decay: 0.16, cutoff: 2200, wet: 0.2 }));
      break;
    case "octaves":
      // Bass 8-bit: nốt gốc và quãng tám nảy liên tục mỗi móc đơn.
      musicNote(bar.bass + (beat % 2 ? 12 : 0), time, { type: "square", level: 0.03, decay: eighth * 0.8, dry: 1, wet: 0.05 });
      break;
    case "slap":
      if (note != null) musicNote(note, time, { type: "sawtooth", level: 0.07, decay: eighth * 0.9, cutoff: 1100, wet: 0.08 });
      break;
    default:
      if (note != null) playBass(note, time, eighth * 3.6);
  }
}

// Trống tổng hợp: trống cái (sin trượt), trống con và chũm chọe (nhiễu lọc), mõ gỗ.
let noiseBuffer = null;
function noise(time, { level, decay, type, frequency: cutoff }) {
  if (!noiseBuffer) {
    noiseBuffer = context.createBuffer(1, Math.floor(context.sampleRate * 0.5), context.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  }
  const source = context.createBufferSource();
  source.buffer = noiseBuffer;
  const filter = context.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = cutoff;
  const envelope = context.createGain();
  envelope.gain.setValueAtTime(level, time);
  envelope.gain.exponentialRampToValueAtTime(0.0001, time + decay);
  source.connect(filter).connect(envelope);
  source.start(time);
  source.stop(time + decay + 0.02);
  route(envelope, 1, 0.12);
}
const DRUMS = {
  k(time) {
    const envelope = context.createGain();
    envelope.gain.setValueAtTime(0.3, time);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + 0.22);
    const osc = context.createOscillator();
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(42, time + 0.18);
    osc.connect(envelope);
    osc.start(time);
    osc.stop(time + 0.24);
    route(envelope, 1, 0.05);
  },
  s: (time) => noise(time, { level: 0.09, decay: 0.13, type: "bandpass", frequency: 1800 }),
  h: (time) => noise(time, { level: 0.035, decay: 0.04, type: "highpass", frequency: 7000 }),
  w: (time) => musicNote(79, time, { harmonics: [[1, 1], [2.7, 0.4]], level: 0.07, decay: 0.07, dry: 1, wet: 0.2 }),
};

const eighthOf = (current) => 60 / current.tempo / 2;
const CROSSFADE_OUT = 0.35; // hằng số thời gian nhỏ dần của bản cũ (≈ 1,2 giây tới lặng)
const CROSSFADE_IN = 0.45; // hằng số thời gian to dần của bản mới
const SWITCH_SETTLE_MS = 300; // chuyển màn liên tiếp: đợi màn ổn định rồi mới đổi nhạc

function createVoice(name, at, level) {
  const bus = context.createGain();
  const send = context.createGain();
  bus.gain.setValueAtTime(level, context.currentTime);
  send.gain.setValueAtTime(level, context.currentTime);
  bus.connect(master);
  send.connect(reverb);
  return { name, theme: MUSIC_THEMES[name] ?? MUSIC_THEMES.home, bus, send, step: 0, loop: 0, nextTime: at, endAt: Infinity };
}

function scheduleStep(voice, time) {
  const current = voice.theme;
  const eighth = eighthOf(current);
  const barIndex = Math.floor(voice.step / 8) % current.bars.length;
  const beat = voice.step % 8;
  const bar = current.bars[barIndex];
  // Swing: móc đơn lẻ đến trễ một chút cho cảm giác nhún nhảy.
  const at = time + (beat % 2 ? (current.swing ?? 0) * eighth : 0);
  if (beat === 0) playThemePad(current, bar.chord, time, eighth);
  playThemeBass(current, bar, beat, at, eighth);
  const hit = current.drums?.[beat];
  if (hit && DRUMS[hit]) DRUMS[hit](at);
  const note = bar.melody[beat];
  // Bản chính: vòng chẵn giai điệu thưa hơn và thấp một quãng tám để nghe không nhàm.
  const sparse = current.alternate && voice.loop % 2 === 1;
  if (note !== null && (!sparse || beat % 4 === 0)) {
    if (current.lead === "bell") playBell(sparse ? note - 12 : note, at, sparse ? 0.13 : 0.16);
    else LEADS[current.lead]?.(note, at);
  }
  voice.step += 1;
  if (voice.step % (current.bars.length * 8) === 0) voice.loop += 1;
}

function scheduler() {
  const now = context.currentTime;
  if (!activeVoice) {
    activeVoice = createVoice(themeName, now + 0.1, 1);
    voices.push(activeVoice);
  }
  for (const voice of voices) {
    musicBus = voice.bus;
    musicSend = voice.send;
    // Giọng đang nhỏ dần vẫn chơi tiếp cho tới khi gần lặng hẳn, để không bị cắt giữa câu nhạc.
    while (voice.nextTime < now + LOOKAHEAD && voice.nextTime < voice.endAt) {
      scheduleStep(voice, voice.nextTime);
      voice.nextTime += eighthOf(voice.theme);
    }
  }
  musicBus = null;
  musicSend = null;
  // Gỡ giọng cũ sau khi tiếng vang đã tắt.
  voices = voices.filter((voice) => {
    if (voice === activeVoice || now < voice.endAt + 3) return true;
    voice.bus.disconnect();
    voice.send.disconnect();
    return false;
  });
}

// Đổi bản: bản cũ nhỏ dần trong khi bản mới vào từ ô nhịp đầu và to dần (hòa trộn chéo, không khoảng lặng).
function crossfadeTo(name) {
  themeName = name;
  if (!context || !timer || !activeVoice) {
    // Nhạc đang tắt: lần bật sau sẽ bắt đầu thẳng bằng bản mới.
    for (const voice of voices) { voice.bus.disconnect(); voice.send.disconnect(); }
    voices = [];
    activeVoice = null;
    return;
  }
  const now = context.currentTime;
  const old = activeVoice;
  for (const node of [old.bus.gain, old.send.gain]) {
    node.cancelScheduledValues(now);
    node.setValueAtTime(node.value, now);
    node.setTargetAtTime(0.0001, now, CROSSFADE_OUT);
  }
  old.endAt = now + CROSSFADE_OUT * 4;
  activeVoice = createVoice(name, now + 0.12, 0.0001);
  for (const node of [activeVoice.bus.gain, activeVoice.send.gain]) node.setTargetAtTime(1, now + 0.12, CROSSFADE_IN);
  voices.push(activeVoice);
}

let pendingTheme = null;
let settleTimer = 0;
export function setMusicTheme(name, { immediate = false } = {}) {
  const next = MUSIC_THEMES[name] ? name : "home";
  pendingTheme = next;
  clearTimeout(settleTimer);
  const apply = () => {
    if (pendingTheme !== themeName || (activeVoice && activeVoice.name !== pendingTheme)) crossfadeTo(pendingTheme);
  };
  if (immediate) apply();
  else settleTimer = setTimeout(apply, SWITCH_SETTLE_MS);
}
export const getMusicTheme = () => themeName;

// Bối cảnh hiện tại theo THEME_RULES (màn đang mở trong Trò chơi / Game Center).
function detectTheme() {
  return THEME_RULES.find(([selector]) => document.querySelector(selector))?.[1] ?? "home";
}
let themeCheck = 0;
function initThemeTracking() {
  const scheduleCheck = () => {
    cancelAnimationFrame(themeCheck);
    themeCheck = requestAnimationFrame(() => setMusicTheme(detectTheme()));
  };
  // Chỉ theo dõi hai cửa sổ có nhạc riêng: mở/đóng và đổi màn bên trong.
  for (const id of ["games-dialog", "game-center-dialog"]) {
    const dialog = document.getElementById(id);
    if (dialog) new MutationObserver(scheduleCheck).observe(dialog, { attributes: true, attributeFilter: ["open"], childList: true, subtree: true });
  }
  setMusicTheme(detectTheme(), { immediate: true });
}

function start() {
  if (!enabled || document.hidden || !setupAudio()) return;
  context.resume?.();
  if (!timer) {
    for (const voice of voices) { voice.bus.disconnect(); voice.send.disconnect(); }
    voices = [];
    activeVoice = null;
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
  // Còn hiệu ứng âm thanh thì giữ âm thanh chạy, chỉ tạm dừng hẳn khi cả hai đều tắt hoặc ẩn trang.
  setTimeout(() => {
    if (!timer && (!sfxEnabled || document.hidden)) context.suspend?.();
  }, 600);
}

// ---------- Hiệu ứng âm thanh khi popup sự kiện bật lên ----------

// Một nốt tổng hợp dùng chung cho các hiệu ứng.
function sfxNote(midi, time, {
  type = "sine", level = 0.2, attack = 0.01, decay = 0.8, harmonics = [[1, 1]],
  vibrato = 0, cutoff = 0, dry = 0.9, wet = 0.5, hold = 0,
} = {}) {
  const envelope = context.createGain();
  envelope.gain.setValueAtTime(0.0001, time);
  envelope.gain.exponentialRampToValueAtTime(level, time + attack);
  if (hold) envelope.gain.setValueAtTime(level, time + attack + hold);
  envelope.gain.exponentialRampToValueAtTime(0.0001, time + attack + hold + decay);
  let input = envelope;
  if (cutoff) {
    // Lọc mở dần như hơi thổi vào kèn.
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoff * 0.35, time);
    filter.frequency.exponentialRampToValueAtTime(cutoff, time + attack + 0.06);
    filter.connect(envelope);
    input = filter;
  }
  const end = time + attack + hold + decay + 0.05;
  let lfo = null;
  if (vibrato) {
    lfo = context.createOscillator();
    lfo.frequency.value = 5.5;
    const depth = context.createGain();
    depth.gain.value = vibrato;
    lfo.connect(depth);
    lfo.start(time);
    lfo.stop(end);
    lfo.depthNode = depth;
  }
  for (const [ratio, amount] of harmonics) {
    const osc = context.createOscillator();
    osc.type = type;
    osc.frequency.value = frequency(midi) * ratio;
    if (lfo) lfo.depthNode.connect(osc.detune);
    const gain = context.createGain();
    gain.gain.value = amount;
    osc.connect(gain).connect(input);
    osc.start(time);
    osc.stop(end);
  }
  route(envelope, dry, wet, true);
}

// Âm trượt cao độ (tiếng "bóp", nhịp tim, tiếng ngân).
function sfxSweep(fromHz, toHz, time, duration, { type = "sine", level = 0.2, wet = 0.2 } = {}) {
  const envelope = context.createGain();
  envelope.gain.setValueAtTime(0.0001, time);
  envelope.gain.exponentialRampToValueAtTime(level, time + 0.008);
  envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
  const osc = context.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(fromHz, time);
  osc.frequency.exponentialRampToValueAtTime(toHz, time + duration);
  osc.connect(envelope);
  osc.start(time);
  osc.stop(time + duration + 0.02);
  route(envelope, 1, wet, true);
}

const bell = [[1, 1], [2, 0.3], [3.01, 0.08]];
const wood = [[1, 1], [3.98, 0.12]];

const EVENT_SOUNDS = {
  // Đời thường: tiếng "bóp" nhẹ như bong bóng rồi một nốt gảy gỗ ấm.
  everyday(t) {
    sfxSweep(380, 900, t, 0.09, { level: 0.22, wet: 0.1 });
    sfxNote(79, t + 0.07, { harmonics: wood, level: 0.24, decay: 0.45, wet: 0.3 });
    sfxNote(84, t + 0.17, { harmonics: wood, level: 0.2, decay: 0.55, wet: 0.35 });
  },
  // Đặc biệt: chuỗi chuông lấp lánh đi lên và tiếng ngân phép màu.
  special(t) {
    [72, 76, 79, 84, 88, 91].forEach((midi, i) =>
      sfxNote(midi, t + i * 0.055, { harmonics: bell, level: 0.15, decay: 1.3, wet: 0.8 }));
    sfxSweep(1800, 4200, t + 0.05, 0.6, { type: "triangle", level: 0.035, wet: 0.9 });
    sfxNote(96, t + 0.36, { harmonics: bell, level: 0.08, decay: 1.6, wet: 1 });
  },
  // Tình yêu: hai nhịp tim "thình thịch" rồi hợp âm ấm áp, rung nhẹ.
  love(t) {
    sfxSweep(95, 55, t, 0.16, { level: 0.5, wet: 0.05 });
    sfxSweep(95, 55, t + 0.2, 0.18, { level: 0.42, wet: 0.05 });
    [69, 73, 76, 81].forEach((midi, i) =>
      sfxNote(midi, t + 0.42 + i * 0.03, { type: "triangle", level: 0.1, attack: 0.08, decay: 1.2, vibrato: 14, wet: 0.7 }));
  },
  // Gia đình: vài nốt hộp nhạc như bài hát ru.
  family(t) {
    [[77, 0], [81, 0.16], [84, 0.32], [81, 0.5], [77, 0.66]].forEach(([midi, at]) =>
      sfxNote(midi, t + at, { harmonics: bell, level: 0.16, decay: 1, wet: 0.6 }));
  },
  // Học tập: chuông trường "ding-dong".
  education(t) {
    sfxNote(83, t, { harmonics: [[1, 1], [2.76, 0.25], [5.4, 0.08]], level: 0.24, decay: 1.1, wet: 0.5 });
    sfxNote(79, t + 0.32, { harmonics: [[1, 1], [2.76, 0.25], [5.4, 0.08]], level: 0.24, decay: 1.4, wet: 0.55 });
  },
  // Nghề nghiệp: kèn đồng ngắn "ta-đaa" tự tin.
  career(t) {
    const brass = { type: "sawtooth", attack: 0.03, cutoff: 2600, wet: 0.35 };
    sfxNote(67, t, { ...brass, level: 0.09, decay: 0.12 });
    [72, 76, 79].forEach((midi) => sfxNote(midi, t + 0.16, { ...brass, level: 0.075, hold: 0.32, decay: 0.45 }));
    sfxNote(60, t + 0.16, { type: "sine", level: 0.16, hold: 0.3, decay: 0.4, wet: 0.1 });
  },
};

// Tiếng chũm chọe: nhiễu trắng lọc cao, ngân rồi tắt dần.
function sfxCymbal(time, { level = 0.08, decay = 1.4 } = {}) {
  const length = Math.floor(context.sampleRate * (decay + 0.1));
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
  const noise = context.createBufferSource();
  noise.buffer = buffer;
  const filter = context.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 6000;
  const envelope = context.createGain();
  envelope.gain.setValueAtTime(0.0001, time);
  envelope.gain.exponentialRampToValueAtTime(level, time + 0.01);
  envelope.gain.exponentialRampToValueAtTime(0.0001, time + decay);
  noise.connect(filter).connect(envelope);
  noise.start(time);
  noise.stop(time + decay + 0.1);
  route(envelope, 1, 0.6, true);
}

// Kèn trầm trượt xuống cho tiếng "wah-wah" khi chưa thành công.
function sfxSadHorn(fromMidi, toMidi, time, duration, level) {
  const envelope = context.createGain();
  envelope.gain.setValueAtTime(0.0001, time);
  envelope.gain.exponentialRampToValueAtTime(level, time + 0.05);
  envelope.gain.setValueAtTime(level, time + duration * 0.6);
  envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(700, time);
  filter.frequency.linearRampToValueAtTime(1500, time + 0.08);
  filter.frequency.exponentialRampToValueAtTime(500, time + duration);
  filter.connect(envelope);
  const lfo = context.createOscillator();
  lfo.frequency.value = 6;
  const depth = context.createGain();
  depth.gain.value = 18;
  lfo.connect(depth);
  for (const [type, gainValue] of [["sawtooth", 0.6], ["triangle", 1]]) {
    const osc = context.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency(fromMidi), time);
    osc.frequency.exponentialRampToValueAtTime(frequency(toMidi), time + duration * 0.9);
    depth.connect(osc.detune);
    const gain = context.createGain();
    gain.gain.value = gainValue;
    osc.connect(gain).connect(filter);
    osc.start(time);
    osc.stop(time + duration + 0.05);
  }
  lfo.start(time);
  lfo.stop(time + duration + 0.05);
  route(envelope, 1, 0.3, true);
}

const OUTCOME_SOUNDS = {
  // Thành công (đậu phỏng vấn, vào trường, thăng chức...): nốt sáng đi lên rồi hợp âm "ta-da!".
  success(t) {
    [72, 76, 79].forEach((midi, i) => sfxNote(midi, t + i * 0.08, { harmonics: bell, level: 0.17, decay: 0.5, wet: 0.4 }));
    const brass = { type: "sawtooth", attack: 0.025, cutoff: 3000, wet: 0.4 };
    [72, 76, 79, 84].forEach((midi) => sfxNote(midi, t + 0.26, { ...brass, level: 0.06, hold: 0.35, decay: 0.6 }));
    [84, 88, 91, 96].forEach((midi, i) => sfxNote(midi, t + 0.3 + i * 0.05, { harmonics: bell, level: 0.09, decay: 1, wet: 0.8 }));
    sfxNote(48, t + 0.26, { level: 0.18, hold: 0.3, decay: 0.5, wet: 0.1 });
  },
  // Đạt thành tựu: kèn ba tiếng ngắn rồi một tiếng dài hoành tráng, chũm chọe và chuông lấp lánh.
  achievement(t) {
    const brass = { type: "sawtooth", attack: 0.02, cutoff: 3200, wet: 0.35 };
    [0, 0.13, 0.26].forEach((at) => {
      sfxNote(67, t + at, { ...brass, level: 0.08, decay: 0.1 });
      sfxNote(71, t + at, { ...brass, level: 0.05, decay: 0.1 });
    });
    [72, 76, 79, 84].forEach((midi) => sfxNote(midi, t + 0.42, { ...brass, level: 0.07, hold: 0.6, decay: 0.8, vibrato: 8 }));
    sfxNote(48, t + 0.42, { level: 0.22, hold: 0.5, decay: 0.7, wet: 0.1 });
    sfxCymbal(t + 0.42, { level: 0.07, decay: 1.6 });
    [84, 88, 91, 96, 100].forEach((midi, i) => sfxNote(midi, t + 0.5 + i * 0.07, { harmonics: bell, level: 0.08, decay: 1.2, wet: 0.9 }));
  },
  // Chưa thành công (rớt, trượt...): kèn trầm buồn đi xuống, nhẹ nhàng không chói tai.
  failure(t) {
    sfxSadHorn(67, 66, t, 0.32, 0.09);
    sfxSadHorn(66, 65, t + 0.36, 0.32, 0.09);
    sfxSadHorn(65, 64, t + 0.72, 0.32, 0.09);
    sfxSadHorn(64, 61, t + 1.08, 0.85, 0.1);
  },
};

// Khi nhân vật qua đời: tiếng chuông trầm ngân xa, hợp âm nền chậm trên vòng Am – F – Dm – Am
// và giai điệu hộp nhạc đi xuống, kéo dài khoảng 6 giây.
function deathSound(t) {
  const toll = [[1, 1], [2.02, 0.35], [2.76, 0.12], [5.4, 0.04]];
  sfxNote(45, t, { harmonics: toll, level: 0.2, decay: 4.5, wet: 0.9 });
  sfxNote(45, t + 3.2, { harmonics: toll, level: 0.12, decay: 4, wet: 1 });
  const pad = { type: "triangle", attack: 0.9, decay: 1.6, level: 0.035, vibrato: 6, wet: 0.9, dry: 0.6 };
  [[[57, 60, 64], 0], [[53, 57, 60], 1.6], [[50, 53, 57], 3.2], [[45, 52, 57, 60], 4.8]].forEach(([chord, at]) =>
    chord.forEach((midi) => sfxNote(midi, t + at, { ...pad, hold: at < 4.8 ? 0.6 : 1.4 })));
  [[76, 0.4], [74, 1.0], [72, 1.6], [69, 2.2], [72, 3.0], [71, 3.6], [69, 4.4], [64, 5.0], [69, 5.6]].forEach(([midi, at], i, all) =>
    sfxNote(midi, t + at, { harmonics: bell, level: 0.13, decay: i === all.length - 1 ? 3.2 : 1.6, wet: 0.85 }));
}

// Âm thanh cho kết quả: "success", "achievement", "failure" hoặc "death".
export function playOutcomeSound(kind) {
  // Nhạc nền lặng dần khi nhân vật qua đời (kể cả khi tắt hiệu ứng); bật lại nhạc hoặc về bến xe thì nhạc như cũ.
  if (kind === "death" && master) {
    master.gain.cancelScheduledValues(context.currentTime);
    master.gain.setTargetAtTime(0, context.currentTime, 0.8);
  }
  if (!sfxEnabled || document.hidden || !setupAudio()) return;
  context.resume?.();
  if (kind === "death") deathSound(context.currentTime + 0.05);
  else OUTCOME_SOUNDS[kind]?.(context.currentTime + 0.03);
}

export function playEventSound(category) {
  if (!sfxEnabled || document.hidden || !setupAudio()) return;
  context.resume?.();
  const sound = EVENT_SOUNDS[category] ?? EVENT_SOUNDS.everyday;
  sound(context.currentTime + 0.03);
}

// ---------- Âm thanh tương tác: bấm nút, chọn/bỏ chọn, xác nhận, quay lại, mở/đóng popup ----------
// Rất ngắn và nhỏ để bấm liên tục không mệt tai; đi chung đường hiệu ứng nên tắt "Hiệu ứng âm thanh" là tắt luôn.

const UI_SOUNDS = {
  // Bấm thường: tiếng "tách" gỗ nhỏ.
  tap(t) {
    sfxNote(86, t, { harmonics: wood, level: 0.07, decay: 0.07, wet: 0.05 });
  },
  // Chọn một lựa chọn: nốt gỗ đi lên.
  select(t) {
    sfxNote(81, t, { harmonics: wood, level: 0.08, decay: 0.08, wet: 0.08 });
    sfxNote(88, t + 0.045, { harmonics: wood, level: 0.07, decay: 0.12, wet: 0.1 });
  },
  // Bỏ chọn: nốt gỗ đi xuống.
  deselect(t) {
    sfxNote(84, t, { harmonics: wood, level: 0.06, decay: 0.07, wet: 0.05 });
    sfxNote(79, t + 0.04, { harmonics: wood, level: 0.05, decay: 0.09, wet: 0.05 });
  },
  // Xác nhận (Mua, Chơi, Tiếp tục…): hai nốt chuông sáng.
  confirm(t) {
    sfxNote(79, t, { harmonics: bell, level: 0.07, decay: 0.18, wet: 0.2 });
    sfxNote(86, t + 0.07, { harmonics: bell, level: 0.07, decay: 0.3, wet: 0.3 });
  },
  // Quay lại: tiếng gỗ trầm hơn.
  back(t) {
    sfxNote(76, t, { harmonics: wood, level: 0.07, decay: 0.08, wet: 0.05 });
    sfxNote(72, t + 0.05, { harmonics: wood, level: 0.06, decay: 0.1, wet: 0.05 });
  },
  // Mở popup: tiếng "bóp" nhẹ đi lên kèm chuông nhỏ.
  open(t) {
    sfxSweep(480, 1150, t, 0.11, { level: 0.06, wet: 0.15 });
    sfxNote(91, t + 0.06, { harmonics: bell, level: 0.04, decay: 0.35, wet: 0.45 });
  },
  // Đóng popup: tiếng "bóp" đi xuống.
  close(t) {
    sfxSweep(950, 430, t, 0.1, { level: 0.05, wet: 0.1 });
  },
  // Chạm lá bài: tiếng "sột" của giấy.
  card(t) {
    sfxSweep(2600, 900, t, 0.035, { type: "triangle", level: 0.05, wet: 0.02 });
    sfxNote(74, t, { harmonics: wood, level: 0.04, decay: 0.05, wet: 0.02 });
  },
  // Sang tuổi mới (năm bình lặng, không có popup): tiếng lật trang và chuông nhỏ.
  age(t) {
    sfxSweep(300, 1400, t, 0.16, { type: "triangle", level: 0.045, wet: 0.2 });
    sfxNote(84, t + 0.1, { harmonics: bell, level: 0.07, decay: 0.45, wet: 0.5 });
    sfxNote(91, t + 0.17, { harmonics: bell, level: 0.05, decay: 0.6, wet: 0.6 });
  },
};

// Đo bằng đồng hồ của trang: đồng hồ của AudioContext đứng yên khi âm thanh chưa được mở khóa.
let lastUiSoundAt = -Infinity;
const lastSoundOfKind = {};
export function playUiSound(kind) {
  if (!sfxEnabled || document.hidden || !setupAudio() || !UI_SOUNDS[kind]) return;
  // Cùng một tiếng bị bấm dồn dập (nhấn đúp, giữ phím) chỉ phát một lần; tiếng khác loại vẫn phát.
  const now = performance.now();
  if (now - (lastSoundOfKind[kind] ?? -Infinity) < 40) return;
  lastSoundOfKind[kind] = now;
  lastUiSoundAt = now;
  context.resume?.();
  UI_SOUNDS[kind](context.currentTime + 0.005);
}

// Popup đã có âm thanh riêng (sự kiện, thành tựu, qua đời) thì không phát thêm tiếng mở.
const DIALOGS_WITH_OWN_SOUND = new Set(["event-dialog", "achievement-unlock-dialog", "death-dialog"]);
let lastDialogOpenAt = 0;

// Phân loại phần tử vừa bấm thành loại âm thanh. wasPressed: trạng thái aria-pressed trước khi bấm.
function interactionKind(element, wasPressed) {
  if (element.id === "age-up") return "age";
  if (element.matches(".tl-hand .tl-card")) return "card";
  if (wasPressed !== null) return wasPressed === "true" ? "deselect" : "select";
  if (element.matches("input[type=checkbox], input[type=radio]")) return element.checked ? "deselect" : "select";
  const label = `${element.getAttribute("aria-label") ?? ""} ${element.id}`;
  if (/^Đóng|(^|\s)close/u.test(label.trim()) || element.matches("[class*=close]")) return "close";
  if (element.matches(".shop-back") && /^\s*←/u.test(element.textContent)) return "back";
  if (element.matches(".event-choice, .game-option")) return "select";
  if (element.matches("#event-confirm, .game-primary, .shop-buy, .lobby-primary, [type=submit]")) return "confirm";
  return "tap";
}

function initInteractionSounds() {
  // Popup mở: ghi lại thời điểm để tiếng bấm của nút mở popup không chồng lên tiếng mở.
  // Popup đóng (bằng nút X, Esc hay bấm ra ngoài): tiếng đóng, trừ khi vừa có tiếng khác
  // (nút xác nhận đóng popup) hoặc đang chuyển sang popup khác (chỉ nghe tiếng mở).
  new MutationObserver((records) => {
    for (const record of records) {
      const dialog = record.target;
      if (dialog.tagName !== "DIALOG") continue;
      if (dialog.open && record.oldValue === null) {
        lastDialogOpenAt = performance.now();
        if (!DIALOGS_WITH_OWN_SOUND.has(dialog.id)) playUiSound("open");
      } else if (!dialog.open && record.oldValue !== null) {
        const closedAt = performance.now();
        setTimeout(() => {
          if (lastDialogOpenAt >= closedAt || performance.now() - lastUiSoundAt < 80) return;
          playUiSound("close");
        }, 0);
      }
    }
  }).observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ["open"], attributeOldValue: true });

  // Bắt ở pha capture để đọc trạng thái trước khi nút tự đổi (aria-pressed, checkbox).
  document.addEventListener("click", (event) => {
    const element = event.target.closest?.("button, summary, [role=button], input[type=checkbox], input[type=radio], a[href]");
    if (!element || element.disabled || element.getAttribute("aria-disabled") === "true") return;
    // Nút bật/tắt âm thanh tự phát tiếng thử; phần tử có data-silent thì im lặng.
    if (element.closest("[data-music-toggle], [data-sfx-toggle], [data-silent]")) return;
    const kind = interactionKind(element, element.getAttribute("aria-pressed"));
    const clickedAt = performance.now();
    // Đợi xử lý của nút chạy xong: nếu vừa mở popup thì để tiếng popup (hoặc tiếng sự kiện) thay cho tiếng bấm.
    // Nút đóng để bộ theo dõi popup phát tiếng đóng, tránh hai tiếng chồng nhau.
    if (kind === "close") return;
    setTimeout(() => {
      if (lastDialogOpenAt >= clickedAt) return;
      playUiSound(kind);
    }, 0);
  }, true);
}

// ---------- Nút bật/tắt ----------

function notify() {
  for (const listener of listeners) listener(enabled);
  document.querySelectorAll("[data-music-toggle]").forEach(render);
  document.querySelectorAll("[data-sfx-toggle]").forEach(renderSfx);
}

function render(button) {
  button.setAttribute("aria-pressed", String(enabled));
  button.title = enabled ? "Tắt nhạc nền" : "Bật nhạc nền";
  const icon = button.querySelector("[data-music-icon]");
  const label = button.querySelector("[data-music-label]");
  if (icon) icon.textContent = enabled ? "🔊" : "🔇";
  if (label) label.textContent = enabled ? "Nhạc nền: Bật" : "Nhạc nền: Tắt";
}

function renderSfx(button) {
  button.setAttribute("aria-pressed", String(sfxEnabled));
  const icon = button.querySelector("[data-sfx-icon]");
  const label = button.querySelector("[data-sfx-label]");
  if (icon) icon.textContent = sfxEnabled ? "🔔" : "🔕";
  if (label) label.textContent = sfxEnabled ? "Hiệu ứng âm thanh: Bật" : "Hiệu ứng âm thanh: Tắt";
}

export const isMusicEnabled = () => enabled;
export const isSfxEnabled = () => sfxEnabled;

export function setMusicEnabled(value) {
  enabled = Boolean(value);
  savePreference(STORAGE_KEY, enabled);
  if (enabled) start();
  else stop();
  notify();
}

export function setSfxEnabled(value) {
  sfxEnabled = Boolean(value);
  savePreference(SFX_STORAGE_KEY, sfxEnabled);
  // Bật lại thì phát thử một tiếng để người chơi biết đã có âm thanh.
  if (sfxEnabled) playEventSound("everyday");
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
  // Nút bật/tắt: mọi phần tử có data-music-toggle / data-sfx-toggle (bến xe, cài đặt trong game).
  document.addEventListener("click", (event) => {
    if (event.target.closest?.("[data-music-toggle]")) setMusicEnabled(!enabled);
    if (event.target.closest?.("[data-sfx-toggle]")) setSfxEnabled(!sfxEnabled);
  });
  notify();
  initInteractionSounds();
  initThemeTracking();
  // Lần chạm/bấm đầu tiên mở khóa âm thanh của trình duyệt.
  const unlock = () => {
    if (enabled) start();
    else if (sfxEnabled && setupAudio()) context.resume?.();
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
    else if (context && enabled) start();
    else if (context && sfxEnabled) context.resume?.();
  });
}
