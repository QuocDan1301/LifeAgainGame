import { openMojiArt } from "./event-art.js";

// Authored alternatives: the shortcut has a small benefit and a larger cost;
// neglect only loses points. Never turn a sensible existing action into a trap.
const risks = {
  sleep: [
    ["Cố thức thêm cho vui", "Tôi có thêm một lúc giải trí, nhưng ngủ muộn khiến hôm sau uể oải.", { happiness: 2, health: -5 }],
    ["Bỏ giờ nghỉ dù đã mệt", "Tôi không nghỉ khi cần, nên càng mệt và khó tập trung vào ngày hôm sau.", { health: -6, intelligence: -2 }],
  ],
  meal: [
    ["Ăn vội cho xong để còn chơi", "Tôi có thêm thời gian vui chơi, nhưng bữa ăn vội khiến tôi khó chịu và không được nghỉ ngơi tử tế.", { happiness: 2, health: -4 }],
    ["Bỏ bữa vì ngại chuẩn bị", "Tôi bỏ qua bữa ăn, đến lúc đói thì người mệt và tâm trạng cũng cáu kỉnh hơn.", { health: -5, happiness: -2 }],
  ],
  cooking: [
    ["Thử nêm theo cảm hứng, bỏ qua công thức", "Tôi học được điều nên tránh qua lần thử này, nhưng món ăn hỏng làm tôi mất hứng.", { intelligence: 1, happiness: -4 }],
    ["Làm qua loa, không kiểm tra món ăn", "Món ăn không đạt, tôi phải bỏ phần đã làm và chuẩn bị lại trong tâm trạng bực bội.", { happiness: -5 }],
  ],
  hygiene: [
    ["Bỏ qua vệ sinh để chơi tiếp", "Tôi vui vì được chơi thêm, nhưng không giữ vệ sinh khiến cơ thể khó chịu sau đó.", { happiness: 2, health: -4 }],
    ["Không chịu làm sạch dù được nhắc", "Tôi để cơ thể bẩn lâu hơn, khó chịu rồi cáu kỉnh khi người nhà nhắc lại.", { health: -4, happiness: -2 }],
  ],
  clothes: [
    ["Dùng ngay, không kiểm tra lại", "Tôi nhanh chóng có đồ để dùng, nhưng sự cẩu thả làm đồ xộc xệch và diện mạo kém gọn gàng.", { happiness: 1, appearance: -4 }],
    ["Mặc kệ, không chăm lại đồ", "Tôi bỏ qua việc chăm đồ dùng cá nhân. Đến lúc cần, đồ không còn gọn gàng khiến tôi lúng túng.", { appearance: -4, happiness: -2 }],
  ],
  laundry: [
    ["Giặt cho nhanh, bỏ qua nhãn hướng dẫn", "Tôi rút ra một bài học sau khi giặt sai cách, nhưng đồ bị hỏng làm tôi tiếc và bực mình.", { intelligence: 1, happiness: -4 }],
    ["Để đồ cần giặt chất đống", "Đồ bẩn tích lại, chỗ ở bừa bộn và tôi càng ngại xử lý khi cần dùng tới.", { happiness: -4, health: -2 }],
  ],
  tidy: [
    ["Nhét mọi thứ vào một góc cho nhanh", "Chỗ trước mắt trông gọn hơn khiến tôi nhẹ nhõm, nhưng đồ bị lẫn và tôi bỏ sót thứ cần tìm.", { happiness: 1, intelligence: -4 }],
    ["Bỏ mặc đống đồ lộn xộn", "Đồ vẫn lộn xộn, tôi mất nhiều thời gian tìm kiếm rồi bực mình với chính mình.", { intelligence: -3, happiness: -3 }],
  ],
  repair: [
    ["Tự mò cách sửa dù chưa biết", "Tôi hiểu thêm một lỗi qua lần thử, nhưng sửa sai làm món đồ trục trặc hơn và khiến tôi nản.", { intelligence: 1, happiness: -5 }],
    ["Mặc kệ chỗ hỏng, cứ dùng tiếp", "Trục trặc không tự biến mất. Khi cần dùng, tôi lại bị gián đoạn và khó chịu hơn.", { happiness: -5 }],
  ],
  plant: [
    ["Chăm theo cảm hứng, không tìm hiểu", "Tôi thử một cách chăm mới và rút ra bài học, nhưng cây kém tươi khiến tôi mất hứng.", { intelligence: 1, happiness: -4 }],
    ["Quên việc chăm cây", "Tôi bỏ qua việc chăm cây, đến lúc nhìn lại thì cây không còn tươi và tôi thấy tiếc.", { happiness: -5 }],
  ],
  nature: [
    ["Mải ngắm, bỏ qua giờ nghỉ", "Tôi thích thú với cảnh trước mắt nên kéo dài quá lâu. Khi dừng lại, tôi đã mệt hơn dự tính.", { happiness: 2, health: -4 }],
    ["Chỉ nhìn điện thoại, bỏ lỡ cảnh đẹp", "Tôi dành cả khoảng thư giãn cho màn hình, bỏ lỡ điều muốn ngắm và trở về với tâm trạng hụt hẫng.", { happiness: -4 }],
  ],
  exercise: [
    ["Cố vượt sức để theo kịp người khác", "Tôi vui vì theo được một đoạn, nhưng cố quá khiến người mệt và buổi vận động không còn dễ chịu.", { happiness: 2, health: -6 }],
    ["Bỏ vận động rồi ngồi lì với màn hình", "Tôi bỏ cả buổi vận động và ngồi quá lâu, cơ thể uể oải hơn mà tinh thần cũng không khá lên.", { health: -4, happiness: -2 }],
  ],
  study: [
    ["Đoán cho nhanh, không kiểm tra lại", "Tôi vui vì làm xong sớm, nhưng hiểu sai mà không nhận ra nên kiến thức càng lẫn lộn.", { happiness: 1, intelligence: -5 }],
    ["Bỏ qua phần chưa hiểu", "Tôi không tìm hiểu hay hỏi lại, phần kiến thức còn thiếu khiến lần sau tôi tiếp tục lúng túng.", { intelligence: -4, happiness: -2 }],
  ],
  schedule: [
    ["Nhận hết, tính giờ sau", "Tôi hào hứng nhận thêm việc và cuộc hẹn, nhưng lịch chồng chéo khiến tôi chạy vội và mất giờ nghỉ.", { happiness: 2, health: -5, intelligence: -2 }],
    ["Không kiểm tra lịch, đến đâu tính đó", "Tôi quên việc cần làm đúng giờ, phải thu xếp lại trong tâm trạng bối rối và bực bội.", { intelligence: -4, happiness: -3 }],
  ],
  money: [
    ["Mua theo hứng, chưa tính ngân sách", "Tôi vui vì có món mới, nhưng không tính trước khiến kế hoạch chi tiêu rối lên và tôi phải lo khoản tiếp theo.", { happiness: 2, intelligence: -5 }],
    ["Bỏ qua việc kiểm tra chi tiêu", "Tôi không biết khoản nào đang vượt kế hoạch. Khi cộng lại, tôi vừa bối rối vừa tiếc những khoản không cần thiết.", { intelligence: -4, happiness: -3 }],
  ],
  documents: [
    ["Cất đại để rảnh làm việc khác", "Tôi nhẹ nhõm vì tạm xong việc, nhưng giấy tờ bị lẫn khiến tôi khó tìm đúng thứ cần dùng.", { happiness: 1, intelligence: -4 }],
    ["Bỏ qua giấy tờ cần kiểm tra", "Tôi không kiểm tra hay giữ giấy tờ cẩn thận, đến lúc cần thì thông tin thiếu và tôi phải tìm lại từ đầu.", { intelligence: -4, happiness: -2 }],
  ],
  digital: [
    ["Bấm thử liên tục, không đọc hướng dẫn", "Tôi nhớ được một thao tác qua lần thử sai, nhưng cài đặt rối lên khiến tôi mất nhiều thời gian sửa lại.", { intelligence: 1, happiness: -5 }],
    ["Xóa vội, không kiểm tra nội dung", "Tôi xóa nhầm thứ còn cần dùng, vừa mất thông tin vừa bực mình vì phải tìm cách khôi phục.", { intelligence: -4, happiness: -3 }],
  ],
  memory: [
    ["Ghi theo trí nhớ, không đối chiếu", "Tôi vui vì nhanh chóng hoàn thành, nhưng vài chi tiết sai khiến câu chuyện bị lẫn và khó xác minh về sau.", { happiness: 1, intelligence: -4 }],
    ["Không lưu hay ghi lại điều muốn giữ", "Tôi bỏ qua việc lưu lại, sau đó quên mất chi tiết quan trọng và tiếc vì không thể nhớ rõ như lúc đầu.", { intelligence: -3, happiness: -3 }],
  ],
  social: [
    ["Chỉ nói chuyện mình, không lắng nghe", "Tôi thấy vui khi được nói nhiều, nhưng người đối diện khó chịu vì không có lượt chia sẻ. Tôi nhận ra mình đã bỏ lỡ điều họ muốn nói.", { happiness: 1, intelligence: -4 }],
    ["Trả lời cộc lốc rồi bỏ ngang", "Cách trả lời của tôi làm cuộc trò chuyện mất vui. Người kia ngại hỏi thêm, còn tôi cũng thấy không thoải mái.", { happiness: -5 }],
  ],
  message: [
    ["Gửi vội cho xong, không đọc lại", "Tôi vui vì trả lời nhanh, nhưng lời nhắn thiếu rõ ràng gây hiểu nhầm và làm tôi mất công giải thích.", { happiness: 1, intelligence: -4 }],
    ["Phớt lờ lời nhắn, không phản hồi", "Cuộc hỏi thăm bị bỏ dở vì tôi không phản hồi. Khi nhớ lại, tôi tiếc vì đã để người quen chờ mãi.", { happiness: -4 }],
  ],
  sharing: [
    ["Giành phần tiện cho mình trước", "Tôi vui vì được phần mình muốn, nhưng cách chia thiếu công bằng làm mọi người mất vui và buổi gặp trở nên khó xử.", { happiness: 1, intelligence: -4 }],
    ["Hứa góp phần rồi bỏ mặc", "Tôi không làm phần đã hứa, khiến người khác phải xoay xở thêm. Không khí buổi gặp vì thế kém vui.", { happiness: -5 }],
  ],
  art: [
    ["Làm vội, không sửa chỗ chưa ổn", "Tôi vui vì làm xong nhanh, nhưng bỏ qua những chỗ sai khiến tôi không học được cách cải thiện sản phẩm.", { happiness: 1, intelligence: -4 }],
    ["Bỏ ngang vì chưa đẹp ngay", "Tôi dừng lại trước khi luyện thêm, vừa không tiến bộ vừa thấy nản với việc mình từng muốn thử.", { intelligence: -3, happiness: -3 }],
  ],
  music: [
    ["Nghe mãi, quên giờ nghỉ", "Tôi thích thú nghe thêm nhiều bài, nhưng quên dừng khi cần nghỉ nên người mệt hơn.", { happiness: 2, health: -4 }],
    ["Mở quá lớn dù đã thấy khó chịu", "Âm thanh quá lớn làm tôi khó chịu và không còn tận hưởng được buổi nghe như mong muốn.", { health: -3, happiness: -3 }],
  ],
  game: [
    ["Cứ chơi, khỏi cần hiểu luật", "Tôi vui vì được vào chơi ngay, nhưng đi sai luật và không chịu hỏi lại nên cả ván trở nên rối.", { happiness: 1, intelligence: -4 }],
    ["Cáu gắt khi không thắng", "Tôi đổ lỗi thay vì tìm hiểu cách chơi, khiến không khí mất vui và mọi người không muốn chơi tiếp.", { happiness: -5 }],
  ],
  plan: [
    ["Đặt thật nhiều mục tiêu cùng lúc", "Tôi hào hứng với danh sách dài, nhưng ôm quá nhiều khiến tôi mất giờ nghỉ và không tập trung được vào việc nào.", { happiness: 2, health: -4, intelligence: -3 }],
    ["Tiếp tục để mai, không bắt đầu", "Tôi không chọn bước nào để làm. Điều muốn thử lại bị bỏ qua khiến tôi càng nản và thiếu quyết tâm.", { intelligence: -3, happiness: -3 }],
  ],
  toy: [
    ["Giữ khư khư, không chịu chia sẻ", "Tôi vui vì giữ được món mình thích, nhưng không nghe lời giải thích nên buổi chơi trở nên căng thẳng.", { happiness: 1, intelligence: -3 }],
    ["Giận rồi ném đồ chơi", "Đồ chơi bị hỏng, tôi không còn chơi được như lúc đầu và càng buồn hơn.", { happiness: -4 }],
  ],
  travel: [
    ["Đi ngay, không kiểm tra thông tin", "Tôi hào hứng lên đường, nhưng nhầm đường hoặc thời gian khiến chuyến đi mệt và phải thu xếp lại.", { happiness: 2, health: -4, intelligence: -2 }],
    ["Bỏ qua địa chỉ và giờ hẹn", "Tôi không kiểm tra thông tin cần thiết nên lỡ việc định làm, vừa bối rối vừa mất vui.", { intelligence: -4, happiness: -3 }],
  ],
  gift: [
    ["Chọn theo ý mình, không hỏi người nhận", "Tôi thích món mình chọn, nhưng món ấy không phù hợp với người nhận nên tôi đã bỏ lỡ điều họ thật sự cần.", { happiness: 1, intelligence: -4 }],
    ["Chê món quà ngay trước người tặng", "Lời chê làm người tặng buồn và cuộc gặp trở nên khó xử. Tôi cũng không còn thấy vui với món quà.", { happiness: -5 }],
  ],
  rest: [
    ["Cố làm tiếp dù đã cần nghỉ", "Tôi biết thêm một việc qua lần cố sức, nhưng người mệt và tâm trạng căng thẳng hơn sau đó.", { intelligence: 1, health: -5, happiness: -2 }],
    ["Bỏ qua nhu cầu nghỉ của mình", "Tôi không nói rõ khi cần nghỉ, nên khoảng nghỉ bị gián đoạn và cơ thể càng uể oải.", { health: -4, happiness: -3 }],
  ],
};

