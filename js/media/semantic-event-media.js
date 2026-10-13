import { openMojiArt } from "./event-art.js";
import { getEventOpenMojiOptions } from "./event-openmoji.js";

// Literal subjects provide context when migrating old saves to OpenMoji.
const subjects = [
  [/học|lớp|giáo viên|hướng dẫn/u, '1F9D1-200D-1F393', 'Học tập'],
  [/thí nghiệm|dung dịch|khoa học/u, '1F9D1-200D-1F52C', 'Thực hành khoa học'],
  [/nghề|hướng nghiệp|tư vấn|công việc/u, '1F9D1-200D-1F4BC', 'Công việc và hướng nghiệp'],
  [/vận động|thể dục|tập luyện/u, '1F3CB', 'Vận động và tập luyện'],
  [/người bạn|bạn cũ|bạn bè|nhóm bạn|hàng xóm|người quen|trò chuyện/u, '1F91D', 'Gặp gỡ và trò chuyện'],
  [/chụp|tự chụp/u, '1F933', 'Chụp ảnh'],
  [/ghi|viết/u, '270D', 'Viết và ghi chép'],
  [/người thân thiết|người thân|lời chúc|câu chào|hỏi thăm|cảm ơn/u, '1F91D', 'Lời hỏi thăm và người thân thiết'],
  [/nghĩ|mong muốn|kế hoạch|dự định|muốn chọn/u, '1F914', 'Suy nghĩ về điều muốn làm'],
  [/niềm vui|vui vẻ|dễ chịu/u, '1F642', 'Niềm vui trong ngày'],
  [/danh sách nhạc|băng nhạc/u, "1F3B5", "Âm nhạc"],
  [/danh sách|biểu đồ/u, "1F4CB", "Danh sách và bảng theo dõi"],
  [/trường|lớp học|mẫu giáo/u, "1F3EB", "Trường học"],
  [/bản tin|tờ báo|báo giấy/u, "1F4F0", "Bản tin"],
  [/thông báo/u, "1F4F1", "Thông báo trên điện thoại"],
  [/ảnh/u, "1F4F7", "Ảnh kỷ niệm"],
  [/quả cầu/u, "1F3F8", "Quả cầu lông"],
  [/ghế/u, "1FA91", "Ghế"],
  [/ngăn kéo|ngăn nhỏ|nhãn hộp|ngăn.*đồ/u, "1F5C4", "Ngăn cất đồ"],
  [/dây sạc|sạc/u, "1F50C", "Dây sạc"],
  [/màn hình/u, "1F4F1", "Màn hình thiết bị"],
  [/tiếng chim/u, "1F426", "Chim"],
  [/mây|khoảng trời|nhìn trời|bầu trời/u, "1F324", "Bầu trời"],
  [/tập phim|đêm.*tập/u, "1F4FA", "Xem phim"],
  [/viết lại|dòng chữ|lời nhắn|thơ/u, "1F4DD", "Ghi chép và lời nhắn"],
  [/nghe sách|giọng đọc|chương trình.*nghe|chương trình.*muốn nghe/u, "1F3A7", "Nghe sách hoặc chương trình âm thanh"],
  [/chữ cái|đánh vần/u, "1F524", "Chữ cái"],
  [/bài toán|đề ôn tập/u, "1F9EE", "Bài toán"],
  [/bài kiểm tra|bài test/u, "1F4DD", "Bài kiểm tra"],
  [/tai nghe/u, "1F3A7", "Tai nghe"],
  [/quả địa cầu|phiên đấu giá.*hành tinh|trái đất/u, "1F30D", "Trái Đất"],
  [/thang máy/u, "1F6D7", "Thang máy"],
  [/toa (?:04|bốn)|chuyến tàu|đoàn tàu|sân ga/u, "1F689", "Đoàn tàu"],
  [/công trường|giàn giáo/u, "1F6A7", "Công trường"],
  [/vali/u, "1F9F3", "Vali hành lý"],
  [/rạp|vé xem.*phim/u, "1F3A6", "Rạp chiếu phim"],
  [/ngập|nước dâng|cứu hộ.*nước/u, "1F30A", "Nước dâng"],
  [/két sắt|chiếc két|mã bốn số|mã.*hộp/u, "1F510", "Ổ khóa và chìa khóa"],
  [/chìa khóa/u, "1F511", "Chìa khóa"],
  [/đồng hồ/u, "1F570", "Đồng hồ"],
  [/radio/u, "1F4FB", "Radio"],
  [/thước kẻ|đặt thước/u, "1F4CF", "Thước kẻ"],
  [/địa cầu/u, "1F30D", "Quả địa cầu"],
  [/cầu lông|quả cầu.*lưới/u, "1F3F8", "Cầu lông"],
  [/bóng đá|đá bóng/u, "26BD", "Bóng đá"],
  [/bóng rổ/u, "1F3C0", "Bóng rổ"],
  [/bơi|hồ bơi/u, "1F3CA", "Bơi lội"],
  [/xe đạp|gửi xe/u, "1F6B2", "Xe đạp"],
  [/giày/u, "1F45F", "Giày"],
  [/chiếc tất|hai.*tất/u, "1F9E6", "Tất"],
  [/mũ/u, "1F9E2", "Mũ"],
  [/chiếc khăn|khăn.*quàng/u, "1F9E3", "Khăn quàng"],
  [/cặp|ba lô/u, "1F392", "Cặp sách"],
  [/đồ chơi|gấu bông/u, "1F9F8", "Đồ chơi"],
  [/giỏ|giặt|quần áo|chăn.*giặt|rèm/u, "1F9FA", "Giỏ quần áo"],
  [/rửa tay|xà phòng/u, "1F9FC", "Xà phòng"],
  [/bàn chải|đánh răng/u, "1FAA5", "Bàn chải đánh răng"],
  [/cúc áo|kim chỉ|đường thêu|tấm vải/u, "1F9F5", "Kim chỉ"],
  [/đan len|kim đan|cuộn len|mẻ len/u, "1F9F6", "Cuộn len"],
  [/lau|dọn|chổi/u, "1F9F9", "Chổi dọn nhà"],
  [/dụng cụ|tua vít|sửa đồ/u, "1F9F0", "Hộp dụng cụ"],
  [/dây.*điện|ổ cắm|dây cáp/u, "1F50C", "Dây điện và phích cắm"],
  [/pin/u, "1F50B", "Pin"],
  [/đèn|ánh sáng.*đọc/u, "1F4A1", "Đèn"],
  [/album|khung ảnh|bức ảnh|tấm ảnh|chụp ảnh|máy ảnh/u, "1F4F7", "Máy ảnh và ảnh kỷ niệm"],
  [/sao lưu|máy tính|thư mục|tệp|gõ phím|code|lập trình/u, "1F4BB", "Máy tính"],
  [/ứng dụng|điện thoại|camera|gọi video/u, "1F4F1", "Điện thoại"],
  [/cuộc gọi|gọi điện|gọi.*hỏi thăm/u, "260E", "Điện thoại gọi hỏi thăm"],
  [/bưu thiếp|bưu điện|hòm thư|dán tem/u, "1F4EC", "Thư gửi qua bưu điện"],
  [/tin nhắn|lời nhắn.*gửi/u, "1F4E8", "Tin nhắn"],
  [/lá thư|viết thư|thư.*chưa gửi/u, "1F48C", "Lá thư"],
  [/sách|truyện|thư viện/u, "1F4D6", "Sách"],
  [/sổ|nhật ký|ghi chép/u, "1F4D3", "Sổ ghi chép"],
  [/thiệp/u, "1F4DD", "Thiệp viết tay"],
  [/giấy tờ|hồ sơ|danh mục/u, "1F5C2", "Hồ sơ giấy tờ"],
  [/bản đồ|địa chỉ|địa điểm/u, "1F5FA", "Bản đồ"],
  [/vé|phiếu.*số|rút thăm/u, "1F3AB", "Vé và phiếu tham dự"],
  [/lịch|khung giờ|ngày hẹn|cuộc hẹn/u, "1F4C5", "Lịch hẹn"],
  [/hóa đơn|biên nhận|bảo hành/u, "1F9FE", "Hóa đơn"],
  [/ngân sách|chi tiêu|đếm|khoản.*mua/u, "1F9EE", "Tính toán chi tiêu"],
  [/tiền|ví tiền|chiếc ví/u, "1F4B0", "Tiền"],
  [/bánh sinh nhật|tuổi.*bánh/u, "1F382", "Bánh sinh nhật"],
  [/sinh nhật/u, "1F389", "Sinh nhật"],
  [/quà|tặng.*món/u, "1F381", "Món quà"],
  [/nồi|canh|nấu/u, "1F372", "Nồi thức ăn"],
  [/chảo/u, "1F373", "Chảo nấu ăn"],
  [/bánh mì/u, "1F35E", "Bánh mì"],
  [/mì/u, "1F35C", "Bát mì"],
  [/cam/u, "1F34A", "Quả cam"],
  [/chanh/u, "1F34B", "Quả chanh"],
  [/rau/u, "1F96C", "Rau"],
  [/trái cây/u, "1F34E", "Trái cây"],
  [/trà/u, "1F375", "Chén trà"],
  [/cà phê/u, "2615", "Tách cà phê"],
  [/bữa ăn|bữa cơm|bữa sáng|bữa tối|bát|đĩa/u, "1F37D", "Bữa ăn"],
  [/thí nghiệm|dung dịch/u, "1F9EA", "Thí nghiệm có hướng dẫn"],
  [/hoa/u, "1F33B", "Hoa"],
  [/cây|mầm|lá/u, "1F331", "Cây"],
  [/bướm/u, "1F98B", "Bướm"],
  [/câu cá|cần câu/u, "1F3A3", "Câu cá"],
  [/vẽ|tranh|màu sơn/u, "1F3A8", "Vẽ tranh"],
  [/micro|hát/u, "1F3A4", "Ca hát"],
  [/nhạc|giai điệu/u, "1F3B5", "Âm nhạc"],
  [/trò chơi bàn|bàn cờ|ván cờ/u, "1F3B2", "Trò chơi bàn"],
  [/ghép hình|mảnh ghép/u, "1F9E9", "Ghép hình"],
  [/đi bộ|vòng đi bộ/u, "1F6B6", "Đi bộ"],
  [/nắng/u, "1F31E", "Ánh nắng"],
  [/mưa/u, "1F327", "Mưa"],
  [/ngủ/u, "1F4A4", "Giấc ngủ"],
  [/chuyện|kể|câu chào|lời cảm ơn|lời chúc|tên gọi/u, "1F4AC", "Trò chuyện"],
  [/câu đố|kỹ năng/u, "1F9E9", "Tìm hiểu kỹ năng và câu đố"],
  [/dự định|kế hoạch|điều.*thử/u, "1F4C5", "Kế hoạch"],
];
const sceneOverrides = {
  "Chiếc quạt chọn đúng lúc để hỏng": "1F6E0",
  "Chậu cây nghiêng về phía cửa sổ": "1F331",
  "Sở thích nằm ngoài danh sách thành tích": "1F9E9",
  "Một chuyến đi cần ít hành lý hơn": "1F9F3",
  "Bốn mươi, nến hơi chật bánh": "1F382",
  "Chiếc ghế hơi lung lay": "1FA91",
  "Bữa trưa không nhìn màn hình": "1F37D",
  "Một kế hoạch cho tuổi năm mươi": "1F4C5",
  "Tiếng rao nghe lại sau nhiều năm": "1F4AC",
  "Giọng đọc trong chiếc máy nhỏ": "1F3A7",
  "Chọn một bài để nghe ngày sinh nhật": "1F3B5",
  "Lời hỏi thăm viết bằng tay": "1F48C",
  "Chọn tên cho một tập kỷ niệm": "1F4D3",
  "Những câu chuyện thành một tập nhỏ": "1F4D3",
  "Mùi hương làm nhớ một căn bếp": "1F373",
};
// Earlier illustrations used medals, turtles, lightning and similar metaphors
// for ordinary results. These outcomes now show the actual activity.
const choiceOverrides = {
  "a1-first-steps": ["1F463", "1F463"], "a1-bath-time": ["1F6C1", "1F9FC"], "a1-bedtime": ["1F4A4", "1F9F8"],
  "a2-picture-book": ["1F4D6", "1F3A8"], "a2-block-tower": ["1F9F1", "1F9F1"], "a2-lost-toy": ["1F9F8", "1F9F8"],
  "a3-preschool": ["1F3EB", "1F3EB"], "a3-playground": ["1F6DD", "1F3C3"], "a3-nap": ["1F4A4", "1F4A4"],
  "a4-painting": ["1F3A8", "1F3A8"], "a4-buttons": ["1F455", "1F455"], "a4-garden": ["1F331", "1F331"],
  "a5-letter": ["1F524", "1F524"], "a5-puzzle": ["1F9E9", "1F9E9"], "a5-storytelling": ["1F5E3", "1F5E3"],
  "a6-first-school": ["1F3EB", "1F3EB"], "a6-pencil": ["270F", "270F"], "a6-reading": ["1F4D6", "1F4D6"],
  "a7-tag": ["1F3C3", "1F3C3"], "a7-rain": ["1F302", "1F45F"], "a7-late-cartoon": ["1F4A4", "1F4FA"],
  "a8-hard-math": ["1F9EE", "1F9EE"], "a8-library": ["1F4D6", "1F4D6"], "a8-group-project": ["1F58D", "1F58D"],
  "a9-school-photo": ["1F4F7", "1F4F7"], "a9-haircut": ["1F487", "1F487"], "a9-school-fair": ["1F3A8", "1F3A8"],
  "a10-science": ["1F4D3", "1F331"], "a10-class-test": ["1F4DD", "1F4DD"], "a10-primary-memories": ["1F4D3", "1F4D3"],
  "teen-11-1": ["1F392", "1F392"], "teen-11-2": ["1F4AC", "1F9E9"], "teen-11-3": ["1F3F8", "1F6B6"],
  "teen-12-1": ["1F9EA", "1F9EA"], "teen-12-2": ["1F9FC", "1F9E2"], "teen-12-3": ["1F4E8", "1F4E8"],
  "teen-13-1": ["1F3B8", "1F3B8"], "teen-13-2": ["1F6B6", "1F6B6"], "teen-13-3": ["1F4DD", "1F5E3"],
  "teen-14-1": ["1F9EE", "1F4A4"], "teen-14-2": ["1F3A8", "1F3A8"], "teen-14-3": ["1F6B2", "1F6CC"],
  "teen-16-1": ["1F4BB", "1F4BB"], "teen-16-2": ["1F37D", "1F37D"], "teen-16-3": ["1F4AC", "1F4D3"],
  "teen-17-1": ["1F4C5", "1F4A4"], "teen-17-2": ["1F3EB", "1F4CA"], "teen-17-3": ["1F4F7", "1F4F7"],
};
const boundedSubjects = subjects.map(([pattern, code, label]) => [
  new RegExp(`(?:^|[^\\p{L}\\p{N}])(?:${pattern.source})(?=$|[^\\p{L}\\p{N}])`, "u"), code, label,
]);

