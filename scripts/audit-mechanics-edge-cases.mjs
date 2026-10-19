import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createInitialState } from '../js/core/state.js';
import { getStudyAbroadLivingCost, createStudyAbroadSchoolEvent, createStudyAbroadMajorEvent, studyAbroadCountries } from '../js/education/study-abroad.js';
import { getFamilyBudget, collectFamilyBudget } from '../js/relationships/family-budget.js';
import { getPartnerRelationship } from '../js/special-events/special-later-life.js';
import { archiveLife, readLifeArchive, getArchiveDiscovery, readLifeDiscovery } from '../js/core/life-archive.js';
import { createChildProposalEvent, getChildProposalUpdates, describeYearLivingCost } from '../js/relationships/family.js';
import { getMarriageUpdates, getBreakupUpdates, getDatingUpdates } from '../js/relationships/relationships.js';

const results = [];
const path = { id: 'study-abroad', school: { type: 'international', countryId: 'china' } };
const income = 600_000_000;
const actualCost = getStudyAbroadLivingCost(path, 35, income);
const describedCost = 0;
// Chọn nước đi thẳng sang chọn chuyên ngành (không có màn kết quả riêng); chi phí hiện trên nhãn và ở bước chuyên ngành.
const admission = createStudyAbroadSchoolEvent({ id: "study-abroad" }, { intelligence: 100, money: 0 })
  .choices.find(choice => choice.careerPath.school.countryId === "china");
const china = studyAbroadCountries.find(country => country.id === "china");
const admissionText = `${admission.label}\n${createStudyAbroadMajorEvent(admission.careerPath, { intelligence: 100 }).choices[0].text}`;
for (const amount of [china.tuition, china.living]) assert.ok(admissionText.includes(`${amount / 1_000_000} triệu`), `chi phí ${amount} hiện trước khi xác nhận`);
assert.ok(!admissionText.includes("55%"));
assert.equal(actualCost, 0);
assert.equal(describedCost, actualCost);
assert.match(describeYearLivingCost(path, 35), /thuế, bảo hiểm và thuê nhà/);
assert.match(describeYearLivingCost(null, 35), /Không thu sinh hoạt phí/);
results.push({ id: "abroad-cost-copy", severity: "medium", confirmed: false, status: "fixed",
  description: "Mô tả sau tốt nghiệp khớp cơ chế mới: không thu sinh hoạt theo tỷ lệ, thuế và thuê nhà được tách riêng.",
  income, actualCost, describedCost });

const family = { age: 40, money: 100_000_000, children: [{ id: 'child', name: 'Con',
  initialAge: 6, joinedAtAge: 40, educationPlan: 'intensive', relationship: 50 }] };
const before = getPartnerRelationship(family.children[0]);
const budget = getFamilyBudget(family, 41);
collectFamilyBudget(family, 41);
assert.equal(family.money, 40_000_000);
assert.equal(family.children[0].relationship, 52);
assert.equal(getPartnerRelationship(family.children[0]), before + 2);
results.push({ id: 'child-relationship-field', severity: 'medium', confirmed: false, status: 'fixed',
  description: 'Gói học cho con ghi gắn kết vào child.bond, nhưng điều kiện người thân ở đoạn kết đọc child.relationship. Chi phí được thu nhưng hiệu ứng không được đoạn kết dùng.',
  annualCost: budget.amount, actualRelationship: family.children[0].relationship,
  endingRelationshipBefore: before, endingRelationshipAfter: getPartnerRelationship(family.children[0]) });

const data = new Map();
const storage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
for (let i = 0; i < 51; i++) {
  const state = createInitialState();
  Object.assign(state.player, { lifeId: `audit-${i}`, name: `Đời ${i}`, isAlive: false, age: 20,
    specialChainsSeen: i === 0 ? ['diamond-mine'] : [], specialChainsCompleted: i === 0 ? ['diamond-mine'] : [] });
  archiveLife(state, storage);
  if (i === 0) assert.ok(getArchiveDiscovery(readLifeArchive(storage)).completed.includes('diamond-mine'));
}
const discovery = readLifeDiscovery(storage);
assert.equal(readLifeArchive(storage).length, 50);
assert.ok(discovery.completed.includes('diamond-mine'));
results.push({ id: 'discovery-lost-at-51', severity: 'medium', confirmed: false, status: 'fixed',
  description: 'Bảng đã khám phá được tính từ 50 đời gần nhất. Khi đời cũ bị đẩy khỏi sổ, chuỗi, danh hiệu và ngành đã khám phá chỉ ở đời đó cũng biến mất.',
  archiveLength: 50, completedAfterEviction: discovery.completed });

const spouse = { id: 'p1', name: 'An', gender: 'female', relationship: 80, stats: { happiness: 80 } };
const parent = { ...createInitialState().player, age: 30, gender: 'male', partner: spouse,
  marriedAtAge: 25, nextChildProposalAge: 30, health: 80 };
assert.ok(createChildProposalEvent(parent, 30));
Object.assign(parent, getChildProposalUpdates(parent, spouse, 30, 'accept', () => 0.4));
assert.equal(createChildProposalEvent(parent, 34), null);
assert.deepEqual(createChildProposalEvent(parent, 35).choices.map(choice => choice.childDecision), ['birth', 'adopt', 'decline']);
Object.assign(parent, getChildProposalUpdates(parent, spouse, 35, 'adopt', () => 0.4));
assert.equal(parent.children.length, 2);
assert.ok(createChildProposalEvent(parent, 40));
Object.assign(parent, getChildProposalUpdates(parent, spouse, 40, 'decline'));
assert.equal(createChildProposalEvent(parent, 45), null);
Object.assign(parent, getBreakupUpdates(parent));
const nextSpouse = { ...spouse, id: 'p2', name: 'Bình' };
Object.assign(parent, getDatingUpdates(parent, nextSpouse, 40));
Object.assign(parent, getMarriageUpdates(parent, nextSpouse, 45, 'accept'));
assert.ok(createChildProposalEvent(parent, 50));
results.push({ id: 'children-every-five-years', severity: 'design-note', confirmed: true,
  description: 'Sau con đầu, cứ 5 năm kể từ đứa con gần nhất, bạn đời hỏi sinh thêm hoặc nhận nuôi thêm cho tới khi người chơi từ chối. Không có đề nghị sau 90 tuổi.' });

fs.writeFileSync('output/mechanics-edge-cases.json', JSON.stringify(results, null, 2));
for (const row of results) console.log(`${row.status === 'fixed' ? 'PASS regression' : 'DESIGN NOTE'}: ${row.id}`);
