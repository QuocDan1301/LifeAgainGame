import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createInitialState } from '../js/core/state.js';
import { completeLifeYear, getAnnualTuition } from '../js/relationships/family.js';
import { careerPaths } from '../js/career/career-event.js';
import { getCareerProfile } from '../js/career/career-jobs.js';
import { shopCatalog, isAtLimit, isRental, getLeaseEndAge } from '../js/leisure/shop.js';
import { achievements, meetsAchievement, recordAchievementFlags } from '../js/achievements/achievements-data.js';
import { studyAbroadCountries } from '../js/education/study-abroad.js';

// Financial feasibility only: no jackpot, inheritance, cheating, randomized death,
// or free hospital recovery. Each year reserves 12m for routine care/activities.
// Promotions at 27/37 are conditional on winning the actual career checks.
const careers = careerPaths.filter(([id]) => id !== 'casual').flatMap(([id, , field]) =>
  id === 'study-abroad'
    ? studyAbroadCountries.map(country => ({ id, field, country }))
    : [{ id, field }]);
const targets = shopCatalog.filter(item => item.achievement || item.id === "starter-apartment");
const paths = ['entry', 'rank-2', 'rank-3'];
const owned = player => [...player.purchases, ...player.livestock];
const annual = (player, age, updates) => {
  const random = Math.random;
  Math.random = () => 0.99;
  try { return completeLifeYear(player, age, updates); } finally { Math.random = random; }
};
function simulate(career, path, target = null, invest = false, family = false) {
  const player = { ...createInitialState().player, name: 'Mô phỏng', age: 21, money: 0,
    health: 85, happiness: 80, intelligence: 75, appearance: 80, relatives: [], illnessPlan: [],
    careerSpark: path === 'rank-3' ? career.id : null,
    careerPath: { id: career.id, field: career.field,
      school: career.country ? { type: 'international', countryId: career.country.id, name: career.country.name }
        : { type: ['military', 'esports'].includes(career.id) ? 'academy' : 'university', name: 'Chương trình trong nước' } },
    abroadProgress: career.country ? { phase: 'graduated', language: 75, academic: 75, integration: 75 } : undefined,
  };
  player.money = career.country ? -4 * (career.country.tuition + career.country.living) : -4 * getAnnualTuition(player.careerPath);
  let serial = 0;
  let achievedAt = null;
  const moneyMilestones = {};
  const balances = {};
  let deductions = 0;
  const buy = item => {
    assert.ok(player.money >= item.price && !isAtLimit(player, item));
    player.money -= item.price;
    player[item.shop === 'pets' ? 'livestock' : 'purchases'].push({ id: item.id, uid: `sim-${serial++}`, boughtAtAge: player.age,
      ...(isRental(item) && item.profit ? { rentedAtAge: player.age } : {}) });
    if (item.achievement) {
      recordAchievementFlags({ player }, [item.achievement]);
    }
  };
  for (let age = 22; age <= 90; age++) {
    // This budget is an explicit assumption, not a claim that health is guaranteed.
    player.money -= 12e6;
    player.health = 85; player.happiness = 80; player.isAlive = true;
    if (family && age === 30) player.children = [{ id: 'child', initialAge: 0, joinedAtAge: 30,
      educationPlan: 'supported', collegeSupport: true }];
    const updates = age === 22 ? { employmentStatus: 'employed', careerLevel: 1, job: getCareerProfile(career.id, player.careerPath).ranks[0] }
      : age === 27 && path !== 'entry' ? { careerLevel: 2 }
        : age === 37 && path === 'rank-3' ? { careerLevel: 3 } : {};
    const result = annual(player, age, updates);
    deductions += result.living?.economy?.total ?? 0;
    for (const achievement of achievements.filter(a => a.rule.field === 'money')) {
      if (!moneyMilestones[achievement.id] && meetsAchievement(achievement, player)) moneyMilestones[achievement.id] = age;
    }
    for (const entry of player.purchases) {
      if (isRental(shopCatalog.find(item => item.id === entry.id)) && getLeaseEndAge(entry) <= age) entry.rentedAtAge = age;
    }
    if (target && player.money >= target.price) {
      buy(target);
      if (target.achievement) assert.ok(meetsAchievement(achievements.find(a => a.id === target.achievement), player), 'The full achievement rule must pass, not only the purchase price');
      achievedAt = age;
      break;
    }
    if (invest) {
      const investments = shopCatalog.filter(item => item.profit && (!target || item.price < target.price))
        .sort((a, b) => b.profit / b.price - a.profit / a.price || a.price - b.price);
      for (const item of investments) {
        while (!isAtLimit(player, item) && player.money >= item.price + 48e6) buy(item);
      }
    }
    if ([30, 40, 50, 62, 75, 90].includes(age)) balances[age] = {
      cash: Math.round(player.money), grossAssets: owned(player).reduce((sum, entry) => sum + shopCatalog.find(item => item.id === entry.id).price, 0),
    };
    assert.ok(Number.isFinite(player.money));
  }
  return { career: career.country?.id ?? career.id, path, invest, family, achievedAt, moneyMilestones, balances, deductions };
}
const lives = careers.flatMap(career => paths.flatMap(path => [false, true].map(family => simulate(career, path, null, false, family))));
const assetRoutes = targets.map(target => {
  const routes = careers.flatMap(career => paths.flatMap(path => [false, true].map(invest => simulate(career, path, target, invest))));
  const successful = routes.filter(route => route.achievedAt !== null).sort((a, b) => a.achievedAt - b.achievedAt);
  return { id: target.achievement ?? "first-home-financial-goal", item: target.id, price: target.price,
    reachableRoutes: successful.length, totalRoutes: routes.length, earliest: successful[0] ?? null,
    routesBeforeRetirement: successful.filter(route => route.achievedAt < 62).length,
    paths: paths.map(path => ({ path, earliestAge: successful.find(route => route.path === path)?.achievedAt ?? null })) };
});
const moneyGoals = achievements.filter(a => a.rule.field === 'money').map(achievement => {
  const ages = lives.map(life => life.moneyMilestones[achievement.id]).filter(Number.isFinite).sort((a, b) => a - b);
  const middle = Math.floor(ages.length / 2);
  return {
    id: achievement.id, amount: achievement.rule.value, totalRoutes: lives.length,
    reachableRoutes: ages.length, routesBeforeRetirement: ages.filter(age => age < 62).length,
    earliestAge: ages[0] ?? null,
    medianAge: ages.length ? (ages[middle] + ages[Math.floor((ages.length - 1) / 2)]) / 2 : null,
  };
});
assert.ok(moneyGoals.every(goal => goal.routesBeforeRetirement > 0), 'Every cash milestone needs a working-life route without jackpots');
const report = {
  assumptions: 'Controlled financial feasibility, not survival probabilities. Start with four years of actual tuition debt (plus overseas student costs), no initial wealth, jackpots or gifts; pay real progressive personal tax, insurance, asset/property taxes, rent, debt interest and family costs. Reserve 12m/year for care/activities; maintain health to isolate money. Entry/rank-2/rank-3 trajectories assume employment and successful eligible promotions at 27/37. Each expensive purchase is tested in a separate life. Investments follow catalog limits and renew four-year leases.',
  careers: careers.length, financialLives: lives.length, assetLives: targets.length * careers.length * paths.length * 2,
  moneyGoals, assets: assetRoutes, lives,
};
fs.mkdirSync('output', { recursive: true });
fs.writeFileSync(process.env.WEALTH_REPORT ?? 'output/wealth-achievement-feasibility.json', JSON.stringify(report, null, 2));
for (const row of assetRoutes) console.log(`${row.earliest ? 'REACHABLE' : 'UNREACHED'} ${row.item}: ${row.price / 1e9}b; earliest=${row.earliest?.achievedAt ?? '-'}; routes=${row.reachableRoutes}/${row.totalRoutes}`);
console.log(`SIMULATED ${report.financialLives} financial lives and ${report.assetLives} purchase goals; all amounts after personal income tax.`);
if (process.env.REQUIRE_ASSET_ROUTES === '1') assert.ok(assetRoutes.every(row => row.earliest), 'Every shopping achievement needs a non-jackpot financial route');
