import { getCareerAnnualSalary, formatSalary, RETIREMENT_AGE } from "./career-salary.js";
import { careerMilestones, hasCareerMilestone, getRankLock } from "./career-milestones.js";
import { FOOTBALL_MIN_HEALTH, failsFootballFitness } from "../stats/health-rules.js";
import { INTERVIEW, PROMOTION, getPromotionChance } from "../stats/intellect-rules.js";
import { hasInternationalDegreeForCareer, getStudyAbroadMajor, getOverseasProfile, getOverseasEmploymentContext, getOverseasJobBlocker, getStudyAbroadCountry, studyAbroadProfile } from "../education/study-abroad.js";

const sticker = (code) =>
  new URL(`../img/events/openmoji/color/svg/${code}.svg`, import.meta.url).href;

const art = (code, alt) => ({
  image: sticker(code),
  imageAlt: alt,
  imageFallback: sticker(code),
  imageFallbackAlt: alt,
});

const profiles = {
  "study-abroad": studyAbroadProfile,
  acting: {
    ranks: ["🎭 Diễn viên quần chúng", "🎬 Diễn viên triển vọng", "🌟 Minh tinh màn bạc"],
    achievement: "career-actor",
    strength: "khả năng nhập vai, biết nghe bạn diễn và chịu sửa cảnh",
  },
  military: {
    ranks: ["🪖 Tân binh", "🎖️ Quân nhân kỳ cựu", "⭐ Chuyên gia quân sự"],
    achievement: "career-military",
    strength: "tính kỷ luật, tinh thần đồng đội và thói quen xác nhận nhiệm vụ",
  },
  singing: {
    ranks: ["🎙️ Ca sĩ nghiệp dư", "🎵 Ca sĩ triển vọng", "🌟 Ngôi sao ca nhạc"],
    achievement: "career-singer",
    strength: "khả năng giữ nhịp, lắng nghe cả nhóm và luyện đến khi đúng tông",
  },
  painting: {
    ranks: ["🖌️ Họa sĩ học việc", "🖼️ Họa sĩ triển vọng", "🎨 Danh họa"],
    achievement: "career-painter",
    strength: "óc quan sát, ý tưởng hình ảnh và sự kiên nhẫn với từng bản phác thảo",
  },
  medicine: {
    ranks: ["🩺 Bác sĩ tập sự", "🥼 Bác sĩ chuyên khoa", "🏥 Trưởng khoa"],
    achievement: "career-doctor",
    strength: "sự cẩn trọng, tinh thần học hỏi và trách nhiệm với người bệnh",
  },
  programming: {
    ranks: ["💻 Lập trình viên tập sự", "🧑‍💻 Lập trình viên chính", "⭐ Chuyên gia lập trình"],
    achievement: "career-programmer",
    strength: "tư duy logic, khả năng tìm lỗi và bình tĩnh khi hệ thống đỏ màn hình",
  },
  accounting: {
    ranks: ["🧾 Nhân viên kế toán", "📊 Kế toán tổng hợp", "💼 Kế toán trưởng"],
    achievement: "career-accountant",
    strength: "sự kỹ tính với con số, biết đối chiếu chứng từ và không sợ bảng tính dài",
  },
  law: {
    ranks: ["📚 Luật sư tập sự", "⚖️ Luật sư", "🏛️ Chuyên gia pháp lí"],
    achievement: "career-law",
    strength: "khả năng đọc kỹ hồ sơ, lập luận rõ ràng và tôn trọng chứng cứ",
  },
  teaching: {
    ranks: ["📖 Giáo viên tập sự", "🏫 Giáo viên chủ nhiệm", "🎓 Hiệu trưởng"],
    achievement: "career-principal",
    strength: "sự kiên nhẫn, cách giải thích dễ hiểu và khả năng lắng nghe học sinh",
  },
  football: {
    ranks: ["⚽ Cầu thủ đội trẻ", "🥅 Cầu thủ đội dự bị", "🏆 Siêu sao sân cỏ"],
    achievement: "career-football",
    strength: "thể lực, tư duy phối hợp và biết chuyền khi đồng đội có vị trí đẹp hơn",
  },
  psychology: {
    ranks: ["💬 Trợ lí tâm lí", "🧠 Chuyên viên tâm lí", "🌿 Chuyên gia tâm lí"],
    achievement: "career-psychologist",
    strength: "khả năng lắng nghe, tôn trọng cảm xúc và giữ bình tĩnh trước khoảng lặng",
  },
  esports: {
    ranks: ["🛡️ Game thủ chuyên nghiệp", "🔥 Game thủ xuất sắc", "🏆 Siêu sao thể thao điện tử"],
    achievement: "career-gamer",
    strength: "phản xạ, giao tiếp trong đội và thói quen xem lại trận thay vì đổ lỗi",
  },
  tiktok: {
    ranks: ["📱 Nhà sáng tạo mới", "🔥 TikToker triển vọng", "🌟 Ngôi sao TikTok"],
    achievement: "career-tiktok",
    strength: "ý tưởng nội dung, khả năng bắt nhịp xu hướng và biết kiểm tra thông tin",
  },
  youtube: {
    ranks: ["📹 Nhà sáng tạo mới", "🎞️ YouTuber triển vọng", "🌟 YouTuber triệu người theo dõi"],
    achievement: "career-youtube",
    strength: "khả năng kể chuyện, dựng video và tôn trọng nguồn tư liệu",
  },
  business: {
    ranks: ["🧑‍💼 Nhân viên kinh doanh", "📈 Trưởng nhóm kinh doanh", "💼 Giám đốc kinh doanh"],
    achievement: "career-business",
    strength: "khả năng hiểu khách hàng, thương lượng rõ ràng và theo sát mục tiêu",
  },
  finance: {
    ranks: ["💵 Nhân viên tài chính", "📊 Chuyên viên phân tích", "💎 Chuyên gia tài chính"],
    achievement: "career-finance",
    strength: "tư duy số liệu, khả năng đánh giá rủi ro và sự cẩn trọng với dòng tiền",
  },
  mechanical: {
    ranks: ["🔧 Thợ cơ khí học việc", "⚙️ Kĩ thuật viên cơ khí", "🏅 Chuyên gia cơ khí"],
    achievement: "career-mechanical",
    strength: "khả năng đọc bản vẽ, kiểm tra sai số và kiên trì tìm nguyên nhân hỏng hóc",
  },
  architecture: {
    ranks: ["📐 Kiến trúc sư tập sự", "🏗️ Kiến trúc sư chính", "🏛️ Kiến trúc sư tài ba"],
    achievement: "career-architect",
    strength: "tư duy không gian, khả năng trình bày ý tưởng và cân bằng thẩm mỹ với công năng",
  },
  fashion: {
    ranks: ["🧵 Trợ lí thiết kế", "👗 Nhà thiết kế thời trang", "✨ Nhà thiết kế danh tiếng"],
    achievement: "career-fashion",
    strength: "cảm nhận chất liệu, óc thẩm mỹ và sự kiên nhẫn với từng đường may",
  },
  marketing: {
    ranks: ["📣 Nhân viên marketing", "🚀 Trưởng nhóm marketing", "👑 Ông hoàng marketing"],
    achievement: "career-marketing",
    strength: "khả năng hiểu khách hàng, tạo thông điệp và đọc số liệu thay vì đoán bằng cảm giác",
  },
  tourism: {
    ranks: ["🧳 Hướng dẫn viên tập sự", "🗺️ Hướng dẫn viên chính", "🌏 Chuyên gia du lịch"],
    achievement: "career-tourism",
    strength: "khả năng tổ chức lịch trình, giao tiếp linh hoạt và bình tĩnh khi kế hoạch thay đổi",
  },
  culinary: {
    ranks: ["🔪 Phụ bếp", "👨‍🍳 Đầu bếp", "👑 Vua đầu bếp"],
    achievement: "career-chef",
    strength: "khả năng giữ gian bếp gọn gàng, cân bằng hương vị và làm đúng quy trình an toàn",
  },
};

const fallbackProfile = {
  ranks: ["🌱 Nhân viên mới", "📈 Nhân viên kinh nghiệm", "⭐ Chuyên gia"],
  achievement: null,
  strength: "tinh thần học hỏi, làm rõ yêu cầu và chịu trách nhiệm với công việc",
};

export function getCareerProfile(careerId, careerPath = null) {
  if (careerId === "study-abroad" && careerPath) return getOverseasProfile(careerPath) ?? studyAbroadProfile;
  return profiles[careerId] ?? fallbackProfile;
}

