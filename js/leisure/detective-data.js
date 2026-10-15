import { applyActivityGain } from "../core/stat-budget.js";

 
 
 
 
 
 
export const DETECTIVE_MIN_AGE = 18;
export const BOARD_SIZE = 3;
 
export const EXTRA_HOUR_RATE = 0.2;
export const MAX_EXTRA_HOURS = 2;
 
export const UNPROVEN_RATE = 0.25;
export const MIN_REWARD_RATE = 0.25;
 
export const SHARP_INTELLECT = 80;
export const WRONG_HAPPINESS = 3;
export const WRONG_REPUTATION = 2;

export const detectiveTiers = [
  { id: 0, icon: "📁", name: "Vụ nhỏ", minReputation: 0, suspects: 4, attrs: ["shoes", "vehicle", "bag"],
    values: 3, hours: 2, minNegative: 0, maxNegative: 0, reward: 2_000_000, reputation: 1 },
  { id: 1, icon: "🗂️", name: "Vụ vừa", minReputation: 4, suspects: 5, attrs: ["vehicle", "bag", "outfit", "route"],
    values: 3, hours: 3, minNegative: 0, maxNegative: 2, reward: 5_000_000, reputation: 2 },
  { id: 2, icon: "🗄️", name: "Vụ khó", minReputation: 10, suspects: 6, attrs: ["bag", "outfit", "route", "trace"],
    values: 4, hours: 3, minNegative: 1, maxNegative: 2, reward: 12_000_000, reputation: 3 },
];
export const detectiveRanks = [
  { min: 0, name: "Thám tử tập sự" },
  { min: 4, name: "Thám tử có tiếng" },
  { min: 10, name: "Thám tử lành nghề" },
];

 
export const detectiveAttributeLabels = {
  shoes: "giày dép", vehicle: "phương tiện", bag: "túi mang theo", outfit: "trang phục",
  route: "lối đi", trace: "dấu bám trên tay áo",
};
export const detectiveSources = {
  either: { icon: "🧩", chip: "🧩", label: "Đối chiếu hai nguồn", tells: "Hai dấu hiệu liên hệ theo điều kiện ít nhất một đúng" },
  xor: { icon: "🔬", chip: "🔬", label: "Kiểm chứng chéo dấu vết", tells: "Hai dấu hiệu liên hệ theo điều kiện chỉ một đúng" },
  route: { icon: "🚪", chip: "🚪", label: "Đối chiếu lối đi", tells: "Lối đi của người cần tìm" },
  trace: { icon: "🧪", chip: "🧪", label: "Kiểm tra dấu bám", tells: "Dấu bám được ghi nhận trên tay áo người cần tìm" },
  time: { icon: "🕒", chip: "🕒", label: "Dựng mốc thời gian", tells: "Việc xảy ra trong khoảng nào" },
  shoes: { icon: "🔦", chip: "👟", label: "Khám hiện trường", tells: "Dấu giày dép của người cần tìm" },
  vehicle: { icon: "🅿️", chip: "🛵", label: "Hỏi người trông xe", tells: "Người cần tìm đi phương tiện gì" },
  bag: { icon: "🗣️", chip: "🎒", label: "Hỏi nhân chứng", tells: "Người cần tìm mang theo túi gì" },
  outfit: { icon: "📹", chip: "👕", label: "Xem camera ngoài cửa", tells: "Trang phục của người cần tìm" },
};

 
export const detectiveAttributes = {
  route: { icon: "🚪", values: ["lối chính", "lối bên", "lối giao nhận", "lối nối khu phụ"].map((name) => ({
    name, fact: `Đi qua ${name}`,
    is: (scene) => `Sổ theo dõi lối đi xác nhận ${scene.taker} đã đi qua ${name}.`,
    not: (scene) => `Bản đối chiếu lối đi xác nhận ${scene.taker} không đi qua ${name}.`,
  })) },
  trace: { icon: "🧪", values: ["bụi phấn", "đất ẩm", "mực xanh", "bột giấy"].map((name) => ({
    name, fact: `Tay áo có ${name}`,
    is: (scene) => `Ảnh kiểm tra sau vụ việc xác nhận tay áo của ${scene.taker} có ${name}.`,
    not: (scene) => `Ảnh kiểm tra sau vụ việc xác nhận tay áo của ${scene.taker} không có ${name}.`,
  })) },
  shoes: { icon: "👟", values: ["giày thể thao", "dép tổ ong", "giày da", "dép quai hậu"].map((name) => ({
    name, fact: `Đi ${name}`,
    is: (scene) => `Ngay chỗ để ${scene.item} còn in rõ một dấu đế ${name}.`,
    not: (scene) => `Người lau dọn khẳng định dấu chân quanh chỗ để ${scene.item} không phải đế ${name}.`,
  })) },
  vehicle: { icon: "🛵", values: [
    { name: "xe máy", fact: "Đi xe máy", go: "rời đi bằng xe máy", notGo: "không đi xe máy" },
    { name: "xe đạp", fact: "Đi xe đạp", go: "dắt xe đạp ra về", notGo: "không đi xe đạp" },
    { name: "đi bộ", fact: "Đi bộ", go: "đi bộ ra về", notGo: "không đi bộ ra về" },
    { name: "xe ôm công nghệ", fact: "Đi xe ôm công nghệ", go: "lên một chiếc xe ôm công nghệ", notGo: "không gọi xe ôm công nghệ" },
  ].map((value) => ({ ...value,
    is: (scene) => `Người trông xe thấy ${scene.taker} ${value.go} khi rời địa điểm.`,
    not: (scene) => `Người trông xe nhớ chắc ${scene.taker} ${value.notGo}.`,
  })) },
  bag: { icon: "🎒", values: ["ba lô", "túi đeo chéo", "túi vải", "cặp tài liệu"].map((name) => ({
    name, fact: `Mang ${name}`,
    is: (scene) => `Một nhân chứng nhớ ${scene.taker} có mang ${name}.`,
    not: (scene) => `Một nhân chứng nhớ ${scene.taker} không mang ${name}.`,
  })) },
  outfit: { icon: "👕", values: ["áo khoác có mũ", "áo sơ mi trắng", "áo len xám", "áo phông đen"].map((name) => ({
    name, fact: `Mặc ${name}`,
    is: (scene) => `Camera ngoài cửa ghi được ${scene.taker} mặc ${name}.`,
    not: (scene) => `Hình camera hơi mờ nhưng đủ thấy ${scene.taker} không mặc ${name}.`,
  })) },
};

