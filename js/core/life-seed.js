// Hạt giống cố định của một đời chơi: dùng cho những thứ tự "ngẫu nhiên nhưng không đổi khi tải lại".

export function hashText(text) {
  let hash = 7;
  for (const char of text) hash = (hash * 31 + char.codePointAt(0)) >>> 0;
  return hash;
}

// Tạo khi lập nhân vật (lobby); bản lưu cũ chưa có thì dùng tên|tỉnh như sự kiện đời thường.
export function getLifeSeed(player = {}) {
  if (Number.isInteger(player?.lifeSeed)) return player.lifeSeed >>> 0;
  return hashText(`${player?.name ?? ""}|${player?.province ?? ""}`);
}

// Bộ sinh số ngẫu nhiên có hạt giống (mulberry32), trả về số trong [0, 1).
export function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value + 0x6d2b79f5) >>> 0;
    let mixed = Math.imul(value ^ (value >>> 15), 1 | value);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 2 ** 32;
  };
}

// Số ngẫu nhiên riêng cho một việc trong đời này (ví dụ "later-60|2").
export const lifeRandom = (player, key) => seededRandom(hashText(`${getLifeSeed(player)}|${key}`));