const careerInterviewTopics = {
  "study-abroad": { task: "điều phối một dự án có thành viên từ nhiều quốc gia", prep: "đọc yêu cầu, chuẩn bị ngoại ngữ và thống nhất lịch làm việc", standard: "giao tiếp rõ ràng, tiến độ và ngân sách", issue: "hai nhóm hiểu khác nhau về yêu cầu bàn giao", fix: "xác nhận bằng văn bản và thống nhất lại trách nhiệm", joke: "gửi một biểu tượng cảm xúc rồi chờ mọi người tự hiểu" },
  acting: {
    task: "diễn một cảnh khóc ngay sau giờ ăn trưa",
    issue: "bạn diễn quên thoại giữa lúc máy quay đang chạy",
    standard: "cảm xúc của nhân vật và nhịp phối hợp với bạn diễn",
    prep: "đọc kịch bản, phân tích nhân vật rồi tập thử với bạn diễn",
    fix: "giữ cảm xúc, ứng biến vừa đủ và đưa cảnh quay về đúng mạch",
    joke: "xin đạo diễn quay từ xa để khán giả không thấy mình quên thoại",
  },
  military: {
    task: "chuẩn bị đội hình cho một buổi huấn luyện dã ngoại",
    issue: "một đồng đội xuống sức giữa hành trình",
    standard: "kỷ luật, an toàn và khả năng phối hợp đơn vị",
    prep: "kiểm tra quân số, trang bị và phổ biến nhiệm vụ rõ ràng",
    fix: "báo chỉ huy, hỗ trợ đồng đội và điều chỉnh đội hình an toàn",
    joke: "giả vờ mất sóng bộ đàm để khỏi nhận nhiệm vụ mới",
  },
  singing: {
    task: "hát live một ca khúc vừa đổi tông vào phút chót",
    issue: "tai nghe sân khấu mất tín hiệu giữa điệp khúc",
    standard: "cao độ, nhịp và khả năng làm chủ sân khấu",
    prep: "khởi động giọng, thử tông và ráp kỹ với ban nhạc",
    fix: "bám nhịp ban nhạc, ra hiệu kỹ thuật và tiếp tục bình tĩnh",
    joke: "đưa micro cho khán giả hát hộ đến khi tai nghe sống lại",
  },
  painting: {
    task: "hoàn thiện một tranh đặt hàng nhưng khách chỉ mô tả là ‘đẹp và có hồn’",
    issue: "màu thử lên tranh khác hẳn bản phác thảo",
    standard: "bố cục, màu sắc và ý đồ thị giác",
    prep: "hỏi rõ mong muốn, dựng bố cục và duyệt bảng màu trước",
    fix: "thử màu trên mẫu nhỏ rồi điều chỉnh từng lớp có kiểm soát",
    joke: "ký tên thật to để người xem quên nhìn phần màu bị lệch",
  },
  medicine: {
    task: "tiếp nhận một bệnh nhân có nhiều triệu chứng chưa rõ nguyên nhân",
    issue: "kết quả xét nghiệm không khớp với biểu hiện lâm sàng",
    standard: "an toàn người bệnh, bằng chứng và quy trình chuyên môn",
    prep: "khai thác bệnh sử, khám kỹ và chỉ định kiểm tra phù hợp",
    fix: "kiểm tra lại dữ liệu, hội chẩn và theo dõi sát người bệnh",
    joke: "tra triệu chứng trên mạng rồi chọn kết quả có nhiều lượt thích nhất",
  },
  programming: {
    task: "sửa lỗi khiến ứng dụng sập ngay trước giờ phát hành",
    issue: "lỗi chỉ xuất hiện trên máy của khách hàng nhưng máy bạn chạy ngon",
    standard: "tính đúng, khả năng kiểm thử và mã nguồn dễ bảo trì",
    prep: "tái hiện lỗi, đọc log và khoanh vùng thay đổi gần nhất",
    fix: "thu thập môi trường lỗi, viết ca kiểm thử rồi sửa đúng nguyên nhân",
    joke: "đổi tên lỗi thành tính năng để kịp giờ phát hành",
  },
  accounting: {
    task: "đối chiếu sổ sách khi số dư lệch đúng 999 đồng",
    issue: "một hóa đơn quan trọng thiếu chứng từ ngay sát ngày khóa sổ",
    standard: "tính chính xác, chứng từ và khả năng truy vết số liệu",
    prep: "đối chiếu từng nguồn, đánh dấu chênh lệch và kiểm tra chứng từ gốc",
    fix: "báo phần thiếu, xin bổ sung hợp lệ và lưu dấu vết điều chỉnh",
    joke: "bỏ thêm 1 đồng cho tròn một nghìn rồi coi như số đẹp",
  },
  law: {
    task: "đọc một hợp đồng dài mà điều khoản quan trọng nằm tận trang cuối",
    issue: "khách hàng nhớ lời thỏa thuận nhưng không có tài liệu chứng minh",
    standard: "chứng cứ, căn cứ pháp lý và quyền lợi hợp pháp của khách hàng",
    prep: "xác định mục tiêu, rà điều khoản và đánh dấu rủi ro pháp lý",
    fix: "thu thập tài liệu, xác minh lời trình bày và tư vấn theo chứng cứ",
    joke: "dùng giọng thật nghiêm để điều khoản tự thấy sợ mà biến mất",
  },
  teaching: {
    task: "giải thích một bài khó cho lớp đang đồng loạt nhìn ra cửa sổ",
    issue: "hai học sinh tranh cãi làm cả lớp mất tập trung",
    standard: "mức độ hiểu bài, sự công bằng và an toàn tâm lý của học sinh",
    prep: "đổi ví dụ gần gũi, chia bài thành bước nhỏ và kiểm tra lại mức hiểu",
    fix: "ổn định lớp, nghe từng bên rồi hướng các em giải quyết tôn trọng",
    joke: "giao bài tập gấp đôi để cả lớp đoàn kết cùng phản đối",
  },
  football: {
    task: "chuẩn bị cho trận đấu gặp đội pressing rất rát",
    issue: "đội nhà bị dẫn bàn và đồng đội bắt đầu đá vội",
    standard: "kỷ luật chiến thuật, thể lực và khả năng phối hợp",
    prep: "xem băng đối thủ, tập thoát pressing và thống nhất phương án hỗ trợ",
    fix: "giữ cự ly đội hình, giao tiếp và thực hiện đúng điều chỉnh chiến thuật",
    joke: "xin trọng tài cho thêm hai quả bóng để cơ hội ghi bàn tăng gấp đôi",
  },
  psychology: {
    task: "gặp một thân chủ im lặng gần hết buổi tham vấn",
    issue: "thân chủ hỏi bạn phải quyết định thay họ một việc hệ trọng",
    standard: "ranh giới nghề nghiệp, bảo mật và quyền tự quyết của thân chủ",
    prep: "tạo không gian an toàn, lắng nghe và không ép thân chủ phải nói",
    fix: "giúp họ làm rõ lựa chọn, hệ quả và tự đưa ra quyết định phù hợp",
    joke: "tung đồng xu giúp thân chủ vì đồng xu không bao giờ thiên vị",
  },
  tiktok: {
    task: "làm video bắt xu hướng nhưng vẫn phải đúng cá tính kênh",
    issue: "video vừa đăng bị phát hiện dùng một thông tin chưa kiểm chứng",
    standard: "độ tin cậy, khả năng giữ người xem và bản sắc nội dung",
    prep: "nghiên cứu xu hướng, viết hook ngắn và biến tấu theo phong cách riêng",
    fix: "kiểm tra nguồn, đính chính nhanh và rút kinh nghiệm cho quy trình duyệt",
    joke: "ghim bình luận ‘ai tin là người đó có niềm tin’ rồi đi ngủ",
  },
  youtube: {
    task: "sản xuất video dài khi đoạn mở đầu chưa đủ cuốn hút",
    issue: "file dựng gần hoàn tất bỗng mất một phần âm thanh",
    standard: "câu chuyện, chất lượng nghe nhìn và nguồn tư liệu minh bạch",
    prep: "chốt thông điệp, dựng khung câu chuyện và thử nhiều cách mở đầu",
    fix: "kiểm tra bản sao lưu, phục hồi âm thanh và xem lại toàn bộ trước khi xuất",
    joke: "đổi tiêu đề thành ‘video im lặng giúp ngủ ngon’ để khỏi dựng lại",
  },
  business: {
    task: "thuyết phục một khách hàng thích sản phẩm nhưng còn lăn tăn về giá",
    issue: "doanh số tuần này giảm dù đội đã gọi rất nhiều khách",
    standard: "nhu cầu khách hàng, giá trị mang lại và mục tiêu doanh số bền vững",
    prep: "hỏi nhu cầu thật, làm rõ giá trị và đề xuất phương án phù hợp ngân sách",
    fix: "xem lại phễu bán hàng, nghe phản hồi và điều chỉnh cách tiếp cận",
    joke: "tự mua hàng của công ty để biểu đồ doanh số bớt buồn",
  },
  finance: {
    task: "đánh giá một khoản đầu tư lợi nhuận cao nhưng dữ liệu còn thiếu",
    issue: "thị trường biến động mạnh ngay sau khi bạn gửi báo cáo",
    standard: "dữ liệu, mức chịu rủi ro và tính minh bạch tài chính",
    prep: "kiểm tra giả định, phân tích nhiều kịch bản và nêu rõ rủi ro",
    fix: "cập nhật dữ liệu, đo lại tác động và báo khách hàng phương án ứng phó",
    joke: "hỏi cung hoàng đạo của thị trường rồi chọn ngày đẹp để xuống tiền",
  },
  mechanical: {
    task: "kiểm tra một cụm máy rung bất thường khi chạy tốc độ cao",
    issue: "chi tiết gia công lệch dung sai ngay trước lúc lắp ráp",
    standard: "an toàn, dung sai kỹ thuật và độ tin cậy của thiết bị",
    prep: "dừng máy an toàn, đo kiểm và khoanh vùng nguyên nhân rung",
    fix: "cách ly chi tiết lỗi, kiểm tra bản vẽ và xử lý theo đúng quy trình",
    joke: "vặn con ốc nào nhìn khó chịu nhất rồi khởi động lại cầu may",
  },
  architecture: {
    task: "thiết kế căn nhà đẹp trên khu đất nhỏ và méo",
    issue: "khách muốn thêm nhiều phòng nhưng không muốn giảm khoảng thoáng",
    standard: "công năng, an toàn, quy chuẩn và thẩm mỹ công trình",
    prep: "khảo sát hiện trạng, làm rõ nhu cầu và thử nhiều phương án mặt bằng",
    fix: "giải thích đánh đổi, tối ưu không gian và đề xuất phương án khả thi",
    joke: "vẽ căn nhà to hơn khu đất rồi ghi chú ‘hình ảnh chỉ mang tính minh họa’",
  },
  fashion: {
    task: "thiết kế bộ trang phục nổi bật nhưng vẫn phải mặc được ngoài đời",
    issue: "mẫu vải chính hết hàng ngay trước lúc may bộ sưu tập",
    standard: "phom dáng, chất liệu, tính ứng dụng và bản sắc thiết kế",
    prep: "nghiên cứu người mặc, dựng moodboard và thử phom trên mẫu",
    fix: "tìm chất liệu tương đương, may mẫu thử và kiểm tra lại độ rủ màu",
    joke: "dùng rèm cửa thay vải rồi gọi đó là tuyên ngôn phá cách",
  },
  marketing: {
    task: "lên chiến dịch cho sản phẩm tốt nhưng gần như chưa ai biết tới",
    issue: "quảng cáo có nhiều lượt xem nhưng rất ít người mua",
    standard: "đúng khách hàng, thông điệp rõ và hiệu quả đo được",
    prep: "nghiên cứu khách hàng, chốt mục tiêu và thử nhiều thông điệp nhỏ",
    fix: "đọc dữ liệu hành trình, kiểm tra điểm rơi và tối ưu từng giả thuyết",
    joke: "tăng ngân sách gấp đôi để quảng cáo kém hiệu quả được thấy nhiều hơn",
  },
  tourism: {
    task: "điều hành tour đông khách trong ngày dự báo có mưa lớn",
    issue: "xe đón khách đến muộn trong khi lịch tham quan đã kín",
    standard: "an toàn, trải nghiệm khách và tính khả thi của lịch trình",
    prep: "kiểm tra thời tiết, chuẩn bị phương án trong nhà và báo khách sớm",
    fix: "liên hệ xe thay thế, cập nhật lịch và hỗ trợ khách trong lúc chờ",
    joke: "bảo khách nhắm mắt tưởng tượng đã tới điểm tham quan",
  },
  culinary: {
    task: "phục vụ một bàn đông khách có người dị ứng thực phẩm",
    issue: "món chính bị quá mặn ngay trước giờ đưa ra bàn",
    standard: "an toàn thực phẩm, hương vị và nhịp vận hành gian bếp",
    prep: "xác nhận dị ứng, tách dụng cụ và phổ biến rõ cho cả bếp",
    fix: "dừng món lỗi, báo bếp trưởng và làm lại đúng công thức nhanh nhất",
    joke: "đặt thêm ly nước thật to cạnh món để khách tự cân bằng vị",
  },
};

