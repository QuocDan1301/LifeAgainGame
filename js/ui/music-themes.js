// Các bản nhạc nền tự soạn (số MIDI, 60 = Đô giữa). Mỗi ô nhịp có 8 móc đơn:
// chord: hợp âm nền, bass: một nốt (đánh theo kiểu bass của bản) hoặc 8 ô (null = nghỉ), melody: 8 ô giai điệu.
// lead/pad/bassVoice: tên nhạc cụ trong music.js. drums: 8 ký tự cho 8 móc đơn
// (k = trống cái, s = trống con, h = chũm chọe nhỏ, w = mõ gỗ, . = nghỉ). swing: độ trễ của móc lẻ (0–0,3).
// Khung nhận diện bối cảnh (màn nào phát bản nào) nằm ở THEME_RULES cuối file.

const bars = (list) => list.map(([chord, bass, melody]) => ({ chord, bass, melody }));

export const MUSIC_THEMES = {
  // Bến xe và cuộc đời: hộp nhạc nhẹ nhàng trên vòng C – G – Am – F.
  home: {
    tempo: 76, lead: "bell", pad: "warm", bassVoice: "sine", alternate: true,
    bars: bars([
      [[60, 64, 67], 36, [76, null, 79, null, 84, null, 79, null]],
      [[59, 62, 67], 43, [74, null, 79, null, 83, null, 81, 79]],
      [[57, 60, 64], 45, [72, null, 76, null, 81, null, 79, 76]],
      [[57, 60, 65], 41, [77, null, 81, null, 84, null, null, null]],
      [[60, 64, 67], 36, [79, null, 76, 79, 84, null, 86, null]],
      [[59, 62, 67], 43, [83, null, 79, null, 74, null, 79, null]],
      [[57, 60, 65], 41, [81, null, 84, null, 77, null, 81, 79]],
      [[55, 62, 65], 43, [74, null, null, null, 71, null, null, null]],
    ]),
  },
  // Danh sách Trò chơi: jazz phòng chờ, đàn điện ấm, bass đi bộ, chổi quét trống.
  lounge: {
    tempo: 92, swing: 0.22, lead: "epiano", pad: "warm", padLevel: 0.045, bassVoice: "walk", drums: "k.s.h.s.",
    bars: bars([
      [[55, 58, 62, 65], [43, null, 46, null, 50, null, 48, null], [74, null, 72, 70, null, 67, null, null]],
      [[55, 58, 60, 64], [48, null, 52, null, 55, null, 46, null], [69, null, 70, 72, null, 76, 74, null]],
      [[57, 60, 64, 65], [41, null, 45, null, 48, null, 50, null], [72, null, null, 69, null, null, 65, null]],
      [[57, 60, 62, 65], [50, null, 48, null, 45, null, 43, null], [null, 69, 72, null, 77, null, 74, null]],
      [[55, 58, 62, 65], [43, null, 46, null, 50, null, 52, null], [70, null, 74, null, 77, null, 74, 72]],
      [[55, 58, 60, 64], [48, null, 46, null, 45, null, 43, null], [70, null, 69, null, 67, null, 64, null]],
      [[55, 60, 64, 67], [45, null, 48, null, 52, null, 55, null], [72, null, 69, null, 76, null, 72, null]],
      [[54, 57, 60, 62], [50, null, 54, null, 57, null, 48, null], [74, null, null, 72, null, 66, null, null]],
    ]),
  },
  // Sấp ngửa, xúc xắc, hộp bí ẩn, xì dách: swing sòng bài rộn ràng với đàn vibraphone.
  casino: {
    tempo: 124, swing: 0.18, lead: "vibes", pad: "warm", padLevel: 0.04, bassVoice: "walk", drums: "k.shk.sh",
    bars: bars([
      [[55, 60, 64, 69], [36, null, 40, null, 43, null, 45, null], [76, 79, null, 76, 72, null, 74, 76]],
      [[55, 61, 64, 67], [45, null, 49, null, 52, null, 43, null], [73, null, 76, null, 79, null, 76, null]],
      [[57, 60, 62, 65], [38, null, 41, null, 45, null, 48, null], [77, null, 74, null, 72, null, 69, null]],
      [[55, 59, 62, 65], [43, null, 47, null, 50, null, 41, null], [71, 74, 77, null, 79, null, null, null]],
      [[55, 60, 64, 69], [36, null, 40, null, 43, null, 45, null], [84, null, 79, null, 76, null, 79, 81]],
      [[55, 61, 64, 67], [45, null, 43, null, 40, null, 37, null], [79, null, 76, null, 73, null, 69, null]],
      [[57, 60, 62, 65], [38, null, 41, null, 45, null, 47, null], [74, 77, 81, null, 79, 77, 74, null]],
      [[55, 59, 62, 65], [43, null, 47, null, 50, null, 43, null], [71, null, 67, null, 72, null, null, null]],
    ]),
  },
  // Leo tháp tài lộc: phiêu lưu cung Rê thứ, đàn hạc và trống đều bước.
  tower: {
    tempo: 100, lead: "harp", pad: "warm", padLevel: 0.05, bassVoice: "sine", drums: "k..sk.s.",
    bars: bars([
      [[50, 53, 57], 38, [74, null, 77, null, 81, null, 77, null]],
      [[50, 53, 58], 46, [74, null, 77, null, 82, null, 81, null]],
      [[52, 55, 60], 48, [79, null, 76, null, 72, null, 76, 79]],
      [[49, 52, 57], 45, [81, null, null, null, 73, null, 76, null]],
      [[50, 53, 57], 38, [86, null, 84, null, 81, null, 77, null]],
      [[50, 53, 58], 46, [82, null, 81, null, 77, null, 74, null]],
      [[50, 55, 58], 43, [79, 77, 74, null, 77, 79, 81, null]],
      [[49, 52, 57], 45, [76, null, 73, null, 69, null, null, null]],
    ]),
  },
  // Đấu giá cổ vật: đàn harpsichord phong cách cổ điển, cung La thứ, trang trọng.
  auction: {
    tempo: 84, lead: "harpsichord", pad: "organ", padLevel: 0.035, bassVoice: "pedal",
    bars: bars([
      [[57, 60, 64], 45, [76, 72, 69, 72, 76, 79, 77, 76]],
      [[57, 62, 65], 50, [74, 77, 81, 77, 74, 72, 71, 72]],
      [[55, 59, 62], 43, [71, 74, 79, 74, 71, 67, 69, 71]],
      [[55, 60, 64], 48, [72, 76, 79, 76, 72, 67, 64, 67]],
      [[57, 60, 65], 41, [65, 69, 72, 77, 76, 74, 72, 69]],
      [[57, 62, 65], 50, [74, 72, 71, 69, 71, 72, 74, 77]],
      [[56, 59, 64], 40, [76, 71, 68, 71, 76, 80, 76, 74]],
      [[57, 60, 64], 45, [72, 71, 69, null, 69, null, null, null]],
    ]),
  },
  // Tiến lên miền Nam: điệu ngũ cung Việt Nam (Đô – Rê – Fa – Son – La), tiếng đàn tranh luyến láy và mõ gỗ.
  tienlen: {
    tempo: 84, lead: "zither", pad: "drone", padLevel: 0.04, bassVoice: "sine", drums: "w..w.w..",
    bars: bars([
      [[48, 55], 36, [81, null, 79, 77, null, 74, 72, null]],
      [[50, 57], 38, [74, null, 77, null, 79, 81, 79, null]],
      [[53, 60], 41, [84, null, 81, 79, null, 77, 79, null]],
      [[48, 55], 36, [77, null, 74, null, 72, null, null, null]],
      [[48, 55], 36, [72, 74, 77, null, 79, null, 81, null]],
      [[50, 57], 38, [84, null, 86, 84, 81, null, 79, null]],
      [[53, 60], 41, [81, 79, 77, null, 74, null, 77, 79]],
      [[48, 55], 36, [72, null, null, null, 74, null, 72, null]],
    ]),
  },
  // Game Center: nhạc 8-bit tươi vui như máy chơi game thùng.
  arcade: {
    tempo: 132, lead: "chip", pad: "none", bassVoice: "octaves", drums: "k.hsk.hs",
    bars: bars([
      [[60, 64, 67], 36, [84, null, 79, null, 76, 79, 84, null]],
      [[57, 60, 64], 45, [81, null, 76, null, 72, 76, 81, null]],
      [[53, 57, 60], 41, [77, 81, 84, null, 81, null, 77, null]],
      [[55, 59, 62], 43, [79, null, 83, null, 86, null, null, null]],
      [[60, 64, 67], 36, [84, 86, 88, null, 86, 84, 79, null]],
      [[57, 60, 64], 45, [81, null, 84, null, 88, null, 84, null]],
      [[53, 57, 60], 41, [77, null, 81, 84, 86, 84, 81, 77]],
      [[55, 59, 62], 43, [79, null, null, null, 74, 76, 79, null]],
    ]),
  },
  // Kéo bò: nhạc đồng quê miền Tây nước Mỹ, đàn banjo và nhịp "bùm – chách".
  cow: {
    tempo: 116, lead: "banjo", pad: "strum", padLevel: 0.05, bassVoice: "boomchick", drums: "k.s.k.s.",
    bars: bars([
      [[55, 59, 62], 43, [74, 76, 79, 76, 74, 71, 74, null]],
      [[55, 60, 64], 48, [72, 76, 79, null, 76, 74, 72, null]],
      [[55, 59, 62], 43, [71, 74, 79, 74, 71, 67, 71, 74]],
      [[57, 62, 66], 50, [76, 74, 72, 71, 69, null, null, null]],
      [[55, 59, 62], 43, [79, null, 78, 79, 81, 79, 76, 74]],
      [[55, 60, 64], 48, [76, null, 72, 76, 79, null, 76, null]],
      [[57, 62, 66], 50, [74, 78, 81, 78, 76, 74, 72, 69]],
      [[55, 59, 62], 43, [67, null, 71, null, 67, null, null, null]],
    ]),
  },
  // Gắp thú: hộp đồ chơi lóc cóc với mộc cầm (marimba).
  claw: {
    tempo: 108, lead: "marimba", pad: "warm", padLevel: 0.035, bassVoice: "pluck", drums: "w.h.w.hh",
    bars: bars([
      [[53, 57, 60], 41, [77, null, 81, null, 84, 81, 77, null]],
      [[53, 58, 62], 46, [74, null, 77, null, 82, null, 77, null]],
      [[52, 55, 60], 48, [76, 79, 84, 79, 76, null, 72, null]],
      [[53, 57, 60], 41, [77, null, null, null, 72, null, null, null]],
      [[53, 57, 60], 41, [81, 84, null, 81, 77, null, 81, null]],
      [[50, 53, 57], 50, [74, 77, 81, null, 77, 74, 69, null]],
      [[53, 58, 62], 46, [70, 74, 77, 82, 79, 76, 74, 72]],
      [[53, 57, 60], 41, [77, null, 72, null, 77, null, null, null]],
    ]),
  },
  // Bóng rổ: funk sân đấu, kèn đồng nhấn nhá và bass giật.
  sport: {
    tempo: 104, lead: "brass", pad: "none", bassVoice: "slap", drums: "k.sk.ks.",
    bars: bars([
      [[52, 55, 59], [40, null, 52, 40, null, 40, 50, null], [76, null, null, 79, null, 76, null, 74]],
      [[52, 55, 59], [40, null, 52, 40, null, 43, 45, null], [null, 71, null, 74, 76, null, null, null]],
      [[52, 57, 61], [45, null, 57, 45, null, 45, 55, null], [76, null, null, 81, null, 79, null, 76]],
      [[51, 54, 59], [47, null, 59, 47, null, 47, 45, null], [78, null, 75, null, 71, null, null, null]],
      [[52, 55, 59], [40, null, 52, 40, null, 40, 50, null], [83, null, 81, null, 79, null, 76, null]],
      [[55, 59, 62], [43, null, 55, 43, null, 43, 53, null], [79, null, null, 74, null, 79, null, 83]],
      [[52, 57, 61], [45, null, 57, 45, null, 45, 55, null], [81, null, 79, null, 76, null, 74, null]],
      [[51, 54, 59], [47, null, 59, 47, null, 47, 51, null], [78, null, null, null, 75, null, 78, null]],
    ]),
  },
  // Đập chuột: 8-bit nhanh, tinh nghịch, nốt nảy cục.
  whack: {
    tempo: 148, lead: "chipThin", pad: "none", bassVoice: "octaves", drums: "khshkhsh",
    bars: bars([
      [[60, 64, 67], 36, [72, null, 74, null, 76, null, 79, 78]],
      [[57, 60, 65], 41, [77, null, null, 76, null, null, 74, null]],
      [[60, 64, 67], 36, [72, 76, 79, 84, null, 83, null, 79]],
      [[55, 59, 62], 43, [77, null, 74, null, 71, null, null, null]],
      [[60, 64, 67], 36, [76, 77, 76, 77, 79, null, 76, null]],
      [[57, 62, 65], 38, [74, 76, 74, 76, 77, null, 74, null]],
      [[57, 60, 65], 41, [72, 74, 76, 77, 79, 81, 83, 84]],
      [[55, 59, 62], 43, [79, null, 72, null, null, null, null, null]],
    ]),
  },
};

// Bối cảnh → bản nhạc. Xét từ trên xuống, khớp quy tắc nào trước thì phát bản đó; không khớp thì "home".
export const THEME_RULES = [
  ["#game-center-dialog[open] .gc-stage-cow", "cow"],
  ["#game-center-dialog[open] .gc-stage-claw", "claw"],
  ["#game-center-dialog[open] .gc-stage-basketball", "sport"],
  ["#game-center-dialog[open] .gc-stage-whack", "whack"],
  ["#game-center-dialog[open]", "arcade"],
  ["#games-dialog[open] :is(.tl-shell, .tl-lobby)", "tienlen"],
  ["#games-dialog[open] .auction-house", "auction"],
  ["#games-dialog[open] :is(.tower-stage, .game-stage-tower, .game-setup[data-game=tower])", "tower"],
  ["#games-dialog[open] :is(.game-setup, .game-stage, .game-result)", "casino"],
  ["#games-dialog[open]", "lounge"],
];
