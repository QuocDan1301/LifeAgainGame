// Giai đoạn 1–10 tuổi. Mỗi tuổi 4 sự kiện cố định (age), sự kiện chuỗi dùng khoảng tuổi (ages).
// Quy tắc viết và danh sách tuyến: docs/su-kien-doi-thuong/SO-TAY.md.
export const stage01To10 = [
  // ───────────── 1 tuổi ─────────────
  {
    id: 'ls01-trao-tay', age: 1, needs: ['mother'],
    title: 'Ở cổng buổi sáng',
    text: 'Mẹ đi làm lại, gửi tôi cho bà trông ban ngày. Sáng nay ở cổng, mẹ trao tôi sang tay bà. Mẹ đã trễ giờ làm, nhưng thấy tôi mếu máo nên vẫn đứng đó, chưa nỡ đi.',
    choices: [
      { label: 'Khóc, níu áo mẹ', effects: { happiness: 2 }, flags: ['niu_me'],
        text: 'Mẹ bế lại tôi thêm mười lăm phút. Tối đó mẹ về muộn, nghe nói bị nhắc vì đi trễ. Tôi không biết chuyện ấy. Tôi chỉ nhớ mùi áo mẹ.' },
      { label: 'Ngả đầu vào vai bà', effects: { happiness: 1, health: 1 }, flags: ['than_ba'],
        text: 'Mẹ đi được. Ra tới đầu đường, mẹ còn ngoái lại hai lần. Bà nói vọng theo: “Nó chịu rồi, đi đi con.” Tối đó mẹ ôm tôi lâu hơn mọi ngày.' },
    ],
  },
  {
    id: 'ls01-tieng-goi', age: 1,
    title: 'Tiếng gọi đầu tiên',
    text: 'Cả nhà thi nhau dạy tôi nói. Ba ngồi trước mặt, nói đi nói lại chữ “ba”. Mẹ chen vào dạy chữ “mẹ”. Bà ngồi góc nhà nhặt rau, không dạy gì, thỉnh thoảng nhìn sang.',
    choices: [
      { label: 'Gọi “mẹ”', effects: { happiness: 2 },
        text: 'Mẹ ôm chầm lấy tôi, mắt đỏ hoe. Ba giả vờ giận, cả buổi tối ngồi lẩm bẩm chữ “ba” một mình.' },
      { label: 'Gọi “ba”', effects: { happiness: 2 },
        text: 'Ba bế bổng tôi lên, gọi điện khoe với cả họ. Mẹ cười, rồi nói nhỏ với bà rằng đêm nào cũng là mẹ thức.' },
      { label: 'Gọi “bà”', effects: { happiness: 2 }, flags: ['than_ba'],
        text: 'Bà đánh rơi rổ rau. Ba mẹ nhìn nhau rồi cùng cười. Từ hôm đó, bà đi đâu cũng kể tôi gọi bà trước tiên.' },
    ],
  },
  {
    id: 'ls01-con-cho', age: 1,
    title: 'Con chó nhà bên',
    text: 'Tôi đang ngồi chơi một mình ngoài sân. Con chó nhà bên lách qua hàng rào, đứng cách tôi một sải tay. Nó to hơn tôi. Người lớn đều đang ở trong bếp. Nó khịt mũi, nhìn tôi, đuôi ve vẩy chậm.',
    choices: [
      { label: 'Đưa tay ra chạm', effects: { happiness: 2 }, flags: ['khong_so_cho'],
        text: 'Nó liếm tay tôi, mũi ướt và lạnh. Bà chạy ra, thấy hai đứa ngồi cạnh nhau. Từ đó tôi không sợ chó.' },
      { label: 'Khóc thét lên', effects: { happiness: -1 }, flags: ['so_cho'],
        text: 'Bà chạy ra đuổi nó về. Tôi khóc tới khi được bế vào nhà. Mấy năm sau, nghe tiếng chó sủa tôi vẫn nép sau lưng người lớn.' },
    ],
  },
  {
    id: 'ls01-sot-dem', age: 1, needs: ['father', 'mother'],
    title: 'Cơn sốt nửa đêm',
    text: 'Nửa đêm tôi sốt cao. Ba muốn chở tôi đi viện ngay. Mẹ muốn lau mát cho tôi, chờ trời sáng vì ngoài kia đang mưa lớn. Ba dang tay định bế tôi đi, mẹ vẫn ôm tôi chưa buông. Tôi khóc, tay quơ về phía hai người.',
    choices: [
      { label: 'Quơ tay về phía ba', effects: { health: 3, happiness: -1 },
        text: 'Ba bế tôi ra xe, mẹ cầm áo mưa chạy theo. Bác sĩ nói đi sớm là đúng. Cả nhà về tới nơi thì trời đã sáng, ai cũng ướt.' },
      { label: 'Rúc vào lòng mẹ', effects: { health: 2, happiness: 1 },
        text: 'Mẹ lau mát cho tôi suốt đêm. Gần sáng tôi hạ sốt, mẹ vẫn đưa đi khám. Ba ngồi cạnh cầm nhiệt kế cả đêm, không chợp mắt.' },
    ],
  },

  // ───────────── 2 tuổi ─────────────
  {
    id: 'ls02-xe-do-choi', age: 2,
    title: 'Chiếc xe của tôi',
    text: 'Tết, đứa em họ cầm chiếc xe đồ chơi của tôi không chịu buông. Nó nhỏ hơn tôi một tuổi. Người lớn ngồi quanh mâm, ai cũng nói: “Nhường em đi con.”',
    choices: [
      { label: 'Nhường em', effects: { happiness: -2 }, flags: ['hay_nhuong'],
        text: 'Người lớn khen tôi ngoan. Tôi ngồi nhìn chiếc xe trong tay nó suốt buổi. Lúc về, nó mang theo luôn. Mẹ hứa mua chiếc khác, rồi quên.' },
      { label: 'Giật lại', effects: { happiness: -1 }, flags: ['giu_cua'],
        text: 'Nó khóc to. Mẹ phải xin lỗi cô. Tôi ôm chiếc xe ngồi một góc, chơi không vui như trước. Cả buổi không ai bế tôi.' },
      { label: 'Đưa nó món đồ chơi khác', effects: { intelligence: 1, happiness: -1 },
        text: 'Nó cầm món mới, rồi vẫn với tay lấy chiếc xe. Cuối cùng nó cầm cả hai. Mẹ nhìn tôi, gật đầu, như thể tôi vừa làm được việc gì lớn lắm.' },
    ],
  },
  {
    id: 'ls02-nha-tre', age: 2, needs: ['mother'],
    title: 'Buổi thử ở nhóm trẻ',
    text: 'Dạo này bà đau lưng, trông tôi không nổi. Mẹ dắt tôi tới nhóm trẻ đầu đường ở thử một buổi. Nếu tôi chịu ở lại, mẹ sẽ gửi tôi ở đây luôn. Mẹ buông tay tôi ra. Năm đứa nhỏ đang ngồi xếp hình, nhìn tôi.',
    choices: [
      { label: 'Đi về phía mấy đứa nhỏ', effects: { intelligence: 2, happiness: 1 }, flags: ['gui_nha_tre'],
        text: 'Tôi xếp hình với tụi nó tới trưa. Tuần sau mẹ gửi tôi luôn. Bà ở nhà rảnh tay, nhưng chiều nào cũng ra đầu đường đứng chờ đón.' },
      { label: 'Ôm chân mẹ không rời', effects: { happiness: 2, intelligence: -1 }, flags: ['than_ba'],
        text: 'Mẹ đưa tôi về. Bà trông tôi thêm một năm. Tối đó tôi nghe mẹ nói với ba là ngại bà, lưng bà dạo này đau nhiều.' },
    ],
  },
  {
    id: 'ls02-ngu-rieng', age: 2, needs: ['mother'],
    title: 'Đêm đầu ngủ riêng',
    text: 'Mẹ kê cho tôi một chiếc giường nhỏ sát vách. Nửa đêm tôi thức dậy. Phòng tối, quạt kêu đều, tôi thấy sợ. Giường ba mẹ chỉ cách mấy bước chân.',
    choices: [
      { label: 'Leo sang giường ba mẹ', effects: { health: 2 },
        text: 'Tôi chui vào giữa hai người, ngủ một mạch tới sáng. Mẹ thở dài, nói thôi để năm sau. Chiếc giường nhỏ thành chỗ để đồ.' },
      { label: 'Ôm gối nằm yên', effects: { happiness: -1, intelligence: 1 }, flags: ['tu_lap'],
        text: 'Rất lâu sau tôi mới ngủ lại. Sáng ra mẹ khen tôi giỏi. Mấy đêm sau dễ hơn, nhưng tôi vẫn để đèn ngủ tới tận năm lớp hai.' },
    ],
  },
  {
    id: 'ls02-ba-khung-lai', age: 2,
    title: 'Bà khựng lại',
    text: 'Tôi giơ hai tay đòi bà bế như mọi lần. Bà cúi xuống, rồi khựng lại giữa chừng, một tay chống hông. Bà vẫn cười, vẫn nói: “Lại đây bà bế.”',
    choices: [
      { label: 'Vẫn đòi bế', effects: { happiness: 2 },
        text: 'Bà bế tôi đi một vòng sân, chậm hơn mọi khi. Tối đó tôi thấy mẹ dán cao lên lưng bà. Bà nói không sao.' },
      { label: 'Tự trèo lên ghế ngồi cạnh bà', effects: { happiness: 1, intelligence: 1 }, flags: ['than_ba'],
        text: 'Bà ngồi xuống cạnh tôi, thở ra một hơi dài. Bà xoa đầu tôi, kể chuyện con cá chép cho tới lúc tôi ngủ gục trên đùi bà.' },
    ],
  },

  // ───────────── 3 tuổi ─────────────
  {
    id: 'ls03-ao-moi', age: 3, needs: ['mother'],
    title: 'Bộ đồ đi đám cưới',
    text: 'Sắp đi ăn cưới, mẹ mặc cho tôi bộ đồ mới mua, mẹ đã ủi phẳng từ tối qua. Cổ áo cứng, cứ cọ vào cổ làm tôi ngứa rát. Mẹ dặn hôm nay cả họ chụp ảnh chung, phải mặc cho đẹp. Tôi kéo cổ áo, nhìn chiếc áo thun cũ trên giường.',
    choices: [
      { label: 'Chịu mặc bộ đồ mới', effects: { appearance: 2, happiness: -2 }, flags: ['anh_ao_moi'],
        text: 'Tôi gãi cổ suốt buổi, không chơi được với ai. Trong tấm ảnh chung, tôi đứng thẳng, mặt nhăn. Mẹ lồng khung tấm ảnh, treo ở phòng khách nhiều năm.' },
      { label: 'Đòi mặc áo thun cũ', effects: { happiness: 2, appearance: -1 }, flags: ['anh_ao_cu'],
        text: 'Mẹ thở dài, thay cho tôi chiếc áo thun sờn vai. Tôi chạy chơi cả buổi. Trong tấm ảnh chung, tôi là đứa duy nhất mặc áo cũ. Mẹ không treo tấm ảnh ấy.' },
    ],
  },
  {
    id: 'ls03-hu-keo', age: 3,
    title: 'Hũ kẹo ở quầy',
    text: 'Ở tiệm tạp hóa, hũ kẹo đặt ngay quầy, vừa tầm tay tôi. Mẹ đang đếm tiền, không nhìn xuống. Cô bán hàng cũng đang bận lấy đồ.',
    choices: [
      { label: 'Lấy một viên bỏ túi', effects: { intelligence: 1, happiness: -2 }, flags: ['tung_lay_keo'],
        text: 'Về nhà mẹ thấy viên kẹo. Mẹ dắt tôi quay lại tiệm, bắt tôi tự trả tiền và xin lỗi. Tôi nói lí nhí. Lần sau đi ngang tiệm, tôi không dám nhìn cô.' },
      { label: 'Kéo áo mẹ, chỉ hũ kẹo', effects: { happiness: -1 },
        text: 'Mẹ nói không, răng tôi đang sâu. Tôi khóc suốt đường về. Tối đó mẹ kể với ba rằng tôi biết hỏi chứ không lấy bậy, giọng mẹ vui. Tôi thì chỉ nhớ là không được ăn kẹo.' },
      { label: 'Đứng nhìn hũ kẹo', effects: { happiness: 2 },
        text: 'Cô bán hàng thấy, mở nắp đưa tôi một viên. Mẹ ngại, đòi trả tiền, cô không lấy. Từ đó mỗi lần dắt tôi theo, mẹ đều mua thêm món gì đó ở tiệm cô.' },
    ],
  },
  {
    id: 'ls03-con-meo', age: 3,
    title: 'Con mèo dưới gầm giường',
    text: 'Con mèo già của bà nằm dưới gầm giường cả ngày, không ra ăn. Bà nói nó mệt. Tôi muốn nó ra chơi như mọi hôm. Nó nhìn tôi, không kêu.',
    choices: [
      { label: 'Lôi nó ra chơi', effects: { happiness: -2 },
        text: 'Nó cào nhẹ vào tay tôi rồi bò vào sâu hơn. Bà kéo tôi ra ngoài. Sáng hôm sau nó không còn. Bà ngồi ngoài hiên rất lâu. Tôi không dám hỏi.' },
      { label: 'Nằm xuống vuốt lưng nó', effects: { happiness: -1 }, flags: ['vuot_meo'],
        text: 'Tôi nằm dưới đất vuốt lưng nó tới khi mẹ bế đi tắm. Sáng hôm sau nó không còn. Bà nói nó đi gặp bạn. Tôi nhớ cái lưng ấm, gầy nhom.' },
    ],
  },
  {
    id: 'ls03-ba-ve', age: 3, needs: ['father'],
    title: 'Ba về sau chuyến đi xa',
    text: 'Ba đi công tác gần một tháng. Hôm ba về, râu mọc lởm chởm, da sạm. Tôi nhìn mãi mới nhận ra ba, nhưng vẫn đứng nép sau lưng mẹ. Ba ngồi xổm xuống, chìa tay ra, chờ.',
    choices: [
      { label: 'Chạy lại', effects: { happiness: 3 }, flags: ['thuyen_go'],
        text: 'Ba bế bổng tôi lên, râu cọ vào má rát rát. Ba lấy trong ba lô ra một con thuyền gỗ nhỏ, nói đã cầm theo suốt chuyến đi.' },
      { label: 'Vẫn nép sau mẹ', effects: { happiness: -1 }, flags: ['thuyen_go', 'ngai_ba'],
        text: 'Ba cười, đặt con thuyền gỗ xuống đất rồi đứng dậy. Tối đó ba ngồi một mình ngoài hiên. Mẹ nói ba hơi buồn. Sáng hôm sau tôi mới chịu lại gần.' },
    ],
  },

  // ───────────── 4 tuổi ─────────────
  {
    id: 'ls04-nhanh-xoai', age: 4, needs: ['father'],
    title: 'Nhánh xoài gãy',
    text: 'Ba vừa trồng cây xoài con giữa sân. Tôi đạp xe ba bánh tông vào, gãy một nhánh. Ba đang ở trong nhà, chưa ai thấy. Con chó nhà bên hay lách qua rào phá cây, nếu tôi im lặng thì chắc ba sẽ nghĩ là nó.',
    choices: [
      { label: 'Chạy vào nói với ba', effects: { intelligence: 1, happiness: 1 }, flags: ['cay_xoai', 'noi_that'],
        text: 'Ba ra xem, lấy dây buộc nhánh gãy lại. Ba không la, chỉ nói cây sẽ tự lành. Năm sau, chỗ buộc dây thành một cái mấu u trên thân cây.' },
      { label: 'Giấu nhánh gãy, im lặng', effects: { happiness: -2 }, flags: ['cay_xoai', 'giau_chuyen'],
        text: 'Tôi nhét nhánh gãy vào bụi rậm. Chiều đó ba thấy cây, đoán là con chó nhà bên. Ba sang nói với hàng xóm, hai nhà hơi căng. Tôi đứng sau cửa nghe, không nói gì.' },
    ],
  },
  {
    id: 'ls04-loi-hua', age: 4, needs: ['mother'],
    title: 'Chủ nhật trời mưa',
    text: 'Mẹ hứa chủ nhật dẫn tôi đi sở thú. Sáng chủ nhật, tôi mặc áo sẵn từ sớm, nhưng trời mưa lâm râm. Mẹ tăng ca cả tuần, giờ vẫn ngủ trong phòng, cửa khép. Tôi đứng trước cửa phòng mẹ.',
    choices: [
      { label: 'Gõ cửa nhắc mẹ', effects: { happiness: 2 }, flags: ['me_giu_loi'],
        text: 'Mẹ dậy, mặc áo mưa chở tôi đi. Sở thú vắng, con voi đứng trong chuồng không ra. Về nhà mẹ bị cảm, nằm hai ngày. Tôi vẫn kể chuyện con voi cho cả lớp.' },
      { label: 'Ngồi xếp hình chờ', effects: { happiness: -2, intelligence: 1 }, flags: ['khong_nhac'],
        text: 'Mẹ ngủ tới trưa. Chiều mẹ thấy tôi ngồi một mình, xin lỗi, hứa tuần sau. Tuần sau mẹ quên. Tôi không nhắc lại.' },
    ],
  },
  {
    id: 'ls04-bang-chu', age: 4, needs: ['father'],
    title: 'Bảng chữ cái của ba',
    text: 'Ba mua bảng chữ cái, muốn tôi biết đọc trước khi vào lớp một. Tối nào ba cũng ngồi kèm. Tối nay ba vừa bày bảng chữ ra bàn thì tụi nhỏ ngoài sân gọi tên tôi ra chơi trốn tìm.',
    choices: [
      { label: 'Ngồi học với ba', effects: { intelligence: 3, happiness: -2 }, flags: ['hoc_chu_som'],
        text: 'Trước Tết tôi đọc được tên mình. Ba đem khoe khắp xóm. Tụi nhỏ ngoài sân thôi gọi tôi. Mấy trò mới bày ra, tôi không biết luật.' },
      { label: 'Chạy ra sân', effects: { happiness: 3, intelligence: -1 },
        text: 'Ba gấp bảng chữ lại, không nói gì. Mấy tối sau ba không ngồi kèm nữa. Tôi thành đứa trốn giỏi nhất xóm.' },
    ],
  },
  {
    id: 'ls04-ban-noi-ngong', age: 4,
    title: 'Đứa ngồi ăn một mình',
    text: 'Lớp mẫu giáo có bạn Lành nói ngọng. Mấy đứa hay nhại giọng Lành. Giờ ăn, Lành ngồi một bàn riêng. Đám bạn vẫy tôi qua bàn bên kia.',
    choices: [
      { label: 'Bưng chén qua ngồi với Lành', effects: { happiness: -1, intelligence: 1 }, flags: ['ban_lanh'],
        text: 'Lành chia cho tôi nửa cái bánh flan. Mấy ngày sau, đám bạn không rủ tôi chơi đồ hàng. Tôi với Lành chơi xích đu, chỉ có hai đứa.' },
      { label: 'Qua bàn đám bạn', effects: { happiness: 2 }, flags: ['cuoi_theo'],
        text: 'Tôi không nhại Lành, nhưng có lúc cười theo. Lành nhìn thấy. Về nhà mẹ hỏi ở lớp vui không, tôi nói vui.' },
    ],
  },

  // ───────────── 5 tuổi ─────────────
  {
    id: 'ls05-li-xi', age: 5, needs: ['mother'],
    title: 'Tiền lì xì',
    text: 'Tết năm nay tôi được lì xì nhiều hơn mọi năm. Mẹ nói đưa mẹ giữ, lớn mẹ trả. Đứa em họ được tự giữ tiền, đang tính mua súng nước.',
    choices: [
      { label: 'Đưa hết cho mẹ', effects: { happiness: -1, intelligence: 1 }, flags: ['me_giu_lixi'],
        text: 'Mẹ ghi số tiền vào một cuốn sổ nhỏ, cất trong tủ. Em họ bắn súng nước ướt cả sân. Tôi đứng xem.' },
      { label: 'Giữ lại một ít', effects: { happiness: 2 }, flags: ['me_giu_lixi'],
        text: 'Tôi giữ hai tờ, đưa mẹ phần còn lại. Hai đứa mua súng nước giống nhau. Tới chiều thì súng của tôi gãy cò.' },
      { label: 'Đòi tự giữ hết', effects: { happiness: 3, intelligence: -1 },
        text: 'Mẹ đưa lại cả xấp. Tôi mua súng nước, kẹo, một con rô bốt. Hết Tết, tôi không nhớ mình đã tiêu vào đâu nữa.' },
    ],
  },
  {
    id: 'ls05-sau-vach', age: 5, needs: ['father', 'mother'],
    title: 'Tiếng nói sau vách',
    text: 'Nửa đêm, tôi nghe ba mẹ cãi nhau ở phòng ngoài. Chuyện tiền. Giọng mẹ nghẹn lại, giọng ba to dần. Tôi nằm trong chăn, mắt mở.',
    choices: [
      { label: 'Ra đứng ở cửa phòng', effects: { happiness: -2 }, flags: ['thay_cai_nhau'],
        text: 'Hai người im bặt. Mẹ bế tôi về giường, nằm cạnh tới khi tôi ngủ. Sáng ra cả nhà ăn sáng như chưa có gì. Tôi biết là có.' },
      { label: 'Trùm chăn giả ngủ', effects: { happiness: -2 }, flags: ['gia_ngu'],
        text: 'Tiếng cãi kéo dài thêm một lúc rồi tắt. Sáng ra mắt mẹ sưng. Tôi không hỏi. Mẹ cũng không nói.' },
    ],
  },
  {
    id: 'ls05-rang-sau', age: 5, needs: ['father'],
    title: 'Cái răng sâu',
    text: 'Răng hàm tôi đau mấy hôm nay. Ba nói phải đi nha sĩ nhổ. Bà nói ngậm nước muối là đỡ, nhỏ vậy nhổ răng tội nghiệp. Tôi sợ cái ghế nha sĩ hơn sợ đau.',
    choices: [
      { label: 'Đi nha sĩ với ba', effects: { health: 3, happiness: -1 },
        text: 'Đau một lúc, rồi hết hẳn. Trên đường về ba mua kem thưởng, rồi mới nhớ bác sĩ dặn hai tiếng sau tôi mới được ăn. Ba ăn hết, tôi ngồi sau xe nhìn.' },
      { label: 'Nghe bà, ngậm muối', effects: { health: -2, happiness: 1 },
        text: 'Mấy hôm thì đỡ. Đêm Trung thu răng đau lại, sưng cả má. Lần này vẫn phải nhổ, và đau hơn.' },
    ],
  },
  {
    id: 'ls05-bo-hoa', age: 5,
    title: 'Bó hoa ngày Nhà giáo',
    text: 'Mẹ mua cho tôi bó hồng để tặng cô. Ở cổng lớp, bạn Quân đứng tay không, nhìn bó hoa của tôi. Mẹ Quân đi làm sớm, không kịp mua. Còn năm phút nữa vào lớp.',
    choices: [
      { label: 'Tặng cô cả bó', effects: { happiness: 1 },
        text: 'Cô cảm ơn, cắm bó hoa của tôi vào bình trên bàn. Quân ngồi cúi đầu suốt buổi chào cờ.' },
      { label: 'Rút một nửa đưa Quân', effects: { happiness: 2 }, flags: ['chia_hoa_quan'],
        text: 'Cô nhận hai bó hoa nhỏ, cười với cả hai đứa. Chiều về mẹ hỏi sao bó hoa ít vậy. Tôi kể. Mẹ im một lúc rồi xoa đầu tôi.' },
    ],
  },

  // ───────────── 6 tuổi ─────────────
  {
    id: 'ls06-cay-but', age: 6,
    title: 'Cây bút chì duy nhất',
    text: 'Tuần đầu lớp một. Bạn cùng bàn quên hộp bút, ngồi im nhìn bảng. Cô bắt đầu đọc chính tả. Tôi chỉ có một cây bút chì.',
    choices: [
      { label: 'Cho bạn mượn, mình chờ', effects: { happiness: 1, intelligence: -1 }, flags: ['ban_cung_ban'],
        text: 'Tôi viết sau bạn nửa bài, bị cô nhắc vì chậm. Ra chơi, bạn trả bút kèm một cục tẩy hình con cá. Tôi giữ cục tẩy ấy mấy năm.' },
      { label: 'Giữ bút viết bài', effects: { intelligence: 2, happiness: -1 },
        text: 'Tôi viết xong, được cô khen chữ đẹp. Bạn bị phạt đứng cuối lớp. Giờ ra chơi, bạn không nhìn tôi.' },
      { label: 'Bẻ đôi cây bút', effects: { intelligence: 1, happiness: 1 }, flags: ['ban_cung_ban'],
        text: 'Hai khúc bút ngắn, cầm khó. Chữ cả hai đứa đều xấu. Cô nhìn hai khúc bút, không phạt ai.' },
    ],
  },
  {
    id: 'ls06-tien-an-sang', age: 6, needs: ['mother'],
    title: 'Tiền ăn sáng',
    text: 'Mỗi sáng mẹ cho tôi hai chục nghìn ăn sáng. Ở cổng trường có bán con quay đèn, ba chục nghìn một con. Đứa nào trong lớp cũng có, tôi cũng muốn một con.',
    choices: [
      { label: 'Nhịn hai bữa sáng', effects: { health: -3, happiness: 2 }, flags: ['nhin_an'],
        text: 'Ngày thứ hai, tới giờ thể dục tôi chóng mặt, phải ngồi dưới bóng cây. Cô gọi điện cho mẹ. Con quay tôi chơi được một tuần thì hỏng đèn.' },
      { label: 'Ăn ít lại, để dành phần dư', effects: { intelligence: 2, health: -1 },
        text: 'Tôi ăn gói xôi mười nghìn, để dành phần còn lại. Ba hôm mới đủ tiền. Hôm tôi mua được, tụi bạn đã chuyển sang chơi đá banh.' },
      { label: 'Xin mẹ mua', effects: { happiness: 1 },
        text: 'Mẹ nói để cuối tháng. Cuối tháng mẹ mua thật, loại không có đèn. Tôi vẫn chơi, không nói gì.' },
    ],
  },
  {
    id: 'ls06-doc-bai', age: 6,
    title: 'Đọc bài trước lớp',
    text: 'Cô gọi tôi đứng lên đọc bài. Tới chữ “nghiêng” tôi vấp, đọc thành “nghiên”. Cả lớp cười. Cô chờ. Mặt tôi nóng ran.',
    choices: [
      { label: 'Đọc lại từ đầu', effects: { intelligence: 2, happiness: -1 }, flags: ['dam_noi'],
        text: 'Tôi đọc lại, chậm và run. Lần này đúng. Cô cho cả lớp vỗ tay. Tôi ngồi xuống mà tay vẫn còn run.' },
      { label: 'Đứng im tới khi cô cho ngồi', effects: { happiness: -2 }, flags: ['ngai_noi'],
        text: 'Cô gọi bạn khác đọc tiếp. Tôi ngồi xuống. Từ đó mỗi lần cô nhìn xuống lớp tìm người đọc, tôi cúi đầu.' },
    ],
  },
  {
    id: 'ls06-ba-dua-don', age: 6, needs: ['father'],
    title: 'Chờ ở cột cờ',
    text: 'Ba dặn tan học phải đứng chờ ở cột cờ, không đi theo ai. Hôm nay tan học đã nửa tiếng mà ba chưa tới, cô bảo vệ sắp khóa cổng. Mẹ của một bạn cùng lớp, nhà ở cùng đường, đề nghị chở tôi về.',
    choices: [
      { label: 'Đi nhờ xe cô', effects: { happiness: 1 },
        text: 'Cô chở tôi về tới cổng. Mười phút sau ba về, mặt tái, áo ướt mồ hôi. Ba đã chạy khắp trường tìm tôi. Ba không la, chỉ ngồi xuống bậc thềm thở.' },
      { label: 'Ngồi chờ ba', effects: { happiness: -1, health: -1 }, flags: ['cho_ba'],
        text: 'Cô bảo vệ ngồi chờ cùng tôi tới sáu giờ. Ba tới, xe hỏng giữa đường. Ba xin lỗi cô bảo vệ ba lần. Trên đường về, ba mua cho tôi cái bánh bao.' },
    ],
  },

  // ───────────── 7 tuổi ─────────────
  {
    id: 'ls07-tien-ba-cho', age: 7, needs: ['mother'],
    title: 'Tờ tiền bà dúi vào tay',
    text: 'Bà dúi vào tay tôi tờ năm mươi nghìn, dặn đừng nói với mẹ. Mẹ đã nhiều lần nói bà đừng cho tiền tụi nhỏ, để dành mà mua thuốc.',
    choices: [
      { label: 'Giữ bí mật với bà', effects: { happiness: 2 }, money: 50_000, flags: ['bi_mat_voi_ba'],
        text: 'Tôi giữ tờ tiền trong ví. Lần đầu tôi có bí mật chung với bà. Mỗi lần mẹ nhắc chuyện thuốc của bà, tôi nhìn đi chỗ khác.' },
      { label: 'Kể với mẹ', effects: { intelligence: 1, happiness: -1 }, flags: ['noi_that'],
        text: 'Mẹ cầm tiền trả lại bà, hai người nói qua nói lại một hồi. Bà không giận tôi. Nhưng từ đó bà cho tôi kẹo thay vì tiền.' },
    ],
  },
  {
    id: 'ls07-chu-ky', age: 7, needs: ['father', 'mother'],
    title: 'Bài chính tả bốn điểm',
    text: 'Tôi bị bốn điểm chính tả, cô bắt về xin chữ ký phụ huynh. Tối nay ba đi làm về mặt nặng trĩu, cả bữa cơm không nói câu nào. Mẹ đi ca đêm, nửa đêm mới về. Sáng mai phải nộp bài.',
    choices: [
      { label: 'Đưa ba ký ngay', effects: { intelligence: 2, happiness: -2 },
        text: 'Ba nhìn bài, không quát. Ba ngồi kèm tôi chép lại từng lỗi tới mười giờ. Ba ký, nét chữ đè mạnh tới rách giấy.' },
      { label: 'Chờ mẹ về ký', effects: { happiness: -1 }, flags: ['lach_ky'],
        text: 'Mẹ về lúc nửa đêm, ký trong lúc mắt nhắm mắt mở, không đọc điểm. Tôi thở phào. Rồi thấy mình hơi tệ, vì mẹ mệt vậy.' },
      { label: 'Tự ký giả chữ ba', effects: { happiness: -3 }, flags: ['gia_chu_ky'],
        text: 'Cô không nhận ra. Mấy ngày liền tôi giật mình mỗi lần điện thoại nhà reo. Cuốn vở ấy tôi giấu dưới đáy cặp tới hết năm.' },
    ],
  },
  {
    id: 'ls07-hoc-boi', age: 7, needs: ['father'],
    title: 'Hồ bơi mùa hè',
    text: 'Hè này ba dắt tôi đi học bơi. Nước hồ sâu tới cổ tôi. Đứa bên cạnh vừa sặc nước, được kéo lên, khóc ầm. Ba đứng dưới nước, giang tay.',
    choices: [
      { label: 'Nhảy xuống với ba', effects: { health: 3, happiness: -1 }, flags: ['biet_boi'],
        text: 'Tôi sặc mấy ngụm, mắt đỏ, mũi cay. Cuối hè tôi bơi được hết chiều ngang hồ. Ba đứng ở thành hồ vỗ tay một mình.' },
      { label: 'Ngồi trên thành hồ', effects: { happiness: 1 }, flags: ['khong_biet_boi'],
        text: 'Ba không ép. Cả hè tôi ngồi thả chân xuống nước. Những năm sau, ba không nhắc lại chuyện học bơi.' },
    ],
  },
  {
    id: 'ls07-cong-cho', age: 7, needs: ['mother'],
    title: 'Bà cụ ở cổng chợ',
    text: 'Đi chợ với mẹ, tôi cầm mười nghìn để mua kẹo kéo. Ở cổng chợ có bà cụ ngồi xin, chân quấn băng. Mẹ đi trước, không quay lại.',
    choices: [
      { label: 'Bỏ hết tiền vào nón bà cụ', effects: { happiness: 1 }, flags: ['cho_ba_cu'],
        text: 'Bà cụ gật đầu với tôi. Hôm đó tôi không có kẹo. Mẹ không nói gì, chỉ nắm tay tôi chặt hơn lúc qua đường.' },
      { label: 'Mua kẹo kéo', effects: { happiness: 2 },
        text: 'Tôi ăn kẹo trên đường về. Đi ngang cổng chợ lần nữa, tôi nhìn xuống đất. Kẹo vẫn ngọt.' },
      { label: 'Chia tiền làm đôi', effects: { happiness: 1, intelligence: 1 },
        text: 'Tôi bỏ năm nghìn vào nón, mua cây kẹo nhỏ. Phần nào cũng có vẻ ít ỏi. Tôi không biết mình đã làm đúng hay chưa.' },
    ],
  },

  // ───────────── 8 tuổi ─────────────
  {
    id: 'ls08-binh-hoa', age: 8,
    title: 'Bình hoa trên bàn cô',
    text: 'Giờ ra chơi, Phong chạy đụng bể bình hoa trên bàn cô. Chỉ có tôi thấy. Cô nói không ai nhận thì cả lớp trực nhật một tuần. Phong nhìn tôi.',
    choices: [
      { label: 'Nói ra là Phong', effects: { happiness: -2, intelligence: 1 }, flags: ['khai_phong'],
        text: 'Phong bị mời phụ huynh. Cả lớp được về đúng giờ. Từ đó Phong không nói chuyện với tôi, mấy đứa thân với Phong cũng vậy.' },
      { label: 'Im lặng', effects: { happiness: -1 }, flags: ['im_lang_binh_hoa'],
        text: 'Cả lớp trực nhật một tuần. Phong quét lớp nhiều nhất, không nói gì. Tôi cũng không nói gì. Cuối tuần, Phong cho tôi mượn truyện.' },
      { label: 'Nhận là mình làm', effects: { happiness: -3 }, flags: ['nhan_thay_phong'],
        text: 'Tôi bị ghi tên vào sổ đầu bài, mẹ bị mời lên trường. Mẹ hỏi thật không, tôi gật. Phong đi theo tôi về tới đầu đường, không nói câu nào.' },
    ],
  },
  {
    id: 'ls08-me-nam-vien', age: 8, needs: ['father', 'mother'],
    title: 'Mẹ nằm viện',
    text: 'Mẹ nằm viện ba ngày. Tối nay ba hỏi tôi có muốn vào thăm mẹ không. Mai tôi kiểm tra Toán, bảng nhân chín tôi chưa thuộc.',
    choices: [
      { label: 'Vào viện với ba', effects: { happiness: 2, intelligence: -1 }, flags: ['tham_me'],
        text: 'Mẹ nắm tay tôi cả buổi, hỏi chuyện lớp. Tôi ngủ gục trên ghế nhựa. Bài kiểm tra hôm sau được sáu điểm.' },
      { label: 'Ở nhà ôn bài', effects: { intelligence: 2, happiness: -1 },
        text: 'Tôi được chín điểm. Mẹ gọi điện về khen, giọng mệt. Tôi định cầm bài vào khoe thì mẹ đã xuất viện.' },
    ],
  },
  {
    id: 'ls08-xe-dap', age: 8, needs: ['father'],
    title: 'Ba buông tay lúc nào',
    text: 'Ba giữ yên sau xe đạp, chạy theo, hứa không buông. Tới giữa con đường, tôi không còn nghe tiếng dép ba nữa. Xe vẫn đang chạy thẳng, nhưng tôi sợ ba đã buông tay.',
    choices: [
      { label: 'Đạp tiếp, không ngoái lại', effects: { health: 2, happiness: 3 }, flags: ['biet_xe_dap'],
        text: 'Tôi đạp tới cuối đường mới dám dừng. Quay lại thì ba đứng xa lắm, hai tay chống gối thở. Ba giơ ngón cái lên.' },
      { label: 'Ngoái lại tìm ba', effects: { health: -1, happiness: -1 }, flags: ['biet_xe_dap'],
        text: 'Xe loạng choạng, tôi té trầy hai đầu gối. Ba chạy tới. Tối đó tôi giận ba nói dối. Hai hôm sau mới chịu tập tiếp.' },
    ],
  },
  {
    id: 'ls08-cho-lac', age: 8, needs: ['mother'],
    title: 'Con chó theo về',
    text: 'Một con chó con lông vàng đi theo tôi từ trường về tới cổng. Nó ngồi đó, không đi. Mẹ nói nhà chật, không nuôi. Trời bắt đầu tối.',
    choices: [
      { label: 'Năn nỉ ba mẹ', effects: { happiness: 3 }, flags: ['nuoi_cho_vang'],
        text: 'Ba nói được, nếu tôi tự cho ăn, tự dọn. Tôi đặt tên nó là Vàng. Mấy tháng đầu tôi làm đủ. Sau đó, mẹ làm phần nhiều hơn.' },
      { label: 'Nhờ cô bán tạp hóa nuôi', effects: { happiness: 1 },
        text: 'Cô nhận nuôi để giữ tiệm. Đi học ngang qua, tôi vẫn thấy nó nằm trước cửa. Lúc đầu nó vẫy đuôi với tôi, rồi cũng thôi.' },
      { label: 'Đóng cổng lại', effects: { happiness: -2 },
        text: 'Nó nằm ngoài cổng tới khuya. Sáng ra không thấy nữa. Cả tuần đi học, tôi nhìn mọi con chó vàng dọc đường.' },
    ],
  },

  // ───────────── 9 tuổi ─────────────
  {
    id: 'ls09-lop-dan', age: 9, needs: ['mother'],
    title: 'Lớp đàn cuối tuần',
    text: 'Mẹ cho tôi học đàn sáng chủ nhật, học phí không rẻ. Học được ba tháng, ngón tay tôi đau, tập mãi vẫn vấp. Cũng giờ đó tụi bạn đá banh, đội cứ thiếu người nên lần nào cũng gọi tôi. Tôi muốn xin mẹ nghỉ học đàn.',
    choices: [
      { label: 'Xin mẹ cho nghỉ', effects: { happiness: 2 }, flags: ['bo_dan'],
        text: 'Mẹ đồng ý, không trách. Cây đàn cũ ba mua lại được phủ khăn, đặt ở góc phòng. Thỉnh thoảng mẹ lau bụi cho nó.' },
      { label: 'Cố học tiếp', effects: { intelligence: 2, happiness: -1 }, flags: ['hoc_dan'],
        text: 'Cuối năm tôi đàn được trọn một bài. Mẹ quay video gửi cả họ. Sáng chủ nhật, đội banh vẫn thiếu người, tụi bạn thôi gọi tôi.' },
    ],
  },
  {
    id: 'ls09-dam-gio', age: 9, needs: ['father', 'mother'],
    title: 'Câu hỏi ở đám giỗ',
    text: 'Đám giỗ đông người. Chú họ hỏi tôi thi cuối kỳ được mấy điểm, rồi kể con chú toàn mười. Ba mẹ ngồi cùng mâm. Tôi được bảy điểm Toán.',
    choices: [
      { label: 'Nói thật bảy điểm', effects: { happiness: -1 },
        text: 'Chú cười, gắp cho tôi miếng thịt. Ba đỡ lời rằng tôi học Văn khá. Tối về mẹ nói: “Không cần so với ai.” Giọng mẹ hơi mệt.' },
      { label: 'Nói được chín', effects: { happiness: -2 }, flags: ['noi_doi_dam_gio'],
        text: 'Chú khen. Ba nhìn tôi, rồi nhìn xuống chén. Trên đường về không ai nói gì. Tới cổng nhà, ba hỏi: “Sao phải nói vậy con?”' },
      { label: 'Lảng ra sân chơi', effects: { happiness: 1 },
        text: 'Tôi bưng chén ra sân ngồi với mấy đứa nhỏ. Chú quay sang hỏi ba. Tôi không nghe ba trả lời gì.' },
    ],
  },
  {
    id: 'ls09-ba-goi-nham', age: 9, needs: ['father'],
    title: 'Bà gọi nhầm tên',
    text: 'Bà ngồi ở hiên, gọi tôi: “{tenBa} ơi, ăn cơm chưa con?” Đó là tên ba tôi. Tuần này bà gọi vậy mấy lần. Bà đang cười, như ba vẫn còn nhỏ.',
    choices: [
      { label: 'Nói: “Con là cháu mà bà”', effects: { intelligence: 1, happiness: -1 }, flags: ['ba_lan'],
        text: 'Bà ngơ ngác một lúc, rồi cười gượng: “Ừ, bà lẩm cẩm.” Bà ngồi im cả buổi chiều. Tôi kể với mẹ, mẹ nói bà già rồi.' },
      { label: 'Trả lời như ba: “Con ăn rồi”', effects: { happiness: 2 }, flags: ['ba_lan', 'nghe_chuyen_ba'],
        text: 'Bà kể chuyện ba hồi nhỏ trốn học đi câu cá, bị ông đánh. Chuyện ấy ba chưa kể bao giờ. Tôi ngồi nghe tới khi bà ngủ gật.' },
    ],
  },
  {
    id: 'ls09-dien-thoai-cu', age: 9, needs: ['father'],
    title: 'Chiếc điện thoại cũ của ba',
    text: 'Ba cho tôi chiếc điện thoại cũ để gọi về nhà. Luật là mỗi ngày chơi game một tiếng. Trong lớp, tụi bạn đã lên màn mười, tôi còn ở màn ba. Tôi muốn chơi thêm cho kịp tụi nó.',
    choices: [
      { label: 'Chơi lén sau giờ ngủ', effects: { happiness: 1, health: -2 }, flags: ['choi_len'],
        text: 'Một tuần tôi lên tới màn chín. Sáng nào cũng ngủ gật tiết đầu. Ba thấy ánh đèn dưới chăn, cất máy vào tủ một tháng.' },
      { label: 'Giữ đúng một tiếng', effects: { intelligence: 1, happiness: -1 }, flags: ['giu_luat'],
        text: 'Tụi bạn bàn chuyện màn mới, tôi chỉ ngồi nghe. Cuối năm ba nói tôi giữ lời, cho chơi thêm cuối tuần.' },
    ],
  },

  // ───────────── 10 tuổi ─────────────
  {
    id: 'ls10-heo-dat', age: 10, needs: ['mother'],
    title: 'Đập heo đất',
    text: 'Con heo đất đầy. Đập ra được gần một triệu. Tôi muốn đôi giày đá banh đã ngắm cả năm. Cùng tuần đó, tôi nghe mẹ gọi điện hỏi mượn tiền đóng học cho tôi.',
    choices: [
      { label: 'Mua giày', effects: { happiness: 2 }, flags: ['mua_giay'],
        text: 'Tôi mang giày mới ra sân, cả đội nhìn. Tối đó mẹ vẫn gọi điện mượn tiền. Tôi để đôi giày dưới gầm giường, không khoe với mẹ.' },
      { label: 'Đưa mẹ hết', effects: { happiness: 1, intelligence: 1 }, flags: ['gop_cho_me'],
        text: 'Mẹ không nhận, rồi nhận, rồi khóc. Cuối tháng mẹ mua cho tôi đôi giày rẻ hơn. Tôi đi tới rách đế.' },
      { label: 'Đưa mẹ một nửa', effects: { intelligence: 1 }, money: 450_000, flags: ['gop_cho_me'],
        text: 'Mẹ nhận nửa ấy, nói sẽ trả. Phần còn lại không đủ mua giày. Tôi giữ bốn trăm năm mươi nghìn còn lại trong ví, chờ năm sau.' },
    ],
  },
  {
    id: 'ls10-thi-hsg', age: 10,
    title: 'Đội tuyển hay đội banh',
    text: 'Cô chọn tôi vào đội tuyển Toán của trường, phải ôn mỗi chiều suốt hai tháng. Cũng giờ đó, đội banh của lớp tập cho vòng trong, mà tôi là thủ môn duy nhất. Tôi chỉ chọn được một.',
    choices: [
      { label: 'Đi ôn thi', effects: { intelligence: 3, happiness: -2 }, flags: ['thi_hsg'],
        text: 'Tôi được giải khuyến khích. Đội banh thua ở bán kết, thủ môn dự bị để lọt ba trái. Tụi nó không trách, nhưng không rủ tôi đi ăn chè.' },
      { label: 'Ở lại đội banh', effects: { happiness: 3, health: 1 }, flags: ['doi_banh'],
        text: 'Cô chọn bạn khác. Đội vào chung kết, thua sát nút. Tôi cản được một quả phạt đền. Gặp tôi ở hành lang, cô chỉ gật đầu.' },
    ],
  },
  {
    id: 'ls10-chuyen-nha', age: 10, needs: ['father', 'mother'],
    title: 'Ba mẹ tính chuyển nhà',
    text: 'Ba được chuyển chỗ làm, đường đi xa thêm một tiếng. Ba mẹ tính dọn tới gần đó, nghĩa là tôi phải đổi trường. Tối nay ba hỏi ý tôi trước khi quyết.',
    choices: [
      { label: 'Muốn ở lại', effects: { happiness: 2 }, flags: ['o_lai_nha_cu'],
        text: 'Cả nhà ở lại. Ba dậy từ năm giờ, tối về khi tôi đã học bài xong. Có tối ba ngủ quên trên ghế, chưa kịp thay đồ.' },
      { label: 'Đi cũng được', effects: { happiness: -1, intelligence: 1 }, flags: ['chuyen_nha'],
        text: 'Cả nhà dọn đi trước năm học mới. Trường mới không ai biết tên tôi. Ba về sớm, tối nào cũng ăn cơm cùng cả nhà.' },
    ],
  },
  {
    id: 'ls10-ban-bi-tru', age: 10,
    title: 'Tờ giấy chuyền tay',
    text: 'Trong giờ học, một tờ giấy chuyền tới tay tôi. Trên đó có người vẽ bạn Lan béo phị, kèm mấy chữ chế giễu. Cả dãy bàn đã xem, đang nhìn chờ tôi chuyền tiếp. Lan ngồi bàn đầu, chưa biết gì.',
    choices: [
      { label: 'Chuyền tiếp', effects: { happiness: 1 }, flags: ['chuyen_giay'],
        text: 'Tờ giấy đi hết lớp. Giờ ra chơi, Lan ở lại trong lớp, gục mặt xuống bàn. Không ai hỏi gì. Tôi cũng không.' },
      { label: 'Vò lại, bỏ vào hộc bàn', effects: { happiness: -1, intelligence: 1 }, flags: ['vo_giay'],
        text: 'Mấy đứa phía sau gọi tôi là đồ nhát. Lan không biết có tờ giấy ấy. Cả tuần đó, tôi ngồi ăn trưa một mình.' },
      { label: 'Đưa cho cô', effects: { happiness: -2 }, flags: ['dua_co_giay'],
        text: 'Cô phạt cả dãy bàn. Lan biết chuyện, khóc trong giờ ra chơi. Mấy đứa bị phạt nhìn tôi suốt mấy tuần sau đó.' },
    ],
  },

  // ───────────── Chuỗi: bạn thân Tú ─────────────
  {
    id: 'ls-tu-gap', ages: [4, 6],
    title: 'Đứa nhỏ nhà bên',
    text: 'Nhà bên có gia đình mới dọn tới. Đứa con tên Tú, trạc tuổi tôi, ngồi ở bậc cửa cầm con diều giấy rách một bên. Nó nhìn sang nhà tôi mấy lần. Diều của tôi thì còn lành, đang dựng ở góc nhà.',
    choices: [
      { label: 'Mang diều của mình sang', effects: { happiness: 2 }, flags: ['ban_tu'],
        text: 'Diều của tôi bay được một lúc thì mắc lên ngọn cây. Hai đứa đứng nhìn tới tối, không lấy xuống được. Hôm sau Tú sang gọi tôi từ sớm.' },
      { label: 'Mang băng keo sang dán diều', effects: { intelligence: 1, happiness: 2 }, flags: ['ban_tu'],
        text: 'Hai đứa dán mất cả buổi. Diều bay được nửa vòng rồi cắm đầu xuống đất. Tú vẫn cười. Từ hôm đó chiều nào Tú cũng sang.' },
      { label: 'Đứng sau cổng nhìn', effects: { happiness: -1 }, flags: ['lo_tu'],
        text: 'Tú ngồi thêm một lúc rồi vào nhà. Mấy tuần sau, mẹ hai nhà đã quen nhau. Tôi với Tú vẫn chưa nói câu nào.' },
    ],
  },
  {
    id: 'ls-tu-khac-lop', ages: [6, 8], requires: ['ban_tu'],
    title: 'Tú đứng ở cửa lớp',
    text: 'Tú và tôi vào hai lớp khác nhau. Giờ ra chơi, Tú đứng ở cửa lớp tôi chờ. Mấy bạn mới trong lớp cũng đang rủ tôi chơi nhảy dây.',
    choices: [
      { label: 'Ra với Tú', effects: { happiness: 1 }, flags: ['tu_than'],
        text: 'Hai đứa ra gốc phượng bắn bi như ở nhà. Bạn mới không rủ tôi nữa. Trong lớp, tôi vẫn chưa thân với ai.' },
      { label: 'Ở lại nhảy dây', effects: { happiness: 2 }, flags: ['tu_nhat'],
        text: 'Tú đứng chờ hết giờ ra chơi rồi về lớp. Chiều đó Tú không sang gọi tôi. Hôm sau thì sang, như chưa có gì.' },
      { label: 'Kéo Tú vào chơi chung', effects: { happiness: 1, intelligence: 1 }, flags: ['tu_than'],
        text: 'Tú vào, nhảy vướng dây, bị mấy đứa lớp tôi cười. Tú cười theo, chơi thêm một lượt rồi xin về lớp.' },
    ],
  },
  {
    id: 'ls-tu-chuyen-di', ages: [9, 11], requires: ['ban_tu'], blocks: ['chuyen_nha'],
    title: 'Tờ giấy ghi số điện thoại',
    text: 'Nhà Tú chuyển đi tỉnh khác. Sáng hôm xe tới chở đồ, Tú chạy sang đưa tôi tờ giấy ghi số điện thoại của mẹ nó. Xe đã nổ máy. Tú đứng đó, chờ tôi nói gì đó.',
    choices: [
      { label: 'Hứa tuần nào cũng gọi', effects: { happiness: -1 }, flags: ['tu_xa_dan'],
        text: 'Mấy tuần đầu tôi gọi đều. Rồi hai tuần một lần, rồi chỉ dịp Tết. Năm sau tôi gọi, số ấy đã không còn ai nghe.' },
      { label: 'Chạy vào lấy quà cho Tú', effects: { happiness: 1 }, flags: ['tu_giu_may_bay', 'giay_so_tu'],
        text: 'Tôi dúi vào tay Tú cái mô hình máy bay đang lắp dở. Xe chạy. Tôi chưa kịp nói câu nào. Tờ giấy tôi kẹp vào cuốn sách Toán.' },
      { label: 'Đứng ở cổng vẫy tay', effects: { happiness: -2 }, flags: ['tu_mat_lien_lac'],
        text: 'Tú vẫy qua cửa kính. Tôi vẫy lại. Tờ giấy nằm trong túi quần, bị giặt nát lúc nào không biết.' },
    ],
  },

  // ───────────── Chuỗi: cây xoài ─────────────
  {
    id: 'ls-xoai-lua-dau', ages: [8, 10], requires: ['cay_xoai', 'giau_chuyen'], blocks: ['chuyen_nha'],
    title: 'Lứa xoài đầu',
    text: 'Cây xoài ra lứa trái đầu. Từ vụ nhánh gãy năm nào, ba vẫn tin là do con chó nhà bên, hai nhà chào nhau rất nhạt. Mẹ hái mấy trái, bảo tôi mang sang biếu nhà bên cho đỡ ngại.',
    choices: [
      { label: 'Mang xoài sang, kể thật', effects: { happiness: 1, intelligence: 1 }, flags: ['noi_that_xoai'],
        text: 'Cô nhà bên nghe xong thì cười, nói chuyện cũ rồi. Ba không cười. Ba nói với tôi đúng một câu: “Lần sau nói ngay.” Tối đó ba sang nhà bên ngồi tới khuya.' },
      { label: 'Mang xoài sang, không kể', effects: { happiness: 1 },
        text: 'Cô nhà bên nhận, cảm ơn. Hai nhà chào nhau tươi hơn một chút. Ba vẫn tin là con chó.' },
      { label: 'Không chịu sang', effects: { happiness: -1 },
        text: 'Mẹ đành tự mang sang. Cô nhà bên nhận, rồi hỏi mẹ sao dạo này không thấy tôi qua chơi. Tôi đứng sau cửa, nhìn cái mấu u trên thân cây.' },
    ],
  },
];