const employmentContexts = {
  "study-abroad": { place: "doanh nghiệp quốc tế", interviewer: "quản lý tuyển dụng quốc tế", leader: "giám đốc dự án", round: "phỏng vấn dự án quốc tế", apply: "gửi hồ sơ sau du học vào doanh nghiệp quốc tế" },
  esports: { place: "đội tuyển Liên Quân Mobile", interviewer: "ban huấn luyện", leader: "huấn luyện viên", round: "đánh giá năng lực", apply: "đăng ký đánh giá tại đội tuyển Liên Quân Mobile" },
  acting: { place: "đoàn phim", interviewer: "đạo diễn", leader: "đạo diễn", round: "thử vai", apply: "mang hồ sơ đến thử vai tại một đoàn phim" },
  military: { place: "đơn vị", interviewer: "hội đồng đơn vị", leader: "chỉ huy", round: "đánh giá nhận nhiệm vụ", apply: "tham gia đợt đánh giá để nhận nhiệm vụ chuyên môn tại đơn vị" },
  singing: { place: "hãng âm nhạc", interviewer: "nhà sản xuất âm nhạc", leader: "nhà sản xuất", round: "thử giọng", apply: "gửi bản thu và đăng ký thử giọng tại một hãng âm nhạc" },
  painting: { place: "studio mỹ thuật", interviewer: "giám tuyển", leader: "giám tuyển", round: "duyệt hồ sơ sáng tác", apply: "mang portfolio đến một studio mỹ thuật để ứng tuyển" },
  medicine: { place: "bệnh viện", interviewer: "hội đồng chuyên môn", leader: "trưởng khoa", round: "tuyển dụng tại bệnh viện", apply: "nộp hồ sơ chuyên môn vào một bệnh viện" },
  programming: { place: "công ty công nghệ", interviewer: "trưởng nhóm kỹ thuật", leader: "trưởng nhóm kỹ thuật", round: "phỏng vấn kỹ thuật", apply: "gửi CV ứng tuyển vào một công ty công nghệ" },
  accounting: { place: "phòng kế toán", interviewer: "kế toán trưởng", leader: "kế toán trưởng", round: "phỏng vấn kế toán", apply: "nộp CV vào phòng kế toán của một doanh nghiệp" },
  law: { place: "văn phòng luật", interviewer: "luật sư phụ trách", leader: "luật sư phụ trách", round: "phỏng vấn pháp lý", apply: "nộp hồ sơ vào một văn phòng luật" },
  teaching: { place: "trường học", interviewer: "ban giám hiệu", leader: "hiệu trưởng", round: "dạy thử và phỏng vấn", apply: "nộp hồ sơ giảng dạy vào một trường học" },
  football: { place: "câu lạc bộ", interviewer: "ban huấn luyện", leader: "huấn luyện viên trưởng", round: "thử việc tại câu lạc bộ", apply: "đăng ký buổi thử việc tại một câu lạc bộ bóng đá" },
  psychology: { place: "trung tâm tham vấn", interviewer: "trưởng bộ phận chuyên môn", leader: "trưởng bộ phận chuyên môn", round: "phỏng vấn chuyên môn", apply: "nộp hồ sơ vào một trung tâm tham vấn tâm lý" },
  tiktok: { place: "studio sáng tạo nội dung", interviewer: "quản lý nội dung", leader: "quản lý nội dung", round: "duyệt hồ sơ sáng tạo", apply: "gửi hồ sơ kênh đến một studio sáng tạo nội dung" },
  youtube: { place: "mạng lưới sáng tạo YouTube", interviewer: "quản lý kênh", leader: "quản lý kênh", round: "duyệt dự án video", apply: "gửi đề án kênh đến một mạng lưới sáng tạo YouTube" },
  business: { place: "doanh nghiệp", interviewer: "giám đốc kinh doanh", leader: "giám đốc kinh doanh", round: "phỏng vấn kinh doanh", apply: "gửi CV ứng tuyển vào bộ phận kinh doanh của một doanh nghiệp" },
  finance: { place: "tổ chức tài chính", interviewer: "trưởng phòng tài chính", leader: "trưởng phòng tài chính", round: "phỏng vấn tài chính", apply: "nộp hồ sơ vào một tổ chức tài chính" },
  mechanical: { place: "nhà máy", interviewer: "quản đốc kỹ thuật", leader: "quản đốc", round: "đánh giá kỹ thuật", apply: "nộp hồ sơ kỹ thuật vào một nhà máy" },
  architecture: { place: "văn phòng kiến trúc", interviewer: "kiến trúc sư trưởng", leader: "kiến trúc sư trưởng", round: "duyệt portfolio kiến trúc", apply: "mang portfolio đến một văn phòng kiến trúc" },
  fashion: { place: "nhà mốt", interviewer: "giám đốc sáng tạo", leader: "giám đốc sáng tạo", round: "duyệt portfolio thời trang", apply: "mang portfolio đến ứng tuyển tại một nhà mốt" },
  marketing: { place: "agency marketing", interviewer: "giám đốc chiến lược", leader: "giám đốc chiến lược", round: "phỏng vấn marketing", apply: "gửi CV vào một agency marketing" },
  tourism: { place: "công ty lữ hành", interviewer: "trưởng phòng điều hành tour", leader: "trưởng phòng điều hành", round: "phỏng vấn điều hành tour", apply: "nộp hồ sơ vào một công ty lữ hành" },
  culinary: { place: "nhà hàng", interviewer: "bếp trưởng", leader: "bếp trưởng", round: "tuyển chọn vào bếp", apply: "mang hồ sơ đến ứng tuyển vào bếp của một nhà hàng" },
};