const childhoodRisks = {
  nature: [
    ["Đòi ngắm mãi, không chịu nghỉ", "Tôi thích ngắm thêm, nhưng không chịu nghỉ nên mệt và khó chịu sau đó.", { happiness: 1, health: -3 }],
    ["Quấy khóc, không chịu ngắm cùng", "Tôi quấy khóc suốt lúc người nhà muốn cùng quan sát, bỏ lỡ cảnh đẹp rồi vẫn còn phụng phịu.", { happiness: -3 }],
  ],
  exercise: [
    ["Cố chơi tiếp dù đã mệt", "Tôi vui vì được chơi thêm, nhưng không chịu nghỉ khiến tôi mệt và khó chịu sau đó.", { happiness: 1, health: -3 }],
    ["Dỗi, không chịu tập cùng người lớn", "Tôi không chịu thử dù người lớn ở cạnh hỗ trợ. Buổi tập bị bỏ dở, tôi vẫn phụng phịu và uể oải.", { happiness: -3, health: -2 }],
  ],
  meal: [
    ["Mải chơi, không chịu ăn đủ bữa", "Tôi vui vì được chơi thêm, nhưng ăn quá ít nên sau đó đói và mệt.", { happiness: 1, health: -3 }],
    ["Hất đồ ăn rồi không chịu ăn", "Đồ ăn vương ra ngoài, tôi vẫn đói và càng cáu kỉnh hơn khi bữa ăn bị bỏ dở.", { health: -3, happiness: -2 }],
  ],
};

