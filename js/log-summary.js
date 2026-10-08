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