const fallbackEmploymentContext = {
  place: "nơi làm việc",
  interviewer: "người phụ trách tuyển dụng",
  leader: "người quản lý",
  round: "phỏng vấn",
  apply: "gửi hồ sơ ứng tuyển",
};

// Tình huống nghề nghiệp riêng của từng ngành (dùng cho phỏng vấn và sự cố công việc).
export const getCareerTopic = (careerId) => careerInterviewTopics[careerId] ?? null;

export function getEmploymentContext(careerId, careerPath = null) {
  return getOverseasEmploymentContext(careerPath) ?? employmentContexts[careerId] ?? fallbackEmploymentContext;
}

function createCareerSpecificQuestions(career, profile) {
  const topic = careerInterviewTopics[career.id === "study-abroad" ? getStudyAbroadMajor(career).domesticCareer : career.id];
  if (!topic) return null;
  const context = getEmploymentContext(career.id, career);
  return [
    {
      text: `Nếu được giao việc ${topic.task}, em sẽ bắt đầu thế nào?`,
      answers: [
        `${topic.prep}, rồi mới bắt tay làm để đỡ phải cầu may.`,
        `Em chốt yêu cầu, ưu tiên ${topic.standard} và báo tiến độ rõ ràng.`,
        `Em sẽ ${topic.joke}; nhanh gọn, còn kết quả tính sau ạ.`,
      ],
    },
    {
      text: `Đang làm việc thì ${topic.issue}. Em xử lý sao?`,
      answers: [
        `Em sẽ ${topic.fix}, đồng thời báo người phụ trách trước khi vấn đề lớn thêm.`,
        `Em bình tĩnh kiểm tra nguyên nhân, ưu tiên ${topic.standard} rồi mới quyết định.`,
        `Em sẽ ${topic.joke}; biết đâu sự tự tin thắng được chuyên môn.`,
      ],
    },
    {
      text: `Theo em, điều gì quan trọng nhất để làm lâu dài trong ngành ${career.field}?`,
      answers: [
        `Em nghĩ phải giữ được ${topic.standard}, vì làm nhanh mà sai thì chỉ nhanh tới đoạn làm lại.`,
        `Ngoài ${profile.strength}, em còn phải học liên tục và chịu trách nhiệm với kết quả.`,
        `Quan trọng nhất là nhớ mang sạc điện thoại; còn nghiệp vụ có đồng nghiệp lo.`,
      ],
    },
    {
      text: `${context.leader} muốn làm thật nhanh và bảo bỏ qua một bước liên quan đến ${topic.standard}. Em nói gì?`,
      answers: [
        "Em trình bày rủi ro, đề xuất cách rút gọn an toàn và xin xác nhận phương án rõ ràng.",
        `Em vẫn giữ bước kiểm tra cốt lõi, đồng thời sắp xếp lại phần việc để kịp tiến độ.`,
        "Em gật đầu thật nhanh; nếu có chuyện thì giả vờ hôm đó là ngày đầu đi làm.",
      ],
    },
    {
      text: `Một câu thôi: vì sao ${context.place} nên nhận em vào ngành ${career.field}?`,
      answers: [
        `Vì em có ${profile.strength}, chưa biết thì hỏi và làm xong vẫn kiểm tra lại.`,
        `Em hiểu nghề này cần ${topic.standard}; em sẵn sàng bắt đầu từ việc nhỏ để chứng minh bằng kết quả.`,
        `Vì mẹ em đã khoe với cả xóm là em sắp vào ${context.place}, mọi người đừng làm mẹ em quê ạ.`,
      ],
    },
  ];
}

function createInterviewQuestion(career, profile, random) {
  const careerQuestions = createCareerSpecificQuestions(career, profile);
  if (careerQuestions) {
    return careerQuestions[Math.floor(random() * careerQuestions.length)];
  }
  const firstRank = profile.ranks[0].replace(/^\S+\s/u, "");
  const questions = career.id === "esports" ? [
    {
      text: "Đội đang ăn Tà Thần, nhưng ba tướng địch mất dạng trên bản đồ. Em sẽ call thế nào?",
      answers: [
        "Dừng đánh hoặc kéo mục tiêu ra, kiểm tra tầm nhìn rồi mới quyết định ăn tiếp.",
        "Call hỗ trợ kiểm tra bụi, giữ Trừng Trị và sẵn sàng quay ra giao tranh.",
        "Em núp bụi chờ highlight, Tà Thần để đồng đội tự lo.",
      ],
    },
    {
      text: "Sau hai ván scrim thua liên tiếp, không khí cả đội bắt đầu căng. Em làm gì?",
      answers: [
        "Xem lại replay, nhận phần lỗi của mình và thống nhất lại cách call mục tiêu.",
        "Cho cả đội nghỉ vài phút rồi chốt một lỗi quan trọng để sửa ở ván sau.",
        "Đổi tên trong game lấy vía, biết đâu ván sau hệ thống thương.",
      ],
    },
    {
      text: "Đến lượt chọn tướng, đội hình đang thiếu chống chịu nhưng tướng tủ của em là sát thủ. Em chọn gì?",
      answers: [
        "Trao đổi với đội và chọn tướng phù hợp bài đánh đã tập.",
        "Báo rõ bể tướng của mình để huấn luyện viên chọn phương án đội hình an toàn nhất.",
        "Bấm chọn ngẫu nhiên để đối thủ không thể đọc chiến thuật.",
      ],
    },
    {
      text: "Còn 30 giây nữa Caesar xuất hiện, đường lính đang đẩy ngược về phía đội mình. Em ưu tiên gì?",
      answers: [
        "Đẩy hoặc xử lý đường lính, kiểm soát tầm nhìn rồi tập trung đúng nhịp mục tiêu.",
        "Call người phù hợp dọn lính, những người còn lại giữ vị trí quanh Caesar và tránh lộ tầm nhìn.",
        "Đi săn mạng lẻ, Caesar thấy mình xanh chắc tự về đội.",
      ],
    },
    {
      text: "Huấn luyện viên hỏi điểm yếu lớn nhất của em trước khi xét lên đội 1. Em trả lời sao?",
      answers: [
        "Đôi lúc em call hơi vội; em đang sửa bằng cách xem replay và nói thông tin ngắn, rõ hơn.",
        "Bể tướng của em còn hẹp; em đang luyện thêm hai tướng đúng vai trò đội cần.",
        "Em không có điểm yếu, chỉ có Wi-Fi đôi lúc thiếu ý chí.",
      ],
    },
  ] : [
    {
      text: `Em thấy mình như thế nào khi bắt đầu ở vị trí ${firstRank}?`,
      answers: [
        `Em là bản thử nghiệm còn cập nhật: có ${profile.strength}, được góp ý là em sửa.`,
        "Em chưa phải bản hoàn hảo, nhưng deadline gọi là em nghe máy và việc sai là em sửa.",
        "Em thấy công ty nhận em là quyết định sáng nhất quý này.",
      ],
    },
    {
      text: `Em nghĩ mình có gì để bước vào ngành ${career.field}?`,
      answers: [
        `Em có ${profile.strength}. Còn cơm trưa thì em tự lo được ạ.`,
        "Em có nền tảng vừa đủ, chưa biết thì hỏi và biết rồi vẫn kiểm tra lại trước khi nộp.",
        "Em có mẹ em bảo em giỏi, cần thì em gọi mẹ xác nhận luôn ạ.",
      ],
    },
    {
      text: "Câu hơi riêng tư một chút: em có bồ chưa?",
      answers: [
        `Dạ chuyện tình cảm em để ngoài giờ; vào việc em chung thủy với ${profile.strength} và deadline.`,
        "Dạ có ạ, nhưng bồ em không chấm công hộ; lịch làm việc em tự chịu trách nhiệm.",
        "Dạ có, nên thứ Hai với thứ Sáu em xin về sớm cho tình cảm bền lâu.",
      ],
    },
    {
      text: "Điểm yếu lớn nhất của em là gì?",
      answers: [
        `Đôi lúc em hơi kỹ với công việc ${career.field}; em đang học cách ưu tiên việc quan trọng trước.`,
        "Đôi khi em hỏi khá kỹ; em đang học cách gom câu hỏi lại để vừa rõ việc vừa đỡ làm phiền mọi người.",
        "Em yếu nhất vào sáng thứ Hai, chiều thứ Sáu và những ngày còn lại.",
      ],
    },
    {
      text: `Vì sao công ty nên chọn em cho ngành ${career.field}?`,
      answers: [
        "Em không hứa cứu công ty trong ba ngày; em hứa học nhanh, làm chắc và báo sớm khi có vấn đề.",
        "Vì em biết phối hợp, nhận trách nhiệm và không biến mất đúng lúc nhóm cần người nhất.",
        "Vì nếu không chọn em thì câu hỏi này hơi phí công đôi bên.",
      ],
    },
  ];
  return questions[Math.floor(random() * questions.length)];
}

