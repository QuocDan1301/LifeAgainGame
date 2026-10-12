import { formatMoney } from './money-format.js';
import { openMojiArt } from './event-art.js';

export const studyAbroadMajors = [
  { id: 'business', name: 'Kinh doanh', domesticCareer: 'business', ranks: ['Nhân viên kinh doanh', 'Trưởng nhóm kinh doanh', 'Giám đốc kinh doanh'] },
  { id: 'technology', name: 'Công nghệ thông tin', domesticCareer: 'programming', ranks: ['Lập trình viên', 'Kỹ sư phần mềm chính', 'Giám đốc kỹ thuật'] },
  { id: 'design', name: 'Thiết kế', domesticCareer: 'fashion', ranks: ['Nhà thiết kế tập sự', 'Trưởng nhóm thiết kế', 'Giám đốc sáng tạo'] },
  { id: 'engineering', name: 'Kỹ thuật', domesticCareer: 'mechanical', ranks: ['Kỹ sư tập sự', 'Kỹ sư chính', 'Giám đốc kỹ thuật'] },
];

// Fictional four-year programs and VND costs for gameplay, not admission advice.
// minIntellect: Trí tuệ tối thiểu để được nhận. Nước trả lương cao xét tuyển gắt hơn, để nước đắt nhất
// không mặc nhiên là lựa chọn tốt nhất (nợ học phí cũng bị tính lãi sau khi ra trường).
export const studyAbroadCountries = [
  ['japan', 'Nhật Bản', '🇯🇵', 120, 90, 216, 55],
  ['korea', 'Hàn Quốc', '🇰🇷', 100, 80, 192, 50],
  ['china', 'Trung Quốc', '🇨🇳', 70, 60, 156, 0],
  ['usa', 'Mỹ', '🇺🇸', 240, 180, 300, 75],
  ['australia', 'Úc', '🇦🇺', 200, 150, 264, 65],
  ['germany', 'Đức', '🇩🇪', 60, 120, 228, 60],
  ['canada', 'Canada', '🇨🇦', 180, 140, 240, 65],
].map(([id, name, icon, tuition, living, salary, minIntellect]) => ({ id, name, icon, minIntellect,
  tuition: tuition * 1_000_000, living: living * 1_000_000,
  salaries: [salary, salary * 2, salary * 4].map(amount => amount * 1_000_000) }));

export function getStudyAbroadCountry(path) {
  return path?.id === 'study-abroad' && path.school?.type === 'international'
    ? studyAbroadCountries.find(country => country.id === path.school.countryId) ?? null : null;
}

export function getStudyAbroadLivingCost(path, age, income = 0, mode = 'normal') {
  const country = getStudyAbroadCountry(path);
  if (!country || age < 18) return 0;
  if (age <= 21) return country.living;
  return Math.max(Math.round(country.living * (mode === 'frugal' ? 0.8 : 1)),
    Math.round(Math.max(0, income) * (mode === 'frugal' ? 0.2 : 0.3) / 1000) * 1000);
}

export const ABROAD_GRADUATION = { language: 50, academic: 50 };
export function canGraduateAbroad(player) {
  // Old saves without score history keep their completed education.
  const progress = player.abroadProgress;
  return !progress || (Number.isFinite(progress.language) && Number.isFinite(progress.academic) &&
    progress.language >= ABROAD_GRADUATION.language && progress.academic >= ABROAD_GRADUATION.academic);
}
export function getStudyAbroadTuition(player, age) {
  const country = getStudyAbroadCountry(player.careerPath);
  if (!country) return 0;
  if (age >= 18 && age <= 21) return country.tuition;
  return age >= 22 && ['studying', 'remediation'].includes(player.abroadProgress?.phase) &&
    (player.abroadProgress.extendedStudyUntilAge === age || !canGraduateAbroad(player))
    ? country.tuition / 2 : 0;
}
export function hasInternationalDegreeForCareer(player, careerId = player.careerPath?.id) {
  const degree = player.overseasEducation;
  return Number.isInteger(degree?.graduatedAtAge) && degree.graduatedAtAge >= 22 &&
    studyAbroadCountries.some(c => c.id === degree.countryId) &&
    studyAbroadMajors.some(m => m.id === degree.majorId && m.domesticCareer === careerId);
}

export function getOverseasEmploymentContext(path) {
  const country = getStudyAbroadCountry(path);
  if (!country) return null;
  return { place: `doanh nghiệp tại ${country.name}`,
    interviewer: `quản lý tuyển dụng tại ${country.name}`,
    leader: `giám đốc tại ${country.name}`,
    round: `phỏng vấn xin việc tại ${country.name}`,
    apply: `nộp hồ sơ xin việc tại ${country.name}, nơi bạn đã du học` };
}

