import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { lifeStoryCatalog } from '../js/events/life-stories/index.js';
import { createLifeStoryEvents, fillStoryText, isLifeStoryEligible } from '../js/events/life-stories.js';
import { prepareStoryChoice, canAffordChoice, collectHomeLoanYear, collectStoryLoanYear } from '../js/core/story-transactions.js';
import { getAnnualSalaryPayment, completeCareerYear, retirePlayer } from '../js/career/career-salary.js';
import { createWorkProblemEvent, createJobReviewEvent, createLayoffNoticeEvent, createContractNoticeEvent } from '../js/career/job-loss.js';
import { getShopItem } from '../js/leisure/shop.js';
import { getHomeFinancing } from '../js/core/housing.js';
import { getChildAge, completeLifeYear, forecastNextYear } from '../js/relationships/family.js';

let checks = 0;
function test(name, body) { body(); checks++; console.log(`PASS ${name}`); }
const worker = (age = 51) => ({ age, money: 500_000_000, name: 'An', isAlive: true,
  employmentStatus: 'employed', careerPath: { id: 'marketing' }, careerLevel: 2,
  job: 'Marketing', employedSince: 25, health: 80, happiness: 80, intelligence: 80, appearance: 80 });
const story = id => lifeStoryCatalog.find(item => item.id === id);

test('Quit immediately stops salary and preserves job search', () => {
  const p = worker();
  const source = lifeStoryCatalog.flatMap(s => s.choices).find(c => c.flags?.includes('tu_nguyen_nghi'));
  const c = prepareStoryChoice(source, p, 52);
  assert.equal(c.money, 30_000_000);
  assert.equal(c.playerUpdates.employmentStatus, 'unemployed');
  assert.equal(c.playerUpdates.careerSwitchOpen, true);
  assert.equal(getAnnualSalaryPayment(p, 52, c.playerUpdates), null);
  completeCareerYear(p, 52, { ...c.playerUpdates, money: p.money + c.money });
  assert.equal(p.money, 530_000_000);
  assert.equal(getAnnualSalaryPayment(p, 53), null);
});
test('Retirement retains pension and suppresses all work discipline', () => {
  const p = worker(61);
  p.jobWarning = { issuedAt: 60, plan: 'ignore', careerId: 'marketing' };
  p.contractEndAge = 63;
  for (const factory of [createWorkProblemEvent, createJobReviewEvent, createLayoffNoticeEvent, createContractNoticeEvent])
    assert.equal(factory(p, 62, () => 0), null);
  const payment = completeCareerYear(p, 62);
  assert.equal(payment.amount, 120_000_000);
  assert.equal(p.employmentStatus, 'retired');
  assert.equal(p.jobWarning, null);
  assert.equal(getAnnualSalaryPayment(p, 62), null);
  assert.equal(completeCareerYear(p, 63).amount, 120_000_000);
});
test('Explicit prices, two months salary and affordability', () => {
  const p = worker(26);
  assert.equal(prepareStoryChoice(story('ls27-khoa-hoc-toi').choices[0], p, 27).money, -40_000_000);
  for (const [id, amounts] of [['ls36-vay-nong', [-30_000_000, -5_000_000]],
    ['ls47-con-yeu-cau-tien', [-30_000_000, -15_000_000]], ['ls59-suc-khoe-tim', [-80_000_000, -6_000_000]]]) {
    amounts.forEach((amount, i) => {
      const c = prepareStoryChoice(story(id).choices[i], p, story(id).age);
      assert.equal(c.money, amount);
      assert.match(c.label, /chi/);
      assert.equal(canAffordChoice({ money: -1 }, c), false);
      assert.equal(canAffordChoice({ money: -amount }, c), true);
    });
  }
});
test('Mortgage owns a real asset and finishes exactly one payment per contract year', () => {
  // Điều khoản lấy từ hợp đồng thật của game (housing.js), khớp lời kể “vay hai mươi năm”.
  const terms = getHomeFinancing('story-home');
  const p = worker(27);
  const c = prepareStoryChoice(story('ls28-mua-nha').choices[0], p, 28);
  assert.match(c.label, new RegExp(`trả trước.*vay.*${terms.years} năm`));
  assert.match(story('ls28-mua-nha').title, /hai mươi năm/);
  assert.equal(terms.years, 20);
  Object.assign(p, c.playerUpdates, { money: 10_000_000_000 + c.money });
  assert.equal(getShopItem(p.purchases[0].id).group, 'realestate');
  assert.equal(collectHomeLoanYear(p, 28), null);
  const before = p.money;
  for (let age = 29; age <= 28 + terms.years; age++) {
    assert.ok(collectHomeLoanYear(p, age));
    assert.equal(collectHomeLoanYear(p, age), null);
    p.homeLoans = JSON.parse(JSON.stringify(p.homeLoans));
  }
  assert.equal(p.homeLoans[0].outstanding, 0);
  assert.equal(before - p.money, terms.total, 'trả đúng tổng hợp đồng, không hơn không kém');
  assert.equal(collectHomeLoanYear(p, 29 + terms.years), null, 'hết hợp đồng thì không thu thêm');
  assert.equal(collectHomeLoanYear(p, 44), null);
});
test('Loans persist and repayments cannot invent legacy credit', () => {
  const p = worker(35);
  const c = prepareStoryChoice(story('ls36-vay-nong').choices[0], p, 36);
  Object.assign(p, c.playerUpdates);
  const repay = prepareStoryChoice({ label: 'Trả nợ', repayLoan: 'cousin' }, p, 40);
  assert.equal(repay.money, 30_000_000);
  Object.assign(p, repay.playerUpdates);
  assert.equal(prepareStoryChoice({ label: 'Trả nợ', repayLoan: 'cousin' }, p, 41).money, 0);
  const old = { money: 10, storyFlags: ['vay_mua_nha', 'cho_anh_ho_vay'] };
  assert.equal(collectHomeLoanYear(old, 50), null);
  assert.equal(old.money, 10);
  assert.equal(old.purchases, undefined);
  assert.equal(isLifeStoryEligible(story('ls-cousin-repayment'), 40, old), false);
});
test('Adopted age, selected child, elapsed time and names', () => {
  const child = { id: 'child', name: 'Nguyễn Lan', initialAge: 5, joinedAtAge: 30 };
  assert.equal(getChildAge(child, 82), 57);
  const p = { ...worker(81), children: [child], partner: { name: 'Trần Minh', ageAtMeeting: 27, metAtAge: 30 }, marriedAtAge: 35 };
  assert.equal(fillStoryText('{tenCon} {tuoiCon}', { ...p, storyAge: 82 }), 'Lan 57');
  assert.equal(fillStoryText('{soNamKetHon} {soNamConThuyen} {tuoiBanDoi}', { ...p, storyAge: 82 }), '47 79 79');
  assert.equal(fillStoryText('Đi tìm {tenBanDoi}', {}), 'Đi tìm người ấy');
  for (let age = 26; age <= 104; age++) for (const event of createLifeStoryEvents(age, p)) {
    assert.doesNotMatch(JSON.stringify(event), /\{(?:ten|tuoi|soNam)[^}]*\}/);
  }
});