function shuffledAnswers(question, random) {
  const answers = question.answers.map((label, index) => ({
    label,
    correct: index < 2,
    // Đáp án gốc theo thứ tự: tốt, chấp nhận được, chưa phù hợp.
    quality: ["good", "acceptable", "weak"][index],
  }));
  for (let index = answers.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [answers[index], answers[swapIndex]] = [answers[swapIndex], answers[index]];
  }
  return answers;
}

const capitalize = (text) => `${text[0].toLocaleUpperCase("vi-VN")}${text.slice(1)}`;
// Phỏng vấn nhận việc của người hoàn thành chuỗi tuổi 16 đúng ngành là phần tiếp nối của chuỗi ấy:
// người hướng dẫn năm xưa giữ lời hẹn, mời phỏng vấn, báo kết quả và hẹn thử lại.
function getMilestoneMentor(player) {
  if (!hasCareerMilestone(player)) return null;
  const data = careerMilestones[player.careerPath.id];
  return { name: data.mentor, Name: capitalize(data.mentor), challenge: data.spark.title.replace(/^\S+\s/u, "") };
}

export function createJobInterview(player, random = Math.random) {
  const career = player.careerPath ?? { id: "general", field: "ngành đã chọn" };
  const profile = getCareerProfile(career.id, career);
  const context = getEmploymentContext(career.id, career);
  const question = createInterviewQuestion(career, profile, random);
  const isEsports = career.id === "esports";
  const academy = career.school?.name ?? "academy";
  const mentor = getMilestoneMentor(player);
  if (mentor) {
    return {
      id: `job-interview-${career.id}`,
      kind: "job-interview",
      interviewCareerId: career.id,
      title: "📞 Lời hẹn từ năm 16 tuổi",
      text: `Bạn vừa khép lại chặng học tập thì nhận được cuộc gọi từ ${mentor.name}, người đã cùng bạn đi qua thử thách “${mentor.challenge}” năm 16 tuổi. “Tôi vẫn nhớ lời hẹn năm ấy. Em đến ${context.place} dự buổi ${context.round} nhé, tôi sẽ ngồi hội đồng.”\n\nTrong buổi ${context.round}, ${mentor.name} lật hồ sơ của bạn rồi hỏi:\n\n“${capitalize(question.text)}”`,
      ...art("1F4DE", `Cuộc gọi từ ${mentor.name}`),
      choices: shuffledAnswers(question, random),
    };
  }
  return {
    id: `job-interview-${career.id}`,
    kind: "job-interview",
    interviewCareerId: career.id,
    title: isEsports ? "🎮 Đánh giá năng lực lên đội 1" : `📄 Vòng ${context.round}`,
    text: isEsports
      ? `${academy} mở buổi đánh giá cuối để chọn tuyển thủ được đưa lên đội 1. Huấn luyện viên xem lại quá trình scrim rồi hỏi bạn:\n\n“${question.text}”`
      : `Bạn ${context.apply}. ${context.interviewer} xem hồ sơ, mỉm cười rồi hỏi:\n\n“${question.text}”`,
    ...art(isEsports ? "1F3AF" : "1F4CB", isEsports ? "Buổi đánh giá tuyển thủ lên đội 1" : `Buổi ${context.round} ngành ${career.field}`),
    choices: shuffledAnswers(question, random),
  };
}

// Kết quả phỏng vấn. \`passed\` là kết quả tổng thể đã tung (chất lượng câu trả lời, trí tuệ, chuẩn bị — xem
// intellect-rules.js); \`assessment\` ghi lại cách tính để người chơi thấy. Câu trả lời tốt luôn được ghi nhận là tốt,
// kể cả khi lần này chưa được nhận. Bóng đá còn cần thể lực: thiếu thể lực thì không đậu.
export function createInterviewResult(player, passed, age, assessment = null) {
  const unfit = failsFootballFitness(player.careerPath?.id, player.health);
  const overseasBlocker = getOverseasJobBlocker(player, age);
  const hired = passed && !unfit && !overseasBlocker;
  const result = createAnsweredInterviewResult(player, hired, age);
  const country = getStudyAbroadCountry(player.careerPath);
  if (country && hired) Object.assign(result.updates, {
    workCountryId: country.id, workCountryName: country.name, overseasEmployedAtAge: age,
  });
  if (!country && hired && player.abroadDestination === "return" && player.overseasEducation) {
    Object.assign(result.updates, { workCountryId: "vietnam", workCountryName: "Việt Nam" });
    const homeNote = `Bạn bắt đầu làm việc tại Việt Nam, với bằng ${player.overseasEducation.program} đã học tại ${player.overseasEducation.countryName}.`;
    result.content += `\n${homeNote}`;
    result.logContent += `\n${homeNote}`;
    result.logSummary += "\nNhận việc tại Việt Nam.";
  }
  const notes = [];
  if (overseasBlocker) notes.push(overseasBlocker);
  if (unfit) notes.push(`⚽ Bạn không qua bài kiểm tra thể lực: Sức khỏe ${player.health}%, ngành Bóng đá cần từ ${FOOTBALL_MIN_HEALTH}%.`);
  if (assessment && !hired && !unfit && assessment.quality !== "weak") {
    notes.push(`Câu trả lời của bạn được đánh giá ${INTERVIEW.qualityLabel[assessment.quality].toLowerCase()}, nhưng lần này hội đồng chọn ứng viên khác.`);
  }
  const tail = [
    assessment ? `📊 ${assessment.note}` : "",
    !hired ? "Bước tiếp theo: học bổ sung (Phát triển bản thân → Trí tuệ), luyện phỏng vấn (Xin việc) hoặc tìm công việc phù hợp hơn." : "",
  ].filter(Boolean);
  if (!notes.length && !tail.length) return result;
  const head = notes.length ? `${notes.join("\n")}\n` : "";
  const foot = tail.length ? `\n${tail.join("\n")}` : "";
  return {
    ...result,
    ...(unfit ? { title: "🏃 Chưa đạt thể lực" } : {}),
    content: `${head}${result.content}${foot}`,
    logContent: `${head}${result.logContent}${assessment ? `\n📊 ${assessment.note}` : ""}`,
    logSummary: `${head}${result.logSummary}`,
    updates: { ...result.updates, interviewPrepAge: null },
  };
}

