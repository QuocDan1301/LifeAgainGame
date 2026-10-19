import assert from 'node:assert/strict';
import {
  createEmploymentEvent, createInterviewResult, createJobInterview, MILESTONE_INTERVIEW_ATTEMPTS, isMilestonePromiseClosed,
} from '../js/career/career-jobs.js';

// A graduate whose age-16 career spark matches the studied career: the mentor invites them at 22.
const graduate = (extra = {}) => ({ age: 21, health: 80, intelligence: 60, money: 0, employmentStatus: 'unemployed',
  careerSpark: 'programming', careerPath: { id: 'programming', field: 'Công nghệ thông tin', school: { name: 'Trường thử' } }, ...extra });
const fail = (player, age) => Object.assign(player, createInterviewResult(player, false, age).updates, { age });

assert.equal(MILESTONE_INTERVIEW_ATTEMPTS, 2);

// First interview at 22 comes from the mentor; failing it warns that one chance is left.
const player = graduate();
const first = createEmploymentEvent(player, 22);
assert.equal(first.kind, 'job-interview');
assert.ok(first.text.includes('16 tuổi'));
const firstResult = createInterviewResult(player, false, 22);
assert.ok(firstResult.content.includes('cơ hội cuối cùng'), 'lần trượt đầu báo trước chỉ còn một lần');
fail(player, 22);
assert.equal(player.milestoneInterviewFailures, 1);

// One retry the next year, still from the mentor.
const retry = createEmploymentEvent(player, 23);
assert.equal(retry.kind, 'job-interview-retry');
assert.ok(retry.title.includes('gọi lại'));
const second = createInterviewResult(player, false, 23);
assert.equal(second.title, '📋 Lời hẹn khép lại');
assert.ok(second.content.includes('không gọi lại nữa') && second.content.includes('Xin việc'));
fail(player, 23);
assert.equal(player.milestoneInterviewFailures, 2);
assert.ok(isMilestonePromiseClosed(player));

// After the second failure the mentor never calls again, at any age.
for (let age = 24; age < 62; age++) assert.equal(createEmploymentEvent(player, age), null, `không phỏng vấn lại ở tuổi ${age}`);
// Applying through Xin việc gives an ordinary interview, not the mentor's.
const ordinary = createJobInterview({ ...player, age: 30 });
assert.ok(!ordinary.text.includes('16 tuổi'), 'Xin việc sau đó là phỏng vấn thường');
assert.ok(!createInterviewResult(player, false, 30).updates.milestoneInterviewFailures, 'phỏng vấn thường không đếm thêm lượt hẹn');
// Passing is still possible through ordinary applications.
assert.equal(createInterviewResult(player, true, 30).updates.employmentStatus, 'employed');

// Passing at the retry still works as before.
const lucky = graduate();
fail(lucky, 22);
assert.equal(createInterviewResult(lucky, true, 23).updates.employmentStatus, 'employed');

// Overseas graduates without the milestone keep their yearly retry.
const abroad = { age: 23, health: 80, employmentStatus: 'unemployed', milestoneInterviewFailures: 5,
  careerPath: { id: 'study-abroad', field: 'Kinh doanh', school: { type: 'international', countryId: 'japan', majorId: 'business' } } };
const abroadEvent = createEmploymentEvent(abroad, 24);
assert.ok(!abroadEvent || abroadEvent.kind === 'job-interview-retry', 'du học không bị ảnh hưởng');

// Old saves without the counter keep the first-time behaviour.
const legacy = graduate({ age: 25 });
assert.equal(createEmploymentEvent(legacy, 26).kind, 'job-interview-retry');

console.log('PASS milestone interviews: mentor at 22, warned retry, closes after the second failure, ordinary Xin việc afterwards, overseas unchanged, old saves');
