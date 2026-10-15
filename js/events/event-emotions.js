 
const faces = /[\u{1F600}-\u{1F64F}\u{1F910}-\u{1F92F}\u{1F970}-\u{1F97A}☺☹]/gu;
const sourceRules = [
  [/(?:hoảng hốt|hoảng sợ|sợ hãi|sợ chết khiếp|giật mình|thót tim|đột nhiên.*(?:chó|lao tới|phi ra|đuổi|tiếng hét))/iu, "😨"],
  [/(?:đau buồn|đau lòng|bật khóc|rơi nước mắt|nhớ.*da diết|buồn bã|tủi thân|cô đơn|mất người thân)/iu, "😢"],
  [/(?:tức giận|bực mình|bực bội|ấm ức|nổi giận)/iu, "😠"],
  [/(?:lo lắng|bồn chồn|bất an|lo âu|run tay|nơm nớp|nỗi lo|căng thẳng)/iu, "😟"],
  [/(?:xấu hổ|ngượng ngùng|ngượng chín mặt|đỏ mặt|bối rối)/iu, "😳"],
  [/(?:thất vọng|tiếc nuối|chán nản|hối hận|ân hận|buồn rầu)/iu, "😔"],
  [/(?:thở phào|nhẹ nhõm|trút.*gánh nặng|yên tâm hơn)/iu, "😌"],
  [/(?:hạnh phúc|ấm lòng|được yêu thương|rung động|tim.*rộn ràng)/iu, "🥰"],
  [/(?:tự hào|đầy tự tin|tự tin hơn|hãnh diện)/iu, "😎"],
  [/(?:vui sướng|vui mừng|vui vẻ|rất vui|vui quá|cười vui|cười tươi|mừng rỡ|háo hức|phấn khởi|sung sướng)/iu, "😊"],
  [/(?:ngạc nhiên|sững sờ|sửng sốt|không tin vào mắt|không thể tin|bất ngờ.*(?:thấy|nhận|gặp))/iu, "😲"],
];
 
const wholeWord = (pattern) => new RegExp(String.raw`(?<![\p{L}\p{M}])(?:${pattern.source})(?![\p{L}\p{M}])`, "iu");
const rules = sourceRules.map(([pattern, icon]) => [wholeWord(pattern), icon]);

export function addEventEmotions(text) {
  if (typeof text !== "string" || !text) return text;
  let remaining = Math.max(0, 2 - (text.match(faces)?.length ?? 0));
  if (!remaining) return text;
  let previous = "";
  return text.replace(/[^\n]+/gu, line => line.replace(/.+?(?:[.!?…]+(?=\s|$)|$)/gu, sentence => {
    if (!remaining || /\p{Extended_Pictographic}/u.test(sentence)) return sentence;
     
     
    if (!/(?:\btôi\b|\bmình\b|\bbạn\b|đột nhiên)/iu.test(sentence) ||
        /(?:^[^.!?]*:|Sức khỏe|Hạnh phúc\s*[+\-:]|Trí tuệ|Ngoại hình|xác suất|nguy cơ|bấm|nhấn|chọn nút)/iu.test(sentence) ||
        /(?:không|chẳng|chưa|đừng|hết)\s+(?:(?:còn|thấy|cảm thấy|hề|thể|muốn|được)\s+){0,3}(?:vui|buồn|lo|sợ|tự hào|tự tin|hạnh phúc|háo hức|bất an|ngạc nhiên|thất vọng|bực|tức|xấu hổ|rung động)/iu.test(sentence)) return sentence;
    const icon = rules.find(([pattern]) => pattern.test(sentence))?.[1];
    if (!icon || icon === previous) return sentence;
    previous = icon;
    remaining--;
    return sentence.replace(/([.!?…]+)?$/u, `${icon}$1`);
  }));
}