function createAnsweredInterviewResult(player, passed, age) {
  const career = player.careerPath ?? { id: "general", field: "ngành đã chọn" };
  const profile = getCareerProfile(career.id, career);
  const context = getEmploymentContext(career.id, career);
  const isEsports = career.id === "esports";
  const academy = career.school?.name ?? "academy";
  const mentor = getMilestoneMentor(player);
  if (mentor) {
    const salaryText = `Lương cố định: ${formatSalary(getCareerAnnualSalary(career.id, 1, career))}/năm.`;
    return passed ? {
      stage: "result",
      age,
      title: "🤝 Giữ trọn lời hẹn năm 16 tuổi",
      content: `${mentor.Name} bắt tay bạn: “Đúng là em của thử thách ‘${mentor.challenge}’ năm nào.” Bạn chính thức gia nhập ${context.place} ở vị trí ${profile.ranks[0]}, và ${mentor.name} sẽ tiếp tục dõi theo chặng đường phía trước.\n${salaryText} Lương năm đầu được cộng ngay vào ví khi xác nhận nhận việc; các năm sau tiếp tục nhận mỗi năm.`,
      confirmText: "Đi làm thôi!",
      updates: { age, job: profile.ranks[0], employmentStatus: "employed", careerLevel: 1 },
      achievementIds: [],
      logSummary: `Giữ lời hẹn với ${mentor.name} từ năm 16 tuổi.\nBắt đầu ở bậc ${profile.ranks[0]}.\n${salaryText}`,
      logContent: `${mentor.Name} giữ lời hẹn từ năm 16 tuổi và mời bạn dự buổi ${context.round}. Bạn vượt qua và bắt đầu làm việc tại ${context.place} ở vị trí ${profile.ranks[0]}.\n${salaryText}`,
      ...art("1F91D", `Giữ lời hẹn với ${mentor.name}`),
    } : {
      stage: "result",
      age,
      title: "📋 Lời hẹn chưa trọn",
      content: `${mentor.Name} khẽ lắc đầu: “Câu trả lời này chưa giống người tôi gặp năm 16 tuổi.” ${capitalize(context.place)} chưa thể nhận bạn lần này, nhưng ${mentor.name} vẫn để ngỏ cánh cửa: năm sau có thể dự buổi ${context.round} lại.`,
      confirmText: "Năm sau thử lại!",
      // Tuyển thủ Liên Quân trượt vẫn tập ở academy như trước.
      updates: { age, job: isEsports ? `🎮 Tuyển thủ ${academy}` : "Thất nghiệp", employmentStatus: "unemployed", careerLevel: 0 },
      achievementIds: [],
      logSummary: `Chưa vượt qua buổi ${context.round} do ${mentor.name} mời.\nTạm thời thất nghiệp; có thể thử lại vào năm sau.`,
      logContent: `Bạn chưa vượt qua buổi ${context.round} do ${mentor.name} mời và tạm thời thất nghiệp. ${mentor.Name} hẹn bạn thử lại vào năm sau.`,
      ...art("1F4CB", `${mentor.Name} hẹn năm sau`),
    };
  }
  if (passed) {
    const salaryText = `Lương cố định: ${formatSalary(getCareerAnnualSalary(career.id, 1, career))}/năm.`;
    return {
      stage: "result",
      age,
      title: isEsports ? "🏆 Chính thức lên đội 1!" : `🎉 Vượt qua vòng ${context.round}!`,
      content: (isEsports
        ? `Cách đọc tình huống và tư duy phối hợp của bạn thuyết phục được ban huấn luyện. Bạn rời đội hình academy và chính thức trở thành ${profile.ranks[0]}.`
        : `Câu trả lời của bạn thuyết phục được ${context.interviewer}. Bạn chính thức gia nhập ${context.place} ở vị trí ${profile.ranks[0]}.`)
        + `\n${salaryText} Lương năm đầu được cộng ngay vào ví khi xác nhận nhận việc; các năm sau tiếp tục nhận mỗi năm.`,
      confirmText: isEsports ? "Ra mắt đội 1!" : "Đi làm thôi!",
      updates: { age, job: profile.ranks[0], employmentStatus: "employed", careerLevel: 1 },
      achievementIds: [],
      logSummary: isEsports
        ? `Vượt qua đánh giá của ${academy}.\nChính thức trở thành ${profile.ranks[0]}.\n${salaryText}`
        : `Vượt qua vòng ${context.round} ngành ${career.field}.\nBắt đầu ở bậc ${profile.ranks[0]}.\n${salaryText}`,
      logContent: isEsports
        ? `Bạn vượt qua buổi đánh giá năng lực tại ${academy} và chính thức được đưa lên đội 1.\n${salaryText}`
        : `Bạn đã vượt qua vòng ${context.round} ngành ${career.field} và bắt đầu làm việc tại ${context.place} ở vị trí ${profile.ranks[0]}.\n${salaryText}`,
      ...art("1F389", `Ăn mừng vượt qua vòng ${context.round}`),
    };
  }
  if (isEsports) {
    return {
      stage: "result",
      age,
      title: "📋 Chưa được chọn lên đội 1",
      content: `Ban huấn luyện nhận xét bạn vẫn cần cải thiện khả năng đọc bản đồ và phối hợp. Bạn tiếp tục tập luyện tại ${academy} và có thể đăng ký đánh giá lại vào năm sau.`,
      confirmText: "Tiếp tục luyện tập!",
      updates: { age, job: `🎮 Tuyển thủ ${academy}`, employmentStatus: "unemployed", careerLevel: 0 },
      achievementIds: [],
      logSummary: `Chưa vượt qua đánh giá lên đội 1.\nTiếp tục tập luyện tại ${academy}.`,
      logContent: `Bạn chưa vượt qua buổi đánh giá năng lực để lên đội 1 và tiếp tục tập luyện tại ${academy}.`,
      ...art("1F3AF", "Tiếp tục tập luyện tại academy"),
    };
  }
  return {
    stage: "result",
    age,
    title: `📭 Chưa vượt qua vòng ${context.round}`,
    content: `${context.interviewer} cảm ơn bạn đã tham gia nhưng ${context.place} chưa thể nhận bạn lần này. Bạn tạm thời thất nghiệp và có thể đăng ký thử lại vào năm sau.`,
    confirmText: "Năm sau thử lại!",
    updates: { age, job: "Thất nghiệp", employmentStatus: "unemployed", careerLevel: 0 },
    achievementIds: [],
    logSummary: `Chưa vượt qua vòng ${context.round} ngành ${career.field}.\nTạm thời thất nghiệp; có thể thử lại vào năm sau.`,
    logContent: `Bạn chưa vượt qua vòng ${context.round} ngành ${career.field} và tạm thời thất nghiệp. ${context.interviewer} hẹn bạn thử lại vào năm sau.`,
      ...art("1F4F1", `Thông báo chưa vượt qua vòng ${context.round}`),
  };
}

export function createInterviewRetryPrompt(player) {
  const field = player.careerPath?.field ?? "ngành đã chọn";
  const isEsports = player.careerPath?.id === "esports";
  const context = getEmploymentContext(player.careerPath?.id, player.careerPath);
  const academy = player.careerPath?.school?.name ?? "academy";
  const mentor = getMilestoneMentor(player);
  if (mentor) {
    return {
      id: `job-retry-${player.careerPath.id}`,
      kind: "job-interview-retry",
      title: `📞 ${mentor.Name} gọi lại`,
      text: `Một năm sau lần trước, ${mentor.name} lại gọi: “Lời hẹn từ năm em 16 tuổi vẫn còn đó. ${capitalize(context.place)} mở buổi ${context.round} mới, em có muốn thử lại không?”`,
      ...art("1F4DE", `${mentor.Name} gọi lại`),
      skipLogContent: `Bạn cảm ơn ${mentor.name} nhưng quyết định không dự buổi ${context.round} nữa.`,
      skipLogSummary: `Từ chối lời mời thử lại của ${mentor.name}.`,
      choices: [
        { label: "💪 Có, lần này em sẽ làm tốt hơn!", retryInterview: true },
        { label: "🙅 Em xin để dịp khác.", skipInterview: true },
      ],
    };
  }
  return {
    id: `job-retry-${player.careerPath?.id ?? "general"}`,
    kind: "job-interview-retry",
    title: isEsports ? "🎮 Đăng ký đánh giá lại?" : `📨 Thử lại vòng ${context.round}?`,
    text: isEsports
      ? `Sau một năm tập luyện thêm tại ${academy}, ban huấn luyện mở đợt đánh giá mới cho đội 1. Bạn có muốn đăng ký thử lại không?`
      : `Một năm đã trôi qua kể từ lần thử sức trước. ${context.place} mở đợt ${context.round} mới cho ngành ${field}. Bạn có muốn đăng ký lại không?`,
    ...art("1F4CB", isEsports ? "Cơ hội đánh giá lại" : `Cơ hội đăng ký lại vòng ${context.round}`),
    skipLogContent: isEsports
      ? `Bạn quyết định không đăng ký các đợt đánh giá lên đội 1 nữa và tiếp tục sinh hoạt tại ${academy}.`
      : `Bạn quyết định không tiếp tục đăng ký vòng ${context.round} trong ngành ${field}.`,
    skipLogSummary: isEsports
      ? "Không đăng ký đánh giá lên đội 1 nữa."
      : `Không tiếp tục vòng ${context.round}.`,
    choices: [
      { label: isEsports ? "🔥 Có, đánh giá lại thôi!" : "💪 Có, đăng ký lại!", retryInterview: true },
      { label: isEsports ? "🙅 Không, ở academy tiếp!" : "🙅 Chưa, để năm khác tính!", skipInterview: true },
    ],
  };
}

