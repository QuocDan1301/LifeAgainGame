import { formatMoney } from '../core/money-format.js';
import { getPlayerAnnualSalary, RETIREMENT_AGE } from './career-salary.js';
import { getJobLossUpdates } from './job-loss.js';
import { isServing } from './street-work.js';
import { crimeRisk, isInPrison } from '../events/crime.js';
import { openMojiArt } from '../media/event-art.js';

// Fictional game rules; offers describe dilemmas, not methods of committing offenses.
export const WORK_TEMPTATIONS = [
  { id: 'expense', careers: ['accounting', 'finance', 'business'], title: 'Khoản thưởng ngoài sổ sách', crime: 'Gian lận tài chính',
    text: 'Trưởng nhóm muốn tôi xác nhận một khoản chi không có thật. Một phần tiền sẽ được chia cho cả nhóm. Đồng nghiệp nói họ đang trông vào khoản này để trả nợ.', harm: 'Tiền của công ty và người góp vốn bị chiếm dụng.', risk: 0.28, years: 3 },
  { id: 'patient', careers: ['medicine', 'psychology'], title: 'Hoa hồng từ nhà cung cấp', crime: 'Nhận hối lộ trong công việc',
    text: 'Nhà cung cấp đề nghị trả tiền riêng nếu tôi ưu tiên sản phẩm của họ dù chưa phù hợp với người bệnh. Họ hứa hỗ trợ thêm cho nhóm và nhắc rằng người khác đã nhận.', harm: 'Người bệnh có thể chịu chi phí cao và chất lượng chăm sóc kém.', risk: 0.35, years: 4 },
  { id: 'data', careers: ['programming', 'marketing'], title: 'Một lời đề nghị kín', crime: 'Bán trái phép dữ liệu khách hàng',
    text: 'Một đối tác muốn mua dữ liệu khách hàng mà tôi có quyền tiếp cận. Họ hứa trả ngay, còn quản lý ám chỉ hợp đồng này sẽ giúp bộ phận giữ được việc.', harm: 'Thông tin riêng tư của khách hàng sẽ bị sử dụng trái phép.', risk: 0.32, years: 3 },
  { id: 'safety', careers: ['architecture', 'mechanical'], title: 'Chữ ký trước ngày bàn giao', crime: 'Làm sai hồ sơ an toàn',
    text: 'Dự án đang trễ hạn. Quản lý muốn tôi ký chấp thuận dù hạng mục chưa đạt an toàn. Nếu bàn giao kịp, cả đội có thưởng; nếu tôi từ chối, những người khác sẽ phải chờ tiền.', harm: 'Người sử dụng có thể gặp nguy hiểm vì sai sót chưa được khắc phục.', risk: 0.38, years: 5 },
  { id: 'exam', careers: ['teaching'], title: 'Món quà trước kỳ thi', crime: 'Gian lận thi cử',
    text: 'Một phụ huynh đề nghị đưa tiền để tôi giúp con họ có lợi thế không công bằng trong kỳ thi. Họ gọi đó là quà cảm ơn và nói đứa trẻ cần cơ hội này để đổi đời.', harm: 'Những học sinh khác mất cơ hội được đánh giá công bằng.', risk: 0.25, years: 2 },
  { id: 'bribe', careers: ['law', 'military', 'tourism'], title: 'Phong bì nhờ bỏ qua', crime: 'Nhận hối lộ trong công việc',
    text: 'Một người quen nhờ tôi bỏ qua vi phạm thuộc trách nhiệm của mình và gửi một phong bì. Họ nói nếu bị xử lý, nhiều nhân viên của họ có thể mất sinh kế.', harm: 'Vi phạm vẫn tồn tại và người khác phải gánh hậu quả.', risk: 0.3, years: 3 },
  { id: 'endorsement', careers: ['acting', 'singing', 'tiktok', 'youtube', 'painting', 'fashion'], title: 'Hợp đồng có điều khoản khó nói', crime: 'Tiếp tay cho quảng cáo lừa đảo',
    text: 'Một nhãn hàng trả thù lao lớn nếu tôi quảng bá những cam kết mà tôi biết không có cơ sở. Người quản lý nhắc rằng ê-kíp đang cần hợp đồng này để có thu nhập.', harm: 'Người tin lời quảng cáo có thể mất tiền hoặc chịu tổn hại.', risk: 0.24, years: 3 },
  { id: 'match', careers: ['football', 'esports'], title: 'Tiền thưởng từ người lạ', crime: 'Dàn xếp kết quả thi đấu',
    text: 'Một người trung gian đưa ra khoản tiền lớn để tôi cố ý làm sai lệch kết quả trận đấu. Họ nói cơ hội kiếm tiền của vận động viên rất ngắn và tôi cần lo cho tương lai.', harm: 'Đồng đội, người hâm mộ và đối thủ bị phản bội.', risk: 0.4, years: 4 },
  { id: 'goods', careers: ['culinary', 'general', 'casual', 'study-abroad'], title: 'Lô hàng giá rẻ bất thường', crime: 'Tiếp tay tiêu thụ hàng phi pháp',
    text: 'Một đầu mối đề nghị chia lợi nhuận nếu tôi giúp đưa lô hàng có nguồn gốc phi pháp vào công việc. Họ nói giá rẻ sẽ giúp mọi người giữ được khách và có tiền trang trải.', harm: 'Khách hàng và người bị mất tài sản có thể phải chịu thiệt.', risk: 0.3, years: 3 },
];
const roundMoney = value => Math.round(value / 1000) * 1000;
const abroadStudent = player => player.careerPath?.id === 'study-abroad' && player.abroadProgress?.phase !== 'graduated' && !player.abroadDestinationChosenAtAge;
const art = openMojiArt('1F4BC', 'Lựa chọn khó khăn trong công việc');

