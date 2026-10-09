import { ensureEventOpenMoji } from "./event-openmoji.js";
import { createEsportsAgeEvents } from "./events-esports-19-21.js";

// Chi tiết chuyên ngành dùng trong 8 tình huống tuổi 19–21.
// Nhập ngũ và esports có bối cảnh huấn luyện thay vì trường đại học.
const careerStories = {
  acting: {
    field: "Diễn xuất", code: "1F3AD",
    task: "dựng một cảnh kịch tâm lý", project: "vở diễn cuối học phần",
    evidence: "video tập luyện và bản phân vai", exam: "diễn một cảnh độc thoại trước hội đồng",
    opportunity: "vai phụ trong một đoàn diễn sinh viên", crisis: "bạn diễn bỏ buổi tổng duyệt ngay trước đêm công diễn",
    practice: "diễn xuất trước máy quay", showcase: "phim ngắn do lớp tự sản xuất",
  },
  military: {
    field: "Nhập ngũ", code: "1FA96", setting: "đơn vị huấn luyện",
    task: "chuẩn bị phần trình bày kỹ năng phối hợp của tổ", project: "bài luyện phối hợp tiểu đội",
    evidence: "sổ phân công và xác nhận của đồng đội", exam: "hoàn thành bài kiểm tra thể lực và điều lệnh",
    opportunity: "tham gia đội hỗ trợ huấn luyện tân binh", crisis: "một đồng đội báo mệt trước buổi luyện tập chung",
    practice: "phối hợp và báo cáo trong tổ", showcase: "buổi tổng kết kỹ năng của đơn vị",
  },
  singing: {
    field: "Thanh nhạc", code: "1F3A4",
    task: "chuẩn bị một tiết mục song ca", project: "chương trình biểu diễn của lớp",
    evidence: "bản thu tập hát và lịch chia bè", exam: "hát bài thi với phần đệm trực tiếp",
    opportunity: "biểu diễn trong một đêm nhạc nhỏ", crisis: "ca sĩ hát cùng đột ngột mất giọng trước buổi diễn",
    practice: "kỹ thuật hơi và xử lý sân khấu", showcase: "mini concert của nhóm sinh viên",
  },
  painting: {
    field: "Mỹ thuật", code: "1F3A8",
    task: "lên ý tưởng cho một bộ tranh chủ đề", project: "tranh tường của nhóm",
    evidence: "phác thảo có ngày lưu và nhật ký sáng tác", exam: "hoàn thành bài bố cục trong phòng vẽ",
    opportunity: "trưng bày tranh ở một không gian nghệ thuật nhỏ", crisis: "tranh của nhóm bị hỏng một mảng ngay trước ngày triển lãm",
    practice: "phối màu và xây dựng hồ sơ tác phẩm", showcase: "bộ tranh triển lãm cuối học phần",
  },
  medicine: {
    field: "Y khoa", code: "1F9D1",
    task: "chuẩn bị báo cáo về một tình huống chăm sóc giả định", project: "bài thuyết trình ca mô phỏng",
    evidence: "tài liệu tham khảo và lịch sử chỉnh sửa báo cáo", exam: "thực hiện bài kiểm tra kỹ năng trên mô hình",
    opportunity: "hỗ trợ một dự án giáo dục sức khỏe dưới sự hướng dẫn", crisis: "nhóm phát hiện số liệu trong báo cáo mô phỏng bị nhập nhầm",
    practice: "giao tiếp trong tình huống mô phỏng", showcase: "buổi báo cáo học thuật của sinh viên",
  },
  programming: {
    field: "Công nghệ thông tin", code: "1F4BB",
    task: "viết bản mẫu cho một ứng dụng quản lý lịch học", project: "ứng dụng nhóm cuối học phần",
    evidence: "lịch sử commit và bảng chia việc", exam: "sửa lỗi và giải thích thuật toán ngay tại phòng máy",
    opportunity: "thực tập hỗ trợ phát triển phần mềm", crisis: "bản demo lỗi ngay trước giờ trình bày",
    practice: "kiểm thử và đọc mã của người khác", showcase: "sản phẩm dự thi ngày hội công nghệ",
  },
  accounting: {
    field: "Kế toán", code: "1F9EE",
    task: "lập bảng theo dõi thu chi cho một doanh nghiệp giả định", project: "bộ báo cáo kế toán mô phỏng",
    evidence: "bảng tính có lịch sử chỉnh sửa và chứng từ giả định", exam: "đối chiếu các khoản chênh lệch trong đề thực hành",
    opportunity: "thực tập hỗ trợ nhập liệu kế toán", crisis: "bảng tổng hợp của nhóm lệch số ngay sát hạn nộp",
    practice: "đối chiếu chứng từ và trình bày báo cáo", showcase: "đề án phân tích tài chính mô phỏng",
  },
  law: {
    field: "Luật", code: "1F4DA",
    task: "chuẩn bị lập luận cho một vụ tranh chấp giả định", project: "phiên tranh biện của nhóm",
    evidence: "bản nháp lập luận và danh sách nguồn tham khảo", exam: "phân tích hồ sơ giả định trong bài thi vấn đáp",
    opportunity: "thực tập hỗ trợ sắp xếp hồ sơ tại một văn phòng", crisis: "nhóm tìm thấy một chi tiết làm lung lay lập luận ngay trước phiên mô phỏng",
    practice: "đọc hồ sơ và lập luận có căn cứ", showcase: "phiên tòa giả định cấp khoa",
  },
  teaching: {
    field: "Sư phạm", code: "1F3EB",
    task: "soạn một hoạt động học có trò chơi tương tác", project: "tiết dạy thử của nhóm",
    evidence: "bản giáo án gốc và lịch chuẩn bị học cụ", exam: "dạy thử trước lớp và nhận phản biện",
    opportunity: "trợ giảng cho một lớp học dưới sự hướng dẫn", crisis: "thiết bị trình chiếu ngừng hoạt động ngay trước tiết dạy thử",
    practice: "thiết kế bài học và phản hồi cho người học", showcase: "tiết dạy minh họa tại ngày hội sư phạm",
  },
  football: {
    field: "Bóng đá", code: "1F3C1",
    task: "xây dựng một bài tập phối hợp cho đội sinh viên", project: "bài phân tích chiến thuật của nhóm",
    evidence: "video buổi tập và bản sơ đồ chiến thuật", exam: "trình bày phương án huấn luyện và thực hành kỹ thuật",
    opportunity: "hỗ trợ một đội bóng trẻ dưới sự hướng dẫn", crisis: "một cầu thủ trụ cột báo đau trước trận giao hữu",
    practice: "phân tích trận đấu và phân bổ sức tập", showcase: "giải giao hữu kết hợp báo cáo huấn luyện",
  },
  psychology: {
    field: "Tâm lý học", code: "1F9E0",
    task: "thiết kế khảo sát về áp lực học tập", project: "báo cáo khảo sát của nhóm",
    evidence: "bản thiết kế khảo sát và lịch sử xử lý dữ liệu", exam: "phân tích tình huống giả định trong bài vấn đáp",
    opportunity: "hỗ trợ một dự án nghiên cứu của giảng viên", crisis: "nhóm phát hiện tệp khảo sát vẫn chứa thông tin nhận dạng trước khi trình bày",
    practice: "phương pháp nghiên cứu và bảo mật thông tin", showcase: "poster nghiên cứu tại hội nghị sinh viên",
  },
  business: {
    field: "Kinh doanh", code: "1F4B0",
    task: "xây dựng kế hoạch bán hàng cho một sản phẩm giả định", project: "đề án kinh doanh của nhóm",
    evidence: "bản phân tích khách hàng và bảng phân công", exam: "thuyết trình phương án kinh doanh trước hội đồng",
    opportunity: "hỗ trợ vận hành một cửa hàng khởi nghiệp", crisis: "chi phí dự kiến tăng mạnh ngay trước buổi gọi vốn giả định",
    practice: "phân tích khách hàng và quản lý kế hoạch", showcase: "gian hàng thử nghiệm tại ngày hội khởi nghiệp",
  },
  finance: {
    field: "Tài chính", code: "1F4B0",
    task: "phân tích dòng tiền của một doanh nghiệp giả định", project: "báo cáo tài chính của nhóm",
    evidence: "bảng tính nguồn và lịch sử chỉnh sửa", exam: "đánh giá một phương án đầu tư trong buổi vấn đáp",
    opportunity: "thực tập hỗ trợ phân tích dữ liệu tài chính", crisis: "mô hình dự báo xuất hiện sai lệch lớn sát giờ trình bày",
    practice: "đánh giá rủi ro và trình bày số liệu", showcase: "đề án phân tích đầu tư sinh viên",
  },
  mechanical: {
    field: "Cơ khí", code: "1F6E0",
    task: "thiết kế mô hình một cơ cấu truyền động", project: "mô hình máy của nhóm",
    evidence: "bản vẽ kỹ thuật và nhật ký gia công", exam: "đo kiểm chi tiết và giải thích nguyên lý máy",
    opportunity: "thực tập tại xưởng cơ khí dưới sự hướng dẫn", crisis: "một chi tiết lắp ghép sai kích thước trước buổi nghiệm thu",
    practice: "đọc bản vẽ và kiểm tra sai số", showcase: "mô hình cơ khí tại ngày hội kỹ thuật",
  },
  architecture: {
    field: "Kiến trúc", code: "1F3EB",
    task: "lên phương án cho một không gian cộng đồng nhỏ", project: "đồ án kiến trúc của nhóm",
    evidence: "bản phác thảo, mô hình và lịch sử chỉnh sửa", exam: "bảo vệ phương án thiết kế trước hội đồng",
    opportunity: "thực tập hỗ trợ triển khai bản vẽ", crisis: "mô hình bị hỏng một phần ngay trước buổi bảo vệ",
    practice: "tổ chức không gian và trình bày bản vẽ", showcase: "triển lãm đồ án kiến trúc sinh viên",
  },
  fashion: {
    field: "Thiết kế thời trang", code: "1F3A8",
    task: "phát triển ý tưởng cho một bộ trang phục", project: "bộ sưu tập mini của nhóm",
    evidence: "phác thảo, bảng chất liệu và mẫu thử", exam: "trình bày thiết kế cùng sản phẩm mẫu",
    opportunity: "hỗ trợ hậu trường cho một buổi trình diễn nhỏ", crisis: "trang phục chủ đạo gặp lỗi đường may sát giờ diễn",
    practice: "xử lý chất liệu và hoàn thiện phom dáng", showcase: "show thời trang sinh viên",
  },
  marketing: {
    field: "Marketing", code: "1F4F1",
    task: "lập kế hoạch truyền thông cho một thương hiệu giả định", project: "chiến dịch marketing của nhóm",
    evidence: "bản nghiên cứu khách hàng và lịch nội dung", exam: "thuyết trình chiến dịch với ngân sách giới hạn",
    opportunity: "hỗ trợ nội dung cho một thương hiệu nhỏ", crisis: "một thông điệp quảng cáo bị hiểu sai ngay trước ngày chạy chiến dịch",
    practice: "nghiên cứu khách hàng và đo hiệu quả nội dung", showcase: "cuộc thi chiến dịch truyền thông sinh viên",
  },
  tourism: {
    field: "Du lịch", code: "1F5FA",
    task: "thiết kế lịch trình trải nghiệm địa phương", project: "tour mô phỏng của nhóm",
    evidence: "lịch trình, bảng chi phí và xác nhận điểm đến", exam: "xử lý một tình huống hướng dẫn tour giả định",
    opportunity: "hỗ trợ điều phối một đoàn khách nhỏ", crisis: "thời tiết thay đổi khiến một điểm trong lịch trình phải đóng cửa",
    practice: "thuyết minh và xử lý thay đổi lịch trình", showcase: "ngày hội giới thiệu sản phẩm du lịch",
  },
  culinary: {
    field: "Ẩm thực", code: "1F373",
    task: "xây dựng thực đơn cho một bữa ăn theo chủ đề", project: "buổi phục vụ món ăn của nhóm",
    evidence: "công thức thử nghiệm và bảng phân công bếp", exam: "chế biến món ăn trong thời gian giới hạn",
    opportunity: "thực tập hỗ trợ tại một căn bếp chuyên nghiệp", crisis: "một nguyên liệu chính không đạt chất lượng ngay trước giờ phục vụ",
    practice: "tổ chức gian bếp và cân bằng hương vị", showcase: "cuộc thi ẩm thực sinh viên",
  },
  esports: {
    field: "Liên Quân Mobile", code: "1F4F1", setting: "đội tuyển tập luyện",
    task: "chuẩn bị chiến thuật cho một trận đấu tập", project: "bản phân tích trận đấu của đội",
    evidence: "video replay và tin nhắn phân công", exam: "thi đấu vòng tuyển chọn với một đội mạnh",
    opportunity: "thử sức trong một giải cộng đồng", crisis: "đồng đội mất kết nối ngay trước buổi đấu tập quan trọng",
    practice: "giao tiếp trong đội và đọc bản đồ", showcase: "giải đấu cộng đồng của đội",
  },
  tiktok: {
    field: "Sáng tạo nội dung TikTok", code: "1F4F1",
    task: "viết kịch bản cho một chuỗi video ngắn", project: "chiến dịch video ngắn của nhóm",
    evidence: "kịch bản gốc và tệp quay thô", exam: "dựng một video theo đề bài trong thời gian giới hạn",
    opportunity: "sản xuất nội dung cho một cửa hàng nhỏ", crisis: "video nháp bị đăng nhầm và bị cắt ngữ cảnh trong phần bình luận",
    practice: "dựng video và kiểm tra thông tin trước khi đăng", showcase: "chuỗi video cho ngày hội truyền thông",
  },
  youtube: {
    field: "Sáng tạo nội dung YouTube", code: "1F4F9",
    task: "lên dàn ý cho một video kể chuyện dài", project: "tập video đầu tiên của nhóm",
    evidence: "dàn ý gốc và lịch sử dựng video", exam: "dựng một phóng sự ngắn theo đề bài",
    opportunity: "hỗ trợ sản xuất cho một kênh nhỏ", crisis: "ổ lưu trữ gặp lỗi khiến nhóm chưa mở được bản dựng sát giờ chiếu",
    practice: "kể chuyện bằng hình ảnh và xử lý âm thanh", showcase: "video dài trình chiếu tại ngày hội truyền thông",
  },
};