// Lần đầu ở tuổi 27; lần cuối cách lần nâng bậc thành công đầu tiên 10 năm.
export function getPromotionUpdates(player, age, correct) {
  const level = Number(player.careerLevel) || 1;
  if (!correct) {
    const retryAge = age + 2;
    const lastAge = (getStudyAbroadCountry(player.careerPath) || hasInternationalDegreeForCareer(player)) ? RETIREMENT_AGE - 1 : 39;
    return { nextPromotionAge: (level === 2 && retryAge > lastAge) || (getStudyAbroadCountry(player.careerPath) && retryAge >= RETIREMENT_AGE) ? null : retryAge };
  }
  const finalAge = age + 10;
  const lastAge = (getStudyAbroadCountry(player.careerPath) || hasInternationalDegreeForCareer(player)) ? RETIREMENT_AGE - 1 : 39;
  return { nextPromotionAge: level === 1 && finalAge <= lastAge ? finalAge : null };
}

// Mỗi tình huống có ba cách làm hợp lý, khác nhau ở cái giá phải trả: dốc sức thì dễ được chọn hơn
// nhưng hao sức khỏe, tinh thần; giữ cân bằng thì an toàn cho bản thân nhưng ít cơ hội hơn.
// bonus cộng vào khả năng được chọn; effects là cái giá (hoặc phần được) dù kết quả thế nào.
const promotionScenarios = {
  1: [
    {
      title: "📋 Công việc sát hạn",
      text: "Một nhiệm vụ trong ngành {field} gặp trục trặc ngay trước hạn. Đồng nghiệp chờ bạn đưa ra cách xử lý, còn cấp trên đang theo dõi năng lực của bạn. Bạn chọn cách nào để đưa nhiệm vụ về đích?",
      approaches: [
        { label: "🧭 Chia việc, phối hợp cả nhóm để kịp hạn", bonus: 0, effects: {},
          done: "Bạn xác định đúng chỗ vướng, chia việc theo thế mạnh từng người và cả nhóm kịp hạn." },
        { label: "🔥 Nhận phần khó nhất, thức nhiều đêm cho kịp", bonus: 0.15, effects: { health: -6, happiness: -2 },
          done: "Bạn tự gánh phần khó nhất, thức nhiều đêm liền. Nhiệm vụ xong sớm, cấp trên thấy rõ dấu ấn của bạn, nhưng cơ thể đã rất mệt." },
        { label: "🛑 Xin lùi hạn một tuần để làm cho chắc", bonus: -0.2, effects: { happiness: 2 },
          done: "Bạn xin lùi hạn để làm kỹ. Kết quả chắc chắn, cả nhóm đỡ áp lực, nhưng hội đồng ghi nhận bạn chưa xoay xở được dưới sức ép." },
      ],
    },
    {
      title: "🔎 Sai sót bất ngờ",
      text: "Bạn phát hiện một sai sót trong công việc ngành {field}. Nếu bỏ qua, người khác có thể bị ảnh hưởng. Sửa lỗi nào cũng tốn thời gian và có người phải chịu trách nhiệm. Bạn xử lý thế nào?",
      approaches: [
        { label: "✅ Báo người phụ trách và cùng sửa ngay", bonus: 0, effects: {},
          done: "Bạn báo người phụ trách, cả nhóm cùng sửa trong ngày. Mọi việc trở lại đúng hướng." },
        { label: "📣 Báo cáo công khai, đề xuất quy trình kiểm tra mới", bonus: 0.15, effects: { happiness: -4 },
          done: "Bạn trình bày sai sót trước cả phòng và đề xuất quy trình kiểm tra mới. Cấp trên đánh giá cao, nhưng vài đồng nghiệp phật lòng vì bị nêu tên." },
        { label: "🌙 Lặng lẽ sửa trong đêm, không làm ai mất mặt", bonus: -0.15, effects: { health: -3, happiness: 1 },
          done: "Bạn tự sửa trong đêm và không nhắc tên ai. Đồng nghiệp biết ơn, nhưng cấp trên gần như không biết bạn đã làm gì." },
      ],
    },
  ],
  2: [
    {
      title: "🚀 Dẫn dắt nhiệm vụ lớn",
      text: "Bạn được cân nhắc cho bậc cao nhất của ngành {field}. Trong nhiệm vụ quyết định, cả nhóm bất đồng về cách làm và tiến độ đang chậm lại, đúng lúc gia đình cũng cần bạn hơn. Bạn dẫn dắt theo cách nào?",
      approaches: [
        { label: "🤝 Lắng nghe, đối chiếu dữ kiện và thống nhất kế hoạch", bonus: 0, effects: {},
          done: "Bạn dành thời gian nghe từng người, đối chiếu dữ kiện và chốt một kế hoạch cả nhóm cùng đồng ý." },
        { label: "👑 Tự quyết và chịu trách nhiệm, đẩy nhanh tiến độ", bonus: 0.15, effects: { health: -3, happiness: -4 },
          done: "Bạn tự quyết hướng đi và đứng ra chịu trách nhiệm. Tiến độ tăng vọt, nhưng không khí trong nhóm căng thẳng và bạn hầu như không về nhà đúng giờ." },
        { label: "🏡 Giao bớt cho phó nhóm, giữ thời gian cho gia đình", bonus: -0.2, effects: { happiness: 3, health: 2 },
          done: "Bạn giao bớt việc cho phó nhóm để có mặt ở nhà. Nhiệm vụ vẫn xong, nhưng công lao được chia cho người khác." },
      ],
    },
    {
      title: "⚖️ Quyết định quan trọng",
      text: "Một kế hoạch lớn trong ngành {field} hứa hẹn thành công nhưng có rủi ro chưa được kiểm tra. Kiểm tra kỹ thì chậm, triển khai sớm thì phải gánh phần phát sinh. Bạn quyết định thế nào?",
      approaches: [
        { label: "🛡️ Kiểm tra rủi ro kỹ, chấp nhận chậm một quý", bonus: 0, effects: { intelligence: 1 },
          done: "Bạn cho kiểm tra kỹ từng rủi ro và chuẩn bị phương án dự phòng. Kế hoạch chậm một quý nhưng chạy êm." },
        { label: "🚀 Triển khai ngay, làm thêm giờ xử lý phát sinh", bonus: 0.15, effects: { health: -5, happiness: -2 },
          done: "Bạn cho triển khai ngay và tự xử lý từng phát sinh ngoài giờ. Kết quả đến sớm, ai cũng thấy, nhưng bạn kiệt sức sau mấy tháng." },
        { label: "🤲 Đề cử người giỏi hơn dẫn dắt, mình làm hậu thuẫn", bonus: -0.3, effects: { happiness: 2, intelligence: 2 },
          done: "Bạn đề cử một đồng nghiệp hợp hơn dẫn dắt và hỗ trợ phía sau. Bạn học được nhiều, nhưng vai trò của bạn trong mắt hội đồng mờ đi." },
      ],
    },
  ],
};
const describeCost = (effects) => Object.entries(effects)
  .map(([stat, value]) => `${({ health: "Sức khỏe", happiness: "Hạnh phúc", intelligence: "Trí tuệ" })[stat]} ${value > 0 ? "+" : ""}${value}`)
  .join(", ");
const addEffects = (...list) => list.reduce((sum, effects) => {
  for (const [stat, value] of Object.entries(effects)) sum[stat] = (sum[stat] ?? 0) + value;
  return sum;
}, {});

function promotionRetryText(player, age) {
  const retryAge = getPromotionUpdates(player, age, false).nextPromotionAge;
  return retryAge === null
    ? (getStudyAbroadCountry(player.careerPath)
      ? "Bạn giữ nguyên bậc nghề. Lần đánh giá tiếp theo sẽ đến sau tuổi nghỉ hưu nên không còn lịch nâng bậc."
      : "Cách xử lý chưa phù hợp nên bạn giữ nguyên bậc nghề. Cơ hội nâng bậc cuối đã kết thúc vì lần thử lại sẽ vượt quá 39 tuổi.")
    : `Cách xử lý chưa phù hợp nên bạn giữ nguyên bậc nghề. Bạn sẽ được thử lại sau 2 năm, ở tuổi ${retryAge}.`;
}