export function getOverseasJobBlocker(player, age = player.age) {
  if (player.careerPath?.id !== 'study-abroad') return '';
  if (!getStudyAbroadCountry(player.careerPath)) return 'Hồ sơ du học chưa có quốc gia hợp lệ; chưa thể xin việc ở nước ngoài.';
  if (age < 22) return 'Bạn cần tốt nghiệp ở tuổi 22 trước khi xin việc tại nước du học.';
  if (age >= 62 || player.employmentStatus === 'retired') return 'Bạn đã đến tuổi nghỉ hưu.';
  if (['studying', 'remediation'].includes(player.abroadProgress?.phase)) return 'Bạn cần hoàn tất lựa chọn tốt nghiệp: ở lại hoặc về nước.';
  return '';
}

export function getStudyAbroadMajor(path) {
  return studyAbroadMajors.find(m => m.id === path?.school?.majorId) ?? studyAbroadMajors[0];
}

export function getOverseasProfile(path) {
  const country = getStudyAbroadCountry(path);
  if (!country) return null;
  return { ...studyAbroadProfile, ranks: getStudyAbroadMajor(path).ranks.map(rank => `🌐 ${rank} tại ${country.name}`) };
}

export function createStudyAbroadMajorEvent(path, player) {
  const country = getStudyAbroadCountry(path);
  if (!country) return null;
  return { kind: 'study-abroad-major', ...openMojiArt('1F393', 'Chọn chuyên ngành du học'),
    title: `Chọn chuyên ngành tại ${country.name}`, text: `Bạn sẽ học gì tại ${country.name}? Chuyên ngành quyết định công việc sau tốt nghiệp. Học phí và sinh hoạt phí giữ nguyên theo nước đã chọn.`,
    choices: studyAbroadMajors.map(major => ({
      label: major.name, title: `Bắt đầu học ${major.name} tại ${country.name}`,
      text: `${path.status}. Chuyên ngành: ${major.name}.\nHọc phí ${formatMoney(country.tuition)}/năm; sinh hoạt ${formatMoney(country.living)}/năm từ tuổi 18–21. ${player.intelligence >= 80 ? 'Năm đầu được giảm 50% học phí.' : 'Học bổng giảm 50% học phí khi Trí tuệ đạt 80.'}\nTổng chi phí năm đầu: ${formatMoney(country.living + country.tuition * (player.intelligence >= 80 ? 0.5 : 1))}.\nBạn bắt đầu với Ngoại ngữ 30, Học tập 50 và Hòa nhập 30 trên thang 100. Tốt nghiệp cần Ngoại ngữ và Học tập từ 50; thiếu điểm phải học bổ sung. Hòa nhập giúp phỏng vấn và thăng tiến.`,
      careerPath: { ...path, status: `Học ${major.name} tại ${country.name}`,
        school: { ...path.school, majorId: major.id, program: major.name } },
      playerUpdates: { abroadProgress: { phase: 'studying', language: 30, academic: 50, integration: 30, countryId: country.id, majorId: major.id } },
      confirmText: 'Xác nhận chuyên ngành và chi phí',
    })) };
}

const clamp = n => Math.max(0, Math.min(100, n));
function progressChoice(player, label, text, gains, effects = {}, money = 0) {
  const old = player.abroadProgress ?? { phase: 'studying', language: 30, academic: 50, integration: 30 };
  const next = { ...old };
  for (const key of ['language', 'academic', 'integration']) next[key] = clamp((old[key] ?? 30) + (gains[key] ?? 0));
  return { label, title: 'Một bước trưởng thành ở nước ngoài', text: `${text}\nNgoại ngữ ${next.language}/100 · Học tập ${next.academic}/100 · Hòa nhập ${next.integration}/100.`, effects, money,
    playerUpdates: { abroadProgress: next }, confirmText: 'Tiếp tục' };
}

