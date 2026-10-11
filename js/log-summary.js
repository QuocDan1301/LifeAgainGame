function shorten(text, limit = 110) {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  const characters = Array.from(clean);
  if (characters.length <= limit) return clean;
  const excerpt = characters.slice(0, limit - 1).join("");
  const boundary = excerpt.lastIndexOf(" ");
  return `${boundary > limit / 2 ? excerpt.slice(0, boundary) : excerpt}…`;
}

const firstSentence = (text) => text.match(/^.*?[.!?](?:\s|$)/u)?.[0] ?? text;
const isStatLine = (line) => /(?:Sức khỏe|Trí tuệ|Hạnh phúc|Ngoại hình|Tiền)\s+[+-]\d/u.test(line);

export function createEventLogSummary({ title, choiceLabel, resultTitle, resultText, changes = [] }) {
  const outcome = resultTitle && resultTitle !== "Kết quả"
    ? resultTitle : firstSentence(resultText ?? "");
  return [
    shorten(title, 85),
    `Chọn: ${shorten(choiceLabel, 100)}`,
    shorten(outcome),
    changes.join(" · "),
  ].filter(Boolean).join("\n");
}

// Compact old saves for display without rewriting their original story text.
export function summarizeLifeLog(text = "") {
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  const selected = lines.filter((line) => line.startsWith("Bạn chọn:"));
  const stats = lines.filter(isStatLine);
  if (selected.length) {
    const lastChoice = lines.lastIndexOf(selected[selected.length - 1]);
    const result = lines.slice(lastChoice + 1).find((line) => !isStatLine(line));
    return [
      ...selected.slice(-2).map((line) => shorten(line.replace(/^Bạn chọn:/u, "Chọn:"))),
      result ? shorten(firstSentence(result)) : "",
      ...stats,
    ].filter(Boolean).join("\n");
  }
  if (text.length <= 180) return text;
  return [shorten(firstSentence(lines.find((line) => !isStatLine(line)) ?? "")), ...stats]
    .filter(Boolean).join("\n");
}

// Rút gọn tối đa khi hiển thị nhật ký; nội dung gốc đã lưu giữ nguyên.
const MONEY = String.raw`[+−-]?[\d.,]+(?:\s?(?:k|nghìn|triệu|tỷ))?\s?VNĐ`;
const yearText = (years) => (years === "năm" ? "" : ` ${years}`);
const compactRules = [
  [new RegExp(String.raw`^💰 Nhận lương (\d+ năm|năm) ở bậc .+?: (${MONEY})\.?$`, "u"),
    (_, years, amount) => `💰 Lương${yearText(years)} ${amount}`],
  [new RegExp(String.raw`^🌅 (Nghỉ hưu)?.*?Nhận lương hưu (\d+ năm|năm): (${MONEY})\.?$`, "u"),
    (_, retired, years, amount) => `🌅 ${retired ? "Nghỉ hưu · " : ""}Lương hưu${yearText(years)} ${amount}`],
  [new RegExp(String.raw`^🏠 Chi phí sinh hoạt \(ăn ở, đi lại, hóa đơn\): (${MONEY})\.?`, "u"),
    (_, amount) => `🏠 Sinh hoạt ${amount}`],
  [/ Ví đang âm (.+?) nên phải sống tằn tiện \((Hạnh phúc -\d+)\)\.?/u, " · nợ $1 · $2"],
  [new RegExp(String.raw`^🎓 Học phí năm học tại .+?: (${MONEY})`, "u"), "🎓 Học phí $1"],
  [/^(\S+) (.+?) \((.+?), chưa điều trị (\d+) năm\)(?:: (Sức khỏe -\d+))?.*$/u,
    (_, icon, name, stage, years, loss) => `${icon} ${name} (${stage.toLowerCase()}, ${years} năm chưa chữa)${loss ? ` · ${loss}` : ""}`],
];
const fillerLines = new Set(["Một năm làm việc bình thường.", "Một năm nghỉ hưu thong thả."]);
const COMPACT_LIMIT = 80;
const STAT = String.raw`(?:Sức khỏe|Trí tuệ|Hạnh phúc|Ngoại hình|Tiền)\s+[+-][\d.,]+(?:\s?(?:k|triệu|tỷ))?(?:\s?VNĐ)?`;
const pureStatLine = new RegExp(String.raw`^${STAT}(?:\s+·\s+${STAT})*$`, "u");

export function compactLogText(text = "") {
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  const kept = lines.length > 1 ? lines.filter((line) => !fillerLines.has(line)) : lines;
  const mapped = kept.map((line) => {
    if (line === "Không có gì thay đổi, mọi thứ vẫn vậy.") return "Một năm bình lặng.";
    // Nút chỉ để đi tiếp không phải một lựa chọn đáng ghi.
    if (/^Chọn: (?:Tiếp tục|Xác nhận)\.?$/u.test(line)) return "";
    let compact = line;
    for (const [pattern, replacement] of compactRules) compact = compact.replace(pattern, replacement);
    // "24 triệu VNĐ" → "24 triệu": đơn vị đã đủ rõ là tiền.
    compact = compact.replace(/(\d\s?(?:k|nghìn|triệu|tỷ))\s?VNĐ/gu, "$1");
    if (compact !== line || isStatLine(compact)) return compact;
    return Array.from(compact).length > COMPACT_LIMIT ? shorten(firstSentence(compact), COMPACT_LIMIT) : compact;
  }).filter(Boolean);
  // Gộp dòng: lựa chọn nối vào tiêu đề, dòng chỉ số nối vào câu trước nó.
  const merged = [];
  for (let index = 0; index < mapped.length; index++) {
    const line = mapped[index];
    // Bỏ dòng lặp lại đúng tiêu đề ngay phía trên.
    const previous = merged.at(-1)?.split(" → ")[0];
    if (line === previous) continue;
    if (line.startsWith("Chọn: ") && merged.length) {
      merged[merged.length - 1] += ` → ${line.slice(6)}`;
      // Câu kết quả ngắn, chung chung ngay trước dòng chỉ số thì bỏ đi.
      const next = mapped[index + 1];
      if (next && pureStatLine.test(mapped[index + 2] ?? "") && !/\d/.test(next) && Array.from(next).length <= 40) index++;
      continue;
    }
    if (pureStatLine.test(line) && merged.length) {
      merged[merged.length - 1] += ` · ${line}`;
      continue;
    }
    merged.push(line);
  }
  return merged.join("\n") || text.trim();
}