const topicRules = [
  [/ngủ|thức khuya|tập phim|phim chưa kết thúc/iu, "sleep"],
  [/bảo hành|hóa đơn|biên nhận|giấy tờ|hồ sơ/iu, "documents"],
  [/chi tiêu|ngân sách|khoản nhỏ|ví gọi|mua sắm/iu, "money"],
  [/sao lưu|thư mục|bản cuối|ứng dụng|nút bấm|trang web|dung lượng/iu, "digital"],
  [/giặt|phai màu|chăn.*khô|rèm cửa/iu, "laundry"],
  [/rửa tay|xà phòng|tắm|đánh răng/iu, "hygiene"],
  [/giày|chiếc tất|chiếc mũ|cúc áo|kiểu tóc|nốt mụn/iu, "clothes"],
  [/hỏng|sửa đồ|dụng cụ|đèn|ổ cắm|dây cáp|pin |lung lay|quai cặp/iu, "repair"],
  [/nấu|nồi|chảo|công thức/iu, "cooking"],
  [/bữa|món ăn|món canh|miếng rau|cơm|quán mì|rau/iu, "meal"],
  [/đi bộ|vận động|đạp xe|cầu lông|quả cầu|bóng|cầu trượt|bước chân|cái lưng|môn mới/iu, "exercise"],
  [/cây|mầm|chậu hoa|chăm.*hoa|cành|lá đổi màu/iu, "plant"],
  [/bản đồ|chuyến|địa chỉ|điểm hẹn|xe tự đi|sang đường|vali/iu, "travel"],
  [/sổ hẹn|lịch|cuộc hẹn|ngày hẹn|giờ hẹn|vé|thông báo/iu, "schedule"],
  [/quà|thiệp chúc|sinh nhật/iu, "gift"],
  [/chia phần|chia.*múi|mỗi người một món|đồ.*tặng|kệ.*sách|dụng cụ mượn/iu, "sharing"],
  [/tin nhắn|thư mời|lời nhắn|danh bạ|hòm thư/iu, "message"],
  [/nghe nhạc|giai điệu|bài hát|radio|tai nghe|micro/iu, "music"],
  [/trò chơi|ván cờ|bàn cờ|ghép hình|mảnh ghép/iu, "game"],
  [/vẽ|bức tranh|áp phích|đan|len|thêu|phụ đề|đoạn phim/iu, "art"],
  [/ảnh|kỷ niệm|nhật ký|ghi chép|câu chuyện|sổ tay/iu, "memory"],
  [/nghỉ|vừa sức|nhịp sống|buổi.*ngắn lại/iu, "rest"],
  [/học|đọc|sách|truyện|thí nghiệm|bài toán|ôn|thước|địa cầu|chữ cái|từ mới|kiến thức/iu, "study"],
  [/dọn|ngăn|giỏ|xếp|lộn xộn|hộp bút|chìa khóa/iu, "tidy"],
  [/đồ chơi|gấu bông|tòa tháp/iu, "toy"],
  [/bướm|nắng|trời|mây|ngắm|chim|câu cá/iu, "nature"],
  [/kế hoạch|mục tiêu|dự định|điều muốn|thói quen|sở thích|mong muốn/iu, "plan"],
  [/gặp|bạn|người quen|hỏi thăm|cảm ơn|chào|trò chuyện|hàng xóm/iu, "social"],
];

