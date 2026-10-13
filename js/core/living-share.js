// Phần thu nhập dành cho sinh hoạt: tỷ lệ cơ bản đến LIVING_COST_HIGH_FROM mỗi năm, phần vượt trên chi
// theo LIVING_COST_HIGH_RATE (nhà rộng hơn, xe, giao tế, chăm sóc gia đình). Mức sống tăng theo thu nhập,
// để lương và tài sản lớn không tích lũy gần như nguyên vẹn.
export const LIVING_COST_HIGH_FROM = 200_000_000;
export const LIVING_COST_HIGH_RATE = 0.5;
export function getLivingShare(income, rate) {
  if (!(income > 0)) return 0;
  const base = Math.min(income, LIVING_COST_HIGH_FROM);
  const high = Math.max(0, income - LIVING_COST_HIGH_FROM);
  return Math.round((base * rate + high * LIVING_COST_HIGH_RATE) / 1000) * 1000;
}