export const detectiveNames = ["Minh", "Lan", "Hùng", "Thảo", "Quân", "Hà", "Phúc", "Ngọc", "Long", "Trang",
  "Khoa", "Vy", "Đạt", "Yến", "Sơn", "My", "Tâm", "Bảo", "Nhi", "Khánh"];

 
export const detectiveScenes = [
  { id: "cafe-wallet", icon: "☕", title: "Chiếc ví trên bàn số 4", client: "Chủ quán cà phê đầu hẻm", item: "chiếc ví", taker: "người cầm chiếc ví",
    intro: (count) => `Một khách quen để quên chiếc ví trên bàn số 4 của quán cà phê đầu hẻm. Trong ví có giấy tờ tùy thân và khoản tiền đặt cọc thuê nhà, nên khách chỉ mong lấy lại mà không muốn làm lớn chuyện. Chủ quán gửi bạn danh sách ${count} người đã ngồi gần bàn ấy trong buổi chiều. Bạn cần chỉ ra ai đã cầm chiếc ví.`,
    time: (a, b) => `Camera quầy cho thấy chiếc ví còn trên bàn lúc ${a} và không còn ở đó lúc ${b}.`,
    outcome: "Chiếc ví được trả lại cho khách, giấy tờ và tiền cọc vẫn còn nguyên.",
    roles: ["Khách ngồi bàn bên", "Nhân viên pha chế", "Người giao hàng", "Khách đọc sách", "Nhân viên phục vụ", "Khách họp nhóm"] },
  { id: "tailor-ring", icon: "🧵", title: "Chiếc nhẫn ở tiệm may", client: "Chủ tiệm may áo dài", item: "chiếc nhẫn", taker: "người lấy chiếc nhẫn",
    intro: (count) => `Một khách hàng tháo nhẫn cưới đặt trên bàn để thử áo dài, đến lúc thay đồ xong thì chiếc nhẫn không còn. Chủ tiệm may đã hỏi qua mọi người nhưng không ai nhận, và không muốn nghi oan cho ai khi chưa có căn cứ. Hôm đó có ${count} người ra vào khu thử đồ. Bạn cần chỉ ra ai đã lấy chiếc nhẫn.`,
    time: (a, b) => `Khách nhớ đã tháo nhẫn lúc ${a} và phát hiện mất lúc ${b}.`,
    outcome: "Chiếc nhẫn được trả lại cho khách trước khi tiệm đóng cửa.",
    roles: ["Thợ may", "Thợ phụ", "Khách đặt may", "Người giao vải", "Khách đi cùng", "Người học việc"] },
  { id: "community-fund", icon: "🏘️", title: "Phong bì quỹ khuyến học", client: "Tổ trưởng tổ dân phố", item: "phong bì", taker: "người lấy phong bì",
    intro: (count) => `Tổ trưởng tổ dân phố để phong bì quỹ khuyến học trong ngăn bàn ở nhà văn hóa trước buổi họp. Số tiền ấy do nhiều hộ góp lại để mua sách vở cho các em năm học mới. Họp xong, phong bì không còn trong ngăn bàn. Có ${count} người đã vào phòng trong buổi chiều. Bạn cần chỉ ra ai đã lấy phong bì.`,
    time: (a, b) => `Tổ trưởng kiểm tra ngăn bàn lúc ${a}, phong bì vẫn còn; đến ${b} thì đã mất.`,
    outcome: "Phong bì được nộp lại đủ số tiền, kịp mua sách vở cho các em.",
    roles: ["Thư ký tổ", "Người dân trong tổ", "Người dọn nhà văn hóa", "Thủ quỹ hội", "Người trông xe", "Người đến xin giấy xác nhận"] },
  { id: "warehouse", icon: "📦", title: "Hai thùng hàng trong kho", client: "Chủ cửa hàng điện máy", item: "hai thùng hàng", taker: "người mang hai thùng hàng",
    intro: (count) => `Chủ một cửa hàng điện máy thấy trong kho thiếu hai thùng nồi cơm điện so với phiếu nhập. Cửa hàng đang khó khăn, và chủ cửa hàng không muốn để mối nghi lan khắp nhân viên khi chưa rõ ai làm. Ngày hôm đó có ${count} người được vào kho. Bạn cần chỉ ra ai đã mang hai thùng hàng ra ngoài.`,
    time: (a, b) => `Phiếu kiểm kho ghi đủ hàng lúc ${a}; lần kiểm sau lúc ${b} thì đã thiếu.`,
    outcome: "Hai thùng hàng được mang trả về kho, phiếu nhập khớp trở lại.",
    roles: ["Thủ kho", "Nhân viên bán hàng", "Tài xế giao hàng", "Nhân viên lắp đặt", "Kế toán cửa hàng", "Người bốc xếp"] },
  { id: "studio-camera", icon: "📷", title: "Máy ảnh ở studio", client: "Chủ studio ảnh cưới", item: "chiếc máy ảnh", taker: "người lấy chiếc máy ảnh",
    intro: (count) => `Một studio ảnh cưới mất chiếc máy ảnh dự phòng để trên giá trong phòng chụp. Chủ studio cần lấy lại máy trước buổi chụp cuối tuần đã nhận cọc của khách. Hôm ấy có ${count} người làm việc hoặc ghé qua phòng chụp. Bạn cần chỉ ra ai đã lấy chiếc máy ảnh.`,
    time: (a, b) => `Thợ chụp cất máy lên giá lúc ${a}; đến ${b} thì giá đã trống.`,
    outcome: "Chiếc máy ảnh về lại giá, buổi chụp cuối tuần vẫn diễn ra đúng hẹn.",
    roles: ["Thợ chụp ảnh", "Thợ trang điểm", "Trợ lý ánh sáng", "Khách chụp ảnh", "Người giao hoa", "Nhân viên lễ tân"] },
  { id: "pharmacy", icon: "💊", title: "Ngăn kéo tiền của nhà thuốc", client: "Chủ nhà thuốc", item: "xấp tiền", taker: "người lấy xấp tiền",
    intro: (count) => `Cuối ngày, chủ nhà thuốc đếm tiền và thấy ngăn kéo thiếu đúng một xấp tiền lẻ đã bó sẵn. Nhà thuốc nhỏ, ai cũng quen mặt nhau, nên chủ nhà thuốc muốn biết rõ sự thật trước khi nói chuyện với bất kỳ ai. Trong ca chiều có ${count} người đứng sau quầy hoặc ghé lại lâu. Bạn cần chỉ ra ai đã lấy xấp tiền.`,
    time: (a, b) => `Sổ ghi chép cho thấy xấp tiền còn đủ lúc ${a} và đã thiếu lúc ${b}.`,
    outcome: "Xấp tiền được trả lại, ngăn kéo khớp sổ trước giờ đóng cửa.",
    roles: ["Dược sĩ ca chiều", "Nhân viên bán thuốc", "Người giao thuốc", "Khách mua thuốc quen", "Thợ sửa máy lạnh", "Sinh viên thực tập"] },
  { id: "library-laptop", icon: "💻", title: "Chiếc laptop ở thư viện", client: "Thủ thư thư viện quận", item: "chiếc laptop", taker: "người lấy chiếc laptop",
    intro: (count) => `Một sinh viên rời bàn đọc ở thư viện quận để nghe điện thoại, lúc quay lại thì chiếc laptop chứa toàn bộ bài luận tốt nghiệp đã không còn. Thư viện nhờ bạn tìm ra người đã cầm máy trước khi hạn nộp bài đến gần. Có ${count} người ngồi ở khu đọc ấy trong buổi chiều. Bạn cần chỉ ra ai đã lấy chiếc laptop.`,
    time: (a, b) => `Sinh viên rời bàn lúc ${a} và quay lại lúc ${b}.`,
    outcome: "Chiếc laptop được trả lại, bài luận tốt nghiệp vẫn còn nguyên.",
    roles: ["Thủ thư", "Người đọc báo", "Sinh viên ôn thi", "Người sắp xếp sách", "Học viên lớp tiếng Anh", "Người đến trả sách"] },
  { id: "garden-bonsai", icon: "🌳", title: "Chậu bonsai ở nhà vườn", client: "Chủ nhà vườn cây cảnh", item: "chậu bonsai", taker: "người mang chậu bonsai",
    intro: (count) => `Một nhà vườn mất chậu bonsai đã chăm hơn mười năm, vốn để dành dự hội chợ sinh vật cảnh. Chủ vườn không định truy cứu nặng, chỉ muốn biết ai đã mang chậu cây đi để nói chuyện thẳng thắn. Ngày hôm đó có ${count} người vào vườn. Bạn cần chỉ ra ai đã mang chậu bonsai đi.`,
    time: (a, b) => `Chủ vườn tưới cây lúc ${a}, chậu vẫn còn; đến ${b} thì trên kệ chỉ còn vết đất.`,
    outcome: "Chậu bonsai về lại kệ, kịp chuẩn bị cho hội chợ sinh vật cảnh.",
    roles: ["Thợ cắt tỉa", "Khách xem cây", "Người chở phân bón", "Hàng xóm", "Người học chăm cây", "Thương lái cây cảnh"] },
  { id: "gallery-catalog", icon: "🖼️", title: "Bản danh mục sau giờ triển lãm", client: "Điều phối viên phòng tranh", item: "bản danh mục có chữ ký", taker: "người mang bản danh mục đi",
    intro: count => `Sau buổi triển lãm, bản danh mục có chữ ký xác nhận của các tác giả biến mất khỏi bàn bàn giao. Một số tài liệu được chuyển sang khu đóng gói, nhưng bản gốc này chưa được phép mang đi. Có ${count} người ra vào khu bàn giao chiều hôm đó. Bạn cần xác định ai đã mang bản danh mục đi, không suy đoán động cơ từ nghề nghiệp của họ.`,
    time: (a, b) => `Ảnh bàn giao chụp lúc ${a} còn bản danh mục; lần kiểm lại lúc ${b} thì không thấy nữa.`,
    outcome: "Bản danh mục được tìm lại, các tác phẩm được bàn giao đúng hạn.",
    roles: ["Điều phối viên", "Họa sĩ", "Người đóng gói tranh", "Khách sưu tầm", "Người giao khung", "Trợ lý phòng tranh"] },
  { id: "bakery-recipe", icon: "🥖", title: "Cuốn sổ sau ca làm bánh", client: "Chủ tiệm bánh gia đình", item: "cuốn sổ công thức", taker: "người mang cuốn sổ đi",
    intro: count => `Cuối ca, chủ tiệm không tìm thấy cuốn sổ công thức có ghi chú tay của người cha đã nghỉ làm. Mọi người đều nhớ đã thấy sổ, nhưng mỗi người kể một đoạn khác nhau. Danh sách đã xác minh có ${count} người đến khu bàn làm việc. Bạn cần tìm đúng người đã mang cuốn sổ đi, thay vì mặc định người biết làm bánh là người đáng nghi nhất.`,
    time: (a, b) => `Ảnh chụp bàn làm việc lúc ${a} có cuốn sổ; đến ${b}, chủ tiệm phát hiện bàn đã trống.`,
    outcome: "Cuốn sổ được trả về tiệm, những ghi chép tay vẫn nguyên vẹn.",
    roles: ["Thợ bánh chính", "Người học việc", "Nhân viên đóng hộp", "Người giao nguyên liệu", "Khách đặt bánh", "Người sửa lò"] },
  { id: "station-luggage", icon: "🧳", title: "Hai chiếc túi ở phòng chờ", client: "Nhân viên hỗ trợ hành khách", item: "chiếc túi hành lý", taker: "người cầm nhầm chiếc túi",
    intro: count => `Một hành khách phát hiện chiếc túi trên ghế không phải của mình. Hai chiếc túi có ngoại hình gần giống nhau, và thông tin ban đầu cho thấy có người đã cầm nhầm. Có ${count} người từng ngồi hoặc làm việc gần dãy ghế ấy. Bạn cần tìm người đang cầm chiếc túi để đổi lại; hồ sơ không yêu cầu quy kết đây là hành vi cố ý.`,
    time: (a, b) => `Ảnh phòng chờ lúc ${a} còn chiếc túi đúng trên ghế; lúc ${b}, hành khách nhận ra túi đã bị đổi.`,
    outcome: "Hai chiếc túi được đổi lại đúng chủ trước giờ khởi hành.",
    roles: ["Hành khách chờ xe", "Người tiễn người thân", "Nhân viên vệ sinh", "Người bán nước", "Nhân viên vận chuyển", "Hướng dẫn viên"] },
  { id: "school-projector", icon: "📽️", title: "Máy chiếu rời phòng sinh hoạt", client: "Người phụ trách câu lạc bộ", item: "chiếc máy chiếu", taker: "người mang máy chiếu ra khỏi phòng",
    intro: count => `Máy chiếu ở phòng sinh hoạt được chuyển đi, nhưng phiếu mượn chưa được cập nhật. Buổi sinh hoạt sáng mai cần thiết bị, nên người phụ trách muốn tìm đúng người đã mang máy ra để liên hệ nhận lại. Có ${count} người sử dụng hoặc đi qua phòng chiều đó. Bạn cần dựng lại việc di chuyển thiết bị từ những dữ kiện đã xác minh.`,
    time: (a, b) => `Người phụ trách kiểm tra phòng lúc ${a}, máy chiếu vẫn còn; lúc ${b}, vị trí để máy đã trống.`,
    outcome: "Máy chiếu được đưa về phòng, buổi sinh hoạt không phải đổi lịch.",
    roles: ["Thành viên câu lạc bộ", "Nhân viên thiết bị", "Người phụ trách âm thanh", "Tình nguyện viên", "Nhân viên bảo trì", "Người hỗ trợ sự kiện"] },
];