export function createStudyAbroadDramaStep(player, age, step = 1, replies = []) {
  if (step < 1 || step > 3) return null;
  const lines = [
    [{ speaker: 'Bạn cùng phòng', text: 'Cậu lấy bài của tôi đưa vào báo cáo mà không ghi tên à?' }, { speaker: 'Tôi', text: 'Tôi tưởng đó là tài liệu chung của nhóm…' }],
    [{ speaker: 'Bạn cùng phòng', text: replies[0] === 'listen' ? 'Tôi cần cậu sửa phần ghi nguồn, trước buổi báo cáo.' : 'Đừng đổ lỗi. Lịch sử chỉnh sửa vẫn còn đây.' }],
    [{ speaker: 'Giảng viên', text: 'Hai em muốn giải quyết việc này thế nào? Tôi cần một báo cáo trung thực.' }],
  ];
  const event = { id: `abroad-drama-${step}`, kind: 'study-abroad-drama', specialStep: step, abroadReplies: replies,
    ...openMojiArt('1F4AC', 'Đối đáp trong nhóm du học'), title: `Bài báo cáo và một tình bạn (${step}/3)`,
    text: 'Một hiểu nhầm về ghi nguồn khiến nhóm đứng trước nguy cơ tan rã.', dialogueLines: lines[step - 1] };
  if (step < 3) event.choices = [
    { label: step === 1 ? 'Nghe bạn nói hết' : 'Đề nghị sửa và ghi đủ nguồn', abroadReply: 'listen', nextStep: step + 1 },
    { label: step === 1 ? 'Bảo bạn đừng làm quá' : 'Cho rằng bạn đang phá nhóm', abroadReply: 'blame', nextStep: step + 1 },
  ];
  else event.choices = [
    progressChoice(player, 'Nhận trách nhiệm và sửa báo cáo', 'Tôi giải thích hiểu nhầm, bổ sung nguồn và ghi rõ đóng góp. Nhóm được nộp bản sửa; chúng tôi cần thời gian để tin nhau lại.', { academic: 10, integration: replies.every(r => r === 'listen') ? 20 : 5, language: 10 }, { happiness: 1 }),
    progressChoice(player, 'Tiếp tục phủ nhận', 'Tôi không chịu sửa. Giảng viên giảm điểm, bạn cùng phòng rời nhóm. Sau buổi báo cáo, tôi phải tự làm phần còn lại.', { academic: -15, integration: -10 }, { happiness: -5 }),
  ];
  return event;
}