function pressure(player) {
  if (player.money < 0) return `Ví của tôi đang âm ${formatMoney(-player.money)}. Khoản tiền này có thể giúp tôi thoát một phần nợ ngay lập tức.`;
  if ((player.relatives ?? []).some(member => member.alive !== false && !member.deceased && member.condition && member.condition !== 'healthy')) return 'Người thân đang có vấn đề sức khỏe; tôi lo về những khoản chi sắp tới.';
  if ((player.children ?? []).length) return 'Tôi còn phải lo tiền học và sinh hoạt cho con. Từ chối khoản tiền này không khiến hóa đơn biến mất.';
  if (player.jobWarning || player.layoffDue) return 'Công việc của tôi đang bấp bênh. Tôi sợ trở thành người bị loại khỏi nhóm.';
  return 'Tôi đã làm việc nhiều năm nhưng vẫn muốn có một khoản dự phòng và một cơ hội tiến lên.';
}

function conviction(player, age, offense, recovered = 0) {
  const years = offense.years + ((player.criminalRecord ?? []).length ? 1 : 0);
  const payment = offense.fine + recovered;
  return { ...getJobLossUpdates(player, age, 'fired'), money: player.money - payment,
    prison: { enteredAge: age, releaseAge: age + years, crime: offense.crime, years },
    criminalRecord: [...(player.criminalRecord ?? []), { crime: offense.crime, age, years }],
    sideJobs: [], streetJobs: [], crimeActionAge: age, lifePath: 'dark',
    crimeHeat: Math.min(30, (player.crimeHeat ?? 0) + 5), workInvestigation: null };
}