const laterTopics = { learn: "study", home: "tidy", meet: "social", create: "art", pace: "rest", share: "sharing" };
const titleTopics = {
  "Giỏ đồ chơi đầy quá": "tidy",
  "Quả cam chia mấy múi": "sharing",
  "Bông hoa trên bàn cô": "art",
  "Hộp cơm có hai ngăn": "sharing",
  "Bảng trực nhật bị nhòe": "schedule",
  "Cốc nước đổi màu": "study",
  "Tai nghe chỉ còn một bên": "repair",
  "Đoạn giới thiệu cho câu lạc bộ": "art",
  "Trang đầu của sổ cấp ba": "plan",
  "Chỗ gửi xe chưa quen": "travel",
  "Gói hàng ghi nhầm số nhà": "documents",
  "Bóng đèn trước cửa": "repair",
  "Tiếng nhạc từ nhà bên": "social",
  "Giỏ đồ dành để tặng": "sharing",
  "Chia phần sau bữa ăn nhóm": "sharing",
  "Bữa ăn nhóm mỗi người một món": "sharing",
  "Bộ bát còn thiếu một chiếc": "tidy",
  "Màu sơn cho chiếc ghế cũ": "art",
  "Vết bẩn trên bàn gỗ": "tidy",
  "Chai đựng có nhãn mờ": "documents",
  "Dụng cụ mượn chưa trả": "sharing",
  "Tấm vải có đường thêu cũ": "memory",
  "Góc treo tranh của mình": "art",
  "Tranh của người hàng xóm": "social",
  "Danh sách liên hệ khu phố": "documents",
  "Bản thu câu chuyện của mình": "memory",
  "Bài nhạc cần nghe nhỏ hơn": "music",
  "Gọi video thấy trần nhà": "digital",
  "Cuộc gọi cần bật loa": "digital",
  "Một câu thơ còn nhớ": "study",
  "Món quà quê trong túi nhỏ": "social",
  "Một món quà tự chọn cho tuổi tám mươi": "plan",
  "Bánh sinh nhật muốn vị nào": "meal",
  "Một lời mong cho tuổi một trăm": "plan",
  "Lời chúc tuổi một trăm qua bưu điện": "message",
  "Góc nắng của buổi sinh nhật": "nature",
  "Cây chanh cho quả đầu mùa": "sharing",
};
const hashOf = (text) => Array.from(text).reduce((hash, char) => (hash * 31 + char.codePointAt(0)) >>> 0, 0);
const hasLoss = (choice) => Object.values(choice.effects ?? {}).some(value => value < 0) || choice.money < 0;
const hasGain = (choice) => Object.values(choice.effects ?? {}).some(value => value > 0) || choice.money > 0;

