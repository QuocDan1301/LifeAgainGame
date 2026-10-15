import assert from 'node:assert/strict';
import { createInitialState } from '../js/core/state.js';
import { studyAbroadCountries, getStudyAbroadLivingCost, createStudyAbroadMajorEvent, createStudyAbroadYearEvent, createStudyAbroadDramaStep, getOverseasJobBlocker } from '../js/education/study-abroad.js';
import { getInterviewChance } from '../js/stats/intellect-rules.js';
import { getRankLock } from '../js/career/career-milestones.js';
import { createSchoolEvent } from '../js/career/career-schools.js';
import { careerEvent } from '../js/career/career-event.js';
import { studyBlocks, canChooseCareer } from '../js/education/study-blocks.js';
import { createCareerTest } from '../js/career/career-tests.js';
import { completeLifeYear, forecastNextYear, getAnnualTuition } from '../js/relationships/family.js';
import { createCareerSparkPickEvent, hasCareerMilestone } from '../js/career/career-milestones.js';
import { createInterviewResult, createMilestonePromotionEvent, createPromotionEvent, createEmploymentEvent, getPromotionUpdates, getCareerProfile } from '../js/career/career-jobs.js';
import { getCareerAnnualSalary } from '../js/career/career-salary.js';
import { isLifeStoryEligible } from '../js/events/life-stories.js';
import { studyAbroadStories } from '../js/events/life-stories/study-abroad.js';

let count = 0;
const test = (name, run) => { run(); console.log(`PASS ${name}`); count++; };
const path = careerEvent.choices.find(c => c.careerPath.id === 'study-abroad').careerPath;
const player = () => ({ ...createInitialState().player, age: 17, money: 0,
  health: 80, intelligence: 50, happiness: 80, appearance: 80, relatives: [], illnessPlan: [] });