const sourceActions = [
  [/(?:từ chối|không (?:đồng ý|tham gia|nhận|đi|mua|bán|vay|học|uống)|bỏ qua|rời đi|dừng lại|tránh xa)/iu, "🙅"],
  [/(?:bán hàng rong)/iu, "🧺"],
  [/(?:bán vé số|mua vé số)/iu, "🎟️"],
  [/(?:nghỉ việc|thôi việc|nghỉ nghề)/iu, "🚪"],
  [/(?:nghỉ ngơi|nghỉ dưỡng|thư giãn|ngủ)/iu, "🛌"],
  [/(?:cấp cứu|gọi cứu thương)/iu, "🚑"],
  [/(?:báo (?:công an|cảnh sát)|tố cáo|trình báo)/iu, "🚔"],
  [/(?:trả nợ|bồi thường|thanh toán|chi trả|học phí)/iu, "💸"],
  [/(?:kiểm tra|xem xét|xác minh|đối chiếu|tìm hiểu|nghiên cứu)/iu, "🔎"],
  [/(?:ép (?:mọi người|người|buộc)|áp đặt|bắt (?:tiếp tục|phải)|ra lệnh|quát|hét|nói thật to)/iu, "😠"],
  [/(?:không trao đổi|im lặng|không nói|giữ kín|giấu kín|lờ đi|phớt lờ)/iu, "😶"],
  [/(?:lắng nghe|nghe.*(?:góp ý|chia sẻ|tâm sự)|giữ nhịp chung)/iu, "👂"],
  [/(?:giả vờ|giả bộ|nói dối|che giấu|qua mặt)/iu, "🤥"],
  [/(?:tự đoán|đoán đại|đánh liều|liều lĩnh|mạo hiểm|tự ý)/iu, "😬"],
  [/(?:nhờ|xin giúp|hỗ trợ|phụ trách|hợp tác|phối hợp|thỏa thuận|thảo luận)/iu, "🤝"],
  [/(?:chia sẻ|tâm sự|trò chuyện|trao đổi|nói chuyện|gọi điện|nhắn tin)/iu, "💬"],
  [/(?:cảm ơn|biết ơn|trân trọng)/iu, "🙏"],
  [/(?:chờ|đợi|kiên nhẫn)/iu, "⏳"],
  [/(?:tiết kiệm|ngân sách|dự phòng|đầu tư|gửi ngân hàng)/iu, "💰"],
  [/(?:trả nợ|vay|mượn tiền|bồi thường|thanh toán|chi trả|học phí|tiền)/iu, "💸"],
  [/(?:mua|bán|đổi đồ|cửa hàng)/iu, "🛍️"],
  [/(?:vé máy bay|bay|chuyến bay)/iu, "✈️"],
  [/(?:khám bệnh|đi khám|chữa|điều trị|bác sĩ|bệnh viện|cấp cứu)/iu, "🩺"],
  [/(?:thuốc|uống thuốc)/iu, "💊"],
  [/(?:ăn|bữa|nấu|món|thức ăn)/iu, "🍲"],
  [/(?:uống|cà phê|trà)/iu, "☕"],
  [/(?:xin việc|ứng tuyển|làm việc|công việc|nghề|nhiệm vụ)/iu, "💼"],
  [/(?:báo (?:công an|cảnh sát)|tố cáo|trình báo)/iu, "🚔"],
  [/(?:báo cáo|báo lại|thông báo|báo người)/iu, "📣"],
  [/(?:sáng tạo|diễn xuất|diễn|kịch bản|sân khấu|biểu cảm|lời thoại)/iu, "🎭"],
  [/(?:hát|âm nhạc|âm thanh|bài hát|nốt|giai điệu|nhịp)/iu, "🎵"],
  [/(?:tốc độ|nhanh|chậm)/iu, "⏱️"],
  [/(?:bức tranh|vẽ|hình ảnh|pha màu|xanh|vàng|đỏ|cam|tím)/iu, "🎨"],
  [/(?:hồng cầu|bạch cầu|tiểu cầu|tế bào|máu)/iu, "🩸"],
  [/(?:phổi|hô hấp)/iu, "🫁"],
  [/(?:dạ dày|thận|cơ thể)/iu, "🩺"],
  [/(?:xương|gân|sụn|dây chằng)/iu, "🦴"],
  [/(?:bên trái|phía trái)/iu, "⬅️"],
  [/(?:bên phải|phía phải)/iu, "➡️"],
  [/(?:phía trên|hướng lên)/iu, "⬆️"],
  [/(?:phía dưới|hướng xuống)/iu, "⬇️"],
  [/(?:vị trí|khoảng cách|chiều sâu|kích thước|bố cục|sắp xếp)/iu, "📐"],
  [/(?:đọc|học|ôn|từ vựng|tài liệu)/iu, "📚"],
  [/(?:từ chối|không (?:đồng ý|tham gia|nhận|đi|mua)|bỏ qua|rời đi|dừng lại|tránh xa)/iu, "🙅"],
  [/(?:giúp|an ủi|động viên|chăm sóc|tha thứ|xin lỗi|làm lại cuộc đời|cải tạo)/iu, "🫶"],
  [/(?:bỏ chạy|chạy trốn|kêu cứu|cầu cứu|hoảng|sợ)/iu, "😨"],
  [/(?:gây gổ|đánh nhau|trả đũa|cãi|đe dọa|tức giận)/iu, "😠"],
  [/(?:trộm|cướp|lừa đảo|con đường xấu|phạm pháp)/iu, "😈"],
  [/(?:nghỉ ngơi|nghỉ dưỡng|thư giãn|ngủ|bình tĩnh)/iu, "😌"],
  [/(?:tỏ tình|hẹn hò|kết hôn|cầu hôn|ôm|yêu thương)/iu, "❤️"],
  [/(?:học|đọc sách|ôn tập|tìm hiểu|nghiên cứu|suy nghĩ|hỏi|kiểm tra|xem xét)/iu, "📚"],
  [/(?:tập luyện|tập thể dục|thử sức|quyết tâm|cố gắng|tiến lên|đối mặt)/iu, "💪"],
  [/(?:đi chơi|bạn bè|vui|ăn mừng|du lịch|khám phá|tham gia)/iu, "🎉"],
  [/(?:đồng ý|chấp nhận|nhận lời|tiếp tục|xác nhận|sẵn sàng)/iu, "✅"],
];
const actions = sourceActions.map(([pattern, icon]) => [wholeWord(pattern), icon]);
 
