import { openMojiArt } from "./event-art.js";
import { ensureEventOpenMoji } from "./event-openmoji.js";
// Mỗi ngành có ba câu nhập môn, mỗi câu có ba đáp án và một đáp án đúng.
const question = (text, answers, correct) => ({ text, answers, correct });
export const careerTests = {
  acting: [
    question("Trong diễn xuất, 'động cơ nhân vật' là gì?", ["Điều nhân vật muốn đạt được và lý do hành động", "Tốc độ nói lời thoại", "Vị trí đứng trên sân khấu"], 0),
    question("Khi diễn cận cảnh trước máy quay, cách thể hiện nào thường phù hợp hơn?", ["Luôn nói thật to", "Biểu cảm tinh tế, tự nhiên", "Luôn dùng động tác phóng đại"], 1),
    question("'Ứng tác' trong diễn xuất là gì?", ["Đọc nguyên văn kịch bản", "Dừng cảnh để chờ chỉ dẫn", "Phản ứng và sáng tạo ngay trong tình huống diễn"], 2),
  ],
  military: [
    question("Khi nhận nhiệm vụ nhưng chưa hiểu một bước, bạn nên làm gì?", ["Hỏi lại người phụ trách để xác nhận", "Tự đoán rồi làm ngay", "Nhờ người khác làm thay mà không báo"], 0),
    question("Khi đồng đội báo mệt trong buổi huấn luyện, cách xử lý phù hợp là gì?", ["Bắt tiếp tục để theo kịp đội", "Báo người phụ trách để được hỗ trợ", "Tự ý bỏ cả buổi tập"], 1),
    question("Trên bản đồ, nếu hướng bắc ở phía trên thì hướng đông ở đâu?", ["Bên trái", "Phía dưới", "Bên phải"], 2),
  ],
  singing: [
    question("'Cao độ' của âm thanh nói về điều gì?", ["Âm thanh cao hay thấp", "Âm thanh to hay nhỏ", "Bài hát nhanh hay chậm"], 0),
    question("Khi hát song ca, điều gì giúp hai người hòa hợp?", ["Ai cũng hát lớn hơn người còn lại", "Lắng nghe và giữ nhịp chung", "Mỗi người chọn một tốc độ"], 1),
    question("Trong âm nhạc, 'tempo' chỉ điều gì?", ["Độ lớn âm thanh", "Độ cao của nốt", "Tốc độ của bản nhạc"], 2),
  ],
  painting: [
    question("Trong mô hình pha màu truyền thống đỏ–vàng–xanh lam, trộn xanh lam với vàng tạo màu gì?", ["Xanh lá", "Cam", "Tím"], 0),
    question("Trong một bức tranh, 'bố cục' là gì?", ["Giá tiền của khung tranh", "Cách sắp xếp các yếu tố hình ảnh", "Tên loại giấy dùng để vẽ"], 1),
    question("Vẽ phối cảnh thường giúp tạo cảm giác gì?", ["Mọi vật đều cùng kích thước", "Mọi màu đều sáng hơn", "Chiều sâu và khoảng cách"], 2),
  ],
  medicine: [
    question("Tế bào máu nào có chức năng chính là vận chuyển oxy?", ["Hồng cầu", "Bạch cầu", "Tiểu cầu"], 0),
    question("Cơ quan nào trao đổi oxy và carbon dioxide với không khí?", ["Dạ dày", "Phổi", "Thận"], 1),
    question("Bộ phận nào nối cơ với xương?", ["Dây chằng", "Sụn khớp", "Gân"], 2),
  ],
  programming: [
    question("Trong JavaScript, 3 + 2 * 4 cho kết quả bao nhiêu?", ["11", "20", "14"], 0),
    question("Vòng lặp trong lập trình thường dùng để làm gì?", ["Đổi màu màn hình", "Lặp lại một nhóm thao tác", "Xóa toàn bộ chương trình"], 1),
    question("Mảng JavaScript ['A', 'B', 'C'] có phần tử ở chỉ số 1 là gì?", ["A", "C", "B"], 2),
  ],
  accounting: [
    question("Doanh thu 2 triệu đồng, tổng chi phí 1,5 triệu đồng. Lợi nhuận là bao nhiêu?", ["500.000 đồng", "3.500.000 đồng", "1.500.000 đồng"], 0),
    question("Hàng giá 200.000 đồng được giảm 10%. Giá sau giảm là bao nhiêu?", ["190.000 đồng", "180.000 đồng", "170.000 đồng"], 1),
    question("Có 1 triệu đồng, thu thêm 300.000 đồng rồi chi 450.000 đồng. Còn bao nhiêu?", ["1.150.000 đồng", "750.000 đồng", "850.000 đồng"], 2),
  ],
  law: [
    question("Khi phân tích một tranh chấp giả định, nên bắt đầu từ đâu?", ["Xác định sự việc và chứng cứ liên quan", "Chọn người mình thích hơn", "Kết luận trước rồi tìm lý do"], 0),
    question("Vai trò nào phù hợp với thẩm phán trong phiên tòa giả định?", ["Đại diện riêng cho một bên", "Điều hành xét xử và xem xét vụ việc", "Đưa tin như phóng viên"], 1),
    question("Trong bài tập về thỏa thuận, vì sao cần làm rõ quyền và nghĩa vụ của các bên?", ["Để văn bản dài hơn", "Để không cần đọc lại", "Để biết mỗi bên được gì và phải làm gì"], 2),
  ],
  teaching: [
    question("Cách nào giúp kiểm tra học sinh đã hiểu bài, thay vì chỉ nhớ lời giảng?", ["Yêu cầu giải thích bằng lời của mình", "Chỉ hỏi đã chép xong chưa", "Cho đọc đồng thanh mọi câu"], 0),
    question("Một mục tiêu bài học rõ ràng nên mô tả điều gì?", ["Giáo viên mặc gì", "Học sinh làm được gì sau bài học", "Lớp có bao nhiêu cửa sổ"], 1),
    question("Khi học sinh trả lời sai, phản hồi nào hỗ trợ việc học tốt hơn?", ["Chỉ nói sai rồi chuyển câu", "So sánh với bạn giỏi nhất", "Chỉ ra chỗ cần sửa và gợi ý cách suy nghĩ"], 2),
  ],
  football: [
    question("Một đội hình bóng đá 11 người đầy đủ có bao nhiêu cầu thủ ngoài thủ môn?", ["10", "11", "9"], 0),
    question("Trong sơ đồ 4-3-3, số 4 thường chỉ nhóm cầu thủ nào?", ["Tiền đạo", "Hậu vệ", "Tiền vệ"], 1),
    question("Trong bài tập phối hợp, 'chạy chỗ không bóng' nhằm mục đích gì?", ["Luôn đứng sát người giữ bóng", "Rời sân nghỉ ngơi", "Tạo khoảng trống hoặc phương án chuyền"], 2),
  ],
  psychology: [
    question("Câu hỏi nào mở hơn khi muốn hiểu trải nghiệm của một người?", ["Bạn cảm thấy thế nào về chuyện đó?", "Bạn có buồn không?", "Bạn đã ăn chưa?"], 0),
    question("Nếu hai hiện tượng xuất hiện cùng nhau, có thể kết luận chắc điều gì?", ["Hiện tượng đầu gây ra hiện tượng sau", "Chưa đủ để khẳng định quan hệ nhân quả", "Chúng chắc chắn giống nhau"], 1),
    question("Trong nghiên cứu, 'thiên kiến xác nhận' là xu hướng nào?", ["Xem xét mọi ý kiến như nhau", "Luôn thay đổi quan điểm", "Ưu tiên thông tin ủng hộ điều mình đã tin"], 2),
  ],
  esports: [
    question("Trong Liên Quân, 'last hit' lính nghĩa là gì?", ["Đánh đòn kết liễu lính", "Đánh lính lần đầu", "Chỉ đứng cạnh lính"], 0),
    question("Đối phương đông người hơn ở một phía bản đồ, đội bạn nên ưu tiên gì?", ["Lao vào đánh dù thiếu người", "Gọi thông tin và cân nhắc đổi mục tiêu ở phía khác", "Mỗi người tự chọn một hướng không trao đổi"], 1),
    question("Trong một pha giao tranh, 'peel' cho chủ lực nghĩa là gì?", ["Bỏ chủ lực để đuổi theo đối thủ", "Nhường toàn bộ tài nguyên cho đối phương", "Bảo vệ chủ lực khỏi đối thủ áp sát"], 2),
  ],
  business: [
    question("Doanh thu là 12 triệu đồng và tổng chi phí là 9 triệu đồng. Lợi nhuận bằng bao nhiêu?", ["3 triệu đồng", "9 triệu đồng", "21 triệu đồng"], 0),
    question("Khi khách hàng phản hồi sản phẩm chưa phù hợp, việc nên làm trước là gì?", ["Xóa phản hồi", "Tìm hiểu nhu cầu và nguyên nhân cụ thể", "Tăng giá sản phẩm"], 1),
    question("Một kế hoạch kinh doanh cơ bản cần xác định rõ điều gì?", ["Màu áo của nhân viên", "Tên gọi càng dài càng tốt", "Khách hàng, giá trị cung cấp và chi phí"], 2),
  ],
  finance: [
    question("Gửi 10 triệu đồng với lãi suất 5% một năm, tiền lãi đơn sau một năm là bao nhiêu?", ["500.000 đồng", "5 triệu đồng", "10,5 triệu đồng"], 0),
    question("Đa dạng hóa danh mục đầu tư thường nhằm mục đích gì?", ["Bảo đảm luôn có lãi", "Giảm rủi ro tập trung", "Loại bỏ mọi biến động"], 1),
    question("Dòng tiền dương có nghĩa là gì trong một kỳ?", ["Không phát sinh khoản chi", "Mọi khoản thu đều là lợi nhuận", "Tiền vào lớn hơn tiền ra"], 2),
  ],
  mechanical: [
    question("Dụng cụ nào thường dùng để đo chính xác đường kính một chi tiết nhỏ?", ["Thước cặp", "Búa", "Cờ lê"], 0),
    question("Bôi trơn các chi tiết chuyển động giúp ích chủ yếu điều gì?", ["Tăng màu sắc bề mặt", "Giảm ma sát và mài mòn", "Tăng khối lượng máy"], 1),
    question("Trước khi vận hành máy, việc nào cần được ưu tiên?", ["Tăng tốc độ tối đa", "Bỏ tấm che để dễ quan sát", "Kiểm tra an toàn và tình trạng thiết bị"], 2),
  ],
  architecture: [
    question("Bản vẽ mặt bằng chủ yếu thể hiện điều gì?", ["Cách bố trí không gian nhìn từ trên xuống", "Màu sơn cuối cùng", "Chi phí xây dựng"], 0),
    question("Thông gió và chiếu sáng tự nhiên có vai trò gì trong thiết kế?", ["Chỉ để trang trí mặt đứng", "Cải thiện chất lượng sử dụng không gian", "Làm bản vẽ nhiều chi tiết hơn"], 1),
    question("Tỉ lệ trên bản vẽ kiến trúc dùng để làm gì?", ["Chọn vật liệu đắt hơn", "Quyết định hướng bắc", "Biểu diễn kích thước theo quan hệ với thực tế"], 2),
  ],
  fashion: [
    question("Bản phác thảo thời trang giúp nhà thiết kế làm gì?", ["Thể hiện ý tưởng kiểu dáng ban đầu", "Tính tiền điện xưởng may", "Thay thế hoàn toàn rập may"], 0),
    question("Khi chọn vải cho trang phục vận động, yếu tố nào đáng chú ý?", ["Tên vải phải thật dài", "Độ co giãn và khả năng thoát ẩm", "Vải phải nặng nhất"], 1),
    question("Rập trong may mặc có chức năng chính gì?", ["Trang trí cửa hàng", "Ghi lời quảng cáo", "Làm mẫu để cắt các chi tiết vải"], 2),
  ],
  marketing: [
    question("Khách hàng mục tiêu là ai?", ["Nhóm người có nhu cầu phù hợp với sản phẩm", "Tất cả mọi người không ngoại lệ", "Chỉ những người đã mua hàng"], 0),
    question("Chỉ số chuyển đổi thường cho biết điều gì?", ["Màu quảng cáo được yêu thích", "Tỉ lệ người thực hiện hành động mong muốn", "Số nhân viên trong đội"], 1),
    question("A/B testing dùng để làm gì?", ["Đăng hai quảng cáo giống hệt nhau", "Tăng ngân sách tự động", "So sánh hiệu quả của hai phiên bản"], 2),
  ],
  tourism: [
    question("Khi lịch trình bị chậm vì thời tiết, hướng dẫn viên nên làm gì trước?", ["Thông báo rõ và đề xuất phương án an toàn", "Im lặng để khách tự đoán", "Hủy mọi hoạt động ngay lập tức"], 0),
    question("Một lịch trình du lịch hợp lý cần cân bằng điều gì?", ["Chỉ số lượng điểm đến", "Thời gian di chuyển, trải nghiệm và nghỉ ngơi", "Chỉ thời gian mua sắm"], 1),
    question("Khi giới thiệu văn hóa địa phương, nguyên tắc phù hợp là gì?", ["Kể thêm chi tiết chưa kiểm chứng", "Chỉ nói điều khách muốn nghe", "Tôn trọng cộng đồng và cung cấp thông tin chính xác"], 2),
  ],
  culinary: [
    question("Vì sao cần tách thực phẩm sống khỏi thực phẩm đã nấu chín?", ["Để hạn chế nhiễm chéo", "Để tủ lạnh trông rộng hơn", "Để món ăn đổi màu"], 0),
    question("Nếm và điều chỉnh gia vị nên được thực hiện thế nào?", ["Cho thật nhiều ngay từ đầu", "Thêm từng ít một và nếm lại", "Chỉ nêm sau khi đã phục vụ"], 1),
    question("Việc đầu tiên trước khi chế biến món ăn là gì?", ["Trang trí đĩa", "Bật tất cả bếp", "Vệ sinh tay và khu vực làm việc"], 2),
  ],
};

