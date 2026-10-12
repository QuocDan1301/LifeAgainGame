import assert from 'node:assert/strict';
import { createInitialState } from '../js/state.js';
import { createSchoolEvent } from '../js/career-schools.js';
import { createStudyAbroadMajorEvent, createStudyAbroadYearEvent, getStudyAbroadTuition, canGraduateAbroad, studyAbroadCountries, hasInternationalDegreeForCareer } from '../js/study-abroad.js';
import { completeLifeYear, forecastNextYear, getDebtInterest } from '../js/family.js';
import { getCareerAnnualSalary, getPlayerAnnualSalary } from '../js/career-salary.js';
import { getRankLock, hasCareerMilestone } from '../js/career-milestones.js';
import { createEmploymentEvent, createPromotionEvent, createInterviewResult } from '../js/career-jobs.js';
import { getInterviewChance, getPromotionChance } from '../js/intellect-rules.js';
import { getAgeEvents } from '../js/events.js';

let passed = 0;
const test = (name, run) => { run(); console.log(`PASS ${name}`); passed++; };
const student = (countryIndex = 0, majorIndex = 0) => {
  const p = { ...createInitialState().player, name: 'Test', age: 21, money: -400e6,
    health: 80, happiness: 80, intelligence: 50, relatives: [], illnessPlan: [] };
  const path = { id: 'study-abroad', field: 'Đi du học' };
  const country = createSchoolEvent(path, p).choices[countryIndex];
  const major = createStudyAbroadMajorEvent(country.careerPath, p).choices[majorIndex];
  return { ...p, careerPath: major.careerPath, ...major.playerUpdates };
};
const year = (p, age, updates = {}) => {
  const random = Math.random; Math.random = () => 0.99;
  try { return completeLifeYear(p, age, updates); } finally { Math.random = random; }
};

