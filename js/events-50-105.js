import { ensureEventOpenMoji } from "./event-openmoji.js";
import { createLaterSpecialEvent } from "./special-later-life.js";

const art = (code, alt) => {
  const image = new URL(`./img/events/openmoji/color/svg/${code}.svg`, import.meta.url).href;
  return { image, imageAlt: alt, imageFallback: image, imageFallbackAlt: alt };
};
const themes = {
  memory: ["1F4F8", ["Ghi lại điều tôi nhớ", { intelligence: 2, happiness: 1 }], ["Chia sẻ câu chuyện", { intelligence: 1, happiness: 3 }]],
  learn: ["1F4D6", ["Tự thử từng bước", { intelligence: 3 }], ["Nhờ người quen hướng dẫn", { intelligence: 2, happiness: 1 }]],
  home: ["1F9F9", ["Sắp xếp một phần nhỏ", { intelligence: 2, happiness: 1 }], ["Nhờ người quen cùng làm", { happiness: 3 }]],
  nature: ["1F331", ["Ngắm và ghi nhận", { happiness: 2, intelligence: 1 }], ["Rủ người quen cùng ngắm", { happiness: 3 }]],
  meet: ["1F91D", ["Chủ động hỏi thăm", { happiness: 3 }], ["Hẹn một lúc phù hợp hơn", { intelligence: 1, happiness: 2 }]],
  create: ["1F3A8", ["Thử làm theo ý mình", { intelligence: 2, happiness: 2 }], ["Cùng làm với người quen", { happiness: 3, intelligence: 1 }]],
  pace: ["1F4C5", ["Điều chỉnh cho vừa sức", { health: 1, intelligence: 2 }], ["Dành thêm thời gian nghỉ", { health: 1, happiness: 2 }]],
  meal: ["1F373", ["Chuẩn bị món đơn giản", { intelligence: 1, happiness: 2 }], ["Chia sẻ một bữa ăn", { happiness: 3 }]],
  share: ["1F91D", ["Góp sức theo khả năng", { happiness: 3 }], ["Chia sẻ điều mình biết", { intelligence: 2, happiness: 1 }]],
  plan: ["1F4C5", ["Chọn một việc để bắt đầu", { intelligence: 2, happiness: 1 }], ["Trao đổi với người thân thiết", { happiness: 3 }]],
};