export function createCareerTest(careerPath, random = Math.random) {
  // Nhập ngũ tự nguyện đi thẳng tới hướng huấn luyện.
  if (["military", "tiktok", "youtube"].includes(careerPath.id)) return null;
  const bank = careerTests[careerPath.id];
  if (!bank) return null;
  const entry = bank[Math.floor(random() * bank.length)];
  return {
    kind: "career-test",
    ...openMojiArt("1F4DD", "Câu hỏi kiểm tra kiến thức trước khi chọn trường"),
    testedCareer: { ...careerPath },
    title: `📝 Bài test ${careerPath.field}`,
    text: `Một câu hỏi nhỏ trước khi bắt đầu hành trình!\n${entry.text}`,
    choices: entry.answers.map((answer, index) => ({ label: answer, correct: index === entry.correct })),
  };
}

export function createFailedTestEvent() {
  return {
    kind: "enlistment-failure",
    ...openMojiArt("1FA96", "Lựa chọn con đường nhập ngũ"),
    title: "🪖 Tiếng gọi của Tổ quốc",
    text: "Bạn đã tạch, đi theo tiếng gọi của tổ quốc thôi",
    choices: [ensureEventOpenMoji({
      label: "🪖 Lên đường nhập ngũ",
      title: "🪖 Hành trình quân ngũ bắt đầu",
      text: "Bạn nhập ngũ tại đơn vị được phân công và bắt đầu học tập, huấn luyện cùng đồng đội.",
      careerPath: { id: "military", field: "Nhập ngũ", school: null, status: "Nhập ngũ" },
      confirmText: "Bắt đầu hành trình!",
      ...openMojiArt("1FA96", "Bắt đầu huấn luyện quân ngũ"),
    })],
  };
}