const generalStory = {
  field: "ngành đang theo học", code: "1F4DA",
  task: "chuẩn bị một bài thuyết trình chuyên ngành", project: "dự án nhóm cuối học phần",
  evidence: "bản nháp và bảng phân công", exam: "giải bài tập chuyên ngành trong buổi vấn đáp",
  opportunity: "tham gia một dự án thực hành", crisis: "một phần tài liệu nhóm bị thất lạc sát giờ báo cáo",
  practice: "kỹ năng chuyên ngành", showcase: "dự án trình bày tại ngày hội sinh viên",
};

const sticker = (code) => new URL(`./img/events/openmoji/color/svg/${code}.svg`, import.meta.url).href;
function illustration(code, alt) {
  return {
    image: sticker(code),
    imageAlt: alt,
    imageFallback: sticker(code),
    imageFallbackAlt: alt,
  };
}
function choice(label, title, text, effects, code) {
  return {
    label, title, text, effects,
    ...illustration(code, title),
    confirmText: "Tiếp tục hành trình!",
    achievementIds: [],
  };
}

// Mỗi năm chọn ngẫu nhiên một tình huống, giống cơ chế các năm trước.
// Tuổi 20 chỉ có hai mục; có thể thêm mục đặc biệt vào mảng tuổi 20 sau.
export function createCareerAgeEvents(careerPath) {
  const path = careerStories[careerPath?.id] ?? {
    ...generalStory, field: careerPath?.field ?? generalStory.field,
  };
  const careerId = careerStories[careerPath?.id] ? careerPath.id : "general";
  const event = (age, index, title, text, code, choices) => ({
    id: `career-${careerId}-${age}-${index}`,
    title, text,
    ...illustration(code, title),
    choices: choices.map(branch => ensureEventOpenMoji(branch)),
  });

  if (careerId === "esports") return createEsportsAgeEvents(event, choice);

  return {
    19: [
      event(19, 1, "🔥 Bị đẩy lên ghế nóng",
        `Bạn được giao ${path.task}. Người thường dẫn dắt nhóm bất ngờ rút lui, còn người bạn hay cạnh tranh buông một câu: “Để xem bạn làm được tới đâu.” Cả nhóm quay sang chờ bạn.`, path.code, [
          choice("📋 Nhận phần dẫn dắt, chia việc rõ ràng", "🤝 Kéo cả nhóm cùng tiến",
            `Bạn chia ${path.task} thành từng phần và cùng mọi người tập thử. Buổi trình bày còn vài chỗ vụng, nhưng nhóm đứng ra nhận trách nhiệm cùng bạn. Người từng châm chọc cũng phải công nhận bạn đã giữ được nhịp.`,
            { intelligence: 4, happiness: 2 }, "1F91D"),
          choice("🔥 Ôm hết để chứng minh bản thân", "🥱 Có thành quả, hết pin",
            `Bạn tự hoàn thiện phần chuẩn bị cho ${path.task} đến khuya. Kết quả giúp bạn được chú ý, nhưng hôm sau mệt rã rời; vài thành viên còn nghĩ bạn không tin họ.`,
            { intelligence: 3, happiness: -2, health: -3 }, "1F4DA", "sleepy"),
        ]),
      event(19, 2, "🎭 Ai đang nhận công của bạn?",
        `Trong ${path.project}, một thành viên trình bày phần bạn làm như ý tưởng riêng của họ. Bạn vẫn giữ ${path.evidence}. Họ kéo bạn ra ngoài và đề nghị “đừng làm lớn chuyện”.`, "1F5E3", [
          choice("🧾 Đưa bằng chứng, yêu cầu ghi đúng đóng góp", "📌 Đòi lại tên mình",
            `Bạn trình bày ${path.evidence} với người hướng dẫn và cả nhóm. Phần đóng góp được sửa lại. Không khí căng thẳng vài hôm, nhưng từ đó mọi người ghi việc rõ ràng hơn.`,
            { intelligence: 3, happiness: -1 }, "1F4CB"),
          choice("🤝 Nói riêng và cho họ cơ hội sửa", "🗣️ Một thỏa thuận khó nuốt",
            `Bạn yêu cầu họ đính chính phần đóng góp trong ${path.project}. Họ đồng ý và nói lại trước nhóm; bạn giữ được quan hệ nhưng chưa thể tin ngay như cũ.`,
            { intelligence: 2, happiness: 1 }, "1F91D"),
        ]),
      event(19, 3, "📱 Tin đồn chạy nhanh hơn lời giải thích",
        `Một đoạn trao đổi về ${path.project} bị chụp thiếu ngữ cảnh và lan trong nhóm chung. Có người nói bạn được ưu ái, có người hùa theo chỉ để đùa. Điện thoại rung liên tục trước giờ học.`, "1F4F1", [
          choice("🔎 Làm rõ với người liên quan và người hướng dẫn", "🌤️ Sự thật có chỗ đứng",
            `Bạn dùng ${path.evidence} để giải thích đầy đủ. Người đăng ảnh bổ sung ngữ cảnh, những lời đồn dịu xuống. Bạn vẫn buồn vì vài người đã vội tin, nhưng biết ai sẵn sàng lắng nghe.`,
            { intelligence: 2, happiness: 2 }, "1F9ED"),
          choice("💬 Đăng ngay một bài đáp trả gay gắt", "💥 Thắng câu chữ, mệt lòng",
            `Bạn nêu rõ công sức trong ${path.project}, nhưng giọng điệu khiến hai phe cãi nhau đến tối. Có người hiểu bạn hơn, có người chặn bạn; buổi sau cả nhóm phải ngồi lại để tiếp tục làm việc.`,
            { happiness: -4, health: -1 }, "1F5E3"),
        ]),
    ],
    20: [
      event(20, 1, "📝 Bài kiểm tra và đường tắt đáng ngờ",
        `Bạn sắp phải ${path.exam}. Một người quen gửi “đáp án chắc chắn” và rủ dùng chung. Họ bảo nếu bạn không tham gia thì đừng kể cho ai, khiến nhóm ôn tập bỗng chia phe.`, "1F4DD", [
          choice("📚 Từ chối đáp án, ôn theo tài liệu chính thức", "🧠 Đi bằng kiến thức của mình",
            `Bạn luyện lại những phần khó để ${path.exam}. Kết quả không hoàn hảo, nhưng bạn hiểu mình đang thiếu gì và tránh được rắc rối khi nguồn “đáp án” bị phát hiện là không đáng tin.`,
            { intelligence: 4, happiness: 1 }, "1F4DA"),
          choice("⚠️ Báo người phụ trách và xin hỗ trợ ôn tập", "⚖️ Chọn một cuộc nói chuyện khó",
            `Bạn báo riêng về tài liệu đáng ngờ trước buổi kiểm tra ${path.field}. Người phụ trách làm rõ tình hình và hỗ trợ phần ôn tập. Một người bạn giận bạn, nhưng bạn không phải mang nỗi lo gian lận vào buổi thi.`,
            { intelligence: 2, happiness: -2 }, "1F4CB"),
        ]),
      event(20, 2, "🚪 Cơ hội đi kèm một cái giá",
        `Bạn có cơ hội ${path.opportunity}. Người phụ trách muốn bạn bắt đầu ngay, đúng lúc ${path.project} cần bạn nhất. Một đồng đội nói: “Bạn đi thì coi như bỏ tụi mình.”`, path.code, [
          choice("🗓️ Thương lượng lịch và bàn giao phần việc", "🌱 Giữ cơ hội, giữ lời hứa",
            `Bạn thống nhất thời gian cho ${path.opportunity}, đồng thời bàn giao phần việc trong ${path.project}. Bạn học được nhiều điều thực tế; lịch khá kín nhưng không ai phải gánh một khoảng trống bất ngờ.`,
            { intelligence: 4, happiness: 2, health: -1 }, "1F91D"),
          choice("🤝 Hoàn thành việc nhóm, xin cơ hội đợt sau", "💛 Không để bạn bè đứng một mình",
            `Bạn ở lại hoàn thành ${path.project} và gửi lời cảm ơn người mời. Cơ hội lần này qua đi khiến bạn tiếc, nhưng nhóm tin bạn hơn và bạn có thêm một sản phẩm tốt để giới thiệu lần tới.`,
            { intelligence: 2, happiness: 3 }, "1F9E9"),
        ]),
    ],
    21: [
      event(21, 1, "🚨 Sự cố sát giờ quyết định",
        `Khi chuẩn bị ${path.showcase}, ${path.crisis}. Người cạnh tranh với bạn đề nghị giấu sự cố, còn nhóm thì nhìn đồng hồ và bắt đầu hoảng.`, "1F6E0", [
          choice("📣 Báo người hướng dẫn, đổi sang phương án dự phòng", "🛠️ Cứu phần có thể cứu",
            `Bạn nói rõ sự cố và cùng người hướng dẫn điều chỉnh ${path.showcase}. Phần trình bày bị thu gọn, nhưng nhóm không phải đánh đổi chất lượng để che giấu vấn đề. Bạn được ghi nhận vì giữ bình tĩnh.`,
            { intelligence: 4, happiness: 1 }, "1F6E0"),
          choice("🛑 Xin lùi phần trình bày để sửa cho đúng", "⏳ Chậm một nhịp, chắc hơn",
            `Nhóm tạm dừng phần chưa ổn của ${path.showcase} và xin lịch bổ sung. Bạn bỏ lỡ lượt được chú ý đầu tiên, nhưng sửa được sự cố; đồng đội cảm ơn vì bạn không ép mọi người tiếp tục bằng mọi giá.`,
            { intelligence: 2, happiness: -1, health: 2 }, "1F4CB"),
        ]),
      event(21, 2, "🧭 Lời hứa từ một người đi trước",
        `Một người đi trước khen khả năng ${path.practice} của bạn và hứa mở cửa cho một dự án lớn. Đổi lại, họ muốn bạn bỏ lịch đang có để làm nhiều buổi không rõ thời hạn. Bạn bè bảo đây là cơ hội chỉ tới một lần.`, "1F9ED", [
          choice("📋 Hỏi rõ nhiệm vụ và đặt giới hạn thời gian", "🌿 Học hỏi mà vẫn giữ mình",
            `Bạn yêu cầu kế hoạch cụ thể cho phần ${path.practice}. Người ấy đồng ý cho bạn thử một nhiệm vụ nhỏ với lịch rõ ràng. Bạn học được thêm kinh nghiệm mà vẫn theo kịp việc học và nghỉ ngơi.`,
            { intelligence: 3, happiness: 2 }, "1F4CB"),
          choice("🔥 Nhận ngay để không bỏ lỡ cơ hội", "🥱 Lời hứa chưa thành, lịch đã kín",
            `Bạn dành liên tiếp nhiều buổi cho ${path.practice}. Có thêm kinh nghiệm, nhưng dự án lớn vẫn chưa rõ ngày bắt đầu. Khi việc học bị dồn lại, bạn phải thương lượng lại lịch trong tình trạng rất mệt.`,
            { intelligence: 2, health: -4, happiness: -2 }, "1F4DA", "sleepy"),
        ]),
      event(21, 3, "🏆 Tỏa sáng hay cùng nhau đi tiếp?",
        `Sau khi chuẩn bị ${path.showcase}, bạn được đề nghị đứng tên trình bày chính. Một đồng đội đã làm cùng bạn từ đầu lại bị bỏ khỏi danh sách giới thiệu. Họ im lặng rời cuộc họp, để lại phần việc chưa bàn giao.`, "1F3C6", [
          choice("🤝 Yêu cầu ghi đủ tên và mời bạn ấy trở lại", "✨ Một thành quả có đủ mọi người",
            `Bạn giải thích đóng góp của từng người trong ${path.showcase}. Danh sách được sửa, đồng đội quay lại và buổi trình bày diễn ra trọn vẹn. Bạn vẫn có cơ hội nổi bật nhờ biết dẫn dắt một tập thể.`,
            { intelligence: 3, happiness: 4 }, "1F91D"),
          choice("🎤 Giữ lượt trình bày, tự hoàn thiện phần còn thiếu", "🎭 Có ánh đèn, thiếu một người bạn",
            `Bạn tự ráp lại phần cuối của ${path.showcase} và được chú ý sau buổi trình bày. Tuy nhiên, người bạn cũ không còn muốn làm nhóm với bạn; lần này thành công đi cùng một khoảng cách khó sửa.`,
            { intelligence: 4, happiness: -3, health: -2 }, "1F3C6"),
        ]),
    ],
  };
}