export function createWorkTemptationEvent(player, age, random = Math.random) {
  if (player.isAlive === false || age < 18 || age >= RETIREMENT_AGE || player.employmentStatus !== 'employed' ||
      player.crimeActionAge === age || isInPrison(player) || isServing(player, age) || abroadStudent(player) || player.workInvestigation ||
      age - (player.lastWorkTemptationAge ?? -100) < 3 || random() >= 0.22) return null;
  const eligible = WORK_TEMPTATIONS.filter(offer => offer.careers.includes(player.careerPath?.id ?? 'general'));
  const template = eligible[Math.floor(random() * eligible.length)] ?? WORK_TEMPTATIONS.at(-1);
  const salary = getPlayerAnnualSalary(player) || 96_000_000;
  const reward = roundMoney(salary * (0.5 + random() * 0.75));
  const offense = { ...template, reward, fine: roundMoney(reward * 0.75) };
  const risk = crimeRisk(player, offense);
  const laterRisk = Math.min(0.85, 0.25 + (player.crimeHeat ?? 0) * 0.01 + (player.criminalRecord?.length ?? 0) * 0.05);
  // All branches are saved with the offer, so reloading either screen cannot redraw consequences.
  const caught = random() < risk, investigated = random() < laterRisk, retaliation = random() < 0.35;
  const lastOffer = { lastWorkTemptationAge: age };
  const withheld = roundMoney(salary * 0.05);
  const canAdvance = (Number(player.careerLevel) || 1) < 3;
  const accepted = caught
    ? { title: '🚔 Khoản tiền chưa kịp nhận', text: `Việc làm sai bị phát hiện ngay. Tôi không nhận được tiền, mất việc và chịu án ${offense.years + (player.criminalRecord?.length ? 1 : 0)} năm tù. Phạt và bồi thường ${formatMoney(offense.fine)}; ví thiếu thì thành nợ.`,
      effects: { happiness: -12 }, playerUpdates: { ...conviction(player, age, offense), ...lastOffer } }
    : { title: '🌑 Có tiền, chưa có bình yên', text: `Tôi nhận ${formatMoney(reward)} và tạm thời chưa bị phát hiện. ${offense.harm} Tôi vẫn có thể bị điều tra lại trong hai năm tới; khoản tiền đã nhận có thể bị thu hồi.`,
      money: reward, effects: { happiness: -5 }, playerUpdates: { ...lastOffer, crimeActionAge: age, lifePath: 'dark', crimeHeat: Math.min(30, (player.crimeHeat ?? 0) + 5),
        workInvestigation: { dueAge: age + 2, caught: investigated, offense, receivedAtAge: age } } };
  return { id: `work-temptation-${template.id}-${age}`, kind: 'work-temptation', category: 'career', ...art,
    title: `🌑 ${template.title}`, text: `Trong công việc ${player.job ?? 'hiện tại'}, tôi gặp một lời đề nghị khó xử. ${template.text}\n\n${pressure(player)}\n\nKhoản tiền được hứa: ${formatMoney(reward)} (khoảng ${Math.round(reward / salary * 12)} tháng lương). ${template.harm}\nNguy cơ bị phát hiện ngay: ${Math.round(risk * 100)}%. Nếu tạm thoát, nguy cơ bị điều tra lại sau hai năm: ${Math.round(laterRisk * 100)}%. Nếu bị bắt: mất việc, án ${offense.years + (player.criminalRecord?.length ? 1 : 0)} năm, bồi thường ${formatMoney(offense.fine)}; khoản tiền đã nhận còn bị thu hồi. Các mức này là quy tắc của game.`,
    choices: [
      { label: `Nhận lời · Được hứa ${formatMoney(reward)}, chấp nhận rủi ro`, ...accepted },
      { label: `Từ chối, giữ việc · Bị cắt ${formatMoney(withheld)} phụ cấp${canAdvance ? ', hoãn nâng bậc ít nhất 2 năm' : ''}`, title: 'Một lời từ chối có giá',
        text: `Tôi từ chối tham gia và giữ công việc. Nhóm lạnh nhạt với tôi; khoản phụ cấp ${formatMoney(withheld)} của năm bị cắt${canAdvance ? ', cơ hội nâng bậc bị hoãn ít nhất hai năm' : ''}. Khoản bị cắt trừ vào thu nhập năm nay; thiếu tiền thì thành nợ. Những khó khăn tài chính vẫn còn, nhưng tôi không gây thêm tổn hại cho người khác.`,
        effects: { happiness: -4 }, playerUpdates: { ...lastOffer, money: player.money - withheld,
          ...(canAdvance ? { nextPromotionAge: Math.max(age + 2, (player.nextPromotionAge ?? age) + 2) } : {}) } },
      { label: 'Báo cáo sai phạm · 35% nguy cơ bị trả đũa, mất việc',
        title: retaliation ? 'Lên tiếng rồi phải rời đi' : 'Sai phạm được ngăn lại',
        text: retaliation ? 'Tôi báo cáo sai phạm. Nhóm quay lưng và công việc của tôi bị chấm dứt. Tôi không nhận khoản tiền phi pháp, nhưng phải tìm việc mới để trang trải.' : 'Báo cáo được tiếp nhận và sai phạm bị ngăn lại. Tôi giữ được việc nhưng quan hệ với nhóm không còn như trước. Tôi không được nhận khoản tiền hứa hẹn.',
        effects: { happiness: retaliation ? -8 : -2 }, playerUpdates: { ...lastOffer, ...(retaliation ? getJobLossUpdates(player, age, 'fired') : {}) } },
      { label: 'Rời công việc · Mất nguồn lương, không tham gia sai phạm', title: 'Rời nơi không còn tin tưởng',
        text: 'Tôi chủ động nghỉ việc để thoát khỏi áp lực. Không có tiền thưởng hay trợ cấp nghỉ việc; tôi cần tìm một nguồn thu mới. Tôi giữ lại kinh nghiệm nghề nghiệp.',
        effects: { happiness: -2 }, playerUpdates: { ...getJobLossUpdates(player, age, 'quit'), ...lastOffer } },
    ] };
}

export function createWorkInvestigationEvent(player, age) {
  const investigation = player.workInvestigation;
  if (!investigation || age < investigation.dueAge || player.isAlive === false || isInPrison(player) || isServing(player, age)) return null;
  const offense = investigation.offense;
  const caught = investigation.caught;
  return { id: `work-investigation-${investigation.receivedAtAge}`, kind: 'work-investigation', category: 'career', ...art,
    title: caught ? '🚔 Chuyện cũ bị điều tra lại' : 'Một khoản tiền vẫn khó quên',
    text: caught ? `Sai phạm ${offense.crime.toLowerCase()} khi tôi ${investigation.receivedAtAge} tuổi đã bị phát hiện. Đổi việc hay tiêu hết tiền không xóa được trách nhiệm.` : 'Hai năm trôi qua, tôi không bị truy cứu trong vụ việc cũ. Những người chịu thiệt vẫn tồn tại; khoản tiền đó không biến việc làm sai thành đúng.',
    choices: [{ label: caught ? 'Chịu trách nhiệm về lựa chọn cũ' : 'Bước tiếp',
      title: caught ? 'Mất nhiều hơn khoản tiền đã nhận' : 'Khép lại vụ việc cũ',
      text: caught ? `Tôi bị thu hồi ${formatMoney(offense.reward)}, bồi thường thêm ${formatMoney(offense.fine)}, mất việc và chịu án ${offense.years + (player.criminalRecord?.length ? 1 : 0)} năm tù. Tiền thiếu được ghi thành nợ.` : 'Tôi chưa bị bắt trong vụ việc này. Tiền án, nếu có, và mức rủi ro tích lũy không bị xóa.',
      effects: { happiness: caught ? -12 : -2 }, playerUpdates: caught ? conviction(player, age, offense, offense.reward) : { workInvestigation: null } }],
  };
}
