 
 
export const LIVING_COST_HIGH_FROM = 200_000_000;
export const LIVING_COST_HIGH_RATE = 0.55;
export const LIVING_COST_TOP_FROM = 600_000_000;
export const LIVING_COST_TOP_RATE = 0.7;
export function getLivingShare(income, rate) {
  if (!(income > 0)) return 0;
  const base = Math.min(income, LIVING_COST_HIGH_FROM);
  const high = Math.max(0, Math.min(income, LIVING_COST_TOP_FROM) - LIVING_COST_HIGH_FROM);
  const top = Math.max(0, income - LIVING_COST_TOP_FROM);
  return Math.round((base * rate + high * LIVING_COST_HIGH_RATE + top * LIVING_COST_TOP_RATE) / 1000) * 1000;
}

export function describeLivingShare(rate) {
  return `lũy tiến: ${Math.round(rate * 100)}% đến ${LIVING_COST_HIGH_FROM / 1_000_000} triệu, ${Math.round(LIVING_COST_HIGH_RATE * 100)}% phần ${LIVING_COST_HIGH_FROM / 1_000_000}–${LIVING_COST_TOP_FROM / 1_000_000} triệu, ${Math.round(LIVING_COST_TOP_RATE * 100)}% phần trên ${LIVING_COST_TOP_FROM / 1_000_000} triệu`;
}
