import { maleNames, femaleNames } from '../core/character-data.js';
import { lifeRandom } from '../core/life-seed.js';
import { applyActivityGain, getActivitySlotsLeft, useActivitySlot, NO_SLOT_LABEL } from '../core/stat-budget.js';
import { isInPrison } from '../events/crime.js';
import { formatMoney } from '../core/money-format.js';
import { CHILD_PROPOSAL_MAX_AGE, getAnnualChildcareCost, getChildcareTotal } from './family.js';

export const ORPHANAGE_CHILD_COUNT = 3;
export const ORPHANAGE_MIN_CHILD_AGE = 5;
export const ORPHANAGE_MAX_CHILD_AGE = 10;
// Adoptive parents must be at least 20 years older than the child.
export const ADOPTION_AGE_GAP = 20;
export const ADOPTION_HAPPINESS = 4;

export const ORPHANAGE_BACKGROUNDS = [
  'Cha mẹ mất trong một tai nạn giao thông. Ông bà nội đã già yếu nên gửi bé vào đây.',
  'Bé được đặt trước cổng cô nhi viện khi mới vài tháng tuổi, trong chăn có mảnh giấy ghi ngày sinh.',
  'Mẹ một mình nuôi bé rồi lâm bệnh nặng. Trước khi mất, mẹ nhờ các cô bảo mẫu tìm cho bé một gia đình.',
  'Bé từng ở với một gia đình nhận nuôi tạm, rồi quay về đây khi gia đình ấy chuyển ra nước ngoài.',
  'Cha đi làm xa rồi mất liên lạc. Họ hàng không đủ điều kiện để nuôi nên đưa bé đến đây.',
  'Bé lớn lên ở cô nhi viện từ khi còn đỏ hỏn, chưa từng sống cùng gia đình nào.',
];

// Temperament decides how close the child feels on the first day at home.
export const ORPHANAGE_TEMPERAMENTS = [
  { id: 'clingy', label: 'Quấn người', bond: 80, note: 'Vừa gặp đã nắm tay khách không rời, hỏi khi nào được về nhà.' },
  { id: 'gentle', label: 'Hiền, chu đáo', bond: 70, note: 'Hay trông các em nhỏ hơn và nhường phần ăn cho bạn.' },
  { id: 'lively', label: 'Hiếu động', bond: 70, note: 'Chạy khắp sân, hỏi chuyện người lạ, ít khi chịu ngồi yên.' },
  { id: 'shy', label: 'Nhút nhát', bond: 55, note: 'Ít nói, đứng sau lưng cô bảo mẫu, cần thời gian mới tin người lớn.' },
  { id: 'wary', label: 'Dè chừng', bond: 45, note: 'Từng được hứa đón về rồi bị bỏ lỡ, nên giữ khoảng cách với người đến thăm.' },
];

export const ORPHANAGE_HOBBIES = [
  'thích vẽ bằng bút sáp', 'mê đá bóng ngoài sân', 'thích nghe đọc truyện trước giờ ngủ',
  'hay hát theo đài', 'thích lắp ráp đồ chơi', 'thích tưới cây trong vườn', 'thích gấp giấy',
];

const pick = (random, list) => list[Math.floor(random() * list.length)];

// The same three children stay all year, then a new group arrives on the next birthday.
export function getOrphanageChildren(player) {
  const random = lifeRandom(player, `orphanage|${player.age}`);
  const taken = new Set((player.children ?? []).map(child => child.name));
  const usedBackgrounds = new Set();
  return Array.from({ length: ORPHANAGE_CHILD_COUNT }, (_, index) => {
    const gender = random() < 0.5 ? 'male' : 'female';
    const names = (gender === 'female' ? femaleNames : maleNames).filter(name => !taken.has(name));
    const name = pick(random, names.length ? names : gender === 'female' ? femaleNames : maleNames);
    taken.add(name);
    const age = ORPHANAGE_MIN_CHILD_AGE + Math.floor(random() * (ORPHANAGE_MAX_CHILD_AGE - ORPHANAGE_MIN_CHILD_AGE + 1));
    let background = pick(random, ORPHANAGE_BACKGROUNDS);
    while (usedBackgrounds.has(background)) background = pick(random, ORPHANAGE_BACKGROUNDS);
    usedBackgrounds.add(background);
    const temperament = pick(random, ORPHANAGE_TEMPERAMENTS);
    return { id: `orphan-${player.age}-${index}`, name, gender, age, background,
      temperament: temperament.id, hobby: pick(random, ORPHANAGE_HOBBIES),
      firstYearCost: getAnnualChildcareCost(age), totalCost: getChildcareTotal(age) };
  });
}