// These multi-scene stories are reviewed scene by scene: later paragraphs
// often mention props from the next scene, so keyword selection is unsuitable.
const chainScenes = {
  "lost-child-school": ["1F333", "1F622", "1F46A", "1F48C", "1F3EB"],
  "diamond-mine": ["1F4F1", "1F3DE", "1F375", "1F415", "1F48E", "260E", "1F48E"],
  "earth-auction": ["1F6D7", "1F30D", "1F47D", "1F37D", "2696", "1F3AB", "1F91D"],
  "save-life": ["1F6A7", "26A1", "1F6A7", "1F691"],
  "old-house": ["1F3DA", "1F375", "1F4F7", "1FA9E", "1F48C", "1F48C", "1F56F"],
  "last-train": ["1F689", "1F3AB", "1F319", "1F305"],
  "theater": ["1F3AD", "1F6AA", "1F9D2", "1F4CB", "1F5FA", "1F691", "1F3C5"],
  "luggage": ["1F9F3", "1FAAA", "1F50D", "1F3B5"],
  "later-60": ["1F9F0", "1F6E0", "1F4FB", "1F327", "1F9F0"],
  "later-65": ["1F5BC", "1F50D", "1F9FE", "1F4B0"],
  "later-70": ["260E", "1F4AC", "1F5C2", "1F4E8", "1F3C5"],
  "later-75": ["1F570", "1F4F7", "1F333", "1F510"],
  "later-80": ["1F426", "1F388", "1F3AB", "2614", "1F3AB"],
  "later-85": ["1F4DA", "1F4F7", "1F5C4", "1F510"],
  "later-90": ["1F31E", "1F4F7", "1F37D", "1F3A4", "1F382"],
  "later-95": ["1F30A", "1F45C", "1F6AA", "1F6DF"],
  "later-100": ["1F455", "1F4F7", "1FA91", "1F4AC", "1F4F7"],
  "later-105": ["260E", "1F48C", "1F4D3", "1F56F"],
};
const careerSubjects = {
  acting: "1F3AD", military: "1FA96", singing: "1F3A4", painting: "1F3A8",
  medicine: "1FA7A", programming: "1F4BB", accounting: "1F9EE", law: "2696",
  teaching: "1F3EB", football: "26BD", psychology: "1F9E0", esports: "1F3AE",
  tiktok: "1F4F1", youtube: "1F4F9", business: "1F4BC", finance: "1F4B0",
  mechanical: "2699", architecture: "1F3DB", fashion: "1F457", marketing: "1F4E3",
  tourism: "1F9F3", culinary: "1F373",
};
const codeOf = slot => slot.mediaReview?.code ?? (slot.imageFallback ?? slot.image ?? "").match(/\/([A-F0-9-]+)\.svg(?:$|\?)/)?.[1];
const meaningfulText = text => (text ?? "").toLocaleLowerCase("vi-VN")
  .replace(/(?:không|chưa|chẳng)\s+(?:muốn\s+)?(?:ngủ|nấu|đọc|đan|tưới)[^.!?]*/gu, "");