test('Zero and missing scores cannot grant a new diploma or hire', () => {
  const p = student(); Object.assign(p.abroadProgress, { language: 0, academic: 0 });
  assert.equal(canGraduateAbroad(p), false);
  const event = createStudyAbroadYearEvent(p, 22);
  assert.equal(event.id, 'abroad-remediation');
  assert.ok(event.text.includes('60 triệu') && event.text.includes('90 triệu'));
  assert.ok(event.choices.every(c => !c.playerUpdates.overseasEducation));
  assert.notEqual(createInterviewResult(p, true, 22).updates.employmentStatus, 'employed');
  delete p.abroadProgress.language;
  assert.equal(canGraduateAbroad(p), false);
});
test('Remediation is priced, charged once per year and eventually permits graduation', () => {
  const p = student(); Object.assign(p.abroadProgress, { language: 0, academic: 0 });
  for (const age of [22, 23]) {
    const forecast = forecastNextYear(p); const event = createStudyAbroadYearEvent(p, age);
    const before = p.money;
    year(p, age, event.choices[0].playerUpdates);
    // Từ 23 tuổi, nợ mang sang đầu năm bị tính lãi.
    assert.equal(p.money, before - 150e6 - getDebtInterest(age, before));
    assert.equal(p.money, forecast.after);
    assert.equal(getPlayerAnnualSalary(p), 0);
  }
  assert.ok(canGraduateAbroad(p));
  const graduation = createStudyAbroadYearEvent(p, 24);
  assert.equal(graduation.kind, 'study-abroad-graduation');
  const before = p.money;
  year(p, 24, { ...graduation.choices[0].playerUpdates, employmentStatus: 'unemployed' });
  assert.equal(p.money, before - 90e6 - getDebtInterest(24, before));
  assert.equal(getStudyAbroadTuition(p, 25), 0);
});
test('Country wages, living costs, forecast and pension use the same configuration', () => {
  for (let i = 0; i < studyAbroadCountries.length; i++) {
    const p = student(i); const country = studyAbroadCountries[i];
    p.abroadProgress = { ...p.abroadProgress, language: 70, academic: 70, phase: 'graduated' };
    Object.assign(p, { age: 30, employmentStatus: 'employed', careerLevel: 3, employedSince: 25, job: 'Test worker' });
    assert.equal(getPlayerAnnualSalary(p), country.salaries[2]);
    const forecast = forecastNextYear(p);
    assert.ok(forecast.living >= country.living);
    year(p, 31); assert.equal(p.money, forecast.after);
    p.age = 61; const retiring = forecastNextYear(p); const result = year(p, 62);
    assert.equal(result.salary.amount, country.salaries[2] / 2);
    assert.equal(p.money, retiring.after);
  }
  assert.ok(studyAbroadCountries[3].salaries[2] > studyAbroadCountries[2].salaries[2]);
});
test('Integration affects recruitment and promotion without rewarding the wrong degree', () => {
  const low = student(); low.abroadProgress = { ...low.abroadProgress, phase: 'graduated', integration: 0 };
  const high = structuredClone(low); high.abroadProgress.integration = 100;
  assert.ok(getInterviewChance(high, 'good').chance > getInterviewChance(low, 'good').chance);
  assert.ok(getPromotionChance(high, 30) > getPromotionChance(low, 30));
});
test('Every returning graduate can advance in their actual major without invented age-16 history', () => {
  for (let i = 0; i < 4; i++) {
    const p = student(0, i); Object.assign(p.abroadProgress, { language: 60, academic: 60 });
    const back = createStudyAbroadYearEvent(p, 22).choices[1];
    year(p, 22, { ...back.playerUpdates, careerPath: back.careerPath, employmentStatus: 'unemployed' });
    assert.ok(getRankLock(p).unlocked && hasInternationalDegreeForCareer(p));
    assert.equal(hasCareerMilestone(p), false);
    p.age = 45; p.careerLevel = 2; p.employmentStatus = 'employed'; p.nextPromotionAge = 46;
    assert.equal(createEmploymentEvent(p, 46).kind, 'career-promotion');
    assert.ok(createPromotionEvent(p, () => 0, 46).choices.some(c => c.careerLevel === 3));
    assert.equal(hasInternationalDegreeForCareer(p, 'medicine'), false);
    assert.equal(getRankLock(p, 'medicine').unlocked, false);
  }
});
test('Overseas promotion mentions age 16 only when that encounter actually happened', () => {
  const p = student(); Object.assign(p, { age: 30, careerLevel: 2 });
  assert.ok(!createPromotionEvent(p, () => 0, 31).text.includes('16 tuổi'));
  p.careerSpark = 'study-abroad';
  assert.ok(createPromotionEvent(p, () => 0, 31).text.includes('16 tuổi'));
});
test('Memorial appears for both legacy deceased spouse and real widowed history', () => {
  for (const p of [{ partner: { name: 'Lan', isAlive: false }, marriedAtAge: 30 },
    { partner: null, marriedAtAge: null, widowedAtAge: 80, relationshipHistory: [{ type: 'widowed', age: 80, person: { name: 'Lan' } }] }]) {
    const event = getAgeEvents(100, null, p).find(e => e.id === 'centennial-memorial');
    assert.ok(event?.priority && event.text.includes('Lan'));
  }
  assert.ok(!getAgeEvents(100, null, {}).some(e => e.id === 'centennial-memorial'));
});
test('Old saves preserve money, education and scores without retroactive charges', () => {
  const p = student(); delete p.abroadProgress;
  const saved = JSON.stringify(p); assert.ok(canGraduateAbroad(p));
  assert.equal(createStudyAbroadYearEvent(p, 22).kind, 'study-abroad-graduation');
  assert.equal(JSON.stringify(p), saved);
  assert.equal(getStudyAbroadTuition(p, 22), 0);
  assert.equal(getCareerAnnualSalary('programming', 1), 120e6);
});
console.log(`${passed} audit fix groups passed`);