export function createStudyAbroadYearEvent(player, age) {
  const country = getStudyAbroadCountry(player.careerPath);
  if (!country || player.isAlive === false) return null;
  const progress = player.abroadProgress;
  if (age === 20) return createStudyAbroadDramaStep(player, age);
  if (age === 19 || age === 21) return {
    id: `abroad-year-${age}`, kind: 'study-abroad-year', ...openMojiArt('1F30D', 'Đời sống du học'),
    title: age === 19 ? `Năm đầu tự lập tại ${country.name}` : `Chuẩn bị tốt nghiệp tại ${country.name}`,
    text: `Ngoại ngữ ${progress?.language ?? 30}/100 · Học tập ${progress?.academic ?? 50}/100 · Hòa nhập ${progress?.integration ?? 30}/100.\n${age === 19 ? 'Giữa bài học, tiền sinh hoạt và những người bạn mới, tôi phải chọn ưu tiên.' : 'Hồ sơ thực tập, bài tốt nghiệp và kế hoạch sau khi ra trường đang chờ tôi.'}`,
    choices: [
      progressChoice(player, 'Tập trung ngoại ngữ và học tập', 'Tôi luyện nói cùng bạn học rồi ôn bài. Những cuộc trò chuyện không còn đáng sợ như trước.', { language: 25, academic: 20, integration: 5 }, { intelligence: 2 }),
      progressChoice(player, 'Làm thêm ngoài giờ (+24 triệu)', 'Tôi làm thêm ngoài giờ học. Thu nhập giúp trả chi phí, nhưng bài vở chậm đi và tôi phải nghỉ ngơi nhiều hơn.', { language: 15, academic: -5, integration: 10 }, { health: -3 }, 24e6),
      progressChoice(player, 'Tham gia nhóm sinh viên quốc tế', 'Tôi làm quen với những người cũng đang học xa nhà. Chúng tôi chia sẻ bài tập và gọi về gia đình vào cuối tuần.', { language: 20, academic: 5, integration: 25 }, { happiness: 3 }),
    ],
  };
  if (age >= 22 && progress?.phase !== 'graduated' && player.employmentStatus !== 'employed' && !player.abroadDestinationChosenAtAge) {
    if (!canGraduateAbroad(player)) {
      const tuition = country.tuition * ((player.intelligence ?? 0) >= 80 ? 0.25 : 0.5);
      const choice = (label, gains, effects) => {
        const result = progressChoice(player, label, 'Tôi dành thêm một năm củng cố kiến thức và ngoại ngữ. Nhà trường sẽ đánh giá lại vào năm sau.', gains, effects);
        result.playerUpdates.abroadProgress = { ...result.playerUpdates.abroadProgress,
          phase: 'remediation', extendedStudyUntilAge: age };
        return result;
      };
      return { id: 'abroad-remediation', kind: 'study-abroad-year',
        ...openMojiArt('1F4DA', 'Học bổ sung trước tốt nghiệp'),
        title: 'Chưa đủ điều kiện tốt nghiệp',
        text: `Cần Ngoại ngữ và Học tập từ 50/100. Hiện có Ngoại ngữ ${progress?.language ?? 0}, Học tập ${progress?.academic ?? 0}.\nMột năm bổ sung: học phí ${formatMoney(tuition)} (50% học phí gốc, học bổng nếu đủ điều kiện), sinh hoạt ${formatMoney(country.living)}. Thiếu tiền thành nợ trong ví; phí được trừ khi xác nhận, không cấp bằng ngay.`,
        choices: [
          choice('Tập trung ôn và luyện nói', { language: 25, academic: 25, integration: 5 }, { health: -2 }),
          choice('Học nhóm với sinh viên bản địa', { language: 20, academic: 20, integration: 25 }, { happiness: 2 }),
        ] };
    }
    const major = getStudyAbroadMajor(player.careerPath);
    const graduated = { ...progress, phase: 'graduated', graduatedAtAge: age };
    const common = { abroadProgress: graduated, abroadDestinationChosenAtAge: age,
      overseasEducation: { ...player.careerPath.school, graduatedAtAge: age } };
    return { id: 'abroad-graduation', kind: 'study-abroad-graduation', ...openMojiArt('1F393', 'Tốt nghiệp du học'),
      title: `Tốt nghiệp ${major.name} tại ${country.name}`,
      text: `Tấm bằng đã nằm trong tay. Tôi sẽ ở lại ${country.name} tìm việc hay mang những điều học được về Việt Nam? Học phí đã kết thúc; xin việc vẫn cần vượt qua phỏng vấn.`,
      choices: [
        { label: `Ở lại ${country.name} xin việc`, title: 'Bắt đầu hành trình làm việc ở nước ngoài', text: `Bạn ở lại ${country.name}. Lương ba bậc nghề: ${country.salaries.map(formatMoney).join(' / ')}/năm. Sinh hoạt tối thiểu ${formatMoney(country.living)}/năm hoặc 30% thu nhập thường xuyên nếu cao hơn, bắt đầu từ năm này. Vào Hoạt động → Xin việc để ứng tuyển ngành ${major.name}; nếu trượt có thể thử lại năm sau. Ngoại ngữ và kết quả học tập tốt giúp bạn chuẩn bị hồ sơ.`,
          playerUpdates: { ...common, abroadDestination: 'stay' }, employmentStatus: 'unemployed', job: 'Thất nghiệp', careerLevel: 0 },
        { label: 'Về Việt Nam làm việc', title: 'Trở về với một hành trang mới', text: `Bạn về Việt Nam với bằng ${major.name} từ ${country.name}. Vào Hoạt động → Xin việc để nộp hồ sơ trong nước.`,
          careerPath: { id: major.domesticCareer, field: major.name, school: { ...player.careerPath.school }, status: `Tốt nghiệp ${major.name}`, switchedFrom: 'study-abroad' },
          playerUpdates: { ...common, abroadDestination: 'return', workCountryId: null, workCountryName: null }, employmentStatus: 'unemployed', job: 'Thất nghiệp', careerLevel: 0 },
      ] };
  }
  return null;
}