export const getTemperament = id => ORPHANAGE_TEMPERAMENTS.find(entry => entry.id === id) ?? ORPHANAGE_TEMPERAMENTS[1];
export const hasAdoptedThisYear = player => player.orphanageAdoption?.age === player.age;

export function getAdoptionBlock(player, kid) {
  if (player.isAlive === false) return 'Cuộc đời đã kết thúc.';
  if (player.age > CHILD_PROPOSAL_MAX_AGE) return `Sau ${CHILD_PROPOSAL_MAX_AGE} tuổi không thể nhận con nuôi.`;
  if (isInPrison(player)) return 'Không thể làm thủ tục khi đang ở tù.';
  if (hasAdoptedThisYear(player)) return player.orphanageAdoption.id === kid.id ? 'Bé đã về nhà cùng bạn.' : 'Mỗi năm chỉ nhận nuôi một bé.';
  if (player.age < kid.age + ADOPTION_AGE_GAP) return `Cần lớn hơn bé ít nhất ${ADOPTION_AGE_GAP} tuổi (từ ${kid.age + ADOPTION_AGE_GAP} tuổi).`;
  if (!getActivitySlotsLeft(player)) return NO_SLOT_LABEL;
  if (!(player.money >= kid.firstYearCost)) return 'Chưa đủ tiền cho chi phí năm đầu.';
  return '';
}

export function adoptFromOrphanage(player, kidId) {
  const kid = getOrphanageChildren(player).find(entry => entry.id === kidId);
  if (!kid || getAdoptionBlock(player, kid) || !useActivitySlot(player)) return null;
  const partner = player.partner && player.marriedAtAge != null ? player.partner : null;
  const temperament = getTemperament(kid.temperament);
  const child = { id: `child-${kid.id}`, name: kid.name, gender: kid.gender, adopted: true,
    relationship: temperament.bond, initialAge: kid.age, joinedAtAge: player.age,
    coParent: partner ? { id: partner.id, name: partner.name } : null,
    // The first year is paid at the gate, like a child welcomed on a birthday.
    lastCarePaidAtAge: player.age, origin: 'orphanage', temperament: kid.temperament, hobby: kid.hobby };
  player.money -= kid.firstYearCost;
  player.children = [...(player.children ?? []), child];
  player.orphanageAdoption = { age: player.age, id: kid.id };
  if (partner) Object.assign(player, { childProposalCompleted: true, childProposalDeclines: 0, nextChildProposalAge: null });
  const happiness = applyActivityGain(player, 'happiness', ADOPTION_HAPPINESS);
  const text = `${partner ? `Tôi và ${partner.name}` : 'Tôi'} làm thủ tục ở cô nhi viện và đón ${kid.name}, ${kid.age} tuổi, về nhà.`;
  player.relationshipHistory = [...(player.relationshipHistory ?? []),
    { age: player.age, type: 'adopted-child', text, ...(partner ? { person: partner } : {}) }];
  const arrival = temperament.id === 'clingy' ? `${kid.name} ôm chặt chiếc ba lô nhỏ, cả đường về cứ hỏi đã gần tới nhà chưa.`
    : temperament.bond < 60 ? `${kid.name} còn rụt rè, im lặng suốt đường về và sẽ cần thời gian để quen nhà mới.`
      : `${kid.name} tò mò nhìn quanh căn nhà mới.`;
  const content = `🏡 ${text} ${arrival} Chi phí nuôi năm đầu: -${formatMoney(kid.firstYearCost)} · Gắn kết ${temperament.bond}%${happiness ? ` · Hạnh phúc +${happiness}` : ''}.`;
  return { child, content };
}
