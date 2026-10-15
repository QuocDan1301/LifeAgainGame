import fs from 'node:fs';
import { getAnnualEconomy, ANNUAL_RENT } from '../js/core/economy.js';
import { getHomeFinancing } from '../js/core/housing.js';
import { shopCatalog } from '../js/leisure/shop.js';
import { getOldAgeDeathChance } from '../js/stats/health-rules.js';
import { ACTIVITY_SLOTS_PER_YEAR, ACTIVITY_GAIN_CAP, STAT_WEAR } from '../js/core/stat-budget.js';

const wealth = JSON.parse(fs.readFileSync('output/wealth-achievement-feasibility.json', 'utf8'));
const activities = JSON.parse(fs.readFileSync('output/activity-achievement-feasibility.json', 'utf8'));
const home = getHomeFinancing('story-home');
const careReserve = 12e6;
const housingBudgets = [36, 48, 60, 72, 120, 180].map(millions => {
  const income = millions * 1e6;
  const casual = income < 120e6;
  const player = { age: 30, isAlive: true, careerPath: { id: casual ? 'casual' : 'programming' }, children: [], purchases: [] };
  const earnings = casual ? { sideIncome: income } : { salary: income };
  const renting = getAnnualEconomy(player, 31, earnings);
  const owning = getAnnualEconomy({ ...player, purchases: [{ id: home.id, boughtAtAge: 30 }] }, 31, earnings);
  return {
    annualIncome: income, incomeType: casual ? 'casual net work income' : 'gross salary',
    remainingWhileRenting: income - renting.total - careReserve,
    remainingWhileFinancing: income - owning.total - home.annualPayment - careReserve,
    careReserve, excludes: 'Children, family support, optional comfort, random events and initial deposit',
  };
});

// This is an idealized ceiling for old-age survival alone, conditional on age 69.
// It does not simulate illness, choices, partners or actual stat maintenance.
let alive = 1;
const oldAgeSurvival = [];
for (let age = 70; age <= 105; age++) {
  alive *= 1 - getOldAgeDeathChance(age, 85, []);
  if ([80, 90, 100, 101, 105].includes(age)) oldAgeSurvival.push({ age, probability: alive });
}
const report = {
  assumptions: {
    financial: wealth.assumptions,
    housing: 'Separate cash-flow comparisons with income held constant, no children or existing assets, and 12m/year explicitly reserved for care. This does not simulate survival, unemployment or buying decisions.',
    oldAge: 'Conditional on reaching age 69, hold health at 85 and no illnesses. Only the old-age mortality roll is multiplied; these are not whole-life survival rates.',
  },
  moneyGoals: wealth.moneyGoals,
  assetGoals: wealth.assets.map(({ item, price, reachableRoutes, totalRoutes, routesBeforeRetirement, earliest }) =>
    ({ item, price, reachableRoutes, totalRoutes, routesBeforeRetirement, earliestAge: earliest?.achievedAt ?? null })),
  housing: {
    price: home.price, deposit: home.deposit, annualPayment: home.annualPayment, years: home.years,
    totalPaidIncludingDeposit: home.deposit + home.total,
    annualRentSaved: ANNUAL_RENT, extraAnnualCashNeededDuringLoan: home.annualPayment - ANNUAL_RENT,
    apartmentCashPrice: shopCatalog.find(item => item.id === 'starter-apartment').price,
    budgets: housingBudgets,
  },
  activities,
  limits: { activitySlotsPerYear: ACTIVITY_SLOTS_PER_YEAR, activityGainAbove70PerStat: ACTIVITY_GAIN_CAP, statWear: STAT_WEAR },
  oldAgeSurvival,
  investments: shopCatalog.filter(item => item.profit).map(item => ({ id: item.id, price: item.price, annualProfitBeforeTax: item.profit, grossYield: item.profit / item.price, limit: item.limit })),
  assessment: [
    { area: 'income', finding: `${wealth.moneyGoals.find(goal => goal.id === 'billionaire').reachableRoutes}/${wealth.financialLives} controlled employed paths reach 1b; this is a common mid-game milestone, not a rare end-game achievement.` },
    { area: 'housing', finding: `Financing costs ${(home.annualPayment - ANNUAL_RENT) / 1e6}m/year more than domestic renting during ${home.years} years. Compare the explicit income scenarios before borrowing; care reserves are separate from the in-game forecast.` },
    { area: 'endgame', finding: 'All shopping goals have a non-jackpot path, but the earliest resort purchase is age 78 and survival is not modeled in the financial routes.' },
    { area: 'tarot', finding: 'The full deck needs at least 78 annual readings across one or more lives. Intermediate 10/39-card goals reduce gaps, but completion remains a long collection goal.' },
  ],
};
fs.writeFileSync('output/game-balance-audit.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify({ housing: report.housing, oldAgeSurvival, moneyGoals: report.moneyGoals }, null, 2));