function getTopic(event) {
  if (event.everydayTheme) return laterTopics[event.everydayTheme] ?? event.everydayTheme;
  if (titleTopics[event.title]) return titleTopics[event.title];
  // Title takes priority so a passing reference to a friend cannot override
  // the actual situation. Results are deliberately excluded from matching.
  for (const text of [event.title ?? "", event.text ?? ""]) {
    const match = topicRules.find(([pattern]) => pattern.test(text));
    if (match) return match[1];
  }
  return "plan";
}

export function balanceEverydayChoices(event, age) {
  if (event.everydayDifficultyApplied) return event;
  const choices = event.choices.map(choice => {
    const loss = hasLoss(choice);
    const effects = Object.fromEntries(Object.entries(choice.effects ?? {}).map(([stat, value]) => [
      stat,
      value < 0 ? -Math.min(age < 6 ? 4 : 7, Math.max(3, Math.abs(value) * 2))
        : Math.min(loss ? 2 : 3, value),
    ]));
    return { ...choice, effects };
  });
  const seed = hashOf(event.id ?? `${age}:${event.title}`);
  const topic = getTopic(event);
  const profile = (age < 6 ? childhoodRisks[topic] : null) ?? risks[topic] ?? risks.plan;
  const makeRisk = (index) => {
    const [label, text, authoredEffects] = profile[index];
    const effects = Object.fromEntries(Object.entries(authoredEffects).map(([stat, value]) => [
      stat, age < 6 && value < -3 ? -3 : value,
    ]));
    return {
      label, title: index === 0 ? "Một chút lợi, một cái giá" : "Một quyết định đáng tiếc",
      text, effects, confirmText: "Tiếp tục", achievementIds: [],
      ...openMojiArt(index === 0 ? "1F615" : "1F61E", label),
    };
  };
  const authoredLoss = choices.some(hasLoss);
  if (!authoredLoss) {
    // Some situations have one responsible action, one shortcut and one
    // clearly poor action. The others offer two distinct outcomes.
    choices.splice(1, choices.length - 1, makeRisk(seed % 2));
    if (seed % 3 === 0) choices.push(makeRisk(1 - seed % 2));
  } else if (choices.length === 2 && seed % 3 === 0 && choices.some(choice => !hasLoss(choice) && hasGain(choice))) {
    choices.push(makeRisk(choices.some(choice => hasLoss(choice) && hasGain(choice)) ? 1 : 0));
  }
  // New everyday stories do not always put the beneficial action first.
  // Order is stable on reload and never consumes the game's random rolls.
  if (!authoredLoss && (event.addedEveryday || event.everydayTheme)) {
    const offset = Math.floor(seed / 3) % choices.length;
    choices.push(...choices.splice(0, offset));
  }
  return { ...event, choices, everydayDifficultyApplied: true };
}
