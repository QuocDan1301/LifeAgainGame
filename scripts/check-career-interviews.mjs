import assert from 'node:assert/strict';
import { careerEvent } from '../js/career/career-event.js';
import { careerInterviewQuestions } from '../js/career/career-interview-questions.js';
import { createJobInterview } from '../js/career/career-jobs.js';
import { studyAbroadMajors } from '../js/education/study-abroad.js';
import { getInterviewChance, rollInterview } from '../js/stats/intellect-rules.js';

const careers = careerEvent.choices.map(choice => choice.careerPath)
  .filter(path => !['casual', 'study-abroad'].includes(path.id));
const questionsSeen = new Set();
let interviews = 0;

function checkInterview(path, questions, careerSpark = null) {
  for (const [index, question] of questions.entries()) {
    for (const shuffleRandom of [0, 0.999]) {
      let calls = 0;
      const random = () => calls++ === 0 ? (index + 0.5) / questions.length : shuffleRandom;
      const event = createJobInterview({ age: 22, careerPath: path, careerSpark }, random);
      assert.equal(event.kind, 'job-interview');
      assert.equal(event.interviewCareerId, path.id);
      assert.ok(event.text.includes(question.text), `${path.id}: selected question reaches the dialog`);
      assert.equal(event.choices.length, question.answers.length);
      assert.equal(event.choices.filter(choice => choice.correct).length, 1);
      assert.deepEqual(new Set(event.choices.map(choice => choice.label)), new Set(question.answers));
      for (const [answerIndex, answer] of question.answers.entries()) {
        const choice = event.choices.find(entry => entry.label === answer);
        assert.equal(choice.quality, answerIndex === 0 ? 'good' : answerIndex === 1 ? 'acceptable' : 'weak');
        assert.equal(choice.correct, answerIndex === 0);
        const applicant = { age: 22, intelligence: 100, appearance: 100, interviewPrepAge: 22,
          careerPath: path, abroadProgress: { language: 100, academic: 100, integration: 100 } };
        assert.equal(rollInterview(applicant, choice.quality, () => 0).passed, answerIndex === 0,
          `${path.id}: only the correct answer can pass even with maximum bonuses and a lucky roll`);
        if (answerIndex > 0) assert.equal(getInterviewChance(applicant, choice.quality).chance, 0);
      }
      if (careerSpark) assert.ok(event.text.includes('16 tuổi'), `${path.id}: mentor introduction preserved`);
      interviews++;
    }
  }
}

for (const path of careers) {
  const questions = careerInterviewQuestions[path.id];
  assert.equal(questions?.length, 1, `${path.id}: must have exactly one interview question`);
  for (const question of questions) {
    assert.ok(question.text.trim());
    assert.ok(!questionsSeen.has(question.text), `${path.id}: question reused by another career`);
    questionsSeen.add(question.text);
    assert.ok(question.answers.length >= 3);
    assert.equal(new Set(question.answers).size, question.answers.length);
    assert.ok(question.answers.every(answer => typeof answer === 'string' && answer.trim()));
  }
  checkInterview(path, questions);
  checkInterview(path, questions, path.id);
}

for (const major of studyAbroadMajors) {
  const path = { id: 'study-abroad', field: major.name, school: { majorId: major.id } };
  checkInterview(path, careerInterviewQuestions[major.domesticCareer]);
}

// A single career can have mixed answer counts without losing choices or adding correct ones.
const variablePath = careers.find(path => path.id === 'teaching');
const originalQuestions = careerInterviewQuestions.teaching;
try {
  careerInterviewQuestions.teaching = [4, 5, 7].map(count => ({
    text: `Câu hỏi kiểm tra với ${count} đáp án?`,
    answers: Array.from({ length: count }, (_, index) => `Lựa chọn ${index + 1}`),
  }));
  checkInterview(variablePath, careerInterviewQuestions.teaching);
  checkInterview(variablePath, careerInterviewQuestions.teaching, 'teaching');
} finally {
  careerInterviewQuestions.teaching = originalQuestions;
}

// Saved pending dialogs carry their own text and labels, independent of future bank changes.
const event = createJobInterview({ age: 22, careerPath: careers[0] }, () => 0);
assert.deepEqual(JSON.parse(JSON.stringify(event)).choices, event.choices);
console.log(`PASS: ${careers.length} career banks, ${questionsSeen.size} unique questions, ${interviews} interview/shuffle/mentor/major cases`);
