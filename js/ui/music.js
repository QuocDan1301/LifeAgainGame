// Nhạc nền và hiệu ứng âm thanh tự soạn, phát bằng Web Audio API: không cần file, không vướng bản quyền.
// Nhạc nền: giai điệu hộp nhạc nhẹ nhàng trên vòng hợp âm C – G – Am – F, có hợp âm nền và bass ấm.
// Hiệu ứng: mỗi loại sự kiện có một âm thanh riêng khi popup bật lên.
// Trình duyệt chỉ cho phát âm thanh sau lần chạm/bấm đầu tiên nên âm thanh bắt đầu từ lúc đó.

const STORAGE_KEY = "lifeAgainMusic";
const SFX_STORAGE_KEY = "lifeAgainSfx";
const TEMPO = 76; // nhịp mỗi phút
const EIGHTH = 60 / TEMPO / 2; // độ dài một móc đơn (giây)
const VOLUME = 0.22;
const PAD_LEVEL = 0.06; // âm lượng hợp âm nền
const SFX_VOLUME = 0.5; // âm lượng hiệu ứng sự kiện
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

let enabled = readPreference(STORAGE_KEY);
let sfxEnabled = readPreference(SFX_STORAGE_KEY);
let context = null;
let master = null; // đường nhạc nền
let reverb = null;
let sfxBus = null; // đường hiệu ứng, bật/tắt riêng với nhạc nền
let sfxReverb = null;
let timer = null;
let nextTime = 0;
let step = 0; // vị trí móc đơn trong cả vòng nhạc
let loop = 0;
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
  node.connect(dryGain).connect(sfx ? sfxBus : master);
  const wetGain = context.createGain();
  wetGain.gain.value = wet;
  node.connect(wetGain).connect(sfx ? sfxReverb : reverb);
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
function playPad(notes, time, duration) {
  const envelope = context.createGain();
  envelope.gain.setValueAtTime(0.0001, time);
  envelope.gain.linearRampToValueAtTime(PAD_LEVEL, time + 0.8);
  envelope.gain.setValueAtTime(PAD_LEVEL, time + duration - 0.3);
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