// Mỗi dòng có nội dung và hai kết quả riêng. Không giả định có bạn đời,
// con cháu, việc làm hoặc khả năng tự đi lại. Các mốc dành chỗ đã có hai dòng.
const stories = {
  50: [
    ["plan", "Năm mươi, một lời hẹn mới", "Sinh nhật năm mươi, tôi muốn dành năm tới cho điều mình thường trì hoãn. Danh sách dài, nhưng thời gian mỗi ngày vẫn thế.", "Tôi chọn một mong muốn nhỏ và đặt ngày bắt đầu, thay vì ôm cả danh sách.", "Tôi trò chuyện với người thân thiết và tìm một kế hoạch có cả niềm vui lẫn giờ nghỉ."],
    ["memory", "Bức ảnh đúng nửa đời người", "Một người bạn gửi lại tấm ảnh hồi trẻ. Tôi nhận ra mình nhớ tiếng cười hôm ấy rõ hơn tên quán.", "Tôi ghi lại câu chuyện phía sau bức ảnh, cả điều còn nhớ lẫn điều chưa chắc.", "Tôi gửi lời hỏi thăm bạn và cùng nhắc lại buổi gặp ngày xưa."],
  ],
  51: [
    ["learn", "Một nút bấm làm ảnh rõ hơn", "Tôi chụp cảnh ngoài cửa nhưng ảnh cứ tối. Trong điện thoại có một tính năng tôi chưa từng dùng.", "Tôi đọc hướng dẫn và thử chỉnh ánh sáng trên vài tấm ảnh.", "Người quen chỉ tôi cách chụp; tôi tự làm lại để nhớ thao tác."],
    ["home", "Kệ sách hết chỗ", "Kệ sách đã chật, vài cuốn nằm ngang che mất tên những cuốn phía sau.", "Tôi sắp một tầng theo nhóm và để riêng cuốn đang đọc.", "Tôi nhờ bạn cùng phân loại sách, tiện thể trao đổi vài cuốn muốn đọc."],
    ["meet", "Người bạn vừa đổi chỗ ở", "Bạn cũ chuyển sang khu khác. Khoảng cách xa hơn khiến những cuộc gặp tiện đường không còn nữa.", "Tôi gọi hỏi bạn đã quen nơi mới chưa và nghe chuyện hàng xóm của họ.", "Tôi hẹn một buổi gọi cụ thể để hai người vẫn giữ liên lạc."],
  ],
  52: [
    ["meal", "Món canh nhớ từ hồi nhỏ", "Một mùi rau quen khiến tôi muốn nấu lại món canh ngày xưa. Công thức trong trí nhớ chỉ có chữ ‘vừa đủ’.", "Tôi nấu một phần nhỏ, nêm từng chút rồi ghi lại cách làm.", "Tôi rủ người quen ăn cùng và hỏi họ nhớ món canh ấy ra sao."],
    ["pace", "Lịch cuối tuần quá nhiều ô", "Tôi nhận lời vài việc trong cùng một cuối tuần. Nhìn lại lịch, tôi thấy các khoảng nghỉ đã biến mất.", "Tôi đổi một cuộc hẹn và chia việc thành những phần vừa sức.", "Tôi báo trước mình cần nghỉ, giữ lại một buổi tối không thêm việc."],
    ["nature", "Cành cây bên cửa có chồi mới", "Cành cây tôi tưởng khô lại nhú mấy chồi xanh. Mỗi sáng, chúng dường như lớn thêm một chút.", "Tôi quan sát và ghi vài dòng về những thay đổi trên cành cây.", "Tôi gửi ảnh cho người quen, cùng chờ xem khi nào lá mở hết."],
  ],
  53: [
    ["share", "Thư viện cần người phân loại sách", "Thư viện nhỏ gần nhà nhờ hỗ trợ sách được tặng. Tôi muốn giúp nhưng không có cả ngày rảnh.", "Tôi nhận một phần việc ngắn, phân loại được một chồng sách.", "Tôi chia sẻ cách ghi nhãn để mọi người dễ tìm và trả sách."],
    ["create", "Một tấm thiệp tự làm", "Sắp sinh nhật người bạn, tôi muốn tặng một tấm thiệp. Nét chữ của tôi hơi nghiêng nhưng lời chúc thì rõ.", "Tôi tự trang trí thiệp và viết một kỷ niệm hai người cùng nhớ.", "Tôi cùng người quen làm thiệp, mỗi người góp một lời chúc."],
    ["memory", "Tiếng rao nghe lại sau nhiều năm", "Một tiếng rao ngoài phố gợi tôi nhớ con đường cũ. Cảnh vật trong đầu hiện lên rất nhanh.", "Tôi ghi lại những hàng quán và âm thanh mình nhớ về con đường ấy.", "Tôi kể chuyện cho bạn, rồi nghe họ nhớ một khu phố khác."],
  ],
  54: [
    ["home", "Chiếc hộp đựng toàn dây sạc", "Tôi cần một dây sạc nhưng trong hộp có cả những dây của máy đã không còn dùng.", "Tôi kiểm tra, ghi nhãn những dây cần thiết và cất riêng đồ chưa rõ.", "Tôi nhờ người quen giúp nhận diện dây, rồi cùng sắp lại hộp."],
    ["learn", "Buổi nghe chuyện lịch sử địa phương", "Tôi thấy một buổi giới thiệu lịch sử khu phố, có cả hình ảnh những con đường trước đây.", "Tôi xem tư liệu và ghi lại một địa điểm muốn tìm hiểu thêm.", "Tôi hỏi người hiểu chuyện địa phương để nối các bức ảnh với hiện tại."],
    ["meet", "Tin nhắn lâu rồi chưa trả lời", "Tôi tìm thấy lời hỏi thăm của một người bạn đã bị trôi giữa nhiều thông báo.", "Tôi trả lời, giải thích đã bỏ sót tin và hỏi thăm cuộc sống của bạn.", "Tôi nhắn hẹn giờ gọi khi cả hai rảnh, không để cuộc trò chuyện lại trôi mất."],
  ],
  55: [
    ["plan", "Một dự định ở tuổi năm mươi lăm", "Tôi muốn dành thêm thời gian cho sở thích. Điều cần tìm là một lịch dễ giữ, không phải lịch thật đẹp.", "Tôi chọn một buổi ngắn mỗi tuần và chuẩn bị đồ sẵn có.", "Tôi hỏi người thân thiết cách họ giữ thời gian cho điều mình thích."],
    ["meal", "Bữa cơm có một món lạ", "Người quen cho tôi ít nguyên liệu địa phương. Tôi chưa biết nấu thế nào để giữ được mùi vị.", "Tôi tìm cách nấu đơn giản và thử một phần vừa đủ.", "Tôi mời người quen cùng ăn, nghe họ kể về món ở quê mình."],
  ],
  56: [
    ["nature", "Cơn mưa làm khu phố đổi màu", "Sau mưa, cây bên đường sạch bụi và mái nhà ánh lên. Một góc quen trông khác hẳn.", "Tôi ngắm cảnh từ chỗ khô ráo và ghi lại màu mình thích.", "Tôi gửi tấm ảnh sau mưa cho bạn, cùng nhận ra nét đẹp thường bỏ qua."],
    ["create", "Trang sổ cần một bìa mới", "Cuốn sổ ghi chép đã sờn bìa nhưng bên trong còn nhiều trang. Tôi muốn giữ nó dùng tiếp.", "Tôi bọc lại bằng giấy có sẵn và viết tên lên bìa.", "Tôi cùng người quen trang trí bìa, cuốn sổ có thêm dấu tay của hai người."],
    ["pace", "Một việc làm chậm lại vẫn xong", "Tôi thường làm liền nhiều việc nhà rồi mới nghỉ. Hôm nay tôi muốn thử chia thành từng đoạn.", "Tôi làm một phần, nghỉ rồi tiếp tục; việc vẫn xong mà bớt vội.", "Tôi để phần chưa cần gấp sang hôm khác và dành thời gian thư giãn."],
  ],
  57: [
    ["memory", "Tấm vé cũ trong túi áo", "Trong chiếc áo lâu không mặc có một tấm vé chuyến đi trước đây. Tôi nhớ mình đã mong chuyến đó thế nào.", "Tôi ghi tên chuyến đi và điều vui nhất lên phong bì giữ vé.", "Tôi kể lại hành trình cho người quen và nghe chuyện đi xa của họ."],
    ["learn", "Nghe sách bằng giọng đọc", "Tôi thử nghe một cuốn sách thay vì đọc chữ. Nhịp kể ban đầu hơi nhanh với tôi.", "Tôi điều chỉnh tốc độ rồi nghe một chương ngắn để làm quen.", "Tôi nhờ người quen chỉ cách đánh dấu đoạn muốn nghe lại."],
    ["share", "Người trẻ hỏi cách bắt đầu", "Một người trẻ hỏi tôi làm sao theo đuổi sở thích lâu dài. Tôi nhớ cả những lần mình bỏ dở.", "Tôi giúp họ chia mục tiêu thành một việc nhỏ có thể thử ngay.", "Tôi kể điều từng giúp mình và cả những cách không phù hợp với mình."],
  ],
  58: [
    ["home", "Bàn ăn thành nơi để đồ", "Bàn ăn có thư từ, sách và mấy món đồ chưa tìm được chỗ. Bữa ăn phải chen ở một góc.", "Tôi dọn từng nhóm nhỏ, trả lại một khoảng trống cho bàn ăn.", "Tôi nhờ người quen cùng phân loại, vừa dọn vừa trò chuyện."],
    ["meet", "Người hàng xóm mới chào trước", "Hàng xóm mới hỏi tôi chỗ mua đồ gần nhà. Một câu hỏi mở đầu cuộc trò chuyện dễ chịu.", "Tôi chỉ đường và hỏi họ đã quen nếp sống khu phố chưa.", "Tôi hẹn lúc rảnh sẽ gửi danh sách vài địa điểm tiện dùng."],
    ["meal", "Mâm cơm nhỏ, không dư nhiều", "Tôi muốn chuẩn bị bữa vừa đủ thay vì nấu thật nhiều rồi cất kín tủ.", "Tôi chọn một món chính đơn giản và ghi lại lượng nguyên liệu phù hợp.", "Tôi mời người quen cùng ăn, chia phần vừa đủ để không bỏ phí."],
  ],
  59: [
    ["plan", "Trước một thập niên mới", "Tuổi sáu mươi còn một năm nữa. Tôi muốn giữ những điều hữu ích, bớt những việc chỉ làm vì quen.", "Tôi chọn một thói quen muốn giữ và một việc có thể giảm bớt.", "Tôi trao đổi với người thân thiết về nhịp sống mình mong muốn."],
    ["memory", "Danh sách những lần làm lại", "Tôi nghĩ về các lần từng đổi hướng. Nhiều bước ngoặt khi đó khó khăn, giờ đã thành kinh nghiệm.", "Tôi ghi điều học được từ một lần làm lại đáng nhớ.", "Tôi chia sẻ câu chuyện với bạn, không giấu cả những lúc lúng túng."],
    ["nature", "Một chiều nhìn mây chậm trôi", "Buổi chiều, tôi bắt gặp đám mây có hình rất lạ. Nó đổi hình trước khi tôi kịp chụp ảnh.", "Tôi ngắm thêm một lúc, giữ khoảnh khắc bằng vài dòng ghi chú.", "Tôi gọi người quen cùng nhìn; hai người thấy hai hình hoàn toàn khác."],
  ],
  60: [
    ["plan", "Sáu mươi, một nhịp sống riêng", "Sinh nhật sáu mươi, tôi nghĩ về cách chia ngày cho việc cần làm, sở thích và những cuộc gặp.", "Tôi thử một lịch vừa sức, có khoảng trống để nghỉ và đổi kế hoạch.", "Tôi hỏi người thân thiết điều họ muốn cùng làm trong năm tới."],
    ["create", "Chiếc khung cho ảnh mới", "Tôi muốn đặt một tấm ảnh yêu thích ở nơi dễ thấy, thay vì chỉ để trong điện thoại.", "Tôi chọn khung sẵn có và thêm một dòng chú thích nhỏ.", "Tôi cùng người quen chọn ảnh, nghe họ kể vì sao thích khoảnh khắc ấy."],
  ],
  61: [
    ["meet", "Một cuộc hẹn giữa ban ngày", "Tôi và bạn thường hẹn vào tối muộn. Lần này cả hai muốn thử gặp lúc có nhiều thời gian hơn.", "Tôi gọi hỏi lịch của bạn và chọn một buổi gặp thong thả.", "Tôi hẹn ngày khác khi cả hai không phải tranh thủ từng phút."],
    ["learn", "Tên loài cây trong tấm ảnh", "Tôi có ảnh một loài cây lạ nhưng chưa biết tên. Những chiếc lá khiến tôi tò mò.", "Tôi tìm thông tin và so sánh hình lá, ghi lại điều chưa chắc.", "Tôi hỏi người mê cây để tìm tên đúng và cách phân biệt."],
    ["home", "Đồ thường dùng đặt quá xa", "Tôi nhận ra những thứ dùng hằng ngày lại nằm ở góc khó lấy. Có lẽ cách sắp xếp đã đến lúc đổi.", "Tôi chuyển vài món nhẹ đến vị trí thuận tiện hơn.", "Tôi nhờ người quen giúp đổi chỗ đồ nặng, giữ lối đi gọn."],
  ],
  62: [
    ["meal", "Một bữa sáng đổi món", "Tôi đã ăn món quen suốt nhiều ngày. Hôm nay tôi muốn một bữa đơn giản nhưng có chút mới.", "Tôi chọn nguyên liệu sẵn có và thử cách chế biến khác.", "Tôi hẹn người quen ăn sáng cùng, đổi cả món lẫn câu chuyện."],
    ["memory", "Địa chỉ cũ trên một phong thư", "Phong thư ngày trước ghi địa chỉ nơi tôi từng sống. Chữ viết làm tôi nhớ người gửi.", "Tôi cất thư vào tập kỷ niệm và ghi chuyện của thời ấy.", "Tôi kể về người gửi thư cho một người thân thiết."],
    ["share", "Sách hướng dẫn cần lời dễ hiểu", "Nhóm sinh hoạt gần nhà muốn làm một tờ hướng dẫn cho người mới. Tôi thấy vài câu hơi khó đọc.", "Tôi giúp đọc thử và chỉ ra những chỗ cần viết rõ hơn.", "Tôi chia sẻ cách ghi từng bước mà mình thường dùng."],
  ],
  63: [
    ["pace", "Một buổi hẹn có thể ngắn hơn", "Buổi sinh hoạt kéo dài hơn tôi dự tính. Tôi muốn tham gia nhưng vẫn cần thời gian nghỉ.", "Tôi báo trước chỉ ở một phần buổi và chọn phần mình quan tâm.", "Tôi xin về nghỉ, hẹn nghe mọi người kể lại vào hôm khác."],
    ["create", "Những màu tôi chưa dùng", "Hộp màu còn nhiều cây nguyên vẹn. Tôi muốn thử một bảng màu khác thay vì chọn mãi màu quen.", "Tôi tô vài mảng nhỏ, nhận ra những màu đi cùng nhau khá đẹp.", "Tôi rủ người quen cùng tô, mỗi người chọn một bảng màu."],
    ["nature", "Tiếng chim lạ lúc sáng sớm", "Một tiếng chim mới vang ngoài cửa. Tôi không nhìn thấy nó nhưng nghe điệu hót khá rõ.", "Tôi ngồi nghe và ghi lại lúc tiếng chim thường xuất hiện.", "Tôi gửi đoạn ghi âm cho người quen, cùng đoán xem loài nào."],
  ],
  64: [
    ["home", "Một góc để ngồi đọc", "Góc tôi thường đọc sách bị đồ dùng chiếm gần hết. Tôi muốn có lại một chỗ yên tĩnh.", "Tôi dọn một khoảng nhỏ và đặt sách đang đọc trong tầm tay.", "Tôi nhờ người quen cùng sắp lại góc ngồi cho thoải mái."],
    ["learn", "Từ mới trong bản tin", "Bản tin nhắc một từ tôi chưa hiểu. Tôi không muốn đoán nghĩa rồi bỏ qua.", "Tôi tra nghĩa và đọc một ví dụ để hiểu cách dùng.", "Tôi hỏi người quen giải thích bằng lời đơn giản rồi ghi lại."],
    ["meet", "Bạn kể một chuyện khó nói", "Một người bạn có vẻ muốn tâm sự nhưng cứ đổi chủ đề. Tôi nghĩ họ cần người nghe hơn lời khuyên.", "Tôi hỏi nhẹ nhàng và dành thời gian nghe, không thúc họ kể hết.", "Tôi hẹn lúc riêng tư hơn để bạn có thể nói thoải mái."],
  ],
  65: [
    ["memory", "Sáu mươi lăm và cuốn sổ lâu năm", "Cuốn sổ cũ ghi nhiều điều tôi từng rất bận tâm. Có những chuyện giờ đọc lại thấy nhẹ hơn.", "Tôi thêm vài dòng về cách nhìn hiện tại bên cạnh ghi chép cũ.", "Tôi chia sẻ một trang mình thích với người thân thiết."],
    ["plan", "Một tuần có chỗ cho điều thích", "Tôi muốn một tuần vừa có việc cần làm vừa có niềm vui nhỏ. Kế hoạch không cần giống ai khác.", "Tôi chọn một buổi dành cho sở thích và thử giữ đều.", "Tôi trao đổi với bạn về một hoạt động hai người cùng thích."],
  ],
  66: [
    ["share", "Một món đồ cần hướng dẫn", "Tôi tặng lại món đồ còn tốt cho người quen. Họ chưa rõ cách sử dụng và chăm giữ.", "Tôi cùng họ kiểm tra phụ kiện và thử dùng một lần.", "Tôi ghi những điều mình đã học khi dùng món đồ ấy."],
    ["meal", "Món ăn gợi một vùng quê", "Tôi nghe người quen kể về món quê họ. Nguyên liệu có vài thứ giống món tôi từng biết.", "Tôi thử phiên bản đơn giản từ những nguyên liệu dễ tìm.", "Tôi cùng người quen ăn và nghe câu chuyện phía sau món ấy."],
    ["nature", "Mùa hoa trở lại ở góc đường", "Góc đường quen lại có hoa nở. Tôi thấy mùa đổi qua những dấu hiệu rất nhỏ.", "Tôi ghi ngày thấy hoa đầu tiên và ngắm màu cánh hoa.", "Tôi gửi ảnh cho bạn, nhắc họ mùa hoa năm nay đã đến."],
  ],
  67: [
    ["learn", "Bản đồ có một đường mới", "Tôi xem bản đồ khu phố và nhận ra một đường mới mở. Những lối đi quen không còn là lựa chọn duy nhất.", "Tôi đọc tên đường và đánh dấu vài nơi muốn tìm hiểu.", "Tôi nhờ người quen chỉ cách xem tuyến đường phù hợp."],
    ["home", "Nhãn hộp đã mờ chữ", "Mấy hộp đồ trông giống nhau, nhãn cũ đã nhòe. Mỗi lần tìm đồ tôi phải mở từng hộp.", "Tôi viết nhãn lớn, rõ và sắp hộp theo tần suất dùng.", "Tôi nhờ người quen giúp kiểm tra, đặt lại tên cho từng hộp."],
    ["memory", "Kỷ niệm có hai phiên bản", "Tôi và bạn nhớ khác nhau về một buổi đi chơi cũ. Cả hai đều tin mình đúng.", "Tôi ghi lại cả hai cách kể, không vội biến ký ức thành cuộc thi.", "Chúng tôi cùng kể và cười; phần vui nhất vẫn giống nhau."],
  ],
  68: [
    ["meet", "Người quen lâu rồi không ghé", "Một người từng hay đến chơi đã ít xuất hiện. Tôi muốn hỏi thăm mà không làm họ khó xử.", "Tôi gửi một lời hỏi thăm ngắn và để họ trả lời khi thuận tiện.", "Tôi hẹn một cuộc gọi vào lúc họ có thể dành thời gian."],
    ["create", "Tập ảnh cần một trang mở đầu", "Album đã có ảnh nhưng trang đầu còn trống. Tôi muốn viết vài câu giới thiệu chặng đường trong đó.", "Tôi chọn một câu ngắn và tự trang trí trang mở đầu.", "Tôi rủ người quen cùng chọn tiêu đề, nghe thêm ý tưởng của họ."],
    ["pace", "Công việc nhà không cần xong một lượt", "Tôi có vài việc nhỏ trong nhà. Làm hết cùng lúc khiến buổi sáng thành một cuộc chạy đua.", "Tôi chia việc theo ngày và giữ phần hôm nay vừa sức.", "Tôi làm điều cần nhất rồi nghỉ, không ép mình hoàn tất cả danh sách."],
  ],
  69: [
    ["plan", "Một việc muốn giữ sang tuổi bảy mươi", "Tôi nghĩ về điều giúp ngày của mình dễ chịu nhất. Có lẽ nên dành chỗ cho nó thường xuyên hơn.", "Tôi chọn một thói quen nhỏ và ghi lại cách duy trì.", "Tôi hỏi người thân thiết điều gì đang làm ngày của họ vui hơn."],
    ["memory", "Lời cảm ơn chưa từng nói rõ", "Tôi nhớ một người đã giúp mình từ lâu. Trước đây tôi chỉ cảm ơn rất vội.", "Tôi viết lại chuyện ấy và điều sự giúp đỡ đã thay đổi.", "Tôi gửi lời cảm ơn cụ thể, để người ấy biết tôi vẫn nhớ."],
    ["nature", "Ánh nắng đổi chỗ trên tường", "Vệt nắng trong phòng không còn ở chỗ như tháng trước. Một chiếc bóng nhỏ cũng thay đổi theo mùa.", "Tôi quan sát và ghi lại giờ nắng đến góc phòng.", "Tôi rủ người quen cùng ngắm, kể cho họ về chiếc bóng đổi chỗ."],
  ],
  70: [
    ["memory", "Bảy mươi, những câu chuyện còn muốn kể", "Sinh nhật bảy mươi, tôi nghĩ đến những chuyện mình muốn giữ lại. Không phải chuyện nào cũng cần thật lớn.", "Tôi ghi một kỷ niệm nhỏ nhưng khiến mình mỉm cười.", "Tôi kể chuyện ấy với người thân thiết và nghe họ kể lại từ góc nhìn khác."],
    ["pace", "Một ngày theo nhịp của tôi", "Tôi muốn sắp ngày sao cho việc cần làm và giờ nghỉ đều có chỗ. Có nhiều cách sống một ngày trọn vẹn.", "Tôi chọn một việc vừa sức, làm chậm và dừng khi cần.", "Tôi để một buổi không thêm việc, dành thời gian thư giãn."],
  ],
  71: [
    ["learn", "Giọng đọc trong chiếc máy nhỏ", "Một người quen giới thiệu cách mở chương trình kể chuyện. Tôi muốn tự chọn thứ mình thích nghe.", "Tôi thử tìm chương trình và tập bật lại đoạn đang nghe dở.", "Tôi nhờ họ hướng dẫn cách chọn âm lượng và lưu mục yêu thích."],
    ["meet", "Lời chào từ bạn sinh hoạt chung", "Người quen trong nhóm sinh hoạt nhắn một lời chào. Chỉ vài chữ cũng khiến ngày bớt im lặng.", "Tôi đáp lại và hỏi họ hôm nay có điều gì vui.", "Tôi hẹn lúc cả hai thuận tiện để trò chuyện dài hơn."],
    ["home", "Chiếc bàn có thể gần hơn", "Đồ tôi hay dùng nằm cách chỗ ngồi khá xa. Một thay đổi nhỏ có thể làm sinh hoạt thuận tiện hơn.", "Tôi sắp những món nhẹ trong tầm tay và chừa mặt bàn gọn.", "Tôi nhờ người quen giúp bố trí bàn, cùng kiểm tra chỗ nào dễ lấy đồ."],
  ],
  72: [
    ["meal", "Một món mềm với mùi quen", "Tôi muốn một món ăn dễ thưởng thức mà vẫn giữ mùi vị thích từ trước.", "Tôi chọn cách chuẩn bị đơn giản, vừa với sở thích của mình.", "Tôi hẹn một bữa ăn nhỏ cùng người quen, chia sẻ những món hai người thích."],
    ["nature", "Gió làm những chiếc lá đổi mặt", "Từ chỗ ngồi, tôi nhìn thấy gió lật mặt lá. Cây quen hiện ra nhiều sắc xanh khác nhau.", "Tôi ngắm một lúc và ghi lại điều vừa nhận thấy.", "Tôi gửi lời rủ người quen cùng nhìn cây trong cơn gió nhẹ."],
    ["memory", "Tên người bạn trên mặt sau ảnh", "Sau một tấm ảnh có tên người bạn từng gặp rất lâu trước. Tôi nhớ câu chào của họ hơn khuôn mặt.", "Tôi ghi lại câu chào và hoàn cảnh hai người quen nhau.", "Tôi kể với người thân thiết, giữ tên người bạn trong câu chuyện."],
  ],
  73: [
    ["create", "Một bức vẽ từ chỗ ngồi", "Tôi muốn vẽ cảnh nhìn thấy từ góc quen trong nhà. Không cần đứng trước phong cảnh mới có thứ để vẽ.", "Tôi phác vài nét cửa sổ và vệt sáng theo cách mình thích.", "Tôi rủ người quen cùng vẽ, so sánh hai cách nhìn một khung cảnh."],
    ["share", "Người quen muốn nghe chuyện món cũ", "Một người hỏi vì sao món ăn ngày trước có tên như vậy. Tôi nhớ một câu chuyện gắn với nó.", "Tôi giúp họ ghi lại tên nguyên liệu và điều mình còn nhớ.", "Tôi kể câu chuyện, nói rõ phần nào là ký ức chứ chưa chắc đúng lịch sử."],
    ["pace", "Buổi gặp cần một khoảng nghỉ", "Cuộc gặp vui nhưng kéo dài. Tôi muốn ở bên mọi người mà không quên nhịp riêng của mình.", "Tôi đề nghị nghỉ một lúc rồi tiếp tục trò chuyện.", "Tôi xin kết thúc buổi gặp sớm hơn và hẹn lần sau."],
  ],
  74: [
    ["home", "Một chiếc hộp cho thư từ mới", "Thư và thiệp gần đây được đặt nhiều chỗ. Tôi muốn cất chúng ở nơi dễ tìm lại.", "Tôi dành một hộp riêng, xếp thư theo người gửi.", "Tôi nhờ người quen cùng đọc tên và ghi nhãn các ngăn."],
    ["learn", "Chữ trên màn hình hơi nhỏ", "Tôi muốn đọc một bài viết nhưng chữ khó nhìn. Có cách đổi cỡ chữ mà tôi chưa dùng.", "Tôi thử phần cài đặt và chọn cỡ chữ hợp với mình.", "Tôi nhờ người quen chỉ cách phóng chữ, rồi tự thử lại."],
    ["meet", "Một người bạn muốn đổi cách gặp", "Bạn tôi không tiện đến như trước. Hai người tìm cách vẫn giữ những cuộc chuyện trò.", "Tôi hỏi cách liên lạc nào thoải mái nhất với bạn.", "Tôi hẹn một cuộc gọi vào giờ bạn dễ sắp xếp."],
  ],
  75: [
    ["memory", "Bảy mươi lăm, một món đồ nhỏ", "Trong hộp kỷ niệm có món đồ không đắt nhưng theo tôi đã lâu. Tôi vẫn nhớ ngày nhận nó.", "Tôi ghi nguồn gốc món đồ để câu chuyện không mất theo thời gian.", "Tôi kể cho người thân thiết vì sao mình luôn giữ món ấy."],
    ["plan", "Cuộc hẹn để nghe nhau kể", "Tôi muốn có những cuộc gặp ít người, đủ yên để mọi người nghe nhau rõ hơn.", "Tôi chọn một buổi và một cách gặp thuận tiện cho mình.", "Tôi trao đổi với người thân thiết để cùng lên một cuộc hẹn vừa sức."],
  ],
  76: [
    ["nature", "Giọt nước ở đầu chiếc lá", "Sau cơn mưa, một giọt nước đọng trên lá gần cửa. Nó giữ cả vệt sáng rất nhỏ.", "Tôi ngắm và ghi lại khoảnh khắc trước khi giọt nước rơi.", "Tôi chia sẻ bức ảnh với người quen, cùng tìm những chi tiết nhỏ khác."],
    ["meal", "Mùi món ăn từ căn bếp", "Mùi một món quen khiến tôi nhớ buổi sum họp trước đây. Tôi muốn thưởng thức lại theo cách đơn giản.", "Tôi chọn phần ăn vừa ý, nhờ hỗ trợ phần chuẩn bị nếu cần.", "Tôi rủ người quen cùng ăn và kể về buổi sum họp mình nhớ."],
    ["create", "Thẻ đánh dấu sách có tên tôi", "Tôi thường dùng giấy rời để đánh dấu sách. Hôm nay tôi muốn làm một chiếc thẻ riêng.", "Tôi trang trí tấm bìa nhỏ và viết một câu mình thích.", "Tôi cùng người quen làm hai chiếc thẻ rồi tặng nhau."],
  ],
  77: [
    ["learn", "Một câu đố không cần trả lời vội", "Tôi gặp câu đố trong chương trình nghe. Đáp án chưa quan trọng bằng thử nghĩ theo cách khác.", "Tôi suy nghĩ từng gợi ý và tự chọn một đáp án.", "Tôi hỏi người quen cách họ giải, học thêm một lối suy luận."],
    ["share", "Kinh nghiệm giữ một cuộc hẹn", "Người trẻ hỏi tôi cách giữ liên lạc với bạn bè lâu năm. Tôi biết không phải mối quan hệ nào cũng dễ.", "Tôi giúp họ nghĩ một lời hỏi thăm cụ thể để bắt đầu.", "Tôi kể rằng những cuộc hẹn nhỏ, đều đặn đã hữu ích với mình."],
    ["home", "Góc ngồi có thêm một tấm ảnh", "Tôi muốn đổi vài chi tiết ở góc ngồi quen. Một tấm ảnh có thể làm không gian gần gũi hơn.", "Tôi chọn ảnh và sắp một khoảng nhỏ để nhìn thấy dễ dàng.", "Tôi nhờ người quen đặt ảnh ở chỗ phù hợp, cùng chọn góc đẹp."],
  ],
  78: [
    ["meet", "Bạn gửi giọng nói thay tin nhắn", "Một người bạn gửi đoạn ghi âm hỏi thăm. Nghe giọng họ mang cảm giác khác với đọc chữ.", "Tôi gửi lời đáp bằng giọng nói và kể một chuyện nhỏ hôm nay.", "Tôi hẹn lúc yên tĩnh để gọi và nghe bạn kể rõ hơn."],
    ["pace", "Một buổi sáng bớt nhiều việc", "Tôi muốn giữ buổi sáng thong thả hơn. Vài việc nhỏ hoàn toàn có thể để sang chiều.", "Tôi chọn việc cần nhất và chia phần còn lại cho lúc khác.", "Tôi dành thêm thời gian ngồi nghỉ, không xem chậm là bỏ phí."],
    ["memory", "Lần đầu tôi biết một người bạn", "Một lời hỏi thăm khiến tôi nhớ lần đầu quen bạn. Khi đó, cả hai không ngờ sẽ giữ liên lạc lâu như vậy.", "Tôi ghi lại hoàn cảnh gặp nhau và chi tiết mình còn nhớ.", "Tôi kể cho bạn nghe, hỏi họ nhớ lần đầu ấy thế nào."],
  ],
  79: [
    ["plan", "Chuẩn bị tuổi tám mươi bằng điều nhỏ", "Tôi nghĩ về năm tới và muốn giữ những điều làm ngày dễ chịu. Không cần một kế hoạch lớn.", "Tôi chọn một niềm vui nhỏ để có thể tiếp tục thường xuyên.", "Tôi trao đổi với người thân thiết về một cách gặp thuận tiện."],
    ["create", "Những câu chuyện thành một tập nhỏ", "Tôi có vài ghi chép rời về cuộc đời mình. Tôi muốn gom lại để dễ xem.", "Tôi chọn vài trang yêu thích và đặt tên cho tập chuyện.", "Tôi cùng người quen sắp trang, để mỗi câu chuyện có chỗ rõ ràng."],
    ["nature", "Một khoảng trời giữa hai mái nhà", "Khoảng trời nhìn từ nhà không rộng nhưng hôm nay rất trong. Tôi nhận ra mình vẫn có thể thấy nhiều thay đổi ở đó.", "Tôi ngắm và ghi lại màu trời trong một buổi bình yên.", "Tôi rủ người quen cùng nhìn, kể điều mình thích ở khoảng trời ấy."],
  ],
  80: [
    ["memory", "Tám mươi, tiếng cười trong album", "Sinh nhật tám mươi, tôi chọn xem vài tấm ảnh vui. Không phải tấm nào cũng rõ, nhưng câu chuyện thì vẫn còn.", "Tôi ghi chú một khoảnh khắc mình muốn giữ lại.", "Tôi cùng người thân thiết xem ảnh, nghe tiếng cười quay lại qua câu chuyện."],
    ["meet", "Một lời chúc đến từ xa", "Người bạn ở xa gửi lời chúc tuổi mới. Khoảng cách không ngăn một câu hỏi thăm đến nơi.", "Tôi đáp lại và hỏi một chuyện cụ thể về ngày của họ.", "Tôi hẹn một lúc thuận tiện để trò chuyện bằng giọng nói."],
  ],
  81: [
    ["home", "Những món quen trong tầm tay", "Tôi muốn chỗ ngồi dễ lấy sách, nước và các món thường dùng. Không cần thêm đồ, chỉ cần đổi chỗ.", "Tôi sắp vài món nhẹ theo cách thuận tiện nhất cho mình.", "Tôi nhờ người quen cùng bố trí và để chỗ đi lại thoáng hơn."],
    ["nature", "Một cành hoa đặt bên cửa", "Người quen mang đến một cành hoa. Màu hoa làm góc phòng khác hẳn ngày hôm qua.", "Tôi ngắm kỹ cánh hoa và ghi tên nếu biết.", "Tôi rủ người quen cùng nhìn, cảm ơn món quà nhỏ họ mang tới."],
    ["learn", "Chọn chương trình mình muốn nghe", "Tôi muốn nghe một chương trình mới mà không phải chờ người khác mở hộ mỗi lần.", "Tôi tập chọn một mục và lưu lại để dễ tìm.", "Tôi nhờ người quen chỉ thao tác đơn giản, rồi làm lại cùng họ."],
  ],
  82: [
    ["memory", "Chuyện một ngày bình thường đã xa", "Tôi nhớ một ngày chẳng có biến cố gì, chỉ có trời đẹp và lời chào dễ mến.", "Tôi ghi những chi tiết nhỏ khiến ngày ấy còn trong trí nhớ.", "Tôi kể cho người thân thiết, nhận ra chuyện bình thường cũng đáng nghe."],
    ["meal", "Bát món quen vừa đủ", "Tôi muốn một phần ăn vừa ý thay vì mâm thật nhiều món. Mùi vị quen làm tôi thấy dễ chịu.", "Tôi chọn món đơn giản, cùng người hỗ trợ chuẩn bị phần vừa đủ nếu cần.", "Tôi chia sẻ bữa ăn với người quen và hỏi món họ đang thích."],
    ["pace", "Cuộc chuyện trò có thể chia đôi", "Tôi thích nghe chuyện nhưng buổi nói chuyện hôm nay khá dài. Tôi muốn giữ sự vui vẻ mà không quá sức.", "Tôi đề nghị dừng một lát rồi tiếp tục phần còn lại.", "Tôi xin nghỉ và hẹn nghe câu chuyện tiếp vào hôm khác."],
  ],
  83: [
    ["create", "Một dòng chữ cho người nhận thiệp", "Tôi muốn gửi thiệp cho một người quen. Một dòng ngắn chân thành có lẽ đã đủ.", "Tôi tự chọn lời chúc và trang trí thiệp theo ý mình.", "Tôi nhờ người quen cùng làm, giữ lời nhắn đúng điều mình muốn nói."],
    ["meet", "Bạn có một ngày không vui", "Người bạn nói hôm nay không được như ý. Tôi muốn hỏi thăm mà không bắt họ phải tỏ ra vui.", "Tôi lắng nghe, để bạn kể điều họ muốn kể.", "Tôi hẹn lúc họ muốn trò chuyện tiếp, nhắc rằng tôi vẫn sẵn lòng nghe."],
    ["share", "Một tên gọi địa phương sắp quên", "Người quen hỏi tên gọi xưa của một vật dụng. Tôi nhớ cách nói ấy từ thời nhỏ.", "Tôi giúp họ ghi lại tên gọi và cách phát âm mình nhớ.", "Tôi kể hoàn cảnh từng dùng từ đó, nói rõ điều mình chưa chắc."],
  ],
  84: [
    ["home", "Đổi tấm ảnh trên bàn", "Tấm ảnh trên bàn đã ở đó nhiều năm. Tôi muốn thêm một khoảnh khắc gần đây bên cạnh.", "Tôi chọn ảnh mới, giữ ảnh cũ trong album thay vì bỏ đi.", "Tôi nhờ người quen cùng sắp hai tấm ảnh, nghe họ chọn khoảnh khắc nào."],
    ["learn", "Nghe lại đoạn kể chưa hiểu", "Một chương trình kể chuyện có đoạn tôi muốn nghe lại. Tôi không cần phải hiểu hết ngay lần đầu.", "Tôi thử quay lại đoạn ấy và nghe theo nhịp chậm hơn.", "Tôi nhờ người quen giúp tìm đúng đoạn rồi cùng trao đổi."],
    ["nature", "Vệt nắng trên chiếc khăn", "Vệt nắng làm màu chiếc khăn quen trông tươi hơn. Trong phòng cũng có những cảnh rất nhỏ để ngắm.", "Tôi nhìn sự đổi màu và ghi một câu về buổi sáng.", "Tôi chia sẻ khoảnh khắc với người quen khi họ ghé."],
  ],
  85: [
    ["memory", "Tám mươi lăm, điều vẫn nhớ rõ", "Có những chuyện rất xa nhưng tôi vẫn nhớ một mùi hương hoặc một câu nói.", "Tôi ghi lại một ký ức rõ nhất theo cách của mình.", "Tôi kể với người thân thiết, để ký ức có thêm người giữ cùng."],
    ["plan", "Một ngày sinh nhật vừa sức", "Tôi muốn sinh nhật đơn giản, có người hỏi thăm và có đủ giờ nghỉ. Đông người chưa chắc là điều tôi thích nhất.", "Tôi chọn một hoạt động nhỏ mình thật muốn làm.", "Tôi nói với người thân thiết cách gặp mà mình thấy thoải mái."],
  ],
  86: [
    ["meet", "Cuộc gọi chỉ để hỏi hôm nay thế nào", "Một người quen gọi mà không có việc cần nhờ. Họ chỉ muốn biết hôm nay tôi ra sao.", "Tôi kể một niềm vui nhỏ rồi hỏi lại ngày của họ.", "Tôi hẹn một giờ khác khi cả hai có thể trò chuyện thong thả."],
    ["create", "Chọn tên cho một tập kỷ niệm", "Tập chuyện đã được gom lại nhưng chưa có tên. Tôi muốn một cái tên giản dị, đúng cảm giác của mình.", "Tôi chọn tên từ một câu chuyện yêu thích trong tập.", "Tôi nghe gợi ý của người quen rồi cùng chọn tên phù hợp."],
    ["meal", "Mùi món ăn chờ một câu chuyện", "Một món ăn quen được mang đến. Tôi nhớ lần từng thưởng thức nó trong một dịp vui.", "Tôi chọn phần vừa đủ và thưởng thức chậm rãi.", "Tôi ăn cùng người quen, kể câu chuyện gắn với món ấy."],
  ],
  87: [
    ["home", "Chiếc ngăn nhỏ cho đồ yêu thích", "Tôi muốn cất những món mình thích ở cùng một chỗ, để dễ chọn khi muốn xem lại.", "Tôi sắp một ngăn nhỏ, giữ đồ cần thiết gọn trong tầm tay.", "Tôi nhờ người quen cùng phân loại theo ý mình, không vội bỏ đồ có kỷ niệm."],
    ["nature", "Âm thanh mưa trên mái", "Mưa rơi trên mái tạo một nhịp quen. Tôi nghe từ nơi khô ráo, không cần ra ngoài.", "Tôi ngồi nghe và ghi lại cảm giác về cơn mưa hôm nay.", "Tôi rủ người quen cùng nghe, kể về tiếng mưa nơi họ từng ở."],
    ["share", "Một câu chuyện cần giọng kể", "Người quen muốn ghi âm chuyện cũ thay vì chỉ viết. Tôi được chọn điều muốn kể và lúc muốn dừng.", "Tôi góp một đoạn ngắn, nghỉ giữa những phần nếu cần.", "Tôi kể những chi tiết mình nhớ, để bản ghi giữ được giọng kể riêng."],
  ],
  88: [
    ["learn", "Một câu thơ chưa hiểu hết", "Tôi nghe câu thơ quen nhưng có một hình ảnh muốn nghĩ thêm. Cách hiểu hôm nay có thể khác ngày trước.", "Tôi đọc lại chậm và chọn một ý nghĩa phù hợp với mình.", "Tôi hỏi người quen cách họ hiểu, thêm một góc nhìn vào câu thơ."],
    ["memory", "Người từng cho tôi một cơ hội", "Tôi nhớ một người đã tin mình khi mình còn thiếu tự tin. Một lời khi đó có ý nghĩa rất lâu.", "Tôi ghi câu chuyện và điều mình muốn cảm ơn.", "Tôi kể với người thân thiết về sức nặng của một lời động viên."],
    ["pace", "Buổi gặp yên hơn một chút", "Hôm nay tôi muốn buổi gặp ít tiếng ồn hơn. Nói ra điều cần sẽ giúp mọi người hiểu nhau.", "Tôi đề nghị giảm âm thanh và trò chuyện từng người.", "Tôi xin nghỉ một lát rồi gặp tiếp khi cảm thấy thoải mái."],
  ],
  89: [
    ["plan", "Điều muốn mang sang tuổi chín mươi", "Tôi nghĩ về năm tới bằng những mong muốn nhỏ: được nghe chuyện, được chọn điều thích và có người hiểu.", "Tôi chọn một điều có thể bắt đầu ngay trong tuần này.", "Tôi trao đổi với người thân thiết về cách giữ những niềm vui ấy."],
    ["meet", "Lời hỏi thăm viết bằng tay", "Tôi nhận một tờ giấy ghi lời hỏi thăm. Chữ có chỗ nguệch ngoạc nhưng đọc lên thấy rất gần.", "Tôi gửi lời đáp và nói điều mình thích trong lời nhắn.", "Tôi hẹn một lúc yên tĩnh để nghe người gửi kể thêm."],
    ["create", "Một trang album còn trống", "Album còn một trang chưa có ảnh. Tôi muốn giữ chỗ ấy cho một khoảnh khắc hiện tại.", "Tôi chọn hình của một ngày gần đây và thêm chú thích.", "Tôi cùng người quen tạo một tấm ảnh mới cho trang trống."],
  ],
  90: [
    ["memory", "Chín mươi, một câu chuyện tự chọn", "Người quen hỏi chuyện đời tôi. Tôi muốn kể một chuyện mình yêu thích, thay vì phải kể hết mọi thứ.", "Tôi ghi một câu chuyện và giữ đúng cách mình nhớ nó.", "Tôi kể với người thân thiết, cùng cười ở những chi tiết nhỏ."],
    ["nature", "Một buổi sáng nhìn trời đổi màu", "Trời ngoài cửa chuyển từ xám nhạt sang sáng. Tôi có thời gian ngắm sự thay đổi chậm ấy.", "Tôi ngắm và ghi một câu ngắn về màu trời hôm nay.", "Tôi rủ người quen cùng nhìn, chia sẻ một buổi sáng bình yên."],
  ],
  91: [
    ["home", "Chiếc khăn đặt ở chỗ quen", "Tôi muốn những món thường dùng có chỗ cố định. Việc tìm kiếm sẽ bớt làm gián đoạn ngày.", "Tôi chọn chỗ rõ ràng cho vài món nhẹ và giữ cách sắp ấy.", "Tôi nhờ người quen cùng ghi nhãn, để ai giúp cũng biết nơi đặt đồ."],
    ["meet", "Bạn kể về một buổi chiều mới", "Một người bạn kể chuyện họ vừa thấy. Tôi thích nghe cuộc sống hiện tại, không chỉ nhắc chuyện cũ.", "Tôi hỏi thêm một chi tiết, để bạn kể trọn điều họ muốn nói.", "Tôi hẹn nghe tiếp khi cả hai có thời gian và sức hơn."],
    ["learn", "Một cách nghe dễ hơn", "Tôi muốn nghe chương trình quen rõ hơn. Có vài thiết lập trên máy chưa được chọn phù hợp.", "Tôi thử điều chỉnh từng mục, dừng ở mức mình thấy dễ chịu.", "Tôi nhờ người quen hướng dẫn và ghi lại cách dùng đơn giản."],
  ],
  92: [
    ["meal", "Một bữa ăn đúng ý mình", "Người quen hỏi hôm nay tôi muốn ăn gì. Tôi thấy vui vì được chọn thay vì chỉ đoán theo thói quen.", "Tôi chọn món đơn giản và phần vừa với mong muốn của mình.", "Tôi hẹn ăn cùng người quen, để bữa ăn có thêm chuyện trò."],
    ["memory", "Một cái tên trở lại trong câu chuyện", "Khi nghe nhắc địa danh cũ, tôi nhớ tên một người từng gặp ở đó.", "Tôi ghi tên và điều còn nhớ, để riêng phần mình chưa chắc.", "Tôi kể với người thân thiết, cùng tìm thêm thông tin nếu có."],
    ["create", "Màu sắc cho một góc phòng", "Tôi muốn góc phòng có thêm màu mình thích. Một tấm giấy nhỏ cũng có thể đổi cảm giác.", "Tôi chọn màu và tạo một hình đơn giản theo ý mình.", "Tôi cùng người quen trang trí, nói rõ màu nào mình muốn giữ."],
  ],
  93: [
    ["nature", "Một chiếc lá vừa rơi", "Chiếc lá đáp xuống gần cửa rồi nằm im. Hình gân lá làm tôi muốn nhìn kỹ hơn.", "Tôi ngắm từ chỗ thuận tiện và ghi lại dáng chiếc lá.", "Tôi nhờ người quen chụp gần, cùng xem những đường gân nhỏ."],
    ["share", "Người quen xin một lời nhắn", "Một người muốn giữ lời nhắn của tôi trong cuốn sổ họ đang làm. Tôi không cần lời thật lớn lao.", "Tôi góp một câu ngắn về điều mình trân trọng.", "Tôi kể điều đã giúp mình vượt qua một thời khó khăn."],
    ["pace", "Khoảng yên giữa hai cuộc gặp", "Hôm nay có hai cuộc hỏi thăm gần nhau. Tôi muốn có một khoảng nghỉ ở giữa.", "Tôi đề nghị cách giờ để có thời gian thư giãn.", "Tôi giữ một cuộc gặp hôm nay, hẹn cuộc còn lại sang lúc khác."],
  ],
  94: [
    ["home", "Bức ảnh cần chú thích lớn hơn", "Chú thích dưới ảnh quá nhỏ để đọc thoải mái. Tôi muốn câu chuyện ấy dễ xem hơn.", "Tôi chọn vài chữ rõ và lớn cho tấm ảnh mình thích.", "Tôi nhờ người quen viết lại đúng lời mình muốn giữ."],
    ["meet", "Một người ghé chỉ để ngồi cùng", "Người quen ghé mà không chuẩn bị chuyện gì. Một khoảng yên có người bên cạnh cũng dễ chịu.", "Tôi hỏi họ muốn kể gì, rồi để cuộc trò chuyện diễn ra tự nhiên.", "Tôi hẹn lần sau khi cả hai có thể ngồi cùng lâu hơn."],
    ["memory", "Mùi hương làm nhớ một căn bếp", "Một mùi hương quen gợi lại căn bếp thời trước. Tôi nhớ ánh sáng ở đó hơn cách bày đồ.", "Tôi ghi điều mình nhớ về căn bếp và những người từng ở trong đó.", "Tôi kể với người thân thiết, để một góc đời cũ được nghe lại."],
  ],
  95: [
    ["plan", "Chín mươi lăm, vẫn có điều muốn chọn", "Tuổi chín mươi lăm, tôi muốn được chọn những niềm vui mỗi ngày theo khả năng của mình.", "Tôi chọn một điều nhỏ và nói rõ cách hỗ trợ nếu cần.", "Tôi trao đổi với người thân thiết để kế hoạch hợp với nhịp sống hiện tại."],
    ["create", "Một tấm thiệp cho chính hôm nay", "Tôi muốn giữ lại hôm nay bằng một tấm thiệp nhỏ. Không cần chờ dịp lớn mới ghi lời vui.", "Tôi chọn lời và màu cho tấm thiệp, làm phần mình thấy thuận tiện.", "Tôi cùng người quen làm thiệp, mỗi người thêm một câu về hôm nay."],
    ["learn", "Một chuyện mới trong chương trình nghe", "Chương trình kể về điều tôi chưa biết. Nghe chuyện mới khiến ngày có thêm một câu hỏi.", "Tôi nghe từng đoạn ngắn và ghi điều mình muốn tìm hiểu.", "Tôi hỏi người quen giải thích phần khó bằng ví dụ dễ hình dung."],
  ],
  96: [
    ["meal", "Món ăn có câu hỏi trước khi mang đến", "Người quen hỏi tôi thích món nào trước khi chuẩn bị. Tôi muốn nói rõ điều mình đang muốn thưởng thức.", "Tôi chọn một món đơn giản và phần ăn theo ý mình.", "Tôi mời người quen ăn cùng, để họ cũng được chọn món mình thích."],
    ["nature", "Bầu trời qua một khung ảnh", "Người quen gửi ảnh bầu trời nơi họ ở. Ở xa vẫn có thể cùng nhìn một buổi chiều.", "Tôi ngắm ảnh và ghi điều khác với bầu trời ngoài cửa mình.", "Tôi gửi lời đáp, cùng người ấy kể về thời tiết hôm nay."],
    ["meet", "Một câu chào không cần nói dài", "Một người gọi hỏi thăm nhưng tôi chỉ muốn trò chuyện ngắn hôm nay.", "Tôi nói một điều vui nhỏ và hỏi lại họ một câu.", "Tôi báo mình cần nghỉ, hẹn một lúc khác để nói chuyện dài hơn."],
  ],
  97: [
    ["memory", "Trang cuối trong một cuốn sổ cũ", "Cuốn sổ cũ gần hết trang. Tôi đọc lại một đoạn và nhận ra mình đã giữ được nhiều chuyện hơn tưởng.", "Tôi thêm một lời nhắn vào trang còn trống và cất sổ cẩn thận.", "Tôi chia sẻ đoạn yêu thích với người thân thiết."],
    ["home", "Một chỗ riêng cho lời nhắn", "Những lời nhắn viết tay được đặt rải rác. Tôi muốn có một chỗ để xem khi thích.", "Tôi chọn một tập nhỏ để giữ lời nhắn theo ngày.", "Tôi nhờ người quen giúp gom lại, giữ cả tên người gửi."],
    ["share", "Một người muốn nghe cách tôi gọi quê nhà", "Người quen hỏi tôi thường gọi quê bằng cái tên nào. Mỗi cách gọi mang một kỷ niệm.", "Tôi góp tên gọi ấy vào tập chuyện của họ.", "Tôi kể vì sao tên đó luôn làm mình thấy gần gũi."],
  ],
  98: [
    ["pace", "Một ngày nhẹ hơn theo ý tôi", "Hôm nay tôi muốn các hoạt động ngắn và có khoảng nghỉ. Nói rõ mong muốn giúp mọi người dễ hỗ trợ.", "Tôi chọn một việc nhẹ, giữ phần còn lại cho lúc khác.", "Tôi dành thêm thời gian nghỉ và nghe một đoạn mình thích."],
    ["meet", "Lời hỏi thăm đến đều đặn", "Một người quen vẫn giữ cuộc gọi ngắn mỗi tuần. Sự đều đặn làm tôi thấy được nhớ tới.", "Tôi đáp lời và hỏi một điều cụ thể về tuần của họ.", "Tôi hẹn giờ thuận tiện hơn, giữ cuộc gọi theo nhịp cả hai."],
    ["nature", "Ánh sáng trên cành cây quen", "Cành cây ngoài cửa có màu khác dưới ánh sáng hôm nay. Một cảnh cũ vẫn có điều mới.", "Tôi ngắm và ghi một câu về sắc lá mình thấy.", "Tôi chia sẻ cảnh ấy với người quen trong buổi hỏi thăm."],
  ],
  99: [
    ["plan", "Trước tuổi một trăm", "Tuổi một trăm còn một năm nữa. Tôi nghĩ đến những điều gần gũi hơn là một buổi mừng thật lớn.", "Tôi chọn một niềm vui muốn giữ trong năm tới.", "Tôi nói với người thân thiết điều mình mong ở một buổi gặp."],
    ["memory", "Một lời hứa nhỏ đã giữ được", "Tôi nhớ lời hứa từng giữ với một người. Nó không nổi tiếng, nhưng luôn có ý nghĩa với mình.", "Tôi ghi lại lời hứa và điều đã giúp mình làm được.", "Tôi kể câu chuyện với người thân thiết, giữ lời hứa trong ký ức chung."],
    ["create", "Chọn một bài để nghe ngày sinh nhật", "Tôi muốn chọn bài hát cho tuổi mới. Có nhiều giai điệu gắn với các chặng đời khác nhau.", "Tôi chọn một bài mình thích và ghi vì sao chọn nó.", "Tôi cùng người quen lập danh sách ngắn, nghe lại từng bài."],
  ],
  100: [
    ["memory", "Một trăm năm trong một câu chuyện", "Sinh nhật một trăm, tôi không cần kể hết cuộc đời. Tôi chỉ muốn giữ một chuyện làm mình thấy ấm lòng.", "Tôi ghi lại câu chuyện bằng cách thuận tiện với mình.", "Tôi kể với người thân thiết, để họ nghe một chặng đời bằng giọng của tôi."],
    ["meet", "Lời chúc từ nhiều nơi", "Những lời chúc đến từ nhiều nơi. Tôi muốn đáp lại từng người theo sức và thời gian của mình.", "Tôi chọn vài lời để đáp hôm nay, giữ phần còn lại cho sau.", "Tôi hẹn một cuộc hỏi thăm nhỏ, để ngày mừng có đủ khoảng nghỉ."],
  ],
  101: [
    ["nature", "Vệt nắng của tuổi một trăm lẻ một", "Một vệt nắng đi qua góc phòng quen. Tôi thấy vui vì vẫn có khoảnh khắc để quan sát hôm nay.", "Tôi ngắm và ghi lại một chi tiết khiến mình thích.", "Tôi chia sẻ với người quen, cùng giữ một buổi sáng trong câu chuyện."],
    ["meal", "Một món tôi tự chọn hôm nay", "Tôi được hỏi muốn thưởng thức món nào. Một lựa chọn nhỏ vẫn là điều đáng trân trọng.", "Tôi chọn món đơn giản phù hợp với điều mình muốn.", "Tôi chia sẻ bữa ăn với người quen, nghe họ nói về món đang thích."],
    ["memory", "Một dòng chữ được đọc lại", "Người quen đọc giúp tôi một đoạn ghi chép cũ. Tôi nhận ra câu mình từng viết vẫn làm mình xúc động.", "Tôi thêm một lời chú thích về cảm giác hiện tại.", "Tôi kể với người ấy vì sao dòng chữ có ý nghĩa."],
  ],
  102: [
    ["meet", "Một cuộc ghé thăm ngắn mà vui", "Người quen chỉ có thể ghé ít phút. Một cuộc gặp ngắn vẫn có thể đủ cho lời hỏi thăm.", "Tôi hỏi một chuyện mới và kể một điều nhỏ trong ngày.", "Tôi hẹn lần khác khi cả hai có thể thong thả hơn."],
    ["learn", "Câu chuyện mới qua giọng đọc quen", "Tôi nghe người quen đọc một đoạn chưa từng biết. Tôi muốn dừng ở chỗ mình tò mò để hỏi thêm.", "Tôi nghe chậm từng đoạn và chọn một câu hỏi nhỏ.", "Tôi nhờ họ giải thích rồi cùng nói về cách hiểu của mình."],
    ["home", "Một bức ảnh ở nơi dễ thấy", "Tôi muốn chuyển bức ảnh yêu thích đến chỗ dễ nhìn từ nơi mình thường nghỉ.", "Tôi chọn vị trí và sắp một khoảng nhỏ quanh ảnh theo khả năng.", "Tôi nhờ người quen đặt ảnh theo ý mình và kiểm tra góc nhìn."],
  ],
  103: [
    ["create", "Một lời nhắn cho người giữ cuốn sổ", "Tôi muốn thêm lời nhắn vào tập chuyện đã giữ nhiều năm. Chỉ vài chữ, nhưng là điều tôi tự chọn.", "Tôi viết hoặc đọc lời nhắn theo cách thuận tiện nhất.", "Tôi cùng người quen ghi lại, đọc lại để chắc đúng ý mình."],
    ["nature", "Nghe gió từ nơi yên tĩnh", "Từ chỗ nghỉ, tôi nghe gió qua tán cây. Không cần làm gì nhiều mới có thể tận hưởng một lúc bình yên.", "Tôi lắng nghe và ghi nhận âm thanh của buổi chiều.", "Tôi rủ người quen cùng nghe, để một khoảng yên có người chia sẻ."],
    ["memory", "Một người vẫn được nhớ bằng câu chào", "Tôi nhớ câu chào riêng của một người đã từng gần gũi. Có những giọng nói ở lại rất lâu.", "Tôi ghi lại câu chào và kỷ niệm gắn với nó.", "Tôi kể với người thân thiết, để người ấy được nhớ thêm một lần."],
  ],
  104: [
    ["plan", "Những điều tôi muốn nói rõ", "Tôi muốn người thân thiết hiểu điều làm mình thoải mái mỗi ngày. Những mong muốn nhỏ cũng đáng được nghe.", "Tôi chọn một điều và nói rõ cách mình muốn được hỗ trợ.", "Tôi cùng người thân thiết trao đổi, giữ những cuộc gặp theo nhịp phù hợp."],
    ["memory", "Đọc lại một chặng đời dài", "Tôi xem hoặc nghe lại tập kỷ niệm đã giữ. Có niềm vui, có điều tiếc, tất cả đều là những năm mình đã sống.", "Tôi chọn một đoạn để thêm suy nghĩ hôm nay.", "Tôi cùng người thân thiết nhắc lại một chuyện khiến cả hai ấm lòng."],
    ["meet", "Một lời cảm ơn trong ngày bình thường", "Một người quen giúp tôi việc nhỏ. Tôi muốn họ biết sự có mặt của họ có ý nghĩa.", "Tôi nói lời cảm ơn cụ thể và hỏi họ hôm nay thế nào.", "Tôi hẹn một lúc thích hợp để trò chuyện, giữ lời cảm ơn trong cuộc gặp ấy."],
  ],
};

export const finalLifeEvent = createLaterSpecialEvent(105);

export function createLaterLifeEvents(age) {
  if (age === 105) return [createLaterSpecialEvent(105)];
  return (stories[age] ?? []).map(([theme, title, text, firstResult, secondResult], index) => {
    const [code, first, second] = themes[theme];
    return {
      id: `later-life-${age}-${index + 1}`, everydayTheme: theme, title, text, ...art(code, title),
      choices: [first, second].map(([label, effects], choiceIndex) => ensureEventOpenMoji({
        label, title: choiceIndex === 0 ? "Một điều nhỏ cho hôm nay" : "Một khoảnh khắc cùng nhau",
        text: choiceIndex === 0 ? firstResult : secondResult,
        effects: { ...effects }, confirmText: "Tiếp tục hành trình!", ...art(code, title),
      })),
    };
  });
}