export function createStudyAbroadSchoolEvent(path, player) {
  const scholarship = (player.intelligence ?? 0) >= 80;
  return {
    kind: 'study-abroad-country',
    title: '✈️ Chọn quốc gia du học',
    text: `Bốn năm học từ tuổi 18–21, tốt nghiệp ở tuổi 22. Sau tốt nghiệp, bạn chọn ở lại nước du học xin việc hoặc về Việt Nam làm việc theo chuyên ngành đã học. Tốt nghiệp cần Ngoại ngữ và Học tập từ 50/100. Chưa đủ điểm thì học bổ sung với 50% học phí gốc mỗi năm.\nVí hiện có: ${formatMoney(player.money ?? 0)}. Học phí và sinh hoạt phí được trừ mỗi năm; thiếu tiền sẽ thành nợ trong ví âm, thu nhập sau này trả dần. Từ 23 tuổi, nợ còn lại bị tính lãi mỗi năm. Trí tuệ từ 80 mỗi năm được giảm 50% học phí; sinh hoạt phí không giảm. Mỗi nước yêu cầu một mức Trí tuệ tối thiểu để xét tuyển. Các mức phí là quy ước trong game.`,
    choices: studyAbroadCountries.map(country => {
      const tuition = scholarship ? country.tuition / 2 : country.tuition;
      return {
        label: `${country.icon} ${country.name} · Học phí ${formatMoney(country.tuition)} + sinh hoạt ${formatMoney(country.living)}/năm${country.minIntellect ? ` · Trí tuệ từ ${country.minIntellect}` : ''}`,
        minIntelligence: country.minIntellect,
        title: `✈️ Lên đường đến ${country.name}`,
        text: `Bạn chọn du học tại ${country.name}. Chi phí năm đầu: học phí ${formatMoney(tuition)}${scholarship ? ' (đã giảm học bổng 50%)' : ''}, sinh hoạt ${formatMoney(country.living)}; tổng ${formatMoney(tuition + country.living)}.\nBốn năm theo giá gốc: ${formatMoney(4 * (country.tuition + country.living))}. Học bổng được xét lại mỗi năm. Bạn sẽ học ngoại ngữ, làm dự án và chuẩn bị hồ sơ xin việc tại ${country.name} sau tốt nghiệp. Lương ba bậc tại đây: ${country.salaries.map(formatMoney).join(' / ')}/năm; sinh hoạt sau học tối thiểu ${formatMoney(country.living)}/năm hoặc 30% thu nhập thường xuyên nếu cao hơn.`,
        careerPath: { ...path, school: { id: `abroad-${country.id}`, type: 'international',
          countryId: country.id, countryName: country.name,
          name: `Chương trình cử nhân quốc tế tại ${country.name}`,
          program: 'Kinh doanh và quản lý dự án quốc tế' }, status: `Du học tại ${country.name}` },
        confirmText: 'Xác nhận chi phí và nhập học',
      };
    }),
  };
}

export const studyAbroadProfile = {
  ranks: ['🌐 Điều phối viên quốc tế', '🌐 Quản lý dự án quốc tế', '🌐 Giám đốc dự án quốc tế'],
  achievement: 'career-study-abroad',
  strength: 'ngoại ngữ, giao tiếp đa văn hóa và quản lý dự án có trách nhiệm',
};

export const studyAbroadMilestone = {
  field: 'Du học', icon: '1F30D', mentor: 'cô An, cố vấn chương trình quốc tế',
  spark: { title: '🌍 Một cánh cửa ra thế giới', reward: 0,
    steps: [
      ['Buổi giao lưu quốc tế ở trường khiến tôi nghĩ đến chuyện học xa nhà.', 'Tìm hiểu chương trình và ngoại ngữ.', 'Xa quá, tôi chưa muốn thử.'],
      ['Cô An hỏi tôi sẽ xoay xở học phí và sinh hoạt bằng cách nào.', 'Lập ngân sách, tìm hiểu học bổng.', 'Đến nơi rồi tính, chắc có tiền.'],
      ['Nhóm giao lưu bất đồng vì mỗi người hiểu đề bài một kiểu.', 'Hỏi lại, thống nhất nhiệm vụ chung.', 'Cứ làm theo ý tôi là được.'],
    ], success: 'Cô An ghi nhận sự chuẩn bị và cách phối hợp của tôi. Tôi có thêm tự tin để theo đuổi du học.',
    failure: 'Tôi nhận ra mình cần rèn ngoại ngữ và chuẩn bị kỹ hơn trước khi học xa nhà.' },
  promotion: { title: '🌐 Dự án vượt biên giới', steps: [
    ['Người cố vấn năm ấy', 'Cô An giới thiệu tôi vào vòng đánh giá quản lý một dự án quốc tế.', 'Chuẩn bị hồ sơ và kế hoạch.', 'Có người quen, không cần chuẩn bị.'],
    ['Hai múi giờ', 'Hai nhóm ở xa liên tục bỏ lỡ lịch họp.', 'Thống nhất giờ họp và biên bản.', 'Buộc mọi người theo giờ của tôi.'],
    ['Hiểu nhầm yêu cầu', 'Khách hàng và đội kỹ thuật hiểu khác nhau về sản phẩm.', 'Xác nhận yêu cầu bằng văn bản.', 'Làm tiếp, đến cuối sửa cũng được.'],
    ['Thành công của cả nhóm', 'Dự án hoàn thành đúng hạn và trong ngân sách.', 'Ghi nhận đóng góp, bàn giao rõ ràng.', 'Nhận hết công lao về mình.'],
  ], result: 'Tôi được giao quản lý dự án quốc tế, nhờ biết kết nối con người và kiểm soát tiến độ.' },
  finalHook: 'một dự án quốc tế lớn cần người cân đối ngân sách và giải quyết bất đồng giữa các nhóm.',
  finalScenario: 1,
};