// Thay thế lượt nâng bậc 1 → 2 khi dấu mốc tuổi 16 có hiệu lực: 4 tình huống,
// chọn sai ở bất kỳ bước nào thì giữ bậc 1 và thử lại sau 2 năm, không mất dấu mốc.
export function createMilestonePromotionEvent(player, step = 1, age = player.age + 1, random = Math.random) {
  const career = player.careerPath;
  const data = careerMilestones[career?.id];
  if (!data || step < 1 || step > 4) return null;
  const profile = getCareerProfile(career.id, career);
  const [stepTitle, text, correctLabel, wrongLabel] = data.promotion.steps[step - 1];
  const retryAge = getPromotionUpdates(player, age, false).nextPromotionAge;
  const correct = step < 4
    ? { label: correctLabel, nextStep: step + 1 }
    : {
        label: correctLabel,
        correct: true,
        title: `📈 Tiến lên bậc ${profile.ranks[1]}`,
        text: `${data.promotion.result} Qua cả bốn tình huống, năng lực của bạn được công nhận; bạn được nâng lên bậc ${profile.ranks[1]}.\nLương mới: ${formatSalary(getCareerAnnualSalary(career.id, 2, career))}/năm, áp dụng từ năm tiếp theo.`,
        effects: { intelligence: 4, happiness: 3 },
        job: profile.ranks[1],
        careerLevel: 2,
        employmentStatus: "employed",
        achievementIds: [],
        confirmText: "Tiếp tục cố gắng!",
        logSummary: `${data.promotion.title}: vượt qua cả bốn tình huống.\nLên bậc ${profile.ranks[1]}.`,
        ...art("1F4C5", "Thăng tiến trong công việc"),
      };
  const wrong = {
    label: wrongLabel,
    correct: false,
    title: "📋 Chưa đạt yêu cầu",
    text: `Người phụ trách ghi nhận nỗ lực của bạn, nhưng cách xử lý lần này chưa đạt yêu cầu. Bạn giữ nguyên bậc nghề hiện tại và có thể tham gia đánh giá lại sau 2 năm${retryAge ? `, ở tuổi ${retryAge}` : ""}.`,
    effects: {},
    achievementIds: [],
    confirmText: "Lần sau làm tốt hơn!",
    logSummary: `${data.promotion.title}: chưa đạt ở tình huống ${step}/4.\nGiữ bậc ${profile.ranks[0]}, thử lại sau 2 năm.`,
    ...art("1F4CB", "Chưa đạt yêu cầu nâng bậc"),
  };
  const choices = [correct, wrong];
  if (random() < 0.5) choices.reverse();
  return {
    id: `career-milestone-promotion-${career.id}-${step}`,
    kind: "career-promotion",
    specialStep: step,
    title: `${stepTitle} (${step}/4)`,
    text: step === 1 ? `${data.promotion.title.replace(/^\S+\s/u, "")}\n\n${text}` : text,
    ...art(data.icon, `Nâng bậc ngành ${career.field}`),
    choices,
  };
}

export function createPromotionEvent(player, random = Math.random, age = player.age + 1) {
  const career = player.careerPath ?? { id: "general", field: "ngành đã chọn" };
  const profile = getCareerProfile(career.id, career);
  const level = Math.max(1, Math.min(2, Number(player.careerLevel) || 1));
  const milestone = (hasCareerMilestone(player) || getStudyAbroadCountry(career)) ? careerMilestones[career.id] : null;
  if (level === 1 && milestone) return createMilestonePromotionEvent(player, 1, age, random);
  const targetLevel = level + 1;
  const finalPromotion = targetLevel === 3;
  const scenarios = promotionScenarios[level];
  const scenarioIndex = finalPromotion && milestone
    ? milestone.finalScenario
    : Math.floor(random() * scenarios.length);
  const scenario = scenarios[scenarioIndex];
  // Kinh nghiệm, trí tuệ (theo nghề) và thành tích đặt khả năng cơ bản; cách làm cộng hoặc trừ thêm.
  // Một lần tung khi sự kiện xuất hiện (tải lại không đổi); cách làm có khả năng cao hơn luôn đậu khi cách
  // thấp hơn đậu. Không tăng lương chỉ vì chỉ số cao.
  const chance = getPromotionChance(player, age);
  const roll = random();
  const options = scenario.approaches.map((approach) => {
    const odds = Math.max(PROMOTION.min, Math.min(PROMOTION.max, chance + approach.bonus));
    const cost = describeCost(approach.effects);
    const label = `${approach.label} (≈${Math.round(odds * 100)}%${cost ? ` · ${cost}` : ""})`;
    if (roll < odds) return {
      label, correct: true,
      title: finalPromotion ? `🏆 Chạm tới bậc ${profile.ranks[2]}` : `📈 Tiến lên bậc ${profile.ranks[1]}`,
      text: `${approach.done} Năng lực của bạn được công nhận; bạn được nâng lên bậc ${profile.ranks[targetLevel - 1]}.
Lương mới: ${formatSalary(getCareerAnnualSalary(career.id, targetLevel, career))}/năm, áp dụng từ năm tiếp theo.`,
      effects: addEffects({ intelligence: 4, happiness: 3 }, approach.effects),
      job: profile.ranks[targetLevel - 1],
      careerLevel: targetLevel,
      employmentStatus: "employed",
      playerUpdates: { workMerit: 0 },
      achievementIds: finalPromotion && profile.achievement ? [profile.achievement] : [],
      confirmText: finalPromotion ? "Nhận thành tựu!" : "Tiếp tục cố gắng!",
      ...art(finalPromotion ? "1F3C6" : "1F4C5", "Thăng tiến trong công việc"),
    };
    return {
      label, correct: false,
      title: "📋 Lần này chưa đến lượt",
      text: `${approach.done} Hội đồng chọn người khác ở lần xét này. ${promotionRetryText(player, age)}`,
      effects: addEffects({ intelligence: 2 }, approach.effects),
      achievementIds: [],
      confirmText: "Lần sau sẽ đến lượt!",
      ...art("1F4CB", "Chưa được chọn nâng bậc"),
    };
  });
  for (let index = options.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [options[index], options[swapIndex]] = [options[swapIndex], options[index]];
  }
  return {
    id: `career-promotion-${career.id}-${level}-${scenarioIndex + 1}`,
    kind: "career-promotion",
    title: scenario.title,
    // Công khai khả năng được chọn nếu xử lý đúng (kinh nghiệm, trí tuệ theo nghề, thành tích).
    text: (finalPromotion && milestone
      ? `${capitalize(milestone.mentor)}${hasCareerMilestone(player) ? " — người đồng hành từ năm 16 tuổi —" : ", cố vấn hành trình du học,"} giới thiệu bạn vào vòng xét bậc ${profile.ranks[2]}: ${milestone.finalHook}\n${hasCareerMilestone(player) ? "Dấu mốc năm xưa chỉ mở cánh cửa;" : "Kinh nghiệm làm việc mở cơ hội này;"} bước qua được hay không là ở cách bạn xử lý.\n\n${scenario.text.replace("{field}", career.field)}`
      : scenario.text.replace("{field}", career.field)) +
      `

📊 Khả năng được chọn ghi cạnh từng cách làm (kinh nghiệm, trí tuệ và thành tích đặt mức cơ bản ${Math.round(chance * 100)}%). Dốc sức thì dễ được chọn hơn nhưng phải trả giá.`,
    ...art(level === 1 ? "1F4CA" : "1F3AF", "Cơ hội thăng tiến nghề nghiệp"),
    choices: options,
  };
}

export function createEmploymentEvent(player, age) {
  // Đã đến tuổi nghỉ hưu thì không còn phỏng vấn lại hay xét nâng bậc.
  if (!player.careerPath || player.careerPath.id === "casual" || age >= RETIREMENT_AGE) return null;
  // Chỉ người hoàn thành chuỗi tuổi 16 và học đúng ngành đó mới được tự động phỏng vấn ở tuổi 22
  // (và được hỏi thử lại mỗi năm). Những người khác tự nộp hồ sơ ở Hoạt động → Xin việc.
  const milestone = hasCareerMilestone(player);
  const overseas = Boolean(getStudyAbroadCountry(player.careerPath));
  const internationalGraduate = hasInternationalDegreeForCareer(player);
  if (player.careerPath.id === "study-abroad" && getOverseasJobBlocker(player, age)) return null;
  if ((milestone || overseas) && age === 22 && player.employmentStatus !== "employed") {
    return createJobInterview(player);
  }
  if ((milestone || overseas) && age > 22 && player.employmentStatus === "unemployed") {
    return createInterviewRetryPrompt(player);
  }
  const level = Number(player.careerLevel) || 0;
  const dueAge = player.nextPromotionAge === undefined
    ? (level === 1 ? 27 : null)
    : player.nextPromotionAge;
  // Bậc 3 chỉ được xét khi dấu mốc tuổi 16 có hiệu lực cho đúng ngành.
  // Đang trong diện cảnh báo thì chưa xét nâng bậc.
  if (player.employmentStatus === "employed" && !player.jobWarning && level >= 1 && level < 3 &&
      Number.isInteger(dueAge) && age >= 27 && age >= dueAge &&
      (level === 1 || ((overseas || internationalGraduate || age <= 39) && getRankLock(player).unlocked))) {
    return createPromotionEvent(player, Math.random, age);
  }
  return null;
}