export const getDetectiveScene = (id) => detectiveScenes.find((scene) => scene.id === id);
export const formatClock = (value) => `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
export const rankOf = (reputation) => detectiveRanks.filter((rank) => reputation >= rank.min).at(-1);
export const nextRankOf = (reputation) => detectiveRanks.find((rank) => rank.min > reputation) ?? null;
export const DAY_START = 13 * 60;
export const DAY_END = 18 * 60;

const STEP = 10;
const pick = (list, random) => list[Math.floor(random() * list.length)];
function sample(list, count, random) {
  const pool = [...list];
  return Array.from({ length: count }, () => pool.splice(Math.floor(random() * pool.length), 1)[0]);
}
function combinations(list, size, start = 0, head = [], out = []) {
  if (head.length === size) out.push(head);
  else for (let index = start; index < list.length; index++) combinations(list, size, index + 1, [...head, list[index]], out);
  return out;
}

 
export function matchesClue(suspect, clue, window) {
  if (!clue) return false;
  if (clue.type === "time") return suspect.arrive < window[1] && suspect.leave > window[0];
  if (clue.type === "either" || clue.type === "xor") {
    const count = clue.terms.filter(term => suspect.attrs[term.attr] === term.value).length;
    return clue.type === "either" ? count >= 1 : count === 1;
  }
  const same = suspect.attrs[clue.attr] === clue.value;
  return clue.type === "is" ? same : clue.type === "not" ? !same : false;
}
 
export const candidatesOf = (file, clueIndexes = file.clues.map((_, index) => index)) =>
  file.suspects.map((_, index) => index).filter((index) =>
    clueIndexes.every((clue) => matchesClue(file.suspects[index], file.clues[clue], file.window)));
export const sourceOf = (clue) => {
  const source = detectiveSources[["time", "either", "xor"].includes(clue.type) ? clue.type : clue.attr];
  return clue.terms ? { ...source, tells: `Mối liên hệ giữa ${clue.terms.map(term => detectiveAttributeLabels[term.attr]).join(" và ")} · ${clue.type === "xor" ? "chỉ một điều đúng" : "ít nhất một điều đúng"}` } : source;
};

export function describeClue(file, clue) {
  const scene = getDetectiveScene(file.scene);
  if (clue.type === "time") return scene.time(formatClock(file.window[0]), formatClock(file.window[1]));
  if (clue.type === "either" || clue.type === "xor") {
    const facts = clue.terms.map(term => detectiveAttributes[term.attr].values[term.value].fact.toLocaleLowerCase("vi-VN"));
    return clue.type === "either"
      ? `Biên bản đối chiếu xác nhận ${scene.taker} có ít nhất một trong hai dấu hiệu: “${facts[0]}” hoặc “${facts[1]}”. Có thể có cả hai; không thể thiếu cả hai.`
      : `Biên bản kiểm chứng xác nhận ${scene.taker} có đúng một trong hai dấu hiệu: “${facts[0]}” và “${facts[1]}”. Không thể có cả hai, cũng không thể thiếu cả hai.`;
  }
  return detectiveAttributes[clue.attr].values[clue.value][clue.type](scene);
}
export const describeFact = (suspect, attr) => detectiveAttributes[attr].values[suspect.attrs[attr]].fact;
 
export function describeMismatch(file, index, clueIndex) {
  const suspect = file.suspects[index];
  const clue = file.clues[clueIndex];
  if (clue.type === "either" || clue.type === "xor") {
    const facts = clue.terms.map(term => describeFact(suspect, term.attr).toLocaleLowerCase("vi-VN")).join("; ");
    const count = clue.terms.filter(term => suspect.attrs[term.attr] === term.value).length;
    return `${facts}: ${count === 0 ? "không khớp dấu hiệu nào" : "khớp cả hai dấu hiệu"}, trái với điều kiện ${clue.type === "either" ? "ít nhất một đúng" : "chỉ một đúng"}`;
  }
  return clue.type === "time"
    ? `có mặt ${formatClock(suspect.arrive)}–${formatClock(suspect.leave)}, không trùng lúc xảy ra việc`
    : describeFact(suspect, clue.attr).toLocaleLowerCase("vi-VN");
}
 
export function clearingClue(file, index, preferred = file.revealed ?? []) {
  const order = [...preferred, ...file.clues.map((_, clue) => clue).filter((clue) => !preferred.includes(clue))];
  return order.find((clue) => !matchesClue(file.suspects[index], file.clues[clue], file.window)) ?? -1;
}

 
export function createDetectiveCase(tierId, random = Math.random, avoidScenes = []) {
  const tier = detectiveTiers[tierId];
  for (let attempt = 0; attempt < 12000; attempt++) {
    const scene = pick(detectiveScenes.filter((option) => !avoidScenes.includes(option.id)), random);
     
    const start = 14 * 60 + STEP * Math.floor(random() * 13);
    const window = [start, start + STEP * (2 + Math.floor(random() * 3))];
    const values = Object.fromEntries(tier.attrs.map((attr) =>
      [attr, sample(detectiveAttributes[attr].values.map((_, index) => index), tier.values, random)]));
    const names = sample(detectiveNames, tier.suspects, random);
    const roles = sample(scene.roles, tier.suspects, random);
     
    const suspects = names.map((name, index) => {
      const arrive = DAY_START + STEP * Math.floor(random() * 22);
      return { name, role: roles[index], arrive, leave: Math.min(DAY_END, arrive + STEP * (3 + Math.floor(random() * 10))),
        attrs: Object.fromEntries(tier.attrs.map((attr) => [attr, pick(values[attr], random)])) };
    });
    const culprit = Math.floor(random() * suspects.length);
    const timeClue = { type: "time" };
    if (!matchesClue(suspects[culprit], timeClue, window) || suspects.every((suspect) => matchesClue(suspect, timeClue, window))) continue;
    const clues = [timeClue, ...tier.attrs.map((attr) => {
      const own = suspects[culprit].attrs[attr];
      if (attr === "route" || attr === "trace") {
        const otherAttr = pick(tier.attrs.filter(other => other !== attr && !["route", "trace"].includes(other)), random);
        const pattern = pick(attr === "trace" ? [1, 2] : [1, 2, 3], random);
        const firstValue = pattern & 1 ? own : pick(values[attr].filter(value => value !== own), random);
        const otherOwn = suspects[culprit].attrs[otherAttr];
        const otherValue = pattern & 2 ? otherOwn : pick(values[otherAttr].filter(value => value !== otherOwn), random);
        return { type: attr === "trace" ? "xor" : "either", terms: [{ attr, value: firstValue }, { attr: otherAttr, value: otherValue }] };
      }
      const options = [{ type: "is", attr, value: own }];
      if (tier.maxNegative) {
        for (const value of values[attr]) {
          if (value !== own && suspects.some((suspect) => suspect.attrs[attr] === value)) options.push({ type: "not", attr, value });
        }
      }
      return pick(options, random);
    })];
    const negatives = clues.filter((clue) => clue.type === "not").length;
    if (negatives < tier.minNegative || negatives > tier.maxNegative) continue;
    const file = { window, suspects, clues };
    const all = clues.map((_, index) => index);
    const solving = (size) => combinations(all, size).filter((set) => candidatesOf(file, set).length === 1).length;
    if (candidatesOf(file).length !== 1 || candidatesOf(file)[0] !== culprit) continue;
     
    let tooEasy = false;
    for (let size = 1; size < tier.hours && !tooEasy; size++) tooEasy = solving(size) > 0;
    const fitting = solving(tier.hours);
    if (tooEasy || fitting === 0 || fitting === combinations(all, tier.hours).length) continue;
     
    const compound = all.filter(index => ["either", "xor"].includes(clues[index].type));
    if (compound.length && candidatesOf(file, all.filter(index => !compound.includes(index))).length === 1) continue;
    if (compound.some(index => suspects.every(suspect => matchesClue(suspect, clues[index], window)))) continue;
    return { tier: tier.id, scene: scene.id, window, suspects, culprit, clues };
  }
  throw new Error("Không tạo được hồ sơ thám tử.");
}

 
export function detectiveOf(player) {
  if (!player.detective || typeof player.detective !== "object") {
    player.detective = { reputation: 0, solved: 0, failed: 0, streak: 0, board: null, current: null };
  }
  const detective = player.detective;
   
  if (detective.current && !Array.isArray(detective.current.revealed)) detective.current = null;
  return detective;
}

 
export function boardTiers(reputation) {
  const top = detectiveTiers.filter((tier) => reputation >= tier.minReputation).at(-1).id;
  return Array.from({ length: BOARD_SIZE }, (_, index) => Math.min(index, top));
}
export function ensureBoard(player, random = Math.random) {
  const detective = detectiveOf(player);
  if (player.age < DETECTIVE_MIN_AGE || detective.board?.age === player.age) return false;
  const offers = [];
  for (const tier of boardTiers(detective.reputation)) {
    offers.push({ file: createWithFallback(tier, random, offers.map((offer) => offer.file.scene)), taken: false });
  }
  detective.board = { age: player.age, offers };
  return true;
}
 
function createWithFallback(tierId, random, avoidScenes) {
  for (let tier = tierId; tier > 0; tier--) {
    try { return createDetectiveCase(tier, random, avoidScenes); } catch {   }
  }
  return createDetectiveCase(0, random, avoidScenes);
}
export function getOfferBlocker(player, offerIndex) {
  const detective = player.detective;
  const offer = detective?.board?.offers?.[offerIndex];
  if (player.isAlive === false) return "Nhân vật đã qua đời.";
  if (player.age < DETECTIVE_MIN_AGE) return `Cần đủ ${DETECTIVE_MIN_AGE} tuổi để nhận vụ việc.`;
  if (!offer || detective.board.age !== player.age) return "Hồ sơ này không còn.";
  if (offer.taken) return "Đã nhận hồ sơ này.";
  if (detective.current) return "Hãy khép hồ sơ đang mở trước.";
  return "";
}
export function takeOffer(player, offerIndex) {
  if (getOfferBlocker(player, offerIndex)) return null;
  const detective = player.detective;
  const offer = detective.board.offers[offerIndex];
  offer.taken = true;
  const sharp = (Number(player.intelligence) || 0) >= SHARP_INTELLECT;
  detective.current = { ...structuredClone(offer.file), hours: detectiveTiers[offer.file.tier].hours + (sharp ? 1 : 0),
    sharp, extraHours: 0, revealed: [], crossed: [], result: null };
  return detective.current;
}

export const hoursLeft = (file) => Math.max(0, file.hours - file.revealed.length + file.extraHours);
export const canInvestigate = (file, clueIndex) => !file.result && !file.revealed.includes(clueIndex) &&
  (hoursLeft(file) > 0 || file.extraHours < MAX_EXTRA_HOURS);
export function investigate(player, clueIndex) {
  const file = player.detective?.current;
  if (!file || !file.clues[clueIndex] || !canInvestigate(file, clueIndex)) return false;
  if (hoursLeft(file) === 0) file.extraHours++;
  file.revealed.push(clueIndex);
  return true;
}
export const baseRewardOf = (file) =>
  Math.round(detectiveTiers[file.tier].reward * (1 - EXTRA_HOUR_RATE * file.extraHours) / 10_000) * 10_000;

 
export function accuse(player, accused, reasons = {}) {
  const detective = player.detective;
  const file = detective?.current;
  if (!file || file.result || !file.suspects[accused]) return null;
  const tier = detectiveTiers[file.tier];
  const proofs = file.suspects.map((suspect, index) => {
    if (index === accused) return null;
    const clue = reasons[index];
    return Number.isInteger(clue) && Boolean(file.clues[clue]) && file.revealed.includes(clue) && !matchesClue(suspect, file.clues[clue], file.window);
  });
  const unproven = proofs.filter((proof) => proof === false).length;
  const result = { accused, reasons: { ...reasons }, proofs, correct: accused === file.culprit, unproven,
    reward: 0, reputation: 0, happiness: 0, intelligence: 0 };
  if (result.correct) {
    result.reward = Math.round(baseRewardOf(file) * Math.max(MIN_REWARD_RATE, 1 - UNPROVEN_RATE * unproven) / 10_000) * 10_000;
    player.money += result.reward;
    detective.solved++;
    if (unproven === 0) {
      result.reputation = tier.reputation;
      result.intelligence = applyActivityGain(player, "intelligence", 1);
      detective.streak++;
    } else {
      detective.streak = 0;
    }
  } else {
    result.reputation = -Math.min(WRONG_REPUTATION, detective.reputation);
    result.happiness = -Math.min(WRONG_HAPPINESS, player.happiness ?? 0);
    player.happiness = Math.max(0, (player.happiness ?? 0) - WRONG_HAPPINESS);
    detective.failed++;
    detective.streak = 0;
  }
  detective.reputation += result.reputation;
  file.result = result;
  return result;
}

export function detectiveAchievementIds(detective, file) {
  const ids = [];
  if (detective.solved >= 1) ids.push("detective-first");
  if (detective.solved >= 10) ids.push("detective-ten");
  if (detective.streak >= 5) ids.push("detective-streak");
  if (detective.reputation >= detectiveRanks.at(-1).min) ids.push("detective-top-rank");
  if (file?.result?.correct && file.result.unproven === 0 && file.tier === 2 && file.extraHours === 0) ids.push("detective-hard-clean");
  return ids;
}
