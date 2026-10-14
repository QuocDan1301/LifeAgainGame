import { getRelativeAge } from './family-members.js';
import { formatMoney } from '../core/money-format.js';

export const EDUCATION_PLANS = {
  basic: { label: 'Học cơ bản', annual: 0, bond: 0 },
  supported: { label: 'Học bổ trợ', annual: 20_000_000, bond: 1 },
  intensive: { label: 'Học chuyên sâu', annual: 60_000_000, bond: 2 },
};
export const PARENT_PLANS = {
  none: { label: 'Tự thu xếp, chưa gửi thêm', annual: 0, bond: 0 },
  support: { label: 'Góp chi phí sinh hoạt', annual: 12_000_000, bond: 1 },
  // Tính như nhờ người chăm sóc (careBy 'helper') cho năm kế tiếp.
  care: { label: 'Hỗ trợ chăm sóc thường xuyên', annual: 36_000_000, bond: 3, care: true },
};
// Con 6–22 tuổi không có gói học thêm hay hỗ trợ đại học: gắn kết giảm mỗi năm.
// Đủ để con chỉ học cơ bản suốt 6–22 tuổi rơi dưới mốc 60 của chuyện tuổi già.
export const CHILD_NEGLECT_LOSS = 2;
export const childAgeAt = (child, age) => child.initialAge + Math.max(0, age - child.joinedAtAge);
export const eligibleParent = (parent, age) => ['father', 'mother'].includes(parent.id) && parent.alive === true &&
  (getRelativeAge(parent, age) >= 65 || ['weak', 'severe'].includes(parent.condition));

// Explicit, reversible annual commitments. Old saves opt into no additional costs.
export function getFamilyBudget(player, age) {
  const charges = [];
  if (age < 18 || player.isAlive === false || player.familyBudgetPaidAge >= age) return { amount: 0, charges };
  for (const child of player.children ?? []) {
    const years = childAgeAt(child, age);
    const plan = EDUCATION_PLANS[child.educationPlan] ?? EDUCATION_PLANS.basic;
    if (years >= 6 && years <= 18 && plan.annual) charges.push({ kind: 'child', id: child.id, name: child.name, amount: plan.annual, bond: plan.bond, label: plan.label });
    if (years >= 19 && years <= 22 && child.collegeSupport) charges.push({ kind: 'child', id: child.id, name: child.name, amount: 20_000_000, bond: 1, label: 'Hỗ trợ đại học' });
  }
  for (const parent of player.relatives ?? []) {
    const plan = PARENT_PLANS[parent.supportPlan] ?? PARENT_PLANS.none;
    if (eligibleParent(parent, age) && plan.annual) charges.push({ kind: 'parent', id: parent.id, name: parent.name, amount: plan.annual, bond: plan.bond, label: plan.label, care: plan.care === true });
  }
  return { amount: charges.reduce((sum, item) => sum + item.amount, 0), charges };
}

export function collectFamilyBudget(player, age, budget = getFamilyBudget(player, age)) {
  if (player.familyBudgetPaidAge >= age || player.isAlive === false) return null;
  player.familyBudgetPaidAge = age;
  player.money -= budget.amount;
  const paidCharges = budget.charges.map(charge => {
    const items = charge.kind === 'child' ? player.children : player.relatives;
    const person = items?.find(item => item.id === charge.id);
    let gained = 0;
    const applied = Boolean(person && (charge.kind === 'child' || person.alive));
    if (applied) {
      const field = charge.kind === 'child' ? 'relationship' : 'bond';
      // Older education plans wrote child.bond; preserve it if no relationship exists.
      const old = Number.isFinite(person[field]) ? person[field]
        : charge.kind === 'child' && Number.isFinite(person.bond) ? person.bond
        : charge.kind === 'child' ? 80 : 70;
      const before = Math.max(0, Math.min(100, old));
      person[field] = Math.min(100, before + charge.bond);
      gained = person[field] - before;
      // Người chăm sóc được trả tiền: giảm nguy cơ bệnh nặng/qua đời ở sinh nhật sau như hành động "Nhờ người hỗ trợ".
      // Không hạ mức khi năm nay đã tự tay chăm sóc.
      if (charge.care && !(person.caredAt === age && person.careBy === 'self')) Object.assign(person, { caredAt: age, careBy: 'helper' });
    }
    return { ...charge, bond: gained, applied, cared: charge.care && applied };
  });
  const lines = paidCharges.map(c => `${c.label} cho ${c.name}: -${formatMoney(c.amount)}` +
    `${c.applied ? `; ${c.bond ? `gắn kết +${c.bond}` : 'gắn kết đã tối đa'}` : ''}${c.cared ? '; có người chăm sóc hằng ngày năm tới' : ''}.`);
  for (const child of player.children ?? []) {
    const years = childAgeAt(child, age);
    if (years < 6 || years > 22 || child.isAlive === false ||
        budget.charges.some(charge => charge.kind === 'child' && charge.id === child.id)) continue;
    const before = Math.max(0, Math.min(100, Number.isFinite(child.relationship) ? child.relationship
      : Number.isFinite(child.bond) ? child.bond : 80));
    child.relationship = Math.max(0, before - CHILD_NEGLECT_LOSS);
    if (before > child.relationship) lines.push(`Ít đồng hành việc học của ${child.name}: gắn kết -${before - child.relationship}.`);
  }
  return lines.length ? { amount: budget.amount, content: lines.join('\n') } : null;
}

export function renderFamilyBudgetControls(container, player, onChange) {
  const group = (title, value, options, change) => {
    const label = document.createElement('label');
    label.className = 'side-job-intro';
    label.textContent = title + ' ';
    const select = document.createElement('select');
    for (const [id, text] of options) {
      const option = document.createElement('option');
      option.value = id; option.textContent = text; select.append(option);
    }
    select.value = value;
    select.disabled = player.isAlive === false || player.age < 18;
    select.addEventListener('change', () => { change(select.value); onChange(); });
    label.append(select); container.append(label);
  };
  for (const child of player.children ?? []) {
    const age = childAgeAt(child, player.age + 1);
    if (age >= 6 && age <= 18) group(`Việc học của ${child.name}:`, child.educationPlan ?? 'basic',
      Object.entries(EDUCATION_PLANS).map(([id, p]) => [id, `${p.label}: thêm ${formatMoney(p.annual)}/năm${p.bond ? `, gắn kết +${p.bond}` : `, gắn kết -${CHILD_NEGLECT_LOSS}`}`]), value => { child.educationPlan = value; });
    if (age <= 22) group(`Đại học của ${child.name} (19–22 tuổi):`, child.collegeSupport ? 'yes' : 'no',
      [['no', `Chưa hỗ trợ thêm, gắn kết -${CHILD_NEGLECT_LOSS}/năm`], ['yes', '80 triệu chia 4 năm (20 triệu/năm), gắn kết +1/năm']], value => { child.collegeSupport = value === 'yes'; });
  }
  for (const parent of player.relatives ?? []) {
    if (!eligibleParent(parent, player.age + 1)) continue;
    group(`Hỗ trợ ${parent.name}:`, parent.supportPlan ?? 'none', Object.entries(PARENT_PLANS).map(([id, p]) =>
      [id, `${p.label}: ${formatMoney(p.annual)}/năm${p.bond ? `, gắn kết +${p.bond}` : ''}${p.care ? ', tính như có người chăm sóc' : ''}`]), value => { parent.supportPlan = value; });
  }
}
