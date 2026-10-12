// Giai đoạn 11–23 tuổi (không có 15, 16, 18, 22: năm có sự kiện đặc biệt).
// Quy tắc viết: docs/su-kien-doi-thuong/SO-TAY.md.
export const stage11To23 = [
  // ───────────── 11 tuổi ─────────────
  {
    id: 'ls11-nhom-ban', age: 11,
    title: 'Nhóm đông nhất lớp',
    text: 'Lên cấp hai, lớp tôi chia thành mấy nhóm. Nhóm đông nhất rủ tôi vào, với điều kiện thôi chơi với Minh, vì tụi nó nói Minh hay mách cô. Minh ngồi cạnh tôi từ đầu năm, chưa mách gì về tôi bao giờ. Mai tôi phải trả lời nhóm.',
    choices: [
      { label: 'Vào nhóm, tránh Minh', effects: { happiness: 2 }, flags: ['theo_nhom'],
        text: 'Ra chơi tôi đi cùng nhóm, có chỗ đứng ở căng tin. Một tuần sau, Minh xin cô đổi chỗ ngồi. Tới cuối năm, tôi vẫn không biết Minh có từng mách ai thật không.' },
      { label: 'Từ chối, vẫn ngồi với Minh', effects: { intelligence: 2, happiness: -1 }, flags: ['giu_ban_minh'],
        text: 'Nhóm không rủ tôi nữa. Ra chơi, tôi với Minh ngồi ở bậc cầu thang chia nhau gói bánh. Minh giảng cho tôi bài Toán. Điểm tôi lên, còn đám đông thì chẳng nhớ tên tôi.' },
    ],
  },
  {
    id: 'ls11-hoc-them', age: 11, needs: ['mother'],
    title: 'Lớp học thêm của cô',
    text: 'Cô dạy Toán mở lớp học thêm ở nhà, gần như cả lớp đều đi. Tuần trước, đề kiểm tra có hai câu giống hệt bài ở lớp học thêm. Mẹ nói nhà đang khó, nếu tôi tự học được thì thôi. Tối nay mẹ hỏi tôi có muốn đi không.',
    choices: [
      { label: 'Xin mẹ cho đi', effects: { intelligence: 3, happiness: -1 }, flags: ['di_hoc_them'],
        text: 'Mẹ cắt bớt tiền chợ để tôi đi học. Bài kiểm tra sau, tôi làm được hết. Có tối tôi về, thấy mẹ ăn cơm với nước mắm, nói là không đói.' },
      { label: 'Nói mình tự học được', effects: { intelligence: 1, happiness: -1 }, flags: ['tu_hoc'],
        text: 'Tôi tự làm sách bài tập tới khuya. Bài kiểm tra sau lại có câu giống bài học thêm, tôi bỏ trống. Lúc trả bài, cô nhìn tôi lâu hơn những đứa khác.' },
    ],
  },
  {
    id: 'ls11-tin-nhan-no', age: 11, needs: ['mother'],
    title: 'Tin nhắn trên máy mẹ',
    text: 'Mẹ để quên điện thoại ở nhà. Màn hình sáng lên một tin nhắn từ số lạ: “Tháng này chị trả trước năm triệu được không? Lãi vẫn tính tiếp.” Tôi không biết nhà mình đang nợ ai. Mẹ sắp đi làm về.',
    choices: [
      { label: 'Hỏi thẳng mẹ', effects: { intelligence: 1, happiness: -1 }, flags: ['biet_no_me'],
        text: 'Mẹ khựng lại, rồi nói nhà vay tiền sửa mái, sắp trả xong. Mẹ dặn đừng kể với ai. Từ hôm đó mẹ hay hỏi tôi có cần gì không, như sợ tôi thiếu thốn.' },
      { label: 'Giả như không thấy', effects: { happiness: -2 }, flags: ['giu_im_no'],
        text: 'Mẹ về, cầm điện thoại đọc rồi úp xuống bàn. Tối đó mẹ ngồi tính sổ tới khuya. Tôi nằm trong phòng, đếm lại số tiền trong heo đất.' },
    ],
  },
  {
    id: 'ls11-di-hoc-xa', age: 11, needs: ['father'],
    title: 'Ba cây số tới trường',
    text: 'Trường cấp hai cách nhà ba cây số. Ba muốn chở tôi đi học cho an toàn. Tụi bạn cùng xóm thì đạp xe đi chung, vừa đi vừa nói chuyện, về trễ một chút cũng được. Ba hỏi tôi muốn tự đạp xe hay để ba chở.',
    choices: [
      { label: 'Tự đạp xe với tụi bạn', effects: { happiness: 3 }, flags: ['tu_dap_xe'],
        text: 'Tuần đầu tôi ghé quán nước, về trễ. Ba đứng ở đầu đường chờ, không la. Từ đó tôi nhắn ba mỗi lần ghé đâu. Đi chung với tụi bạn, chuyện gì trong lớp tôi cũng biết.' },
      { label: 'Để ba chở', effects: { intelligence: 1, happiness: -1 }, flags: ['ba_cho_di_hoc'],
        text: 'Sáng nào ba cũng chở tôi tới trường rồi mới đi làm. Trên xe hai ba con ít nói, nhưng có hôm ba kể chuyện hồi ba đi học. Tụi bạn cùng xóm có những chuyện riêng tôi không biết.' },
    ],
  },

  // ───────────── 12 tuổi ─────────────
  {
    id: 'ls12-mun', age: 12, needs: ['mother'],
    title: 'Mặt nổi mụn',
    text: 'Mặt tôi nổi mụn nhiều, đi đâu cũng cúi mặt. Mẹ nói để tự hết. Đứa bạn bày tôi mua loại kem trên mạng, mặt nó láng hẳn sau một tuần. Lọ kem giá hai trăm nghìn, đúng bằng số tiền tôi để dành.',
    choices: [
      { label: 'Mua kem bôi thử', effects: { appearance: -2, health: -1 }, flags: ['kem_tron'],
        text: 'Hai tuần đầu mặt láng thật. Sang tuần thứ ba, da nổi mẩn đỏ rát. Mẹ dẫn tôi đi khám, bác sĩ hỏi tên lọ kem rồi lắc đầu. Tiền thuốc tốn gấp mấy lần lọ kem.' },
      { label: 'Nghe mẹ, chờ mụn tự hết', effects: { appearance: -1, happiness: -1, health: 1 },
        text: 'Tôi rửa mặt đều, không nặn. Mụn kéo dài gần hết năm học. Năm đó tôi né mọi tấm ảnh chụp chung của lớp.' },
      { label: 'Xin mẹ dẫn đi khám da', effects: { appearance: 2 },
        text: 'Mẹ dẫn tôi đi khám. Thuốc uống ba tháng, mụn bớt dần. Mẹ không than, nhưng tôi thấy mẹ ghi tiền thuốc vào cuốn sổ chi tiêu bằng mực đỏ.' },
    ],
  },
  {
    id: 'ls12-to-giay-duoi-chan', age: 12,
    title: 'Tờ giấy dưới chân',
    text: 'Giờ kiểm tra Văn, Thảo ngồi cạnh làm rơi một tờ giấy nhỏ ghi sẵn dàn ý. Tờ giấy trượt tới chân tôi. Cô đang đi xuống dãy bàn này. Cô từng nói, bắt được tài liệu ở chân ai thì người đó bị lập biên bản.',
    choices: [
      { label: 'Đá tờ giấy về phía Thảo', effects: { happiness: -1 }, flags: ['da_giay_thao'],
        text: 'Cô nhặt được tờ giấy dưới chân Thảo. Thảo bị lập biên bản, bài thi bị trừ nửa số điểm. Thảo không hỏi tôi câu nào. Tôi biết Thảo đã thấy chân tôi.' },
      { label: 'Nhặt lên giấu vào túi', effects: { happiness: -2 }, flags: ['giau_giay_thao'],
        text: 'Cô đi ngang, không thấy gì. Hết giờ, tôi trả Thảo tờ giấy. Thảo cảm ơn rối rít. Còn tôi cả buổi chiều nghĩ, nếu cô thấy thì tôi giải thích sao.' },
      { label: 'Ngồi yên, để cô thấy', effects: { intelligence: 1, happiness: -1 },
        text: 'Cô nhặt tờ giấy lên, nhìn tôi rồi nhìn Thảo. Thảo nhận là của mình. Cô không lập biên bản tôi. Thảo ít nói chuyện với tôi từ đó.' },
    ],
  },
  {
    id: 'ls12-vo-hay-tieng-anh', age: 12, needs: ['father', 'mother'],
    title: 'Võ hay tiếng Anh',
    text: 'Ba muốn tôi học võ cho khỏe, khỏi bị bắt nạt. Mẹ muốn tôi học tiếng Anh, sau này dễ kiếm việc. Tiền nhà chỉ đủ cho một lớp. Hai người cãi nhau mấy hôm rồi quyết định để tôi chọn.',
    choices: [
      { label: 'Học võ', effects: { health: 3, intelligence: -1 }, flags: ['hoc_vo'],
        text: 'Ba đích thân chở tôi đi học mỗi tối thứ ba. Mẹ không nói gì, nhưng vẫn mua cho tôi cuốn sách tiếng Anh cũ ở tiệm sách, để trên bàn học.' },
      { label: 'Học tiếng Anh', effects: { intelligence: 3, happiness: -1 }, flags: ['hoc_tieng_anh'],
        text: 'Mẹ mừng, khoe với hàng xóm. Ba nói “cũng được” rồi đi ra hiên. Cuối tuần, ba lôi tôi ra sân tập chống đẩy, nói tự tập cũng khỏe như ai.' },
    ],
  },
  {
    id: 'ls12-dieu-thuoc', age: 12,
    title: 'Điếu thuốc sau trường',
    text: 'Tuần trước tôi bị giật mũ bảo hiểm ở cổng trường. Hôm nay, đám anh lớp chín đứng hút thuốc sau trường, gọi tôi lại. Một anh chìa điếu thuốc, nói hút thử một hơi thì từ mai được đi chung nhóm, không ai dám đụng tới tôi nữa.',
    choices: [
      { label: 'Hút thử một hơi', effects: { health: -2, happiness: 1 }, flags: ['hut_thu'],
        text: 'Tôi ho sặc, tụi nó cười. Từ hôm đó tôi được đi chung, không ai giật đồ của tôi nữa. Tối về, mẹ ngửi thấy mùi khói trên áo, nhìn tôi rất lâu.' },
      { label: 'Từ chối, đi về', effects: { happiness: -2 }, flags: ['tu_choi_thuoc'],
        text: 'Tụi nó gọi với theo, chê tôi con nít. Mấy tuần sau, tôi lại bị giật đồ một lần nữa. Lần này tôi kể với ba, ba lên trường gặp thầy hiệu trưởng.' },
    ],
  },

  // ───────────── 13 tuổi ─────────────
  {
    id: 'ls13-ban-thu-vien', age: 13,
    title: 'Người ở thư viện',
    text: 'Tôi để ý một bạn lớp bên, giờ ra chơi hay ngồi đọc sách ở thư viện. Đứa bạn thân biết chuyện, nói sẽ đưa giúp lá thư nếu tôi viết. Nhưng nó cũng là đứa không giữ được chuyện gì quá hai ngày.',
    choices: [
      { label: 'Viết thư nhờ bạn đưa', effects: { happiness: 1 }, flags: ['thu_dau_tien'],
        text: 'Bạn ấy đọc thư, trả lời bằng một mẩu giấy: “Cảm ơn nha.” Hai hôm sau cả khối biết chuyện. Tôi bị trêu suốt học kỳ, còn mẩu giấy thì tôi vẫn giữ.' },
      { label: 'Tự ra thư viện bắt chuyện', effects: { happiness: 2, intelligence: 1 }, flags: ['ban_thu_vien'],
        text: 'Tôi hỏi mượn cuốn sách bạn ấy vừa đọc xong. Hai đứa nói được vài câu. Mấy tuần sau, chúng tôi thành bạn đổi sách cho nhau. Bạn ấy nghĩ gì, tôi không biết.' },
      { label: 'Giữ trong lòng', effects: { happiness: -1 },
        text: 'Tôi vẫn đi ngang thư viện mỗi giờ ra chơi. Hết năm, bạn ấy chuyển trường theo gia đình. Tôi không biết cả họ của bạn ấy.' },
    ],
  },
  {
    id: 'ls13-diem-tieng-anh', age: 13, needs: ['mother'],
    title: 'Điểm trên ứng dụng',
    text: 'Điểm giữa kỳ tiếng Anh của tôi thấp nhất lớp. Trường gửi điểm qua ứng dụng, mà mật khẩu do tôi giữ vì mẹ không rành điện thoại. Tối nay mẹ hỏi dạo này học hành ra sao.',
    choices: [
      { label: 'Mở điểm cho mẹ xem', effects: { intelligence: 2, happiness: -1 }, flags: ['khai_diem'],
        text: 'Mẹ nhìn con số khá lâu. Mẹ không la, chỉ hỏi tôi cần gì. Tuần sau, mẹ nhờ được chị con nhà hàng xóm kèm tiếng Anh cho tôi mỗi tối thứ năm.' },
      { label: 'Nói ổn, đổi chủ đề', effects: { happiness: -2 }, flags: ['giau_diem'],
        text: 'Mẹ tin. Cuối kỳ, cô chủ nhiệm gọi điện cho mẹ. Mẹ không giận chuyện điểm bằng chuyện tôi giấu. Mẹ đòi giữ mật khẩu từ hôm đó.' },
    ],
  },
  {
    id: 'ls13-ba-say', age: 13, needs: ['father', 'mother'],
    title: 'Ba say về',
    text: 'Ba đi đám cưới về, say, nói lớn tiếng với mẹ. Mẹ im lặng dọn dẹp. Ba gọi tôi ra rót nước, rồi bắt ngồi nghe ba giảng chuyện học hành. Đã mười một giờ đêm, sáng mai tôi thi Toán.',
    choices: [
      { label: 'Ngồi nghe tới khi ba ngủ', effects: { health: -2, intelligence: -1 }, flags: ['nghe_ba_say'],
        text: 'Ba nói tới một giờ sáng rồi ngủ gục trên ghế. Mẹ đắp chăn cho ba. Sáng ra tôi làm bài thi trong cơn buồn ngủ. Ba không nhớ gì về đêm qua.' },
      { label: 'Nói: “Ba say rồi, con đi ngủ”', effects: { happiness: -1 }, flags: ['cai_ba_say'],
        text: 'Ba đập tay xuống bàn. Mẹ kéo tôi vào phòng. Sáng hôm sau ba đi làm sớm, không nhìn tôi. Ba tuần sau ba mới nói chuyện bình thường lại với tôi.' },
      { label: 'Rót nước, lặng lẽ vào phòng', effects: { intelligence: 1 },
        text: 'Ba gọi theo hai tiếng, rồi thôi. Mẹ ngồi lại nghe ba nói. Tôi nằm trong phòng nghe giọng ba nhỏ dần, rồi im.' },
    ],
  },
  {
    id: 'ls13-quy-lop', age: 13, needs: ['father'],
    title: 'Tiền quỹ lớp',
    text: 'Tôi là thủ quỹ lớp, đang giữ hơn một triệu tiền quỹ. Tuần này tôi lỡ làm rơi vỡ màn hình điện thoại của ba, sửa hết năm trăm nghìn. Ba chưa phát hiện. Cuối tháng lớp mới cần tiền quỹ.',
    choices: [
      { label: 'Mượn tạm quỹ lớp sửa máy', effects: { happiness: -3 }, flags: ['muon_quy'],
        text: 'Máy sửa xong, ba không biết gì. Cuối tháng tôi mới trả được ba trăm. Lớp hỏi, tôi nói dối là chưa thu đủ. Cuối cùng tôi phải kể với mẹ, mẹ bù số còn lại.' },
      { label: 'Nói thật với ba', effects: { happiness: -1, intelligence: 1 }, flags: ['noi_that'],
        text: 'Ba la một trận. Ba bắt tôi chịu một nửa tiền sửa, trừ dần vào tiền tiêu vặt ba tháng. Ba vẫn dùng chiếc máy ấy thêm mấy năm.' },
      { label: 'Để yên, chờ ba phát hiện', effects: { happiness: -1 },
        text: 'Ba thấy màn hình vỡ, tưởng tự mình làm rơi. Ba dán một miếng băng keo trong lên, dùng tiếp. Mỗi lần ba nheo mắt đọc tin nhắn, tôi lại nhìn đi chỗ khác.' },
    ],
  },

  // ───────────── 14 tuổi ─────────────
  {
    id: 'ls14-nguyen-vong', age: 14,
    title: 'Nguyện vọng lớp mười',
    text: 'Sắp thi vào lớp mười. Trường gần nhà điểm chuẩn vừa sức. Trường ở trung tâm tốt hơn nhưng điểm chuẩn cao, nếu trượt phải học trường tư, học phí gấp mấy lần. Cô chủ nhiệm nói tôi có thể thử. Tuần này phải nộp nguyện vọng.',
    choices: [
      { label: 'Đăng ký trường trung tâm', effects: { intelligence: 3, health: -2 }, flags: ['truong_trung_tam'],
        text: 'Tôi ôn tới khuya suốt hai tháng, đậu sát nút. Từ đó mỗi ngày đi về mất gần một tiếng. Lớp mới toàn người lạ, đứa nào cũng giỏi.' },
      { label: 'Chọn trường gần nhà', effects: { happiness: 2, intelligence: 1 }, flags: ['truong_gan_nha'],
        text: 'Tôi đậu dễ dàng, mùa hè thong thả. Bạn cũ học chung lớp. Thỉnh thoảng nghe ai đó nhắc tới trường trung tâm, tôi tự hỏi nếu thử thì sao.' },
    ],
  },
  {
    id: 'ls14-nhom-chat', age: 14,
    title: 'Ảnh chụp màn hình',
    text: 'Một đứa trong lớp gửi tôi ảnh chụp nhóm chat riêng. Trong đó, đứa bạn thân của tôi chê tôi ki bo, nói chơi với tôi chỉ vì tiện đường về. Chủ nhật này hai đứa vẫn hẹn đi nhà sách như mọi tuần.',
    choices: [
      { label: 'Gửi ảnh, hỏi thẳng', effects: { happiness: -1, intelligence: 1 }, flags: ['hoi_thang_ban'],
        text: 'Nó im mấy tiếng, rồi xin lỗi, nói lúc đó đang bực chuyện khác. Chủ nhật hai đứa vẫn đi nhà sách. Nói chuyện vẫn được, chỉ là ít hơn trước.' },
      { label: 'Vẫn đi, không nhắc gì', effects: { happiness: -2 }, flags: ['nuot_gian'],
        text: 'Chủ nhật hai đứa đi nhà sách như cũ. Tôi trả tiền nước cho cả hai. Nó cảm ơn. Tôi không biết mình trả để làm gì.' },
      { label: 'Hủy hẹn, không giải thích', effects: { happiness: -1 }, flags: ['cat_ban'],
        text: 'Nó nhắn hỏi mấy lần, tôi không trả lời. Lên lớp mười, hai đứa học hai trường khác nhau. Lâu lâu tôi vẫn đi nhà sách một mình.' },
    ],
  },
  {
    id: 'ls14-com-toi', age: 14, needs: ['father', 'mother'],
    title: 'Bữa cơm hay buổi sinh nhật',
    text: 'Mẹ nhận thêm ca tối để có tiền, việc nấu cơm giao cho tôi. Tối nay cả lớp đi ăn sinh nhật một bạn ở quán. Ba đi làm về muộn, nếu tôi đi thì nhà không ai nấu cơm.',
    choices: [
      { label: 'Ở nhà nấu cơm', effects: { happiness: -2, health: 1 },
        text: 'Tôi nấu nồi canh chua, ngồi chờ ba. Ba về, ăn hai chén, khen ngon. Cả tối tôi xem ảnh buổi sinh nhật trên mạng, không thấy ai hỏi sao tôi vắng.' },
      { label: 'Đi sinh nhật, mua sẵn cơm cho ba', effects: { happiness: 2 },
        text: 'Tôi mua hộp cơm sườn để trên bàn, kèm tờ giấy nhắn. Tối về, hộp cơm đã hết. Ba đang rửa hộp, nói cơm ngoài mặn quá, mai con nấu nha.' },
    ],
  },
  {
    id: 'ls14-to-roi', age: 14,
    title: 'Quần áo ngắn cũn',
    text: 'Tôi cao vọt lên, quần áo năm ngoái ngắn cũn. Mẹ mua cho hai bộ ngoài chợ, rẻ, kiểu cũ. Đứa bạn rủ đi phát tờ rơi sáng thứ bảy và chủ nhật, mỗi buổi một trăm nghìn, để tự mua đồ mình thích. Sắp tới kỳ thi học kỳ.',
    choices: [
      { label: 'Đi phát tờ rơi', effects: { happiness: 2, intelligence: -1, health: -1 }, money: 400000, flags: ['lam_them_som'],
        text: 'Hai tuần đứng nắng ở ngã tư, tôi có bốn trăm nghìn. Tôi mua được cái áo mình thích. Điểm học kỳ tụt một chút. Mẹ thấy cái áo, hỏi tiền đâu ra.' },
      { label: 'Mặc đồ mẹ mua, lo học', effects: { intelligence: 2, appearance: -1 },
        text: 'Tôi mặc bộ đồ chợ đi học thêm. Có đứa hỏi đồ mua ở đâu, giọng không có ý tốt. Điểm thi học kỳ của tôi cao hơn năm trước.' },
    ],
  },

  // ───────────── 17 tuổi ─────────────
  {
    id: 'ls17-ba-va-nganh-hoc', age: 17, needs: ['father'],
    title: 'Tờ hướng dẫn trên bàn',
    text: 'Ba muốn tôi theo ngành ổn định, có biên chế, đỡ lo. Còn tôi muốn học thứ mình thích, dù ba gọi là “không ra tiền”. Hồ sơ còn mấy tháng mới nộp, nhưng tối nay ba ngồi chờ ở bàn, cầm tờ hướng dẫn tuyển sinh, muốn nghe tôi nói.',
    choices: [
      { label: 'Nói thẳng mình muốn gì', effects: { happiness: 1, intelligence: 1 }, flags: ['noi_nganh_voi_ba'],
        text: 'Ba nghe hết, không ngắt lời. Rồi ba hỏi ngành đó ra trường làm ở đâu, lương bao nhiêu. Tôi trả lời được một nửa. Ba gấp tờ giấy lại: “Tìm hiểu cho kỹ rồi nói ba nghe.”' },
      { label: 'Hứa sẽ suy nghĩ thêm', effects: { happiness: -1 }, flags: ['ne_ba'],
        text: 'Ba gật đầu, có vẻ hài lòng. Mấy tuần sau, ba gửi cho tôi đường dẫn mấy trường ba chọn. Tôi đọc, không trả lời. Ba cũng không hỏi lại.' },
    ],
  },
  {
    id: 'ls17-xem-phim', age: 17, needs: ['mother'],
    title: 'Lời rủ đi xem phim',
    text: 'Một bạn cùng lớp rủ tôi đi xem phim tối thứ bảy, chỉ hai đứa. Tuần sau thi thử. Mẹ đã nói rõ, chưa thi đại học thì chưa được yêu đương. Tôi rất muốn đi.',
    choices: [
      { label: 'Đi, nói dối là học nhóm', effects: { happiness: 3 }, flags: ['noi_doi_me_17'],
        text: 'Buổi tối rất vui. Hai đứa ăn kem ở cổng rạp tới chín giờ. Tuần sau, mẹ gặp mẹ của đứa trong nhóm học ở chợ. Tối đó mẹ chỉ hỏi tôi đúng một câu.' },
      { label: 'Đi, nói thật với mẹ', effects: { happiness: 1, intelligence: 1 }, flags: ['noi_that_me_17'],
        text: 'Mẹ im một lúc rồi cho đi, dặn chín giờ phải về. Tôi về lúc chín giờ kém năm. Mẹ ngồi chờ ở phòng khách, giả vờ xem tivi.' },
      { label: 'Hẹn sau kỳ thi', effects: { intelligence: 2, happiness: -1 },
        text: 'Bạn ấy nói “ừ”, giọng hơi hụt. Tôi thi thử được điểm cao. Thi xong, tôi rủ lại thì bạn ấy đã có hẹn với người khác.' },
    ],
  },
  {
    id: 'ls17-de-thi-thu', age: 17,
    title: 'Đề thi lọt ra ngoài',
    text: 'Một đứa trong lớp có đề thi thử sớm một ngày, mua từ anh khóa trên, rồi gửi vào nhóm chat của lớp. Điểm thi thử dùng để xét học sinh tiêu biểu, có học bổng nhỏ. Tệp đề đang nằm trong điện thoại tôi, chưa mở.',
    choices: [
      { label: 'Mở ra xem', effects: { intelligence: 1, happiness: -1 }, flags: ['xem_de_lo'],
        text: 'Đề y hệt. Tôi được chín điểm, vào danh sách học bổng. Lúc lên nhận giấy khen, tôi không dám nhìn xuống chỗ mấy đứa không vào nhóm chat.' },
      { label: 'Xóa tệp, không xem', effects: { intelligence: 2 }, flags: ['khong_xem_de'],
        text: 'Tôi làm bài bằng sức mình, được bảy điểm. Nửa lớp được chín, mười. Học bổng về tay mấy đứa đó. Cô nhìn bảng điểm, không nói gì.' },
      { label: 'Báo cho cô', effects: { happiness: -2 }, flags: ['bao_de_lo'],
        text: 'Trường hủy kết quả, cho thi lại bằng đề khác. Cả lớp biết ai báo. Mấy tháng cuối cấp, nhóm chat lớp vẫn chạy, nhưng tôi không còn ở trong đó.' },
    ],
  },
  {
    id: 'ls17-me-dau-bao-tu', age: 17, needs: ['mother'],
    title: 'Mẹ đau bụng',
    text: 'Mẹ đau bụng mấy tuần nay, chỉ mua thuốc ngoài tiệm. Mẹ nói đợi tôi thi xong rồi đi khám, giờ tiền phải dành đóng lớp luyện thi cho tôi. Tối qua tôi thấy mẹ ôm bụng ngồi trong bếp.',
    choices: [
      { label: 'Ép mẹ đi khám, bỏ lớp luyện thi', effects: { intelligence: -1, happiness: 1 }, flags: ['ep_me_kham'],
        text: 'Mẹ bị viêm loét dạ dày, bác sĩ nói để lâu sẽ nặng. Mẹ uống thuốc hai tháng thì đỡ. Tôi tự ôn ở nhà bằng đề trên mạng, có hôm học tới hai giờ sáng.' },
      { label: 'Nghe mẹ, chờ thi xong', effects: { intelligence: 2, happiness: -2 }, flags: ['de_me_cho'],
        text: 'Tôi học lớp luyện thi đều đặn. Thi xong, tôi chở mẹ đi khám. Bác sĩ hỏi sao để tới giờ mới đi. Mẹ nói tại bận, rồi nhìn sang tôi.' },
    ],
  },

  // ───────────── 19 tuổi ─────────────
  {
    id: 'ls19-cuoi-thang', age: 19,
    title: 'Mười ngày cuối tháng',
    text: 'Lần đầu tự lo chi tiêu, cuối tháng tôi còn ba trăm nghìn, phải sống thêm mười ngày. Bạn cùng phòng rủ góp tiền làm nồi lẩu mừng sinh nhật, mỗi người hai trăm. Gọi về xin thì mẹ sẽ gửi, nhưng tháng này mẹ đã kêu kẹt.',
    choices: [
      { label: 'Góp tiền, ăn mì cả tuần', effects: { happiness: 2, health: -2 },
        text: 'Bữa lẩu vui, cả phòng chụp ảnh tới khuya. Tuần sau tôi ăn mì gói, có hôm chỉ ăn một bữa. Người bạn có sinh nhật hôm đó trả tôi một gói mì khi biết chuyện.' },
      { label: 'Gọi về xin mẹ', effects: { happiness: 1 }, flags: ['xin_tien_me_19'],
        text: 'Mẹ gửi năm trăm, nói không sao. Tối đó tôi lướt thấy mẹ đăng bán cái nồi cơm điện cũ trên nhóm chợ của xóm.' },
      { label: 'Nói thật, xin không góp', effects: { happiness: -1, intelligence: 1 },
        text: 'Cả phòng nói không sao, cứ xuống ăn. Tôi xuống ngồi một lúc rồi viện cớ đi học bài. Từ đó tôi lập bảng chi tiêu, ghi từng đồng.' },
    ],
  },
  {
    id: 'ls19-lam-them-quan', age: 19, needs: ['student'],
    title: 'Ca tối ở quán cà phê',
    text: 'Quán cà phê gần trường tuyển phục vụ ca tối, mỗi tháng ba triệu. Ca làm trùng giờ tôi tự học, mà học kỳ này có hai môn khó, rớt là phải học lại. Quản lý muốn tôi trả lời trong hôm nay.',
    choices: [
      { label: 'Nhận việc', effects: { intelligence: -2, happiness: 1 }, money: 3000000, flags: ['lam_quan_19'],
        text: 'Tôi có tiền tự lo, không phải xin nhà nữa. Cuối kỳ rớt một môn, phải đăng ký học lại. Mẹ hỏi điểm, tôi nói vẫn ổn.' },
      { label: 'Từ chối, lo học', effects: { intelligence: 3, happiness: -1 },
        text: 'Tôi qua cả hai môn khó. Cuối tháng vẫn phải gọi về xin tiền, mỗi lần gọi lại nói một câu “con cảm ơn mẹ” cho dài cuộc điện thoại.' },
    ],
  },
  {
    id: 'ls19-tang-ca', age: 19, needs: ['notStudent'],
    title: 'Một tháng tăng ca',
    text: 'Tôi đi làm ở xưởng. Quản lý đề nghị tôi tăng ca đêm suốt tháng này, được thêm bốn triệu. Tuần trước, đứa bạn cùng tổ ngất ở chuyền vì làm liên tục nhiều tuần. Tôi đang định gửi tiền về sửa nhà cho ba mẹ.',
    choices: [
      { label: 'Nhận tăng ca', effects: { health: -3 }, money: 4000000, flags: ['tang_ca_19'],
        text: 'Cuối tháng tôi gửi được tiền về. Mẹ gọi điện, giọng mừng. Tôi ngủ gục trên xe buýt, lỡ trạm hai lần. Lưng đau tới mức phải đi xoa bóp.' },
      { label: 'Từ chối', effects: { health: 1, happiness: -1 },
        text: 'Quản lý ghi tên tôi vào danh sách “không hợp tác”. Tiền gửi về ít hơn dự tính. Mẹ nói không sao, mái nhà để năm sau sửa cũng được.' },
    ],
  },
  {
    id: 'ls19-ve-tet', age: 19, needs: ['mother'],
    title: 'Ở lại hay về Tết',
    text: 'Tết đầu tiên xa nhà. Vé xe về tăng gấp đôi. Chỗ tôi làm thêm trả lương gấp ba cho ai ở lại làm mấy ngày Tết. Tôi định ở lại làm, thì mẹ gọi hỏi chừng nào về, giọng rất vui.',
    choices: [
      { label: 'Về nhà ăn Tết', effects: { happiness: 3 },
        text: 'Xe chạy suốt đêm. Về tới, mẹ đã gói xong nồi bánh. Ba ngồi canh nồi bánh với tôi tới sáng, hỏi chuyện học, chuyện làm, chuyện ăn uống.' },
      { label: 'Ở lại làm', effects: { happiness: -2 }, money: 2000000, flags: ['tet_xa_nha'],
        text: 'Đêm giao thừa, tôi gọi video về. Cả nhà ngồi quanh mâm, chừa chỗ của tôi. Mẹ xoay màn hình cho tôi thấy nồi bánh. Ba nói: “Thôi, ở đó làm cho tốt.”' },
    ],
  },
  {
    id: 'ls19-ban-vay', age: 19,
    title: 'Hai triệu cho bạn mượn',
    text: 'Một người bạn mới quen hỏi vay tôi hai triệu, nói nhà có người ốm, cuối tháng trả. Hai triệu gần bằng số tiền tôi đang có. Bạn ấy đã hỏi thêm hai người khác, đều bị từ chối.',
    minMoney: 2000000,
    choices: [
      { label: 'Cho vay hết', effects: { happiness: 1 }, money: -2000000, flags: ['cho_vay_19'],
        text: 'Cuối tháng bạn ấy trả được một nửa, xin khất phần còn lại. Ba tháng sau mới trả đủ, kèm một túi trái cây ở quê lên. Từ đó bạn ấy có gì cũng kể với tôi.' },
      { label: 'Cho vay một nửa', effects: { intelligence: 1 }, money: -1000000, flags: ['cho_vay_19'],
        text: 'Bạn ấy cảm ơn, nói sẽ xoay phần còn lại. Cuối tháng trả đúng hẹn. Tôi không biết người nhà bạn ấy có khỏi bệnh không, cũng ngại hỏi.' },
      { label: 'Từ chối', effects: { happiness: -1 },
        text: 'Bạn ấy nói “không sao”, rồi ít nói chuyện với tôi hẳn. Mấy tháng sau tôi mới biết mẹ bạn ấy mổ ruột thừa, phải vay nóng.' },
    ],
  },

  // ───────────── 20 tuổi ─────────────
  {
    id: 'ls20-mat-khau', age: 20, needs: ['partner'],
    title: 'Mật khẩu điện thoại',
    text: '{tenBanDoi} hỏi mật khẩu điện thoại của tôi, nói yêu nhau thì có gì phải giấu. Trong máy có mấy tin nhắn tôi kể với bạn thân chuyện hai đứa cãi nhau tuần trước, có câu nói hơi quá về {tenBanDoi}.',
    choices: [
      { label: 'Đưa mật khẩu', effects: { happiness: -2 }, flags: ['dua_mat_khau'],
        text: '{tenBanDoi} đọc tới tin nhắn ấy, im lặng rất lâu. Hai đứa nói chuyện tới gần sáng. Không chia tay, nhưng mấy tháng sau đó, tôi nói gì cũng phải nghĩ trước.' },
      { label: 'Từ chối, giải thích vì sao', effects: { happiness: -1, intelligence: 1 }, flags: ['giu_rieng_tu'],
        text: 'Tôi nói ai cũng cần một chỗ riêng, kể cả khi yêu. {tenBanDoi} không vui nhưng không ép. Tối đó tôi đọc lại mấy tin nhắn ấy, rồi xóa đi.' },
    ],
  },
  {
    id: 'ls20-dam-cuoi-ban', age: 20, needs: ['single'],
    title: 'Chỗ ngồi được sắp sẵn',
    text: 'Đám cưới đứa bạn thân cấp ba, cả bàn đều đi có đôi. Một người bà con của cô dâu được xếp ngồi cạnh tôi, rõ là có người cố ý. Người đó bắt chuyện trước, khá dễ chịu. Tiệc sắp tàn.',
    choices: [
      { label: 'Xin số liên lạc', effects: { happiness: 2 }, flags: ['xin_so_dam_cuoi'],
        text: 'Hai đứa nhắn tin được vài tuần, đi cà phê một lần. Rồi thưa dần, không ai giận ai. Cô dâu hỏi chuyện, tôi chỉ cười.' },
      { label: 'Chào lịch sự rồi về', effects: { happiness: -1 },
        text: 'Tôi chào, cảm ơn vì buổi nói chuyện. Về tới nhà, cô dâu nhắn: “Bà con tao hỏi mày đó nha.” Tôi đọc, rồi để đó.' },
    ],
  },
  {
    id: 'ls20-dau-tu', age: 20, minMoney: 5000000,
    title: 'Nhóm đầu tư của bạn',
    text: 'Thằng bạn cấp ba khoe tuần trước kiếm được mười triệu nhờ một nhóm đầu tư trên mạng. Nó rủ tôi bỏ vào năm triệu, hứa một tháng sau gấp đôi. Năm triệu là tiền tôi dành dụm cả năm.',
    choices: [
      { label: 'Bỏ vào năm triệu', effects: { happiness: -3 }, money: -5000000, flags: ['mat_tien_dau_tu'],
        text: 'Tuần đầu, tài khoản báo lời. Tuần thứ ba, nhóm khóa bình luận, trang web không vào được. Thằng bạn mất gấp ba tôi. Hai đứa không nhắc lại chuyện này nữa.' },
      { label: 'Bỏ thử một triệu', effects: { happiness: -1, intelligence: 1 }, money: -1000000,
        text: 'Một triệu mất sau ba tuần. Tôi coi như học phí. Thằng bạn thì bỏ thêm để gỡ, tới lúc nhận ra thì đã vay mượn khắp nơi.' },
      { label: 'Không bỏ, khuyên bạn rút', effects: { intelligence: 2 }, flags: ['khuyen_ban_rut'],
        text: 'Nó nói tôi nhát, chặn tôi trên mạng. Hai tháng sau nó nhắn lại, hỏi mượn tiền trả nợ. Tôi cho mượn một ít, không hỏi ngày trả.' },
    ],
  },
  {
    id: 'ls20-huyet-ap-ba', age: 20, needs: ['father', 'mother'],
    title: 'Tay ba run',
    text: 'Về nhà dịp hè, tôi thấy ba leo thang thay bóng đèn mà tay run. Ba nói tại đói bụng. Tối đó mẹ kể ba bị huyết áp cao mấy tháng nay, không chịu uống thuốc đều, rồi dặn đừng nói là mẹ kể.',
    choices: [
      { label: 'Hỏi thẳng ba', effects: { happiness: -1 }, flags: ['hoi_ba_huyet_ap'],
        text: 'Ba gắt: “Ai nói với con?” rồi đi ra hiên. Mẹ nhìn tôi trách. Hôm sau, tôi thấy hộp thuốc huyết áp được dời ra để cạnh bình nước.' },
      { label: 'Mua máy đo huyết áp để sẵn', effects: { happiness: 1 }, flags: ['may_do_huyet_ap'],
        text: 'Tôi đặt máy đo trên bàn nước, không nói gì. Ba nhìn, không hỏi. Mấy hôm sau, mẹ nhắn: “Sáng nay ba tự đo, rồi ghi số vào cuốn lịch.”' },
      { label: 'Giả như không biết', effects: { happiness: -2 },
        text: 'Tôi về lại chỗ học, chỗ làm. Mỗi lần gọi về, tôi hỏi ba ăn uống ra sao. Ba nói khỏe. Mẹ ở bên cạnh không nói gì.' },
    ],
  },
  {
    id: 'ls20-hien-mau', age: 20,
    title: 'Nhóm máu O',
    text: 'Tôi sợ kim tiêm từ nhỏ. Hôm nay, người bạn cùng phòng nói mẹ của một bạn cùng lớp đang cần máu nhóm O để mổ gấp, bệnh viện thiếu máu. Tôi nhóm O. Bệnh viện cách đây nửa tiếng.',
    choices: [
      { label: 'Đi hiến máu ngay', effects: { health: -2, happiness: 3 }, flags: ['hien_mau'],
        text: 'Tôi nhắm mắt suốt lúc lấy máu, chân tay lạnh ngắt. Ca mổ thành công. Bạn cùng lớp không biết tôi là ai, cứ cảm ơn “mấy người hiến máu”. Tôi không nói.' },
      { label: 'Nhờ đăng tin tìm người khác', effects: { intelligence: 1, happiness: -1 },
        text: 'Tôi chia sẻ tin lên mạng, nhắn hỏi khắp nơi. Ba tiếng sau có người hiến. Tối đó tôi nằm nghĩ mãi, nếu không ai đến thì sao.' },
    ],
  },

  // ───────────── 21 tuổi ─────────────
  {
    id: 'ls21-thuc-tap', age: 21, needs: ['student'],
    title: 'Ở lại tới mười giờ',
    text: 'Tôi thực tập ở một công ty. Trưởng nhóm nhờ tôi ở lại làm tới mười giờ mỗi tối, không có lương, nói sẽ viết nhận xét tốt và có thể giữ tôi lại làm chính thức. Tuần sau tôi có hai bài thi ở trường.',
    choices: [
      { label: 'Ở lại làm', effects: { intelligence: 1, health: -2 }, flags: ['o_lai_thuc_tap'],
        text: 'Trưởng nhóm khen trước cả phòng. Bài thi ở trường tôi làm qua loa, điểm vừa đủ. Hết đợt, công ty chưa tuyển ai, chỉ hẹn “có vị trí sẽ gọi”.' },
      { label: 'Làm đúng giờ, nói rõ lý do', effects: { intelligence: 2 },
        text: 'Trưởng nhóm gật đầu, không vui lắm. Nhận xét cuối đợt chỉ có hai dòng. Hai bài thi tôi được điểm cao nhất lớp.' },
    ],
  },
  {
    id: 'ls21-to-truong', age: 21, needs: ['notStudent'],
    title: 'Chức tổ trưởng',
    text: 'Ông chủ đề nghị tôi làm tổ trưởng, lương thêm hai triệu. Tổ trưởng phải chấm công và báo tên người đi trễ. Đứa đi trễ nhiều nhất là bạn thân cùng quê với tôi, sáng nào cũng phải đưa con đi gửi.',
    choices: [
      { label: 'Nhận, chấm công đúng', effects: { intelligence: 1, happiness: -2 }, flags: ['to_truong_dung'],
        text: 'Tháng đầu, tên bạn tôi nằm đầu danh sách trễ. Bạn ấy bị trừ lương, không trách tôi, nhưng thôi ngồi ăn trưa cùng. Tôi được ông chủ tin.' },
      { label: 'Nhận, nhắm mắt cho bạn', effects: { happiness: 1 }, flags: ['to_truong_che'],
        text: 'Tôi ghi bạn ấy đúng giờ. Ba tháng sau, có người khác mách ông chủ. Tôi bị cắt phụ cấp, còn bạn ấy chuyển sang làm chỗ khác, gần nhà gửi trẻ hơn.' },
      { label: 'Từ chối chức', effects: { happiness: 1 },
        text: 'Ông chủ giao chức cho người khác. Bạn tôi vẫn bị ghi tên đi trễ. Tôi chỉ đi phụ bạn đón con được mấy buổi.' },
    ],
  },
  {
    id: 'ls21-dam-tang-bac', age: 21, needs: ['father'],
    title: 'Đám tang bác',
    text: 'Ba gọi điện, nói bác ruột của tôi vừa mất, cả họ về quê lo đám tang ba ngày. Tuần đó tôi có hạn chót quan trọng, bỏ lỡ là ảnh hưởng tới cả năm. Ba nói tùy tôi, giọng mệt.',
    choices: [
      { label: 'Về quê với ba', effects: { happiness: 1, intelligence: -1 }, flags: ['ve_dam_tang_bac'],
        text: 'Tôi đứng cạnh ba suốt ba ngày. Ba ít khóc, chỉ đứng hút thuốc ở góc sân. Đêm cuối ba kể chuyện hồi nhỏ hai anh em đi chăn bò. Hạn chót của tôi phải xin lùi, bị trừ điểm.' },
      { label: 'Gửi tiền phúng điếu, ở lại', effects: { intelligence: 1, happiness: -2 },
        text: 'Ba nói “ừ, lo việc của con đi”. Tôi xong việc đúng hạn. Tuần sau gọi về, ba kể lại đám tang, kể rất kỹ, như để tôi thấy mình đã ở đó.' },
    ],
  },
  {
    id: 'ls21-he-nay', age: 21,
    title: 'Hai lời mời mùa hè',
    text: 'Hè này có hai lời mời. Câu lạc bộ thiện nguyện rủ tôi lên vùng cao dạy chữ ba tuần, không lương. Chú họ rủ làm phụ bếp ở nhà hàng, mỗi tháng tám triệu. Mẹ nói nhà đang cần tiền, nhưng để tôi tự quyết.',
    choices: [
      { label: 'Lên vùng cao', effects: { happiness: 3, health: -1 }, flags: ['len_vung_cao'],
        text: 'Ba tuần ngủ trong lớp học vách gỗ. Có đứa nhỏ đi bộ hai tiếng tới lớp, chân không dép. Ngày về, tụi nhỏ đứng ở đầu dốc vẫy tới khi xe khuất.' },
      { label: 'Làm phụ bếp', effects: { health: -1, intelligence: 1 }, money: 8000000, flags: ['lam_bep_he'],
        text: 'Tôi rửa chén, sơ chế tới nửa đêm. Cuối hè gửi mẹ một nửa số tiền. Mẹ dùng đóng tiền điện nước nửa năm. Tôi học được cách nấu ba món mẹ thích.' },
    ],
  },

  // ───────────── 23 tuổi ─────────────
  {
    id: 'ls23-luong-dau', age: 23, needs: ['employed', 'mother'],
    title: 'Tháng lương đầu',
    text: 'Tôi nhận tháng lương đầu tiên. Trừ tiền nhà, tiền ăn, còn lại chừng năm triệu. Mẹ gọi điện, nói không cần gửi về, lo cho mình trước. Nhưng tôi biết mái bếp nhà đang dột, mẹ hứng nước bằng thau.',
    choices: [
      { label: 'Gửi về hết năm triệu', effects: { happiness: 2 }, flags: ['gui_luong_dau'],
        text: 'Mẹ nhắn lại một tin rất dài, toàn lời dặn ăn uống. Tháng đó tôi ăn cơm bụi, mua đôi giày bị hỏng đế phải để tháng sau. Tết về, mái bếp đã lợp mới.' },
      { label: 'Gửi một nửa, giữ một nửa', effects: { happiness: 1, intelligence: 1 },
        text: 'Mẹ cảm ơn, nói đủ sửa một góc mái. Tôi mua đôi giày đi làm, để dành phần còn lại. Mái bếp sửa nửa năm mới xong.' },
      { label: 'Giữ lại, hẹn tháng sau', effects: { happiness: -1 },
        text: 'Tôi mua laptop trả góp để làm việc. Tháng sau, tháng sau nữa, lương vừa đủ trả góp. Mẹ vẫn hứng nước bằng thau mỗi lần mưa.' },
    ],
  },
  {
    id: 'ls23-chua-co-viec', age: 23, needs: ['notEmployed'],
    title: 'Tiệm vật liệu của cậu',
    text: 'Ra trường đã nửa năm, tôi vẫn chưa xin được việc. Mẹ gọi hỏi, giọng dè dặt. Cậu tôi mở tiệm vật liệu xây dựng, cần người trông, lương tám triệu, nhưng là việc chẳng liên quan gì tới những gì tôi đã học.',
    choices: [
      { label: 'Nhận việc ở tiệm cậu', effects: { happiness: -1, health: 1 }, flags: ['lam_tiem_cau'],
        text: 'Sáng nào tôi cũng khiêng xi măng, ghi sổ bán hàng. Có tiền, mẹ yên tâm. Tối về, tôi mở tin tuyển dụng đúng ngành ra đọc, rồi tắt.' },
      { label: 'Từ chối, tiếp tục nộp hồ sơ', effects: { intelligence: 1, happiness: -2 }, flags: ['cho_viec_dung_nganh'],
        text: 'Tôi nộp thêm mười bốn hồ sơ, được gọi hai chỗ. Tiền tiết kiệm cạn dần. Cậu nói với mẹ: “Thanh niên giờ kén quá.” Mẹ không cãi.' },
    ],
  },
  {
    id: 'ls23-thang-ba-dam-cuoi', age: 23, minMoney: 1500000,
    title: 'Ba tấm thiệp trong một tháng',
    text: 'Tháng này tôi nhận ba tấm thiệp cưới. Tấm thứ ba của một đứa bạn cấp ba đã nhiều năm không liên lạc, gửi qua tin nhắn kèm số tài khoản. Tiền mừng mỗi đám ít nhất năm trăm nghìn, mà tiền tháng này đã sắp cạn.',
    choices: [
      { label: 'Đi đủ cả ba đám', effects: { happiness: 1 }, money: -1500000,
        text: 'Ở đám thứ ba, cô dâu chú rể nhìn tôi một giây mới nhớ tên. Bàn tôi ngồi toàn người lạ. Nửa tháng sau đó tôi ăn cơm nhà nấu, không đi đâu.' },
      { label: 'Đi hai đám, gửi lời chúc đám thứ ba', effects: { intelligence: 1 }, money: -1000000,
        text: 'Tôi nhắn lời chúc, không chuyển tiền. Đứa bạn trả lời bằng một biểu tượng cảm ơn. Một năm sau, tôi thấy nó đã xóa kết bạn với mình.' },
      { label: 'Chỉ đi đám thân nhất', effects: { happiness: -1 }, money: -500000,
        text: 'Đám thân nhất, tôi ở lại phụ dọn tới khuya. Hai đám kia tôi nhắn lời chúc. Có người trả lời, có người không.' },
    ],
  },
  {
    id: 'ls23-hoi-cuoi', age: 23, needs: ['single'],
    title: 'Câu hỏi đầu năm',
    text: 'Tết về, các cô dì thay nhau hỏi bao giờ lấy chồng lấy vợ, kể đứa này đứa kia đã có con. Mẹ không hỏi, nhưng ngồi ngay đó, chờ nghe tôi trả lời. Đây là năm thứ hai tôi nghe câu hỏi này.',
    choices: [
      { label: 'Cười, nói đang lo sự nghiệp', effects: { happiness: -1 },
        text: 'Cô út nói sự nghiệp gì thì cũng phải có gia đình. Tôi cười tiếp. Tối đó mẹ ngồi gọt trái cây, nói khẽ: “Mẹ không giục đâu, nhưng mẹ cũng muốn biết.”' },
      { label: 'Nói thẳng: chưa muốn', effects: { happiness: 1 }, flags: ['noi_chua_muon_cuoi'],
        text: 'Cả bàn im một lúc. Mẹ đứng dậy đi lấy thêm nước. Năm sau, các cô hỏi ít hơn. Mẹ thì thỉnh thoảng gửi tôi bài báo về những người kết hôn muộn mà vẫn hạnh phúc.' },
    ],
  },
  {
    id: 'ls23-tuong-lai', age: 23, needs: ['partner'],
    title: 'Hai năm nữa',
    text: '{tenBanDoi} hỏi tôi hai năm nữa mình ở đâu, làm gì, có còn đi cùng nhau không. Tôi đang có cơ hội đi làm ở thành phố khác, chưa kể với ai. Câu hỏi đến đúng lúc tôi chưa biết trả lời thế nào.',
    choices: [
      { label: 'Kể chuyện công việc mới', effects: { happiness: -1, intelligence: 1 }, flags: ['ke_viec_moi'],
        text: '{tenBanDoi} im lặng, rồi nói cần thời gian nghĩ. Hai đứa bàn cả tuần, chưa ra được câu trả lời. Ít nhất từ hôm đó, không ai phải đoán ý người kia.' },
      { label: 'Nói: “Vẫn ở cạnh nhau”', effects: { happiness: 2 }, flags: ['giu_kin_viec_moi'],
        text: '{tenBanDoi} cười, ôm tôi. Tôi từ chối lời mời làm việc ở thành phố kia mà không kể với ai. Có những tối tôi mở thư mời ấy ra đọc lại.' },
    ],
  },

  {
    id: 'ls23-lung-dau', age: 23,
    title: 'Cái lưng hai mươi ba tuổi',
    text: 'Tôi ngồi trước máy tính mười tiếng mỗi ngày, tối về lại nằm xem điện thoại. Dạo này lưng đau, ngủ dậy vẫn mệt. Phòng tập gần nhà đang giảm giá gói một năm, phải dậy sớm hơn một tiếng. Đứa bạn rủ đăng ký chung.',
    choices: [
      { label: 'Đăng ký tập với bạn', effects: { health: 3, happiness: -1 }, flags: ['tap_the_duc_23'],
        text: 'Hai tuần đầu tôi đi đều, rồi bạn bỏ, tôi đi một mình. Tháng thứ ba thì lưng hết đau. Có sáng đứng trước cửa phòng tập lúc trời còn tối, tôi tự hỏi mình đang làm gì ở đây.' },
      { label: 'Tự đi bộ buổi tối', effects: { health: 2 },
        text: 'Tôi đi bộ quanh khu nhà mỗi tối nửa tiếng. Có hôm mưa thì bỏ. Lưng đỡ dần. Bạn tôi khoe ảnh phòng tập, tôi khoe ảnh con mèo hoang hay ngồi ở góc đường.' },
      { label: 'Để sau, đang bận', effects: { health: -2, happiness: 1 },
        text: 'Tôi mua miếng dán giảm đau, dán mỗi khi lưng nhức. Công việc vẫn chạy đều. Cuối năm khám sức khỏe ở công ty, bác sĩ ghi vào hồ sơ: cột sống bắt đầu có vấn đề.' },
    ],
  },

  // ───────────── Chuỗi ─────────────
  {
    id: 'ls-ba-trao-nhan', ages: [11, 13], requiresAny: ['than_ba', 'bi_mat_voi_ba', 'ba_lan', 'nghe_chuyen_ba'],
    title: 'Chiếc nhẫn trong hộp thiếc',
    text: 'Bà yếu đi nhiều, nằm nhiều hơn ngồi. Hôm nay bà gọi tôi vào, mở cái hộp thiếc dưới gối, lấy ra chiếc nhẫn bạc đã mòn. Bà nói để dành cho tôi, dặn đừng cho ai biết, kẻo các cô chú lại bàn tán.',
    choices: [
      { label: 'Nhận, giữ kín', effects: { happiness: 2 }, flags: ['ba_yeu', 'giu_nhan_ba'],
        text: 'Tôi giấu chiếc nhẫn trong hộp bút. Đêm nào tôi cũng mở ra nhìn. Bà hỏi “cất kỹ chưa”, tôi gật. Đó là chuyện riêng cuối cùng giữa hai bà cháu.' },
      { label: 'Nhận, rồi kể với ba mẹ', effects: { happiness: 1, intelligence: 1 }, flags: ['ba_yeu', 'nhan_ba_cong_khai'],
        text: 'Ba mẹ nói bà cho thì cứ giữ. Chuyện tới tai cô út, cô hơi buồn vì nghĩ bà thương cháu hơn con. Bà nghe được, ngồi im cả buổi chiều.' },
      { label: 'Bảo bà cứ giữ lấy', effects: { happiness: -1 }, flags: ['ba_yeu', 'ba_giu_nhan'],
        text: 'Bà cất chiếc nhẫn vào hộp, không nói gì thêm. Mấy tháng sau, chiếc nhẫn được đeo vào tay bà lúc khâm liệm. Cô út nói bà dặn vậy.' },
    ],
  },
  {
    id: 'ls-ba-mat', ages: [12, 14], requires: ['ba_yeu'],
    title: 'Đêm canh bên bà',
    text: 'Bà mất vào một sáng mưa. Nhà đông người, ai cũng bận. Đêm thứ hai, chỉ còn tôi với một chú họ ngồi canh bên quan tài. Chú hỏi tôi có muốn lên giường nằm một lát không, chú canh thay.',
    choices: [
      { label: 'Ở lại canh tới sáng', effects: { health: -1, happiness: 1 }, flags: ['canh_ba'],
        text: 'Tôi ngồi cạnh bà tới khi gà gáy. Chú họ kể chuyện bà hồi trẻ gánh hàng ra chợ, đi bộ mười cây số. Tôi chưa từng nghe những chuyện ấy.' },
      { label: 'Đi nằm một lát', effects: { health: 1, happiness: -2 }, flags: ['ngu_dem_canh'],
        text: 'Tôi nằm, định chợp mắt một chút, rồi ngủ quên tới sáng. Chú vẫn ngồi đó. Sáng ra tôi đứng cạnh quan tài rất lâu, không biết nói gì với bà.' },
    ],
  },
  {
    id: 'ls-tu-so-cu', ages: [12, 14], requires: ['giay_so_tu'],
    title: 'Số điện thoại cũ',
    text: 'Dọn sách cũ, tôi tìm thấy tờ giấy Tú ghi số điện thoại, vẫn kẹp trong cuốn Toán lớp bốn. Mấy năm rồi tôi chưa gọi lần nào. Số này có thể đã đổi. Tôi bấm được nửa dãy số thì dừng tay.',
    choices: [
      { label: 'Bấm nốt, gọi', effects: { happiness: 3 }, flags: ['tu_noi_lai'],
        text: 'Mẹ Tú nghe máy, nhận ra tôi ngay, đưa máy cho Tú. Hai đứa ngượng ngùng hỏi chuyện học. Tú nói vẫn còn giữ cái mô hình máy bay lắp dở.' },
      { label: 'Kẹp tờ giấy lại', effects: { happiness: -1 }, flags: ['tu_de_sau'],
        text: 'Tôi kẹp tờ giấy vào cuốn sổ mới, tự nhủ để khi khác. Cuốn sổ đi theo tôi qua mấy lần chuyển nhà, tờ giấy vẫn nằm trong đó.' },
    ],
  },
  {
    id: 'ls-vang-gia', ages: [12, 14], requires: ['nuoi_cho_vang'],
    title: 'Con Vàng già',
    text: 'Con Vàng đã già, chân sau yếu, nằm cả ngày ở góc hiên. Bác sĩ thú y nói có thể chữa, tốn vài triệu, nhưng chỉ kéo dài được ít lâu. Ba mẹ nói Vàng là chó của tôi, để tôi quyết.',
    choices: [
      { label: 'Xin ba mẹ cho chữa', effects: { happiness: 1 }, flags: ['chua_vang'],
        text: 'Vàng sống thêm mấy tháng, có hôm lết được ra tới cổng đón tôi đi học về. Tôi biết nhà đã bớt nhiều thứ cho mấy tháng ấy. Mẹ không nhắc lần nào.' },
      { label: 'Để Vàng ở nhà, tự chăm', effects: { happiness: -1 }, flags: ['cham_vang'],
        text: 'Tôi lót ổ cho Vàng, tối nào cũng ngồi cạnh. Một sáng, Vàng không dậy nữa. Ba đào hố dưới gốc cây sau nhà. Tôi tự tay lấp đất.' },
    ],
  },
  {
    id: 'ls-bien-khong-boi', ages: [12, 14], requires: ['khong_biet_boi'],
    title: 'Cái phao ngoài xa',
    text: 'Lớp đi dã ngoại biển. Cả nhóm rủ nhau bơi ra cái phao cách bờ chừng năm chục mét. Chỉ mình tôi không biết bơi, mà chưa ai biết chuyện đó. Tụi nó đã xuống nước, đứng vẫy tôi.',
    choices: [
      { label: 'Nói thật mình không biết bơi', effects: { happiness: -1, health: 1 }, flags: ['nhan_khong_biet_boi'],
        text: 'Tụi nó trêu một lúc. Rồi Khoa ở lại chỗ nước cạn, chỉ tôi cách nằm ngửa cho nổi. Tới chiều tôi nổi được mười giây. Khoa vỗ tay như tôi vừa bơi ra tới phao.' },
      { label: 'Nói đau bụng, ngồi trên bờ', effects: { happiness: -2 }, flags: ['gia_dau_bung'],
        text: 'Tôi ngồi trông đồ cho cả nhóm. Tụi nó leo lên phao chụp ảnh, ảnh nào cũng thiếu tôi. Về nhà mẹ hỏi biển vui không. Tôi nói vui.' },
    ],
  },
  {
    id: 'ls-bien-cuu-ban', ages: [12, 14], requires: ['biet_boi'],
    title: 'Người chới với ngoài phao',
    text: 'Đang bơi gần phao, tôi thấy Khoa, đứa cùng lớp, chới với ở chỗ sâu. Bờ còn xa, người lớn chưa ai để ý. Ba từng dặn: người đang đuối nước sẽ bám chặt, kéo cả mình xuống. Tôi phải làm gì đó ngay.',
    choices: [
      { label: 'Bơi ra kéo Khoa', effects: { health: -3, happiness: 3 }, flags: ['cuu_khoa'],
        text: 'Khoa ghì chặt cổ tôi, hai đứa cùng chìm một nhịp. Tôi đạp nước, đẩy được Khoa tới phao. Người lớn bơi ra kịp. Tối đó ba ôm tôi, tay ba run.' },
      { label: 'La lớn, đẩy phao về phía Khoa', effects: { intelligence: 2, happiness: 1 }, flags: ['goi_nguoi_lon'],
        text: 'Tôi hét hết sức, đẩy cái phao xốp về phía Khoa. Khoa bám được, người lớn bơi ra kéo vào. Khoa uống nhiều nước nhưng không sao. Ba khen tôi bình tĩnh.' },
    ],
  },
  {
    id: 'ls-vo-chu-ky', ages: [12, 14], requires: ['gia_chu_ky'], needs: ['father', 'mother'],
    title: 'Cuốn vở dưới gầm giường',
    text: 'Mẹ dọn gầm giường, tìm thấy cuốn vở chính tả lớp hai của tôi. Chữ ký phụ huynh trong đó nghiêng về bên phải, ba thì xưa nay ký nghiêng bên trái. Mẹ cầm cuốn vở, đứng ở cửa phòng tôi.',
    choices: [
      { label: 'Kể thật chuyện năm đó', effects: { happiness: 1, intelligence: 1 }, flags: ['nhan_chu_ky'],
        text: 'Mẹ nghe xong, bật cười, rồi lại thôi cười. Tối đó mẹ đưa cuốn vở cho ba xem. Ba lật tới trang có chữ ký, nói: “Ký cũng giống đó chứ.”' },
      { label: 'Nói không nhớ', effects: { happiness: -1 }, flags: ['choi_chu_ky'],
        text: 'Mẹ nhìn tôi một lúc, rồi bỏ cuốn vở vào thùng giấy vụn. Mẹ không hỏi nữa. Tôi biết mẹ biết.' },
    ],
  },
  {
    id: 'ls-so-lixi', ages: [17, 21], requires: ['me_giu_lixi'], needs: ['mother'],
    title: 'Cuốn sổ lì xì',
    text: 'Trước ngày tôi đi xa, mẹ đưa cuốn sổ nhỏ ghi tiền lì xì từ năm tôi năm tuổi. Cộng lại hơn ba triệu. Mẹ nói tiền ấy mẹ đã lỡ tiêu vào học phí những năm khó, giờ mẹ sẽ trả dần. Mẹ nhìn tôi, chờ.',
    choices: [
      { label: 'Nói mẹ không cần trả', effects: { happiness: 2 }, flags: ['tha_lixi'],
        text: 'Mẹ không nói gì, chỉ gật đầu. Hôm tôi đi, trong ba lô có thêm một phong bì. Mở ra, đúng ba triệu, kèm tờ giấy: “Của con thì con giữ.”' },
      { label: 'Xin giữ cuốn sổ thay tiền', effects: { happiness: 3 }, flags: ['giu_so_lixi'],
        text: 'Mẹ đưa cuốn sổ, ngập ngừng. Tôi đọc từng dòng: tuổi, số tiền, ai lì xì, có năm ghi thêm “con bị sốt”. Cuốn sổ đi theo tôi rất nhiều năm.' },
    ],
  },
  {
    id: 'ls-phat-bieu', ages: [17, 21], requires: ['ngai_noi'],
    title: 'Bài phát biểu',
    text: 'Tôi được chọn phát biểu trước toàn trường trong lễ tổng kết. Từ năm lớp một, cứ đứng trước đông người là tay tôi run, giọng lạc đi. Người phụ trách nói nếu tôi không nhận thì sẽ chọn người khác, nhưng tôi là người hợp nhất.',
    choices: [
      { label: 'Nhận lời, tập mỗi tối', effects: { intelligence: 2, happiness: 1 }, flags: ['vuot_ngai_noi'],
        text: 'Tôi tập trước gương ba tuần. Hôm đó tay vẫn run, đọc vấp hai chỗ. Nhưng tôi đọc hết, không cúi đầu. Xuống sân khấu, chân tôi mềm nhũn.' },
      { label: 'Nhường người khác', effects: { happiness: -1 },
        text: 'Một bạn khác lên phát biểu, nói hay. Tôi đứng dưới vỗ tay. Bài viết sẵn của tôi nằm trong túi áo, tôi gấp nhỏ lại.' },
    ],
  },
  {
    id: 'ls-gap-lai-lan', ages: [19, 23], requires: ['chuyen_giay'],
    title: 'Người ở bàn bên',
    text: 'Ở quán cà phê, cô gái bàn bên nhìn tôi rồi cười: “Bạn học lớp năm trường cũ phải không?” Là Lan, giờ gầy và khác hẳn. Lan kể dạo đó bị trêu nhiều quá nên chuyển trường. Lan hỏi tôi còn nhớ chuyện tờ giấy không.',
    choices: [
      { label: 'Nhận mình đã chuyền, xin lỗi', effects: { happiness: 1, intelligence: 1 }, flags: ['xin_loi_lan'],
        text: 'Lan im một lúc, rồi nói cảm ơn vì tôi còn nhớ. Lan kể những năm đó Lan bỏ ăn. Hai đứa ngồi tới khi quán đóng cửa. Lan đi, không hẹn gặp lại.' },
      { label: 'Nói không nhớ', effects: { happiness: -2 }, flags: ['quen_lan'],
        text: 'Lan cười, nói “chắc vậy”. Lan trả tiền phần mình, chào rồi đi. Tôi ngồi lại, nhớ rõ từng nét vẽ trên tờ giấy năm ấy.' },
    ],
  },
  {
    id: 'ls-tu-mang-xa-hoi', ages: [19, 23], requiresAny: ['tu_xa_dan', 'tu_mat_lien_lac', 'tu_de_sau'], blocks: ['tu_noi_lai'],
    title: 'Gợi ý kết bạn',
    text: 'Mạng xã hội gợi ý kết bạn: một người tên Tú, ảnh đại diện đứng trước tiệm sửa xe ở tỉnh khác. Nhìn kỹ thì đúng là Tú nhà bên năm nào. Chúng tôi đã mất liên lạc gần mười năm.',
    choices: [
      { label: 'Gửi lời mời, nhắn trước', effects: { happiness: 2 }, flags: ['tu_noi_lai'],
        text: 'Tú trả lời ngay: “Trời, tưởng mày quên tao rồi.” Hai đứa nhắn tới khuya. Tú bỏ học năm lớp mười một, giờ mở tiệm sửa xe với ba, đã có vợ sắp cưới.' },
      { label: 'Gửi lời mời, không nhắn', effects: { happiness: 1 }, flags: ['tu_ket_ban_im'],
        text: 'Tú chấp nhận, thả tim vài tấm ảnh của tôi. Không ai nhắn trước. Thỉnh thoảng tôi xem ảnh Tú đăng, biết Tú vẫn ổn.' },
      { label: 'Bỏ qua', effects: { happiness: -1 },
        text: 'Tôi kéo xuống, đọc tin khác. Mấy hôm sau gợi ý ấy biến mất. Tôi tìm lại tên Tú, rồi không bấm vào.' },
    ],
  },
  {
    id: 'ls-tu-o-nho', ages: [19, 23], requires: ['tu_noi_lai'],
    title: 'Tú xin ở nhờ',
    text: 'Tú lên thành phố tìm việc, chưa có chỗ ở, hỏi ở nhờ chỗ tôi vài tuần. Phòng tôi chỉ đủ một người, lại đang mùa thi, cần yên tĩnh. Tú nói không có ai khác để hỏi.',
    choices: [
      { label: 'Cho Tú ở nhờ', effects: { happiness: 2, intelligence: -1 }, flags: ['tu_o_nho'],
        text: 'Tú ở năm tuần, ngủ dưới sàn, sáng nào cũng dậy sớm nấu cơm. Tối hai đứa nói chuyện tới khuya, kỳ thi của tôi điểm kém hơn mọi lần. Ngày dọn đi, Tú để lại tiền điện nước dưới gối.' },
      { label: 'Tìm giúp Tú phòng trọ rẻ', effects: { intelligence: 1 }, flags: ['tu_tim_tro'],
        text: 'Tôi đi cùng Tú xem phòng hai buổi, tìm được một phòng gần chợ. Tú cảm ơn, giọng hơi xa cách. Hai đứa hẹn cà phê cuối tuần, rồi dời hai lần.' },
    ],
  },
];
