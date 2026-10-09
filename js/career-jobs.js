import { getCareerAnnualSalary, formatSalary } from "./career-salary.js";

const sticker = (code) =>
  new URL(`./img/events/openmoji/color/svg/${code}.svg`, import.meta.url).href;

const art = (code, alt) => ({
  image: sticker(code),
  imageAlt: alt,
  imageFallback: sticker(code),
  imageFallbackAlt: alt,
});

const profiles = {
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

export function getCareerProfile(careerId) {
  return profiles[careerId] ?? fallbackProfile;
}

const careerInterviewTopics = {
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

export function getEmploymentContext(careerId) {
  return employmentContexts[careerId] ?? fallbackEmploymentContext;
}

function createCareerSpecificQuestions(career, profile) {
  const topic = careerInterviewTopics[career.id];
  if (!topic) return null;
  const context = getEmploymentContext(career.id);
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
  }));
  for (let index = answers.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [answers[index], answers[swapIndex]] = [answers[swapIndex], answers[index]];
  }
  return answers;
}

export function createJobInterview(player, random = Math.random) {
  const career = player.careerPath ?? { id: "general", field: "ngành đã chọn" };
  const profile = getCareerProfile(career.id);
  const context = getEmploymentContext(career.id);
  const question = createInterviewQuestion(career, profile, random);
  const isEsports = career.id === "esports";
  const academy = career.school?.name ?? "academy";
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

export function createInterviewResult(player, passed, age) {
  const career = player.careerPath ?? { id: "general", field: "ngành đã chọn" };
  const profile = getCareerProfile(career.id);
  const context = getEmploymentContext(career.id);
  const isEsports = career.id === "esports";
  const academy = career.school?.name ?? "academy";
  if (passed) {
    const salaryText = `Lương cố định: ${formatSalary(getCareerAnnualSalary(career.id, 1))}/năm.`;
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
  const context = getEmploymentContext(player.careerPath?.id);
  const academy = player.careerPath?.school?.name ?? "academy";
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
    return { nextPromotionAge: level === 2 && retryAge > 39 ? null : retryAge };
  }
  const finalAge = age + 10;
  return { nextPromotionAge: level === 1 && finalAge <= 39 ? finalAge : null };
}

const promotionScenarios = {
  1: [
    {
      title: "📋 Công việc sát hạn",
      text: "Một nhiệm vụ trong ngành {field} gặp trục trặc ngay trước hạn. Đồng nghiệp chờ bạn đưa ra cách xử lý, còn cấp trên đang theo dõi năng lực của bạn.",
      answers: ["🧭 Xác định vấn đề, chia việc và phối hợp cả nhóm", "🔥 Ôm hết việc, khỏi cần hỏi ai", "🤫 Giấu trục trặc, mong mọi chuyện tự ổn"],
    },
    {
      title: "🔎 Sai sót bất ngờ",
      text: "Bạn phát hiện một sai sót trong công việc ngành {field}. Nếu bỏ qua, người khác có thể bị ảnh hưởng. Cấp trên muốn biết bạn sẽ làm gì.",
      answers: ["✅ Kiểm tra, báo người phụ trách và cùng sửa sai", "🙈 Bỏ qua vì chắc không ai nhận ra", "👉 Đổ lỗi cho đồng nghiệp trước đã"],
    },
  ],
  2: [
    {
      title: "🚀 Dẫn dắt nhiệm vụ lớn",
      text: "Bạn được cân nhắc cho bậc cao nhất của ngành {field}. Trong nhiệm vụ quyết định, cả nhóm bất đồng về cách làm và tiến độ đang chậm lại.",
      answers: ["🤝 Lắng nghe, đối chiếu dữ kiện và thống nhất kế hoạch", "👑 Bắt mọi người làm theo ý mình", "🏃 Bỏ mặc cả nhóm tự giải quyết"],
    },
    {
      title: "⚖️ Quyết định quan trọng",
      text: "Một kế hoạch lớn trong ngành {field} hứa hẹn thành công nhưng có rủi ro chưa được kiểm tra. Bạn phải quyết định với tư cách người dẫn dắt.",
      answers: ["🛡️ Đánh giá rủi ro, kiểm tra và chuẩn bị phương án dự phòng", "🎲 Triển khai ngay, thành công nhờ may mắn", "🤐 Giấu rủi ro để kế hoạch được duyệt"],
    },
  ],
};

export function createPromotionEvent(player, random = Math.random, age = player.age + 1) {
  const career = player.careerPath ?? { id: "general", field: "ngành đã chọn" };
  const profile = getCareerProfile(career.id);
  const level = Math.max(1, Math.min(2, Number(player.careerLevel) || 1));
  const targetLevel = level + 1;
  const finalPromotion = targetLevel === 3;
  const scenarios = promotionScenarios[level];
  const scenarioIndex = Math.floor(random() * scenarios.length);
  const scenario = scenarios[scenarioIndex];
  const options = [
    {
      label: scenario.answers[0],
      correct: true,
      title: finalPromotion ? `🏆 Chạm tới bậc ${profile.ranks[2]}` : `📈 Tiến lên bậc ${profile.ranks[1]}`,
      text: `Bạn xử lý tình huống bình tĩnh, giữ đúng trách nhiệm và giúp công việc đi đến kết quả tốt. Năng lực của bạn được công nhận; bạn được nâng lên bậc ${profile.ranks[targetLevel - 1]}.\nLương mới: ${formatSalary(getCareerAnnualSalary(career.id, targetLevel))}/năm, áp dụng từ năm tiếp theo.`,
      effects: { intelligence: 4, happiness: 3 },
      job: profile.ranks[targetLevel - 1],
      careerLevel: targetLevel,
      employmentStatus: "employed",
      achievementIds: finalPromotion && profile.achievement ? [profile.achievement] : [],
      confirmText: finalPromotion ? "Nhận thành tựu!" : "Tiếp tục cố gắng!",
      ...art(finalPromotion ? "1F3C6" : "1F4C5", "Thăng tiến trong công việc"),
    },
    {
      label: scenario.answers[1],
      correct: false,
      title: "🥱 Có cố gắng, chưa đúng cách",
      text: "Cách xử lý chưa phù hợp nên bạn chưa được nâng bậc. Bạn sẽ có cơ hội thử lại sau 2 năm, nếu còn trong giới hạn tuổi của lần nâng bậc này.",
      effects: { intelligence: 1, health: -3, happiness: -1 },
      achievementIds: [],
      confirmText: "Lần sau làm tốt hơn!",
      ...art("1F4DA", "Mệt mỏi vì ôm quá nhiều việc"),
    },
    {
      label: scenario.answers[2],
      correct: false,
      title: "⚠️ Bài học về trách nhiệm",
      text: "Quyết định của bạn chưa giải quyết được vấn đề. Bạn giữ nguyên bậc và sẽ được thử lại sau 2 năm, nếu còn trong giới hạn tuổi của lần nâng bậc này.",
      effects: { happiness: -3 },
      achievementIds: [],
      confirmText: "Rút kinh nghiệm!",
      ...art("26A1", "Công việc gặp cảnh báo"),
    },
  ];
  for (const option of options) {
    if (option.correct) continue;
    const retryAge = getPromotionUpdates(player, age, false).nextPromotionAge;
    option.text = retryAge === null
      ? "Cách xử lý chưa phù hợp nên bạn giữ nguyên bậc nghề. Cơ hội nâng bậc cuối đã kết thúc vì lần thử lại sẽ vượt quá 39 tuổi."
      : `Cách xử lý chưa phù hợp nên bạn giữ nguyên bậc nghề. Bạn sẽ được thử lại sau 2 năm, ở tuổi ${retryAge}.`;
  }
  for (let index = options.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [options[index], options[swapIndex]] = [options[swapIndex], options[index]];
  }
  return {
    id: `career-promotion-${career.id}-${level}-${scenarioIndex + 1}`,
    kind: "career-promotion",
    title: scenario.title,
    text: scenario.text.replace("{field}", career.field),
    ...art(level === 1 ? "1F4CA" : "1F3AF", "Cơ hội thăng tiến nghề nghiệp"),
    choices: options,
  };
}

export function createEmploymentEvent(player, age) {
  if (!player.careerPath) return null;
  if (age === 22 && player.employmentStatus !== "employed") {
    return createJobInterview(player);
  }
  if (age > 22 && player.employmentStatus === "unemployed") {
    return createInterviewRetryPrompt(player);
  }
  const level = Number(player.careerLevel) || 0;
  const dueAge = player.nextPromotionAge === undefined
    ? (level === 1 ? 27 : null)
    : player.nextPromotionAge;
  if (player.employmentStatus === "employed" && level >= 1 && level < 3 &&
      Number.isInteger(dueAge) && age >= 27 && age >= dueAge &&
      (level === 1 || age <= 39)) {
    return createPromotionEvent(player, Math.random, age);
  }
  return null;
}