const CHOICE_FACES = ["🙂", "😊", "😌", "🤔", "😄", "😃", "😇", "😁", "🧐", "😉"];
const hasAuthorIcon = (label) => /[\p{Extended_Pictographic}\p{Regional_Indicator}]|[0-9#*]\uFE0F?\u20E3/u.test(label);
const labelSeed = (label) => [...label].reduce((hash, char) => (hash * 31 + char.codePointAt(0)) >>> 0, 7);

 
 
 
export function addChoiceIcons(labels) {
  const used = new Set();
  return labels.map((label) => {
    if (typeof label !== "string" || !label.trim()) return label;
    if (hasAuthorIcon(label)) {
      used.add(label.match(/\p{Extended_Pictographic}/u)?.[0]);
      return label;
    }
    const meaning = [...new Set([...actions, ...rules].filter(([pattern]) => pattern.test(label)).map(([, icon]) => icon))];
    const start = labelSeed(label) % CHOICE_FACES.length;
    const faces = CHOICE_FACES.map((_, step) => CHOICE_FACES[(start + step) % CHOICE_FACES.length]);
    const icon = meaning[0] ?? faces.find((face) => !used.has(face)) ?? faces[0];
    used.add(icon);
    return `${icon} ${label}`;
  });
}

export const addChoiceIcon = (label) => addChoiceIcons([label])[0];