// Run the actual choice handler with a tiny UI harness; confirmation remains the sole mutation point.
const main = fs.readFileSync(new URL('../js/main.js', import.meta.url), 'utf8');
const handler = main.slice(main.indexOf('function chooseEventAction(index)'), main.indexOf('ageButton.addEventListener("click",', main.indexOf('function chooseEventAction(index)')));
test('Actual handler: insufficient funds, log, reload and double click', () => {
  const p = worker(35);
  const source = story('ls36-vay-nong');
  const choice = prepareStoryChoice(source.choices[0], p, 36);
  choice.playerUpdates.storyFlags = ['seen:ls36-vay-nong', 'cho_anh_ho_vay'];
  const state = { player: p, pendingEvent: { id: source.id, category: 'everyday', catalogVersion: 2, stage: 'choice', age: 36, title: source.title, text: source.text, choices: [choice] } };
  const ctx = vm.createContext({ state, canAffordChoice, eligibilityFeedback: {},
    softenSetback: (_, c) => c, statNames: { happiness: 'Hạnh phúc' },
    formatMoneyAmount: String, createSchoolEntryReward: () => null,
    createEventLogSummary: ({ changes }) => changes.join(' '), getChoiceOutcome: () => null, getEventTags: () => [],
    saveEventProgress() {}, showPendingEvent() {} });
  vm.runInContext(handler, ctx);
  p.money = 1;
  vm.runInContext('chooseEventAction(0)', ctx);
  assert.equal(state.pendingEvent.stage, 'choice');
  assert.equal(p.storyLoans, undefined);
  p.money = 500_000_000;
  vm.runInContext('chooseEventAction(0)', ctx);
  assert.equal(p.money, 500_000_000);
  assert.equal(state.pendingEvent.updates.money, 470_000_000);
  assert.match(state.pendingEvent.logContent, /Tiền -30000000 VNĐ/);
  state.pendingEvent = JSON.parse(JSON.stringify(state.pendingEvent));
  vm.runInContext('chooseEventAction(0)', ctx);
  assert.equal(state.pendingEvent.updates.money, 470_000_000);
  const random = Math.random;
  Math.random = () => 0.99;
  try { completeLifeYear(p, 36, state.pendingEvent.updates); } finally { Math.random = random; }
  assert.equal(p.storyLoans.length, 1);
  assert.equal(p.storyLoans[0].principal, 30_000_000);
});
test('Scheduled repayments and stale retirement results', () => {
  const p = worker(32);
  const source = lifeStoryCatalog.flatMap(s => s.choices).find(c => c.flags?.includes('cho_tu_vay'));
  const c = prepareStoryChoice(source, p, 33);
  Object.assign(p, c.playerUpdates);
  const before = p.money;
  for (const age of [34, 35, 36]) {
    assert.equal(collectStoryLoanYear(p, age).amount, 10_000_000);
    assert.equal(collectStoryLoanYear(p, age), null);
  }
  assert.equal(p.money - before, 30_000_000);
  assert.equal(p.storyLoans[0].outstanding, 0);
  assert.equal(collectStoryLoanYear(p, 37), null);
  const retired = worker(70);
  const random = Math.random;
  Math.random = () => 0.99;
  try {
    completeLifeYear(retired, 71, { employmentStatus: 'unemployed', jobWarning: { issuedAt: 70 } });
  } finally { Math.random = random; }
  assert.equal(retired.employmentStatus, 'retired');
  assert.equal(retired.jobWarning, null);
  assert.equal(getAnnualSalaryPayment({ ...retired, isAlive: false }, 72), null);
  assert.equal(forecastNextYear(retired).income, 120_000_000);
  const borrower = worker(28);
  Object.assign(borrower, prepareStoryChoice(story('ls28-mua-nha').choices[0], borrower, 28).playerUpdates);
  assert.equal(forecastNextYear(borrower).costs - forecastNextYear({ ...borrower, homeLoans: [] }).costs, getHomeFinancing('story-home').annualPayment, 'dự báo năm tới tính đúng một kỳ trả góp');
});
console.log(`${checks} regression groups passed.`);
