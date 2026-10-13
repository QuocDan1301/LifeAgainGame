import { RETIREMENT_AGE } from './career-salary.js';
import { getJobHealthRule } from '../stats/health-rules.js';
import { applyEmergency } from '../stats/hospital.js';
import { formatMoney } from '../core/money-format.js';

export const streetJobs = [
  { id: 'noodle-seller', icon: '🍜', name: 'Bán hủ tiếu', asset: 'noodle-cart', assetName: 'xe hủ tiếu', income: 60_000_000, health: -6 },
  { id: 'motorbike-taxi', icon: '🛵', name: 'Chạy xe ôm', asset: 'motorbike', assetName: 'xe máy', income: 72_000_000, health: -8 },
];
export const isServing = (player, age = player.age) => Boolean(player.casualService && age < player.casualService.releaseAge);
const owns = (player, id) => (player.purchases ?? []).some(item => item.id === id);
export function getStreetJobBlocker(player, id) {
  const job = streetJobs.find(item => item.id === id);
  if (!job) return 'Không có nghề này.';
  if (player.isAlive === false) return 'Cuộc đời đã kết thúc.';
  if (player.age < 18) return 'Mở từ 18 tuổi.';
  if (player.age >= RETIREMENT_AGE) return 'Đã đến tuổi nghỉ hưu.';
  if (isServing(player)) return 'Đang thực hiện nghĩa vụ quân sự.';
  if (player.prison && player.prison.releaseAge > player.age) return 'Đang thụ án.';
  if (!owns(player, job.asset)) return `Cần sở hữu ${job.assetName} trong Mua sắm.`;
  if ((player.streetJobs ?? []).some(item => item.id === id)) return 'Đang làm nghề này.';
  const health = getJobHealthRule(player);
  return health.allowed ? '' : health.message ?? 'Sức khỏe chưa cho phép.';
}
export function startStreetJob(player, id) {
  if (getStreetJobBlocker(player, id)) return false;
  player.streetJobs = [...(player.streetJobs ?? []), { id, startedAtAge: player.age }];
  return true;
}
export function getStreetIncome(player, age) {
  if (age >= RETIREMENT_AGE || player.isAlive === false || isServing(player) ||
      (player.prison && player.prison.releaseAge > player.age) || player.restYear === age) return 0;
  return (player.streetJobs ?? []).reduce((sum, entry) => {
    const job = streetJobs.find(item => item.id === entry.id);
    return sum + (job && owns(player, job.asset) && entry.startedAtAge < age ? job.income : 0);
  }, 0);
}
export function collectStreetYear(player, age, random = Math.random) {
  if (player.streetPaidAge === age) return null;
  if (age >= RETIREMENT_AGE) {
    const had = (player.streetJobs ?? []).length;
    player.streetJobs = [];
    return had ? { amount: 0, content: '🌅 Tôi nghỉ bán hủ tiếu và chạy xe ôm khi đến tuổi nghỉ hưu.' } : null;
  }
  if (!getStreetIncome(player, age)) return null;
  player.streetPaidAge = age;
  const working = (player.streetJobs ?? []).filter(entry => {
    const job = streetJobs.find(item => item.id === entry.id);
    return job && owns(player, job.asset) && entry.startedAtAge < age;
  });
  const amount = getStreetIncome(player, age);
  const strain = working.reduce((sum, entry) => sum + streetJobs.find(item => item.id === entry.id).health, 0);
  player.money += amount;
  player.health = Math.max(0, player.health + strain);
  let content = working.map(entry => {
    const job = streetJobs.find(item => item.id === entry.id);
    return `${job.icon} Thu nhập ròng ${job.name.toLowerCase()}: +${formatMoney(job.income)} (đã trừ chi phí vận hành).`;
  }).join('\n') + `\nSức khỏe ${strain}.`;
  if (player.health === 0) content += `\n${applyEmergency(player, 'Mưu sinh quá sức khiến cơ thể kiệt sức.', age, random)}`;
  return { amount, content };
}

export function createCasualStartChoice(player, choice) {
  const male = player.gender === 'male';
  return { ...choice, title: male ? '🪖 Lên đường nhập ngũ' : '🧭 Tự tìm đường mưu sinh',
    text: male ? 'Tôi chọn không đi học tiếp. Tôi nhận lệnh nhập ngũ ngay ở tuổi 18, bắt đầu huấn luyện tại đơn vị được phân công. Hai năm sau tôi sẽ trở về và tự tìm đường mưu sinh.'
      : 'Tôi chọn không đi học tiếp. Tôi bắt đầu cuộc sống tự do, tự tìm việc và chịu trách nhiệm với lựa chọn của mình. Có thể mua xe hủ tiếu hoặc xe máy rồi nhận nghề trong Hoạt động → Làm thêm.',
    careerPath: { id: 'casual', field: 'Lông bông', school: null, status: male ? 'Đang thực hiện nghĩa vụ quân sự' : 'Không học tiếp · Tự tìm việc' },
    playerUpdates: { casualLife: true, casualService: male ? { enteredAge: 18, releaseAge: 20 } : null,
      streetJobs: [], sideJobs: [], job: null, careerLevel: 0, employmentStatus: 'unemployed', nextPromotionAge: null },
  };
}
export function createCasualServiceEvent(player, age) {
  if (!player.casualService || player.isAlive === false) return null;
  if (age >= player.casualService.releaseAge) return {
    id: 'casual-discharge', kind: 'casual-service', title: '🪖 Hoàn thành nghĩa vụ quân sự',
    text: 'Tôi hoàn thành hai năm nghĩa vụ và trở về nhà. Nhịp sống ngoài cổng đơn vị đã đổi khác; giờ tôi phải tự tìm đường mưu sinh.',
    choices: [{ label: '🧭 Trở về, bắt đầu cuộc sống tự do', text: 'Tôi cất bộ quân phục, bắt đầu tìm việc. Bán hủ tiếu cần xe hủ tiếu; chạy xe ôm cần xe máy. Cả hai nghề đều có trong Hoạt động → Làm thêm.',
      effects: { happiness: 5 }, playerUpdates: { casualService: null, careerPath: { ...player.careerPath, status: 'Không học tiếp · Tự tìm việc' } } }],
  };
  return { id: 'casual-training', kind: 'casual-service', title: '🪖 Một năm trong đơn vị',
    text: 'Tôi quen dần với tiếng kẻng sáng, những buổi huấn luyện và bữa cơm cùng đồng đội. Cuộc sống có kỷ luật khác hẳn những ngày lông bông.',
    choices: [
      { label: '😤 Chăm chỉ huấn luyện', text: 'Tôi rèn thể lực và học cách làm việc cùng đồng đội.', effects: { health: 4, intelligence: 2 } },
      { label: '🤝 Hỗ trợ đồng đội', text: 'Tôi giúp người bạn mới theo kịp buổi tập. Tình đồng đội làm tôi thấy ấm lòng.', effects: { happiness: 4, intelligence: 1 } },
      { label: '😔 Chỉ mong sớm về nhà', text: 'Tôi nhớ nhà nhưng vẫn hoàn thành nhiệm vụ được giao.', effects: { happiness: -2 } },
    ] };
}