function reviewSlot(slot, scene, isResult, choiceIndex = -1) {
  const context = isResult ? `${slot.text ?? ""} ${slot.label ?? ""}` : `${slot.title ?? ""} ${slot.text ?? ""}`;
  const lower = meaningfulText(context);
  const title = meaningfulText(isResult ? slot.label : slot.title);
  const storyCode = chainScenes[scene.specialId ?? (scene.kind === "lost-child-chain" ? "lost-child-school" : scene.kind === "special-chain" ? "diamond" : "")]?.[(scene.specialStep ?? 1) - 1];
  const originalCode = codeOf(slot);
  const reviewedCode = isResult ? choiceOverrides[scene.id]?.[choiceIndex]
    : sceneOverrides[scene.title?.replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F\u200D]/gu, "").trim()];
  const subject = boundedSubjects.find(([pattern]) => pattern.test(title)) ??
    (isResult || !originalCode ? boundedSubjects.find(([pattern]) => pattern.test(lower)) : null);
  const milestoneCode = scene.kind === "orientation-chain" ? "1F308"
    : scene.kind === "marriage-proposal" ? (isResult && slot.marriageDecision === "decline" ? "1F4AC" : "1F48D")
    : scene.kind === "workplace-dating" ? "1F495"
    : scene.kind === "child-proposal" ? (isResult && slot.childDecision === "decline" ? "1F4AC" : /nhận con nuôi/u.test(scene.text) ? "1F46A" : "1F476")
    : scene.id === "career-18" && isResult ? careerSubjects[slot.careerPath?.id]
    : scene.kind === "career-test" ? careerSubjects[scene.testedCareer?.id] : null;
  const code = slot.death ? "1F480" : milestoneCode ?? storyCode ?? reviewedCode ??
    (scene.addedEveryday && !isResult ? originalCode : subject?.[1]) ?? originalCode ?? codeOf(scene) ?? "1F4AC";
  const description = (slot.death ? "Kết thúc cuộc đời" : milestoneCode
    ? scene.kind === "career-test" ? `Kiến thức ngành ${scene.testedCareer.field}`
      : scene.id === "career-18" && isResult ? `Hướng nghề nghiệp: ${slot.careerPath.field}` : scene.title
    : storyCode || reviewedCode ? scene.title : code === subject?.[1] ? subject[2] : slot.imageFallbackAlt ?? scene.title)
    .replace(/^(?:(?:OpenMoji|Nhãn dán minh họa):\s*)+/u, "");
  Object.assign(slot, openMojiArt(code, description));
  slot.mediaReview = { code, subject: description, kind: "openmoji" };
  slot.imageOptions = getEventOpenMojiOptions(slot, scene, isResult);
  const emoji = slot.imageOptions[0];
  slot.image = emoji.url;
  slot.imageAlt = emoji.alt;
  slot.imageFallback = emoji.poster;
  slot.imageFallbackAlt = emoji.alt;
  slot.mediaReview = {code,subject:emoji.alt,kind:emoji.kind,source:emoji.source,origin:emoji.origin,plan:emoji.plan};
  return slot;
}

export function reviewEventMedia(event) {
  if (!event) return event;
  reviewSlot(event, event, event.stage === 'result');
  (event.choices ?? []).forEach((choice, index) => reviewSlot(choice, event, true, index));
  return event;
}

export function reviewPendingMedia(pending) {
  if (pending?.stage === "choice") reviewEventMedia(pending);
  if (pending?.stage === "result") {
    pending.imageOptions = getEventOpenMojiOptions(pending, pending);
    const emoji = pending.imageOptions[0];
    if (emoji) { pending.image = emoji.url; pending.imageAlt = emoji.alt; pending.imageFallback = emoji.poster; pending.imageFallbackAlt = emoji.alt; }
  }
  return pending;
}