const year = (p, age, updates = {}) => {
  const original = Math.random; Math.random = () => 0.99;
  try { return completeLifeYear(p, age, updates); } finally { Math.random = original; }
};
test('Every study block supports admission and the age-16 discovery', () => {
  for (const b of studyBlocks) {
    assert.ok(canChooseCareer(path.id, b.id));
     
    assert.ok(Array.from({ length: 200 }, (_, lifeSeed) => createCareerSparkPickEvent(b.id, { lifeSeed }))
      .some(e => e.choices.some(c => c.careerSparkId === path.id)));
  }
  assert.equal(createCareerTest(path).choices.length, 3);
});
test('All seven countries have explicit cost previews and saved country data', () => {
  const event = createSchoolEvent(path, player());
  assert.equal(event.choices.length, 7);
  for (const [i, c] of event.choices.entries()) {
    assert.equal(c.careerPath.school.countryId, studyAbroadCountries[i].id);
    assert.ok(c.label.includes('Học phí') && c.label.includes('sinh hoạt'));
    assert.ok(c.text.includes('Bốn năm'));
    assert.equal(getAnnualTuition(c.careerPath), studyAbroadCountries[i].tuition);
  }
});
test('Every country charges precisely four years, forecast matches, debt is preserved', () => {
  for (const c of createSchoolEvent(path, player()).choices) {
    const p = player();
    const country = studyAbroadCountries.find(x => x.id === c.careerPath.school.countryId);
    year(p, 18, { careerPath: c.careerPath });
    for (let age = 19; age <= 21; age++) {
      const forecast = forecastNextYear(p);
      year(p, age); assert.equal(p.money, forecast.after);
    }
    assert.equal(p.money, -4 * (country.tuition + country.living));
    const restored = JSON.parse(JSON.stringify(p));
    assert.equal(restored.careerPath.school.countryName, country.name);
    const before = restored.money; year(restored, 22);
    assert.equal(restored.money, before - country.living);
    assert.equal(getStudyAbroadLivingCost(restored.careerPath, 22), country.living);
  }
});
test('Scholarship discounts tuition only and is reevaluated annually', () => {
  const p = player(); p.intelligence = 80;
  const choice = createSchoolEvent(path, p).choices[0];
  year(p, 18, { careerPath: choice.careerPath });
  assert.equal(p.money, -150_000_000);
  p.intelligence = 50; const forecast = forecastNextYear(p);
  year(p, 19); assert.equal(p.money, -360_000_000); assert.equal(p.money, forecast.after);
});
test('Graduation opens paid work, promotions use international ranks and achievements', () => {
  const p = player(); p.careerPath = createSchoolEvent(path, p).choices[0].careerPath;
  p.careerSpark = path.id; p.age = 21;
  assert.ok(hasCareerMilestone(p));
  const hire = createInterviewResult(p, true, 22);
  year(p, 22, hire.updates);
  assert.equal(p.money, 126_000_000);
  assert.equal(p.job, getCareerProfile(path.id, p.careerPath).ranks[0]);
  const promotion = createMilestonePromotionEvent(p, 4, 27, () => 0.99);
  assert.ok(promotion.choices.some(c => c.careerLevel === 2));
  p.careerLevel = 2; p.age = 30;
  const final = createPromotionEvent(p, () => 0, 31);
  const winner = final.choices.find(c => c.careerLevel === 3);
  assert.ok(winner);
  assert.deepEqual(winner.achievementIds, ['career-study-abroad']);
  assert.equal(getCareerProfile(path.id).achievement, 'career-study-abroad');
  assert.deepEqual([1, 2, 3].map(l => getCareerAnnualSalary(path.id, l)), [180e6, 360e6, 540e6]);
});
test('Foreign student stories require the actual country program and study age', () => {
  const p = player(); p.careerPath = createSchoolEvent(path, p).choices[0].careerPath;
  for (const story of studyAbroadStories) {
    assert.ok(isLifeStoryEligible(story, story.age, p));
    assert.ok(!isLifeStoryEligible(story, 30, p));
    assert.ok(!isLifeStoryEligible(story, story.age, { ...p, careerPath: { id: 'programming' } }));
  }
});
test('Existing saves get no invented country or retroactive foreign costs', () => {
  assert.equal(getAnnualTuition({ id: path.id, school: {} }), 0);
  assert.equal(getStudyAbroadLivingCost({ id: path.id, school: {} }, 19), 0);
  assert.equal(getAnnualTuition({ id: 'programming', school: { name: 'Old school' } }), 20e6);
});
test('International workers lose salary on quitting and receive only pension at retirement', () => {
  const p = player(); p.age = 30;
  p.careerPath = createSchoolEvent(path, p).choices[0].careerPath;
  p.employmentStatus = 'employed'; p.careerLevel = 3; p.job = getCareerProfile(path.id).ranks[2];
  p.employedSince = 25;
  const retired = structuredClone(p); retired.age = 61;
  const a = year(p, 31, { employmentStatus: 'unemployed', job: 'Thất nghiệp', careerLevel: 0 });
  assert.ok(!a.salary);
  const b = year(retired, 62);
  assert.equal(retired.employmentStatus, 'retired');
  assert.equal(b.salary.amount, 324e6);
  assert.ok(!b.tuition);
});
test('Four separate majors persist; student progress changes recruitment chances', () => {
  const p = player(); const countries = createSchoolEvent(path, p);
  for (const c of countries.choices) {
    const majors = createStudyAbroadMajorEvent(c.careerPath, p);
    assert.equal(majors.choices.length, 4);
    for (const m of majors.choices) {
      const s = { ...p, careerPath: m.careerPath, ...m.playerUpdates };
      assert.equal(s.abroadProgress.majorId, m.careerPath.school.majorId);
      assert.equal(getCareerProfile(path.id, s.careerPath).ranks.length, 3);
      const before = getInterviewChance(s, 'good').chance;
      Object.assign(s, createStudyAbroadYearEvent(s, 19).choices[0].playerUpdates);
      assert.ok(getInterviewChance(s, 'good').chance > before);
    }
  }
});
test('Student work earns once on settling the result and drama has meaningful replies', () => {
  const p = player(); const m = createStudyAbroadMajorEvent(createSchoolEvent(path, p).choices[0].careerPath, p).choices[0];
  year(p, 18, { careerPath: m.careerPath, ...m.playerUpdates });
  const before = p.money;
  const work = createStudyAbroadYearEvent(p, 19).choices[1];
  assert.equal(p.money, before);
  year(p, 19, { ...work.playerUpdates, money: before + work.money });
  assert.equal(p.money, before + 24e6 - 210e6);
  const good = createStudyAbroadDramaStep(p, 20, 3, ['listen', 'listen']).choices[0];
  const bad = createStudyAbroadDramaStep(p, 20, 3, ['blame', 'blame']).choices[1];
  assert.ok(good.playerUpdates.abroadProgress.integration > bad.playerUpdates.abroadProgress.integration);
});
test('Graduation separates staying and returning without duplicate fees or rewards', () => {
  for (const country of createSchoolEvent(path, player()).choices) {
    for (const major of createStudyAbroadMajorEvent(country.careerPath, player()).choices) {
      const p = { ...player(), age: 21, money: -100e6, careerPath: major.careerPath, ...major.playerUpdates };
      p.abroadProgress.language = 60; p.abroadProgress.academic = 60;
      assert.ok(getOverseasJobBlocker(p, 22));
      const event = createStudyAbroadYearEvent(p, 22);
      const stay = structuredClone(p); year(stay, 22, { ...event.choices[0].playerUpdates, employmentStatus: 'unemployed' });
      assert.equal(stay.money, p.money - getStudyAbroadLivingCost(p.careerPath, 22)); assert.equal(getOverseasJobBlocker(stay), '');
      assert.equal(createStudyAbroadYearEvent(stay, 23), null);
      const hire = createInterviewResult(stay, true, 22);
      assert.equal(hire.updates.workCountryId, p.careerPath.school.countryId);
      assert.ok(hire.content.includes(p.careerPath.school.countryName));
      assert.ok(getRankLock(stay).unlocked);
      assert.equal(hasCareerMilestone(stay), false);
      const senior = { ...stay, age: 45, employmentStatus: 'employed', careerLevel: 2, nextPromotionAge: 46 };
      assert.equal(createEmploymentEvent(senior, 46).kind, 'career-promotion');
      assert.equal(getPromotionUpdates(senior, 46, false).nextPromotionAge, 48);
      assert.equal(getPromotionUpdates(senior, 60, false).nextPromotionAge, null);
      assert.equal(createEmploymentEvent(senior, 62), null);
      const returning = structuredClone(p); const back = event.choices[1];
      year(returning, 22, { ...back.playerUpdates, careerPath: back.careerPath, employmentStatus: 'unemployed' });
      assert.notEqual(returning.careerPath.id, path.id);
      assert.equal(returning.overseasEducation.countryId, p.careerPath.school.countryId);
      assert.equal(returning.money, p.money);
      const domesticHire = createInterviewResult(returning, true, 22);
      assert.equal(domesticHire.updates.workCountryId, 'vietnam');
      assert.equal(domesticHire.updates.workCountryName, 'Việt Nam');
      assert.ok(domesticHire.logContent.includes('Việt Nam'));
      assert.equal(createInterviewResult(returning, false, 22).updates.workCountryId, undefined);
    }
  }
});
console.log(`${count} study-abroad groups passed`);
