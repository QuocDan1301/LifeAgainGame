const numberFormat = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 });
const units = [
  { value: 1, suffix: "" },
  { value: 1_000, suffix: "k" },
  { value: 1_000_000, suffix: " triệu" },
  { value: 1_000_000_000, suffix: " tỷ" },
];

export function formatMoneyAmount(amount) {
  const absolute = Math.abs(amount);
  let index = absolute >= 1_000_000_000 ? 3 : absolute >= 1_000_000 ? 2 : absolute >= 1_000 ? 1 : 0;
  // Promote values that round to the next unit instead of showing 1.000k.
  if (index < 3 && Math.round(absolute / units[index].value * 100) / 100 >= 1_000) index++;
  return `${numberFormat.format(amount / units[index].value)}${units[index].suffix}`;
}

export const formatMoney = amount => `${formatMoneyAmount(amount)} VNĐ`;

// Currency is required so ages, dates and stat points are left untouched.
export function formatMoneyText(text) {
  return text.replace(/(?<![\p{L}\d.,])\d+(?:\.\d{3})*(?:,\d+)?\s*(VNĐ|VND|₫)/giu,
    (match, currency) => {
      const numeric = match.slice(0, -currency.length).trim().replaceAll(".", "").replace(",", ".");
      return `${formatMoneyAmount(Number(numeric))} ${currency}`;
    });
}
