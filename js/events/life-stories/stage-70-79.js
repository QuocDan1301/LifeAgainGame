 
 
export const stage70To79 = [
   
  {
    id: 'ls70-giau-benh', age: 70,
    title: 'Kết quả không tốt',
    text: 'Bác sĩ nói tôi có một khối u, cần điều trị, có thể kéo dài. Tôi chưa kể với ai. Người thân đang lo chuyện riêng của họ. Kể ra thì mọi người sẽ lo, bỏ việc, chạy tới chạy lui vì mình.',
    choices: [
      { label: 'Kể với người thân', effects: { happiness: 1 }, flags: ['ke_benh_70'],
        text: 'Mọi người im lặng, rồi bàn nhau thay phiên đưa tôi đi điều trị. Có người khóc, có người trách sao không nói sớm. Những buổi điều trị không còn phải ngồi một mình.' },
      { label: 'Giấu, tự đi điều trị', effects: { happiness: -2 }, flags: ['giau_benh_70'],
        text: 'Tôi tự đi xe tới bệnh viện mỗi tuần. Về nhà, nói đi thăm bạn. Có hôm mệt quá, nằm cả ngày. Người thân gọi, tôi nói khỏe. Câu nói dối ấy nặng hơn tôi nghĩ.' },
    ],
  },
  {
    id: 'ls70-sinh-nhat-bay-muoi', age: 70,
    title: 'Mừng thọ bảy mươi',
    text: 'Người thân muốn làm tiệc mừng thọ bảy mươi, mời đông đủ họ hàng. Tôi ngại ồn ào, ngại người ta nói chuyện tuổi tác. Tôi chỉ muốn một bữa cơm, có vài người thân thiết.',
    choices: [
      { label: 'Để mọi người làm tiệc', effects: { happiness: 2 },
        text: 'Tiệc đông, ồn, mệt. Nhưng có những người họ hàng tôi chưa gặp mười năm, ôm tôi chúc thọ. Tối về, tôi mệt rã, mà cười một mình.' },
      { label: 'Xin một bữa cơm nhỏ', effects: { happiness: 2 }, flags: ['tho_nho'],
        text: 'Bữa cơm có năm người. Ai cũng kể một chuyện về tôi. Có chuyện tôi đã quên, có chuyện tôi chưa từng biết người khác nhớ. Bảy mươi tuổi, nghe kể về mình như nghe chuyện người khác.' },
    ],
  },
  {
    id: 'ls70-lua-dao-goi-dien', age: 70,
    title: 'Giọng người quen',
    text: 'Có người gọi, giọng giống hệt đứa cháu, nói đang bị tai nạn ở xa, cần gấp mười triệu, dặn đừng nói với ai vì sợ bị la. Tôi nghe tim đập thình thịch. Giọng nó run, khóc.',
    choices: [
      { label: 'Cúp máy, gọi lại số của cháu', effects: { intelligence: 2 }, flags: ['tranh_lua_giong'],
        text: 'Đứa cháu nghe máy, đang ở trường, không có chuyện gì. Tôi ngồi xuống ghế, tay còn run. Rồi gọi cho mấy người bạn già, kể lại chuyện này, dặn họ cẩn thận.' },
      { label: 'Hỏi một câu chỉ cháu biết', effects: { intelligence: 1 },
        text: 'Tôi hỏi: “Con mèo nhà bà tên gì?” Đầu dây bên kia im lặng, rồi cúp máy. Tôi ngồi một lúc lâu, rồi đi pha trà, uống không thấy vị gì.' },
    ],
  },
  {
    id: 'ls70-ban-doi-bay-muoi', age: 70, needs: ['partner'],
    title: 'Bản danh sách cuối đời',
    text: '{tenBanDoi} muốn hai đứa cùng viết ra những điều mong muốn nếu một ngày không còn tự quyết được: có muốn thở máy không, muốn nằm ở nhà hay bệnh viện. Đọc lên thấy lạnh người.',
    choices: [
      { label: 'Cùng viết', effects: { intelligence: 2, happiness: 1 }, flags: ['viet_mong_muon_cuoi'],
        text: 'Hai đứa ngồi viết cả buổi chiều, có lúc dừng lại nắm tay nhau. Viết xong, cất vào phong bì, đưa cho con giữ. {tenBanDoi} nói: “Giờ thì mình chỉ còn việc sống thôi.”' },
      { label: 'Hẹn khi khác', effects: { happiness: -1 },
        text: '{tenBanDoi} gật đầu, cất tờ giấy trắng vào ngăn kéo. Tôi biết mình đang trốn. {tenBanDoi} cũng biết, nhưng không nói.' },
    ],
  },
  {
    id: 'ls70-mot-minh-bay-muoi', age: 70, needs: ['single'],
    title: 'Bữa tối thứ năm',
    text: 'Sống một mình ở tuổi bảy mươi, nhiều tối tôi không nấu, ăn qua loa cho xong. Một nhóm thiện nguyện trong phường tổ chức bữa tối chung cho người già mỗi thứ năm. Tôi ngại đi một mình tới chỗ đông người lạ.',
    choices: [
      { label: 'Đi thử một lần', effects: { happiness: 3, health: 1 }, flags: ['bua_toi_thu_nam'],
        text: 'Tôi ngồi cạnh một bà cụ hay kể chuyện, ăn hết một bát canh. Tuần sau, bà cụ để dành chỗ cho tôi. Thứ năm thành ngày tôi mặc áo đẹp.' },
      { label: 'Ở nhà, nấu một món đàng hoàng', effects: { health: 1 },
        text: 'Tôi nấu nồi canh, ngồi ăn ở bàn chứ không trước tivi. Bữa ăn ngon. Tối thứ năm, căn nhà vẫn chỉ có một tiếng muỗng chạm vào chén.' },
    ],
  },
  {
    id: 'ls70-con-cai-tranh-dat', age: 70, needs: ['children'], childAge: [35, 55],
    title: 'Mảnh đất',
    text: 'Con cái bắt đầu bàn chuyện chia mảnh đất khi tôi còn sống. Một người muốn bán chia tiền, một người muốn giữ làm nhà thờ. Hai bên to tiếng ngay trong bữa cơm. Mọi người quay sang nhìn tôi.',
    choices: [
      { label: 'Quyết ngay, nói rõ ý mình', effects: { intelligence: 1 }, flags: ['quyet_chia_dat'],
        text: 'Tôi nói mảnh đất giữ làm nơi họp mặt, không bán khi tôi còn sống. Một người không vui, ra về sớm. Tôi biết mình vừa trì hoãn một cuộc tranh chấp, chứ chưa giải quyết.' },
      { label: 'Yêu cầu tất cả ngồi lại nói chuyện', effects: { happiness: 1 }, flags: ['hop_gia_dinh'],
        text: 'Ba buổi họp gia đình, có lúc khóc, có lúc cười. Cuối cùng mọi người đồng ý giữ một nửa, bán một nửa. Không ai hài lòng hoàn toàn, nhưng không ai giận ai.' },
    ],
  },

   
  {
    id: 'ls71-ban-gia-ra-di', age: 71,
    title: 'Ghế đá công viên',
    text: 'Người bạn già sáng nào cũng ngồi cùng tôi ở ghế đá công viên vừa mất. Sáng nay tôi ra công viên theo thói quen, chiếc ghế trống. Mấy người khác hỏi tôi có muốn sang ngồi cùng nhóm họ không.',
    choices: [
      { label: 'Sang ngồi cùng nhóm', effects: { happiness: 1 }, flags: ['nhom_ghe_da_moi'],
        text: 'Nhóm mới nói chuyện nhiều, ồn ào. Tôi ít nói, chỉ nghe. Một tuần sau, tôi kể cho họ nghe về người bạn cũ. Họ nghe, gật gù, rồi có người kể về người bạn của mình.' },
      { label: 'Vẫn ngồi chiếc ghế cũ', effects: { happiness: -1 },
        text: 'Sáng nào tôi cũng ngồi ở chiếc ghế ấy, để trống một chỗ bên cạnh. Có một con chim sẻ hay đậu ở chỗ trống. Tôi bắt đầu mang theo một ít gạo.' },
    ],
  },
  {
    id: 'ls71-dien-thoai-moi', age: 71,
    title: 'Chiếc điện thoại cũ',
    text: 'Chiếc điện thoại tôi dùng nhiều năm đã quá cũ, ứng dụng ngân hàng không chạy nữa. Đứa cháu muốn mua cho tôi máy mới, nhưng tôi sợ học lại từ đầu, sợ bấm nhầm, mất tiền.',
    choices: [
      { label: 'Nhận máy mới, học từ từ', effects: { intelligence: 2 }, flags: ['may_moi_tuoi_gia'],
        text: 'Đứa cháu ngồi chỉ cả buổi, viết từng bước ra giấy. Tuần đầu tôi gọi nhầm cho nó mấy lần lúc nửa đêm. Tháng sau, tôi tự chuyển tiền được, gửi nó mười nghìn để thử.' },
      { label: 'Giữ máy cũ, ra ngân hàng làm', effects: { happiness: 1 },
        text: 'Tôi giữ chiếc máy cũ, chỉ để nghe gọi. Việc ngân hàng, tôi đi tận quầy, chờ số. Cô nhân viên quen mặt, thấy tôi là cười, gọi tôi lên trước.' },
    ],
  },
  {
    id: 'ls71-ve-que-lan-cuoi', age: 71,
    title: 'Về làng',
    text: 'Tôi muốn về thăm làng quê nơi ông bà nội từng sống, nơi tôi chưa về từ hồi nhỏ. Đường xa, sức khỏe yếu. Người thân nói đi làm gì, giờ ở đó chẳng còn ai quen.',
    choices: [
      { label: 'Về', effects: { happiness: 3, health: -1 }, flags: ['ve_lang_cu'],
        text: 'Làng đổi khác nhiều. Ngôi nhà cũ không còn, chỉ còn cây giếng. Một cụ già trong làng nhìn tôi rất lâu, rồi gọi đúng tên ba tôi. Tôi ngồi xuống bên giếng, không đứng dậy nổi.' },
      { label: 'Nhờ người chụp ảnh gửi về', effects: { happiness: 1 },
        text: 'Đứa cháu đi công tác ngang qua, chụp mấy tấm gửi về. Tôi phóng to từng tấm, tìm cây giếng, tìm con đường đất. Tìm thấy cây giếng. Con đường đã thành đường bê tông.' },
    ],
  },
  {
    id: 'ls71-ban-doi-cham-nhau', age: 71, needs: ['partner'],
    title: 'Ai chăm ai',
    text: 'Sức khỏe hai đứa đều yếu. Hôm nay {tenBanDoi} ngã trong bếp, tôi không đỡ nổi, phải gọi hàng xóm. Con cái đề nghị thuê người giúp việc ở cùng. {tenBanDoi} không muốn có người lạ trong nhà.',
    choices: [
      { label: 'Thuê người ở cùng', effects: { health: 2, happiness: -1 }, flags: ['thue_nguoi_o_cung'],
        text: 'Người giúp việc chu đáo, ít nói. {tenBanDoi} khó chịu tháng đầu, rồi quen, còn dạy cô ấy nấu món của nhà. Hai đứa có thời gian ngồi với nhau, không phải lo cơm nước.' },
      { label: 'Lắp thêm tay vịn, tự lo', effects: { happiness: 1 },
        text: 'Đứa cháu lắp tay vịn khắp nhà, nút báo động bên giường. Hai đứa đi chậm, đỡ nhau. Có hôm cả hai cùng ngồi bệt dưới sàn, cười, chờ hàng xóm tới.' },
    ],
  },
  {
    id: 'ls71-mot-minh-nhan-than', age: 71, needs: ['single'],
    title: 'Người họ hàng xa',
    text: 'Một người họ hàng xa, cũng sống một mình, đề nghị hai người về ở chung một nhà cho có nhau lúc tuổi già. Tôi không thân người ấy lắm, chỉ gặp nhau ở đám giỗ. Người ấy nói thẳng: “Mình già rồi, cần có người.”',
    choices: [
      { label: 'Thử ở chung', effects: { happiness: 2 }, flags: ['o_chung_ho_hang'],
        text: 'Tháng đầu hai người còn khách sáo. Tháng thứ ba bắt đầu cãi nhau chuyện bật quạt. Tháng thứ sáu, tối nào cũng ngồi xem tivi chung, người này ngủ gật trên vai người kia.' },
      { label: 'Ở gần, hẹn qua lại', effects: { happiness: 1 },
        text: 'Hai người ở cách nhau một con hẻm. Chiều nào cũng có người sang uống trà. Có hôm người ấy không sang, tôi mang ấm trà qua gõ cửa.' },
    ],
  },
  {
    id: 'ls71-chau-hoi-tien', age: 71, needs: ['children'], childAge: [36, 56],
    title: 'Đứa cháu cần tiền',
    text: 'Đứa cháu nhắn riêng cho tôi, xin tiền trả nợ, dặn đừng nói với ba mẹ nó. Nó nói lỡ vay qua ứng dụng, lãi chồng lãi. Tôi có một ít tiền để dành cho những ngày ốm đau.',
    choices: [
      { label: 'Cho tiền, giữ bí mật', effects: { happiness: -1 }, money: -20000000, flags: ['giu_bi_mat_chau'],
        text: 'Đứa cháu trả được nợ, cảm ơn rối rít. Mấy tháng sau nó lại nhắn, lần này ít hơn. Tôi bắt đầu thấy mình đang giúp nó trốn một chuyện lẽ ra phải đối mặt.' },
      { label: 'Cho tiền, nhưng bảo cháu tự nói với ba mẹ', effects: { intelligence: 1 }, money: -20000000, flags: ['day_chau_noi_that'],
        text: 'Đứa cháu im lặng mấy ngày, rồi tự kể với ba mẹ nó. Ba mẹ nó la một trận, rồi cùng nó tính cách trả nợ. Nó nhắn cho tôi: “Nói ra nhẹ hơn con tưởng.”' },
    ],
  },

   
  {
    id: 'ls72-giay-bao-tu-vong', age: 72,
    title: 'Lá thư từ người đã khuất',
    text: 'Con của một người bạn cũ gửi tới một lá thư. Người bạn đã mất, để lại lá thư dặn gửi cho tôi. Trong thư, bạn xin lỗi về một chuyện cũ, chuyện tôi đã giận bạn suốt hai mươi năm.',
    choices: [
      { label: 'Viết thư trả lời, đốt ở mộ bạn', effects: { happiness: 2 }, flags: ['tha_thu_ban_cu'],
        text: 'Tôi viết một lá thư dài, nói tôi cũng có lỗi. Đốt lá thư ở mộ bạn, khói bay thẳng lên. Con của bạn đứng bên cạnh, khóc. Tôi thấy nhẹ, như vừa đặt xuống một gánh nặng.' },
      { label: 'Cất lá thư đi', effects: { happiness: -1 },
        text: 'Tôi cất lá thư vào hộp. Hai mươi năm giận, giờ không còn ai để giận. Đêm đó tôi không ngủ được, nghĩ tới những lần mình có thể đã gọi điện.' },
    ],
  },
  {
    id: 'ls72-thuoc-qua-dat', age: 72,
    title: 'Thuốc ngoài danh mục',
    text: 'Bác sĩ đề nghị một loại thuốc mới, hiệu quả hơn, nhưng không có trong danh mục bảo hiểm, mỗi tháng tốn gần hết lương hưu. Thuốc cũ thì rẻ, nhưng tác dụng chậm, nhiều tác dụng phụ.',
    choices: [
      { label: 'Dùng thuốc mới', effects: { health: 3, happiness: -1 }, flags: ['thuoc_dat'],
        text: 'Sức khỏe khá lên rõ. Nhưng mỗi tháng tôi phải cắt bớt nhiều thứ: bớt đi chợ, bớt quà cho cháu. Có hôm nhìn hộp thuốc, tôi tính ra mỗi viên bằng mấy bữa cơm.' },
      { label: 'Giữ thuốc cũ', effects: { health: -1, happiness: 1 },
        text: 'Thuốc cũ vẫn giữ được bệnh. Có những ngày mệt hơn. Tôi vẫn đủ tiền đi chợ, vẫn mua được quà cho cháu dịp sinh nhật.' },
    ],
  },
  {
    id: 'ls72-hang-xom-tre-giup', age: 72,
    title: 'Người hàng xóm trẻ',
    text: 'Cô gái trẻ mới dọn tới nhà bên hay sang hỏi thăm, giúp tôi mua đồ, sửa điện. Hôm nay cô ngập ngừng hỏi mượn tiền, nói mẹ cô ốm ở quê. Số tiền không lớn, nhưng tôi không biết nhiều về cô.',
    choices: [
      { label: 'Cho mượn', effects: { happiness: 1 }, flags: ['cho_hang_xom_tre_muon'],
        text: 'Cô cảm ơn, về quê một tuần. Quay lại, cô trả tôi một nửa, kèm túi trái cây quê. Phần còn lại cô trả dần trong ba tháng. Cô vẫn sang giúp tôi như trước, có khi còn nhiều hơn.' },
      { label: 'Từ chối khéo', effects: { happiness: -1 },
        text: 'Cô nói không sao, rồi ít sang hơn. Một tháng sau tôi nghe nói mẹ cô ốm nặng thật. Tôi mang sang một ít tiền, nói là quà thăm bệnh. Cô nhận, mắt đỏ.' },
    ],
  },
  {
    id: 'ls72-ban-doi-lan', age: 72, needs: ['partner'],
    title: 'Người lạ trong nhà',
    text: 'Có buổi sáng {tenBanDoi} thức dậy, nhìn tôi rất lạ, hỏi tôi là ai, sao ở trong nhà này. Mấy phút sau thì nhớ lại, xin lỗi. Bác sĩ nói bệnh sẽ nặng dần. Tôi không biết nên kể với ai.',
    choices: [
      { label: 'Kể với người thân, xin giúp đỡ', effects: { happiness: 1 }, flags: ['ke_ban_doi_lan'],
        text: 'Người thân thay phiên về. Có người đọc sách về bệnh, dạy tôi cách nói chuyện khi {tenBanDoi} lẫn. Tôi không còn phải một mình đối diện với ánh mắt lạ ấy mỗi sáng.' },
      { label: 'Tự chăm, không muốn làm phiền', effects: { happiness: -2, health: -1 }, flags: ['tu_cham_ban_doi_lan'],
        text: 'Tôi tự lo hết. Mỗi sáng tôi tự giới thiệu lại mình, nói tên, nói ngày cưới. Có hôm {tenBanDoi} cười: “Vậy là mình cưới nhau à? May quá.”' },
    ],
  },
  {
    id: 'ls72-mot-minh-nhat-ky', age: 72, needs: ['single'],
    title: 'Ai sẽ đọc',
    text: 'Tôi có mấy chục cuốn nhật ký viết suốt đời. Sống một mình, tôi không biết sau này ai sẽ đọc, hay chúng sẽ bị bỏ vào bao rác. Có những trang viết về người khác, không nên để ai đọc.',
    choices: [
      { label: 'Đọc lại, đốt những trang riêng tư', effects: { happiness: 2 }, flags: ['doc_lai_nhat_ky'],
        text: 'Tôi đọc lại từ đầu, mất nửa năm. Có những trang đốt đi, có những trang đánh dấu để lại. Cuối cùng còn ba cuốn, tôi gửi cho đứa cháu thích đọc sách.' },
      { label: 'Gửi cho thư viện địa phương', effects: { intelligence: 1 },
        text: 'Thư viện nhận, hứa năm mươi năm sau mới mở cho người đọc. Tôi ký giấy, thấy như vừa gửi đời mình đi một chuyến thật xa.' },
    ],
  },
  {
    id: 'ls72-con-xin-o-chung', age: 72, needs: ['children'], childAge: [36, 56],
    title: 'Con xin về ở cùng',
    text: '{tenCon} gặp khó khăn, xin cả nhà dọn về ở cùng tôi một thời gian. Nhà tôi đủ rộng, nhưng tôi đã quen yên tĩnh. Nhà con có ba đứa nhỏ, ồn ào, bừa bộn.',
    choices: [
      { label: 'Đồng ý', effects: { happiness: 2, health: -1 }, flags: ['con_ve_o_cung'],
        text: 'Nhà ồn từ sáng tới tối. Tụi nhỏ chạy khắp nơi, làm vỡ mấy thứ. Nhưng tối nào cũng có người hỏi tôi ăn cơm chưa. Một năm sau con dọn đi, nhà im tới mức tôi không quen.' },
      { label: 'Cho mượn tiền thuê nhà gần đây', effects: { intelligence: 1 },
        text: 'Con thuê nhà cách tôi hai con phố. Tụi nhỏ chạy sang chơi mỗi chiều, tối về nhà mình. Tôi giữ được sự yên tĩnh, và vẫn nghe được tiếng cười trẻ con.' },
    ],
  },

   
  {
    id: 'ls73-ngoi-xe-lan', age: 73,
    title: 'Chiếc xe lăn',
    text: 'Chân tôi yếu, đi xa vài trăm mét là mỏi. Người thân mua một chiếc xe lăn để đưa tôi đi dạo. Tôi thấy ngồi xe lăn là chịu thua. Không ngồi thì gần như chỉ quanh quẩn trong nhà.',
    choices: [
      { label: 'Ngồi xe lăn đi dạo', effects: { happiness: 2 }, flags: ['xe_lan_di_dao'],
        text: 'Lần đầu ra công viên bằng xe lăn, tôi thấy hàng cây, hồ nước, tụi trẻ con chơi đùa, những thứ đã lâu không thấy. Người đẩy xe dừng lại để tôi ngắm một bông hoa.' },
      { label: 'Tập đi thêm, chưa dùng', effects: { health: 1, happiness: -1 },
        text: 'Tôi tập đi mỗi ngày trong sân, vịn tường. Đi được xa hơn một chút. Chiếc xe lăn gấp gọn ở góc nhà, phủ một tấm khăn.' },
    ],
  },
  {
    id: 'ls73-tin-gia', age: 73,
    title: 'Tin đồn trong nhóm',
    text: 'Nhóm chat của câu lạc bộ người cao tuổi đang truyền tay một tin: một loại thực phẩm gây ung thư, ai cũng hoang mang. Tôi đọc kỹ, thấy là tin giả. Người chia sẻ là bà trưởng nhóm, người tôi rất quý.',
    choices: [
      { label: 'Nói riêng với bà trưởng nhóm', effects: { intelligence: 1 }, flags: ['noi_rieng_tin_gia'],
        text: 'Bà đọc thông tin tôi gửi, gật gù, rồi tự đăng đính chính trong nhóm, cảm ơn tôi. Từ đó, bà hay hỏi tôi trước khi chia sẻ tin gì.' },
      { label: 'Im lặng', effects: { happiness: -1 },
        text: 'Mọi người hoang mang cả tuần, có người bỏ ăn món ấy. Rồi tin khác tới, mọi người quên. Tôi đọc lại tin cũ, thấy mình lẽ ra nên nói.' },
    ],
  },
  {
    id: 'ls73-viet-thu-tay', age: 73,
    title: 'Những lá thư tay',
    text: 'Tôi muốn viết thư tay cho những người quan trọng trong đời, nói những điều chưa từng nói. Tay tôi run, chữ xấu, viết một lá mất cả buổi. Danh sách có hơn mười người.',
    choices: [
      { label: 'Viết mỗi tuần một lá', effects: { happiness: 3 }, flags: ['thu_tay_cuoi_doi'],
        text: 'Ba tháng, mười hai lá thư. Có người gọi lại khóc, có người viết thư trả lời. Một người đã mất trước khi thư tới, gia đình họ đọc lá thư ở đám giỗ.' },
      { label: 'Nhờ người viết hộ, mình đọc', effects: { happiness: 1 },
        text: 'Đứa cháu ngồi chép lại những gì tôi nói. Thư đẹp hơn, nhưng không có nét chữ run của tôi. Người nhận vẫn vui, nhưng tôi thấy thiếu một điều gì đó.' },
    ],
  },
  {
    id: 'ls73-ban-doi-di-truoc', age: 73, needs: ['partner'],
    title: 'Câu hỏi lúc nửa đêm',
    text: 'Nửa đêm, {tenBanDoi} thức dậy, hỏi tôi: “Nếu mình đi trước, mình có buồn lâu không?” Giọng {tenBanDoi} bình thản. Bác sĩ vừa nói sức khỏe {tenBanDoi} yếu đi nhiều.',
    choices: [
      { label: 'Trả lời thật lòng', effects: { happiness: 1 }, flags: ['tra_loi_dem_khuya'],
        text: 'Tôi nói sẽ buồn, buồn rất lâu. {tenBanDoi} gật đầu, nói vậy là tốt, vì có nghĩa là đã thương nhau nhiều. Hai đứa nắm tay nhau tới sáng.' },
      { label: 'Nói: “Đừng nghĩ chuyện đó”', effects: { happiness: -1 },
        text: '{tenBanDoi} im lặng, quay vào trong. Tôi nằm thức, nghe tiếng thở của {tenBanDoi}. Câu hỏi ấy tôi mang theo rất lâu, chưa trả lời.' },
    ],
  },
  {
    id: 'ls73-goa-buoi-sang', age: 73, needs: ['widowed'],
    title: 'Chiếc ghế bên bàn ăn',
    text: 'Người bạn đời đã mất. Mỗi sáng tôi vẫn bày hai cái chén trên bàn ăn theo thói quen, rồi cất lại một cái. Người thân khuyên dọn bớt đồ của người ấy cho đỡ buồn. Tủ quần áo vẫn để nguyên.',
    choices: [
      { label: 'Dọn dần, mỗi tuần một ngăn', effects: { happiness: 1 }, flags: ['don_do_nguoi_mat'],
        text: 'Mỗi tuần tôi dọn một ngăn, gấp từng cái áo, cho đi những thứ không dùng. Giữ lại một chiếc áo len, mặc vào những ngày lạnh. Tủ trống dần, lòng cũng bớt chật.' },
      { label: 'Để nguyên như cũ', effects: { happiness: -1 },
        text: 'Tôi để mọi thứ như cũ. Có đêm mở tủ, ngửi mùi áo, rồi đóng lại. Sáng nào vẫn bày hai cái chén, rồi cất một cái.' },
    ],
  },
  {
    id: 'ls73-mot-minh-lam-di-chuc', age: 73, needs: ['neverMarried'],
    title: 'Người thừa kế',
    text: 'Không vợ không chồng, không con. Tôi phải chọn người thừa kế căn nhà: đứa cháu ruột ít khi về thăm, hay người hàng xóm đã chăm sóc tôi mười năm nay. Luật sư nói tùy tôi quyết.',
    choices: [
      { label: 'Chia đôi cho hai người', effects: { happiness: 1 }, flags: ['chia_doi_thua_ke'],
        text: 'Tôi viết rõ lý do trong di chúc. Kể với hai người. Đứa cháu im lặng, rồi bắt đầu về thăm thường hơn. Người hàng xóm nói không cần, nhưng tôi không sửa.' },
      { label: 'Để cho người đã chăm mình', effects: { happiness: 2 }, flags: ['de_lai_cho_hang_xom'],
        text: 'Người hàng xóm khóc, nói không nhận. Đứa cháu biết chuyện, giận một thời gian, rồi tới gặp tôi, nói hiểu. Tôi nói với nó: “Không phải vì máu mủ, mà vì những bữa cơm.”' },
    ],
  },
  {
    id: 'ls73-chau-dua-nguoi-yeu', age: 73, needs: ['children'], childAge: [38, 58],
    title: 'Cháu ra mắt',
    text: 'Đứa cháu dẫn người yêu về ra mắt tôi trước cả ba mẹ nó, vì sợ ba mẹ phản đối. Người yêu của nó khác tôn giáo, khác vùng miền. Đứa cháu nhìn tôi, chờ một lời ủng hộ.',
    choices: [
      { label: 'Ủng hộ, hứa nói giúp', effects: { happiness: 2 }, flags: ['ung_ho_chau_yeu'],
        text: 'Tôi gọi {tenCon} sang, nói chuyện rất lâu. Con không vui, nhưng nghe. Một năm sau, đám cưới đứa cháu, tôi ngồi hàng ghế đầu, cạnh cả hai bên gia đình.' },
      { label: 'Khuyên cháu tự nói với ba mẹ', effects: { intelligence: 1 },
        text: 'Đứa cháu hơi thất vọng, nhưng nghe lời. Nó tự nói, bị phản đối mấy tháng. Rồi ba mẹ nó cũng gật đầu. Đám cưới, nó nói với tôi: “Hồi đó nói đúng thật.”' },
    ],
  },

   
  {
    id: 'ls74-ban-may-tinh', age: 74,
    title: 'Câu lạc bộ thơ',
    text: 'Câu lạc bộ thơ người cao tuổi mời tôi tham gia, mỗi tuần đọc thơ một buổi. Tôi chưa từng làm thơ, chỉ thích đọc. Người ta nói ai cũng phải đọc một bài tự làm vào buổi đầu.',
    choices: [
      { label: 'Tham gia, tập làm thơ', effects: { happiness: 3, intelligence: 1 }, flags: ['clb_tho'],
        text: 'Bài thơ đầu tiên tôi viết về cây xoài, vần chưa chuẩn, ý thì lộn xộn. Cả câu lạc bộ vỗ tay. Một ông cụ nói bài thơ làm ông nhớ cái sân nhà mình.' },
      { label: 'Chỉ đi nghe', effects: { happiness: 1 },
        text: 'Tôi ngồi cuối phòng, nghe người khác đọc. Có những bài làm tôi khóc. Sáu tháng sau, tôi đứng dậy đọc bài đầu tiên của mình, giọng run.' },
    ],
  },
  {
    id: 'ls74-con-meo-cuoi', age: 74,
    title: 'Con vật cuối cùng',
    text: 'Đứa cháu muốn tặng tôi một con chó con để có bạn. Tôi biết mình có thể không sống lâu hơn con chó. Nếu tôi đi trước, ai sẽ nuôi nó?',
    choices: [
      { label: 'Nhận một con chó già', effects: { happiness: 3 }, flags: ['nuoi_cho_gia_cuoi'],
        text: 'Tôi đề nghị nhận một con chó già ở trạm cứu hộ, tuổi già như tôi. Hai đứa đi chậm như nhau. Hàng xóm cười, nói tôi với nó già như nhau.' },
      { label: 'Nhận chó con, dặn cháu nhận lại sau', effects: { happiness: 2 },
        text: 'Con chó con chạy khắp nhà, làm tôi cười. Tôi viết một tờ giấy dặn đứa cháu, kẹp vào sổ: nếu tôi không còn, nó nhớ đón con chó về.' },
    ],
  },
  {
    id: 'ls74-nhan-hoi-ung-ho', age: 74,
    title: 'Quỹ khuyến học',
    text: 'Hội khuyến học địa phương xin tôi đứng tên một suất học bổng hằng năm, vì tôi từng dạy kèm nhiều đứa trẻ trong khu. Tôi có thể dùng tiền dành dụm. Nhưng tiền ấy là để lo khi ốm đau.',
    choices: [
      { label: 'Lập suất học bổng', effects: { happiness: 3 }, money: -30000000, flags: ['hoc_bong_ten_minh'],
        text: 'Suất học bổng đầu tiên trao cho một đứa trẻ mồ côi. Trong lễ trao, nó cúi chào tôi rất thấp. Tôi nhớ có một cậu bé vùng cao năm nào cũng từng chào như vậy.' },
      { label: 'Góp một lần, không đứng tên', effects: { happiness: 1 }, money: -10000000,
        text: 'Tôi gửi một khoản, nhờ hội trao cho ai cần. Không đứng tên. Hội gửi thư cảm ơn, tôi kẹp vào cuốn sổ cùng những lá thư khác.' },
    ],
  },
  {
    id: 'ls74-ban-doi-hoi-ky', age: 74, needs: ['partner'],
    title: 'Chuyện hai người',
    text: '{tenBanDoi} muốn hai đứa cùng kể lại chuyện đời mình cho đứa cháu ghi âm, để sau này người thân nghe. Có những chuyện hai đứa nhớ khác nhau, có những chuyện một người chưa từng nói với người kia.',
    choices: [
      { label: 'Kể hết, kể cả chuyện chưa nói', effects: { happiness: 2, intelligence: 1 }, flags: ['ghi_am_doi_hai_nguoi'],
        text: 'Đứa cháu ghi âm mười buổi. Có buổi {tenBanDoi} nghe tôi kể một chuyện cũ, quay sang hỏi: “Sao giờ mới nói?” Rồi nắm tay tôi, nói tiếp.' },
      { label: 'Chỉ kể những chuyện cả hai đều nhớ', effects: { happiness: 2 },
        text: 'Hai đứa kể chuyện ngày quen nhau, ngày cưới, những năm khó khăn. Kể tới đâu cãi tới đó, đứa cháu cười suốt. Băng ghi âm đầy tiếng cười.' },
    ],
  },
  {
    id: 'ls74-mot-minh-buon', age: 74, needs: ['single'],
    title: 'Những ngày dài',
    text: 'Dạo này tôi buồn không rõ lý do, ăn không ngon, ngủ không yên. Một người bạn nói có thể là trầm cảm tuổi già, nên đi khám. Tôi thấy ngại, nghĩ đó là bệnh của người trẻ.',
    choices: [
      { label: 'Đi khám', effects: { health: 2, happiness: 2 }, money: -2000000, flags: ['kham_tram_cam'],
        text: 'Bác sĩ nói chuyện với tôi một tiếng, kê thuốc, hẹn tái khám. Ba tháng sau, buổi sáng tôi dậy và muốn ra ngoài. Tôi gọi cho người bạn, cảm ơn.' },
      { label: 'Tự cố gắng ra ngoài nhiều hơn', effects: { happiness: 1 },
        text: 'Mỗi ngày tôi ép mình ra khỏi nhà một lần. Có ngày đỡ, có ngày không. Người bạn vẫn gọi mỗi tối, hỏi hôm nay thế nào.' },
    ],
  },
  {
    id: 'ls74-con-chuyen-xa', age: 74, needs: ['children'], childAge: [38, 58],
    title: 'Con chuyển đi xa',
    text: '{tenCon} được điều đi làm ở thành phố khác, cả nhà phải chuyển theo. Con hỏi tôi có muốn đi cùng không. Đi thì xa hết bạn bè, hàng xóm, nhưng có con cháu bên cạnh.',
    choices: [
      { label: 'Đi cùng con', effects: { happiness: 1 }, flags: ['di_theo_con'],
        text: 'Thành phố mới lạ, không quen ai. Tôi trông cháu, nấu cơm. Một năm sau, tôi quen được mấy người già ở công viên gần nhà. Họ gọi tôi là “người mới”.' },
      { label: 'Ở lại', effects: { happiness: 1 },
        text: 'Con đi, gọi video mỗi tối. Tôi ở lại với hàng xóm cũ, bạn bè cũ. Tết con về, nhà đông như xưa. Ra Giêng, nhà lại vắng.' },
    ],
  },

   
  {
    id: 'ls75-cay-gay', age: 75,
    title: 'Cây gậy trong góc nhà',
    text: 'Đi chợ, tôi vấp ở bậc thềm, may có người đỡ kịp. Người bán hàng quen khuyên tôi nên chống gậy. Tôi có sẵn một cây gậy người ta tặng từ năm ngoái, cất trong góc nhà, chưa dùng lần nào vì thấy mình chưa già tới mức ấy.',
    choices: [
      { label: 'Bắt đầu chống gậy', effects: { health: 1, happiness: -1 },
        text: 'Mấy hôm đầu tôi cầm gậy như cầm vật lạ, đi đâu cũng thấy người ta nhìn. Tháng sau thì quen. Tôi đi chợ xa hơn, không còn phải dò từng bậc thềm.' },
      { label: 'Để gậy trong góc', effects: { happiness: 1, health: -1 },
        text: 'Tôi đi chậm lại, bám vào tường mỗi khi xuống bậc. Người quen khen tôi còn nhanh nhẹn. Có hôm trời mưa, tôi đứng ở đầu đường rất lâu mới dám bước.' },
    ],
  },
  {
    id: 'ls75-bua-com-cuoi-tuan', age: 75,
    title: 'Bếp ăn trong khu',
    text: 'Tay tôi run, nấu ăn ngày càng khó, đã mấy lần quên tắt bếp. Có dịch vụ giao cơm cho người già mỗi ngày, rẻ, đủ chất. Nhưng tôi thích tự nấu, đó là việc cuối cùng tôi còn làm được trọn vẹn.',
    choices: [
      { label: 'Đặt cơm giao, nấu cuối tuần', effects: { health: 2 }, flags: ['com_giao'],
        text: 'Ngày thường ăn cơm giao, cuối tuần tự nấu một món. Món cuối tuần nấu chậm, cẩn thận, ăn rất ngon. Không còn lần nào quên tắt bếp.' },
      { label: 'Tự nấu, lắp bếp tự ngắt', effects: { happiness: 2 },
        text: 'Đứa cháu lắp bếp điện có hẹn giờ tự ngắt. Tôi vẫn nấu mỗi ngày, chậm hơn. Có hôm nồi canh mặn quá, tôi thêm nước, ăn tiếp.' },
    ],
  },
  {
    id: 'ls75-ban-cu-goi', age: 75,
    title: 'Người bạn cuối cùng',
    text: 'Trong nhóm bạn thân năm người thời trẻ, giờ chỉ còn tôi và một người. Người ấy gọi, nói sắp vào viện dưỡng lão ở tỉnh khác, chắc khó gặp lại. Muốn gặp tôi một lần.',
    choices: [
      { label: 'Đi gặp bạn', effects: { happiness: 3, health: -1 }, flags: ['gap_ban_cuoi'],
        text: 'Hai đứa ngồi ở quán cà phê cũ, nay đã đổi chủ. Kể lại chuyện ba người đã đi. Lúc chia tay, bạn nói: “Còn mày là còn tao.” Tôi ôm bạn rất lâu.' },
      { label: 'Gọi video, hẹn sau', effects: { happiness: 1 },
        text: 'Hai đứa nói chuyện một tiếng qua màn hình. Tôi hứa sẽ tới thăm. Ba tháng sau tôi chưa đi được. Bạn gửi tin nhắn: “Không sao, tao vẫn ở đây.”' },
    ],
  },
  {
    id: 'ls75-chon-noi-nghi', age: 75,
    title: 'Nơi nằm sau cùng',
    text: 'Tôi muốn tự chọn nơi mình sẽ nằm sau này. Ở nghĩa trang quê gần ông bà, hay hỏa táng rồi để ở chùa gần nhà người thân cho tiện thăm viếng. Người thân không ai muốn nói chuyện này.',
    choices: [
      { label: 'Chọn về quê, gần ông bà', effects: { happiness: 1 }, flags: ['chon_mo_que'],
        text: 'Tôi về quê chọn chỗ, cạnh mộ ông bà. Đứng ở đó, nghe gió qua rặng tre, tôi thấy yên. Tôi ghi rõ ý mình vào giấy, giao cho người thân.' },
      { label: 'Chọn gần người thân', effects: { happiness: 1 }, flags: ['chon_gan_con_chau'],
        text: 'Tôi chọn một ngôi chùa gần nhà, nói với sư thầy. Sư thầy dẫn tôi đi một vòng, chỉ chỗ có cây bồ đề. Tôi ngồi ở gốc cây một lúc, thấy dễ chịu.' },
    ],
  },
  {
    id: 'ls75-ban-doi-tham-mo', age: 75, needs: ['married'],
    title: 'Lễ kỷ niệm {soNamKetHon} năm',
    text: '{soNamKetHon} năm kể từ ngày cưới. {tenBanDoi} muốn chụp một bộ ảnh cưới mới, mặc áo dài, áo vest, như lần chụp ảnh cưới ngày xưa. Tôi thấy già rồi, chụp ảnh cưới thì ngượng.',
    choices: [
      { label: 'Chụp', effects: { happiness: 4 }, money: -5000000, flags: ['anh_cuoi_nam_muoi_nam'],
        text: 'Thợ ảnh kiên nhẫn, chờ hai đứa đứng dậy, ngồi xuống. {tenBanDoi} cười suốt buổi. Tấm ảnh đẹp nhất là tấm hai đứa đang cười vì bị vấp vào nhau.' },
      { label: 'Chụp một tấm ở nhà', effects: { happiness: 2 },
        text: 'Đứa cháu chụp cho hai đứa một tấm ở hiên nhà, ánh chiều. Không áo dài, không vest. Tấm ảnh được phóng to, treo cạnh tấm ảnh cưới {soNamKetHon} năm trước.' },
    ],
  },
  {
    id: 'ls75-goa-tet', age: 75, needs: ['widowed'],
    title: 'Tết đầu tiên một mình',
    text: 'Tết đầu tiên sau khi người bạn đời mất. Người thân mời về nhà chúng ăn Tết. Tôi muốn ở nhà mình, thắp nhang cho người ấy đêm giao thừa, như hai đứa vẫn làm mấy chục năm qua.',
    choices: [
      { label: 'Ở nhà, mời người thân về', effects: { happiness: 2 }, flags: ['tet_goa_o_nha'],
        text: 'Người thân về đông đủ, nhà ồn ào như xưa. Đêm giao thừa, tôi thắp nhang, nói chuyện với người ấy như mọi năm. Đứa cháu nhỏ đứng cạnh, cũng chắp tay.' },
      { label: 'Về nhà con ăn Tết', effects: { happiness: 1 },
        text: 'Tôi về nhà con, được chăm sóc chu đáo. Đêm giao thừa, tôi ra ban công, nhìn về hướng nhà mình. Đứa cháu mang ra cho tôi một nén nhang, không hỏi gì.' },
    ],
  },
  {
    id: 'ls75-mot-minh-chuyen-cu', age: 75, needs: ['neverMarried'],
    title: 'Người năm ấy',
    text: 'Tôi nhận tin người mình từng yêu thời trẻ, người mà tôi đã không đủ can đảm để giữ, vừa mất. Gia đình người ấy gửi lời mời dự đám tang, vì người ấy dặn lại phải báo cho tôi.',
    choices: [
      { label: 'Đi dự', effects: { happiness: 1, health: -1 }, flags: ['tien_nguoi_xua'],
        text: 'Tôi đứng ở cuối hàng người đưa tiễn. Con gái người ấy đưa tôi một cuốn sổ nhỏ, nói mẹ dặn. Trong sổ có một tấm ảnh hai đứa chụp năm hai mươi tuổi.' },
      { label: 'Gửi hoa, ở nhà', effects: { happiness: -1 },
        text: 'Tôi gửi một bó hoa trắng, không ghi tên. Đêm đó tôi lấy ra lá thư cuối cùng người ấy gửi năm mươi năm trước. Lá thư vẫn còn nguyên nếp gấp.' },
    ],
  },
  {
    id: 'ls75-con-nghi-huu', age: 75, needs: ['children'], childAge: [42, 60],
    title: 'Con cũng già',
    text: '{tenCon} cũng đã {tuoiCon} tuổi, tóc bạc, hay than đau lưng. Hôm nay con về thăm, ngồi xoa bóp chân cho tôi, rồi nói: “Con mệt quá.” Tôi nhìn con, thấy con già hơn tôi tưởng.',
    choices: [
      { label: 'Kéo con nằm xuống, xoa lưng cho con', effects: { happiness: 3 }, flags: ['xoa_lung_con'],
        text: 'Con nằm xuống giường tôi, tôi xoa lưng cho con bằng đôi tay run run. Được một lúc, con ngủ thiếp đi, thở đều như hồi còn bé. Tôi ngồi canh con ngủ.' },
      { label: 'Hỏi con chuyện gì', effects: { happiness: 1 },
        text: 'Con kể chuyện công việc, chuyện con cái, chuyện sức khỏe. Tôi nghe hết, không khuyên gì. Lúc về, con nói: “Nói ra với ba mẹ là nhẹ rồi.”' },
    ],
  },

   
  {
    id: 'ls76-quen-duong-ve', age: 76,
    title: 'Con đường quen',
    text: 'Đi bộ về nhà trên con đường đã đi ba mươi năm, tôi bỗng không nhớ rẽ trái hay rẽ phải. Đứng ở góc đường mười phút, rồi nhớ ra. Không ai biết chuyện này.',
    choices: [
      { label: 'Kể với người thân, đi khám', effects: { health: 1, happiness: -1 }, flags: ['kham_tri_nho'],
        text: 'Bác sĩ nói trí nhớ bắt đầu suy giảm, cho thuốc, dặn tập luyện. Người thân cài định vị trên điện thoại tôi. Tôi đi đâu, họ cũng biết. Hơi phiền, nhưng yên tâm.' },
      { label: 'Giữ kín, ghi địa chỉ vào túi', effects: { happiness: -1 },
        text: 'Tôi viết địa chỉ nhà, số điện thoại người thân vào một tờ giấy, để trong túi áo. Mỗi lần ra đường, tôi sờ tay vào túi, kiểm tra tờ giấy còn đó không.' },
    ],
  },
  {
    id: 'ls76-nhung-mon-qua', age: 76,
    title: 'Tặng đồ khi còn sống',
    text: 'Tôi muốn tặng những món đồ quý cho người mình thương khi còn sống, để được thấy họ dùng. Nhưng mỗi món đồ là một kỷ niệm. Cho đi rồi, nhà sẽ trống.',
    choices: [
      { label: 'Tặng dần, mỗi dịp một món', effects: { happiness: 3 }, flags: ['tang_do_khi_song'],
        text: 'Sinh nhật đứa cháu, tôi tặng chiếc đồng hồ cũ. Đám cưới đứa khác, tặng bộ ấm trà. Lần nào tặng cũng kể câu chuyện của món đồ. Có đứa ghi lại câu chuyện vào sổ.' },
      { label: 'Giữ lại, để sau', effects: { happiness: 1 },
        text: 'Tôi giữ mọi thứ quanh mình. Chiều nào cũng lau bụi từng món. Mỗi món đồ là một người, một năm, một câu chuyện.' },
    ],
  },
  {
    id: 'ls76-cuoc-goi-sai-so', age: 76,
    title: 'Cuộc gọi nhầm số',
    text: 'Một đứa trẻ gọi nhầm số vào máy tôi, khóc, nói đang tìm bà nội. Nó lạc ở chợ, không biết đường về, chỉ nhớ một số điện thoại mà nó đọc sai. Nghe giọng thì chừng sáu, bảy tuổi.',
    choices: [
      { label: 'Giữ máy, hướng dẫn nó tìm người lớn', effects: { happiness: 2, intelligence: 1 }, flags: ['giup_tre_lac'],
        text: 'Tôi nói chuyện với nó, bảo nó đưa máy cho cô bán hàng gần nhất. Cô bán hàng gọi được người nhà. Nửa tiếng sau, bà nội nó gọi lại cho tôi, khóc cảm ơn. Tôi nhớ tới một đứa trẻ bị lạc năm nào.' },
      { label: 'Báo công an phường', effects: { intelligence: 1 },
        text: 'Tôi gọi công an, đọc số máy vừa gọi tới. Một tiếng sau, họ báo đã tìm được đứa trẻ. Tôi ngồi một lúc lâu, tay vẫn cầm điện thoại.' },
    ],
  },
  {
    id: 'ls76-ban-doi-cham-nguoc', age: 76, needs: ['partner'],
    title: 'Đổi vai',
    text: 'Cả đời {tenBanDoi} chăm tôi. Giờ {tenBanDoi} yếu, nằm nhiều, đến lượt tôi chăm. Tôi không quen việc nhà, nấu không ngon, làm gì cũng vụng. Có hôm {tenBanDoi} nhìn tôi loay hoay, bật cười.',
    choices: [
      { label: 'Nhờ {tenBanDoi} chỉ từng việc', effects: { happiness: 3 }, flags: ['ban_doi_chi_viec'],
        text: '{tenBanDoi} nằm trên giường, chỉ tôi cách nấu canh, cách gấp áo. Tôi làm theo, sai, làm lại. Hai đứa cười nhiều hơn mấy năm trước cộng lại.' },
      { label: 'Thuê người phụ việc nhà', effects: { health: 1 },
        text: 'Người giúp việc làm mọi thứ gọn gàng. Tôi ngồi cạnh giường {tenBanDoi}, đọc báo, kể chuyện. Có hôm {tenBanDoi} nói: “Nhớ món canh dở của mình ghê.”' },
    ],
  },
  {
    id: 'ls76-mot-minh-nguoi-giup', age: 76, needs: ['single'],
    title: 'Người giúp việc',
    text: 'Người giúp việc tới mỗi ngày đã ba năm, chăm tôi rất tận tình. Hôm nay chị nói con chị ốm nặng, phải về quê, có thể không quay lại. Chị khóc, xin lỗi vì bỏ tôi.',
    choices: [
      { label: 'Gửi chị một khoản tiền, tiễn chị về', effects: { happiness: 2 }, flags: ['tien_nguoi_giup_viec'],
        text: 'Tôi đưa chị một phong bì, nói là tiền thưởng. Chị không nhận, tôi dúi vào túi chị. Chị về quê, tuần nào cũng gọi điện hỏi thăm, kể chuyện con chị đỡ dần.' },
      { label: 'Nhờ chị giới thiệu người thay', effects: { intelligence: 1 },
        text: 'Chị giới thiệu một người cùng quê, dặn dò kỹ từng thói quen của tôi. Người mới làm tốt, nhưng không biết tôi thích uống trà lúc nào. Tôi tự dạy lại từ đầu.' },
    ],
  },
  {
    id: 'ls76-chat-chau-khong-ve', age: 76, needs: ['children'], childAge: [42, 60],
    title: 'Chuyện của con',
    text: '{tenCon} kể muốn ly hôn ở tuổi {tuoiCon}, sau nhiều năm chung sống. Cả họ phản đối, nói già rồi còn bỏ nhau làm gì. Con hỏi ý tôi, người đã sống gần trọn một đời.',
    choices: [
      { label: 'Nói con cứ sống cho mình', effects: { happiness: 1 }, flags: ['ung_ho_con_song_cho_minh'],
        text: '{tenCon} khóc, ôm tôi. Con ly hôn nhẹ nhàng, dọn ra ở riêng. Một năm sau, con gọi điện, giọng nhẹ như hồi hai mươi tuổi.' },
      { label: 'Khuyên con nghĩ thêm', effects: { intelligence: 1 },
        text: '{tenCon} suy nghĩ thêm một năm, đi tư vấn cùng người kia. Cuối cùng hai người ở lại với nhau, nhưng ngủ riêng, sống như hai người bạn. Con nói vậy cũng ổn.' },
    ],
  },

   
  {
    id: 'ls77-te-gay-xuong', age: 77,
    title: 'Ca mổ ở tuổi bảy mươi bảy',
    text: 'Tôi ngã, gãy cổ xương đùi. Bác sĩ nói mổ thì có cơ hội đi lại, nhưng ở tuổi này mổ có rủi ro. Không mổ thì có thể nằm một chỗ. Người thân để tôi tự quyết.',
    choices: [
      { label: 'Mổ', effects: { health: 2 }, money: -30000000, flags: ['mo_xuong_dui'],
        text: 'Ca mổ ổn. Ba tháng tập đi, đau tới chảy nước mắt. Ngày đầu tiên tự đi được mười bước với khung tập, tôi đứng ở cuối hành lang, cười như đứa trẻ tập đi.' },
      { label: 'Không mổ', effects: { health: -2, happiness: -1 },
        text: 'Tôi nằm, ngồi xe lăn. Người thân thay phiên chăm. Tôi đọc sách nhiều hơn bao giờ hết, nhìn ra cửa sổ, học thuộc từng chiếc lá trên cây bàng.' },
    ],
  },
  {
    id: 'ls77-nguoi-tre-hoi-y-kien', age: 77,
    title: 'Lời khuyên cho người trẻ',
    text: 'Một người trẻ trong khu, sắp lấy vợ lấy chồng, tới hỏi tôi bí quyết sống chung lâu dài. Tôi nghĩ mãi không ra câu trả lời nào gọn gàng. Người ấy ngồi chờ, mắt sáng.',
    choices: [
      { label: 'Kể một chuyện thật', effects: { happiness: 2 }, flags: ['ke_chuyen_cho_nguoi_tre'],
        text: 'Tôi kể chuyện một lần cãi nhau to, và cách hai người làm lành. Người trẻ nghe, gật gù. Cuối cùng tôi nói: “Không có bí quyết. Chỉ có ngày mai thử lại.”' },
      { label: 'Nói: “Mỗi người một khác”', effects: { intelligence: 1 },
        text: 'Người trẻ hơi thất vọng, nhưng cảm ơn. Một năm sau, người ấy quay lại, nói giờ mới hiểu câu ấy. Tôi không nhớ mình đã nói gì.' },
    ],
  },
  {
    id: 'ls77-khu-pho-moi', age: 77,
    title: 'Hàng xóm mới',
    text: 'Những người hàng xóm cũ lần lượt chuyển đi hoặc qua đời. Khu phố toàn người trẻ, không ai biết tôi. Có một gia đình trẻ mới dọn tới nhà bên, hay nhìn sang nhà tôi với vẻ tò mò.',
    choices: [
      { label: 'Sang chào, mang theo đĩa bánh', effects: { happiness: 3 }, flags: ['chao_hang_xom_moi'],
        text: 'Đứa con nhỏ của họ thích bánh tôi làm, hôm sau tự sang xin thêm. Từ đó, chiều nào nó cũng sang ngồi ở hiên nhà tôi, kể chuyện trường lớp. Nó gọi tôi bằng cái tên nó tự đặt.' },
      { label: 'Chờ họ sang trước', effects: { happiness: -1 },
        text: 'Mấy tháng trôi qua, hai nhà chỉ gật đầu chào. Có hôm tôi ốm, không ai biết. Tôi nghĩ lẽ ra mình nên sang trước.' },
    ],
  },
  {
    id: 'ls77-ban-doi-noi-chuyen-xua', age: 77, needs: ['partner'],
    title: 'Chuyện ngày cưới',
    text: '{tenBanDoi} nằm trên giường, kể lại chuyện ngày cưới. Kể sai nhiều chi tiết: sai ngày, sai người, sai cả màu áo. Nhưng {tenBanDoi} đang cười rất hạnh phúc.',
    choices: [
      { label: 'Kể theo cách của {tenBanDoi}', effects: { happiness: 3 }, flags: ['ke_theo_ban_doi'],
        text: 'Tôi gật đầu, thêm vào những chi tiết đúng như {tenBanDoi} nhớ. Câu chuyện thành một ngày cưới khác, đẹp hơn ngày cưới thật. {tenBanDoi} ngủ thiếp đi giữa chừng, vẫn cười.' },
      { label: 'Nhẹ nhàng sửa lại', effects: { happiness: -1 },
        text: 'Tôi sửa từng chi tiết. {tenBanDoi} im lặng, rồi nói: “Vậy hả.” Nụ cười tắt dần. Tôi nhận ra mình đã giành lại một ký ức, và làm mất một nụ cười.' },
    ],
  },
  {
    id: 'ls77-mot-minh-tam-su', age: 77, needs: ['single'],
    title: 'Đường dây tâm sự',
    text: 'Một tổ chức có đường dây điện thoại cho người già cô đơn, mỗi tuần có tình nguyện viên gọi tới nói chuyện. Tôi ngại nói chuyện với người lạ, nhưng nhiều tối không có ai để nói.',
    choices: [
      { label: 'Đăng ký', effects: { happiness: 3 }, flags: ['duong_day_tam_su'],
        text: 'Người gọi là một sinh viên, giọng trong trẻo. Tôi kể chuyện ngày xưa, nó kể chuyện thi cử. Tối thứ ba thành buổi tối tôi chờ. Ngày nó tốt nghiệp, tôi gửi nó một tấm thiệp.' },
      { label: 'Gọi điện cho người quen cũ', effects: { happiness: 1 },
        text: 'Tôi lật sổ danh bạ, gọi cho những người lâu không liên lạc. Có số không còn ai nghe. Có người mừng rỡ. Tôi gạch bớt những số không còn dùng.' },
    ],
  },
  {
    id: 'ls77-chat-chat', age: 77, needs: ['children'], childAge: [42, 60],
    title: 'Chắt đầu tiên',
    text: 'Tôi có đứa chắt đầu tiên. Người ta đặt nó vào tay tôi, nhỏ xíu, nhẹ hều. Tay tôi run, sợ làm rơi. Cả nhà đứng quanh, chờ chụp ảnh bốn thế hệ.',
    choices: [
      { label: 'Ôm chắt, nhìn vào ống kính', effects: { happiness: 4 }, flags: ['anh_bon_the_he'],
        text: 'Tấm ảnh bốn thế hệ được in ra, lồng khung. Trong ảnh, tôi nhìn đứa chắt chứ không nhìn ống kính. Ai cũng nói đó là tấm đẹp nhất.' },
      { label: 'Ngồi xuống, đặt chắt trên đùi', effects: { happiness: 3 },
        text: 'Tôi ngồi xuống ghế, đặt đứa chắt trên đùi, hai tay đỡ chắc. Nó mở mắt nhìn tôi, rồi ngáp. Cả nhà cười. Tấm ảnh chụp đúng lúc ấy.' },
    ],
  },

   
  {
    id: 'ls78-ngu-nhieu', age: 78,
    title: 'Ngủ nhiều hơn',
    text: 'Dạo này tôi ngủ nhiều, ngồi đâu cũng ngủ gật. Người thân lo, đưa đi khám. Bác sĩ nói không có gì nghiêm trọng, tuổi già thôi, nhưng nên ra ngoài nhiều hơn, nói chuyện nhiều hơn.',
    choices: [
      { label: 'Nhờ đưa ra ngoài mỗi chiều', effects: { happiness: 2, health: 1 }, flags: ['ra_ngoai_moi_chieu'],
        text: 'Chiều nào cũng có người đưa tôi ra công viên, ngồi nhìn người qua lại. Có bà cụ hay ngồi ghế bên cạnh, hai người nói chuyện về thời tiết, về giá rau. Tôi ngủ gật ít hơn.' },
      { label: 'Để tự nhiên', effects: { health: -1 },
        text: 'Tôi ngủ khi buồn ngủ, thức khi tỉnh. Ngày ngắn lại, đêm dài ra. Có hôm tỉnh dậy, không biết sáng hay chiều.' },
    ],
  },
  {
    id: 'ls78-chuyen-tien-cho-chau', age: 78,
    title: 'Chiếc xe đạp cũ',
    text: 'Đứa trẻ hàng xóm thích chiếc xe đạp cũ của tôi, đã lâu không ai đi, phủ bụi trong kho. Nó hỏi mua, đưa ra một trăm nghìn tiền tiết kiệm. Chiếc xe đạp là quà ba mẹ tặng tôi năm mười lăm tuổi.',
    choices: [
      { label: 'Tặng nó, không lấy tiền', effects: { happiness: 3 }, flags: ['tang_xe_dap_cu'],
        text: 'Đứa trẻ lau chùi chiếc xe cả buổi, rồi đạp vòng vòng trước nhà tôi, vẫy tay. Mỗi chiều đi ngang, nó bấm chuông xe, cái chuông vẫn kêu như sáu mươi năm trước.' },
      { label: 'Giữ lại', effects: { happiness: -1 },
        text: 'Tôi nói chiếc xe có kỷ niệm, không bán được. Đứa trẻ gật đầu, hơi buồn. Chiếc xe vẫn nằm trong kho. Tôi nghĩ ba mẹ mua cho mình là để mình đạp.' },
    ],
  },
  {
    id: 'ls78-xin-loi-nguoi-xua', age: 78,
    title: 'Lời xin lỗi muộn',
    text: 'Tôi vẫn nhớ một người từng bị mình làm tổn thương nhiều năm trước, chưa từng xin lỗi. Nghe nói người ấy còn sống, ở một tỉnh khác. Tôi không chắc người ấy có muốn gặp lại mình không.',
    choices: [
      { label: 'Viết thư xin lỗi', effects: { happiness: 2 }, flags: ['xin_loi_nguoi_xua'],
        text: 'Một tháng sau có thư trả lời, nét chữ run run. Người ấy viết: “Cảm ơn vì đã nhớ. Tôi đã quên, nhưng giờ thì nhớ lại cả việc mình đã tha thứ.”' },
      { label: 'Thắp nhang, nói thầm', effects: { happiness: -1 },
        text: 'Tôi thắp một nén nhang, nói lời xin lỗi trong im lặng. Thấy nhẹ lòng một chút. Nhưng tôi biết người ấy vẫn chưa nghe được.' },
    ],
  },
  {
    id: 'ls78-ban-doi-ra-di', age: 78, needs: ['partner'],
    title: 'Ở viện hay về nhà',
    text: 'Sau đợt ốm dài, {tenBanDoi} yếu đi nhiều. Bác sĩ đề nghị ở lại viện theo dõi thêm một thời gian, hoặc đưa về nhà, có y tá tới khám mỗi tuần. {tenBanDoi} nhìn tôi, muốn về mà không nói ra.',
    choices: [
      { label: 'Đưa về nhà', effects: { happiness: 1, health: -1 }, flags: ['dua_ban_doi_ve_nha'],
        text: 'Giường kê cạnh cửa sổ, nhìn ra khoảng sân. Tôi học cách đo huyết áp, chia thuốc. Có buổi chiều {tenBanDoi} tỉnh táo, nắm tay tôi, nói những điều đã muốn nói từ lâu.' },
      { label: 'Ở lại viện theo dõi', effects: { health: -1 },
        text: 'Một tháng trong viện, máy móc, dây truyền. Tôi ngồi cạnh giường mỗi ngày. Ngày được về, {tenBanDoi} đi được ra tới cổng, quay lại cảm ơn từng cô y tá.' },
    ],
  },
  {
    id: 'ls78-mot-minh-vien-duong-lao', age: 78, needs: ['single'],
    title: 'Người bạn cùng phòng',
    text: 'Ở viện dưỡng lão hoặc trong khu nhà, người bạn ngồi cạnh tôi mỗi bữa ăn hay lẩm bẩm, có lúc nói những điều vô nghĩa. Nhân viên đề nghị đổi chỗ ngồi cho tôi yên. Người bạn ấy chỉ nói chuyện với tôi.',
    choices: [
      { label: 'Vẫn ngồi cạnh', effects: { happiness: 2 }, flags: ['ngoi_canh_ban_lan'],
        text: 'Tôi nghe người ấy nói những điều vô nghĩa, gật đầu, đáp lại. Có hôm người ấy nói một câu rất rõ: “Cảm ơn đã không bỏ đi.” Rồi lại quay về những lời lẩm bẩm.' },
      { label: 'Đổi chỗ', effects: { health: 1 },
        text: 'Tôi đổi sang bàn khác, yên tĩnh hơn. Người bạn ấy ngồi một mình, nhìn quanh tìm. Tôi quay đi, ăn hết bữa cơm.' },
    ],
  },
  {
    id: 'ls78-con-giau-benh', age: 78, needs: ['children'], childAge: [44, 62],
    title: 'Con giấu bệnh',
    text: 'Tôi tình cờ biết {tenCon} đang điều trị một bệnh nặng, giấu tôi vì sợ tôi lo. Tôi đã từng làm y như vậy với chính con. Con vẫn gọi điện mỗi tuần, giọng vui vẻ như không có gì.',
    choices: [
      { label: 'Nói với con là mình đã biết', effects: { happiness: 1 }, flags: ['biet_con_benh'],
        text: '{tenCon} im lặng rất lâu, rồi khóc. Con kể hết. Từ đó, mỗi lần đi điều trị, con đều gọi kể cho tôi nghe. Hai người già đi cùng nhau qua điện thoại.' },
      { label: 'Giả như không biết, âm thầm hỏi thăm', effects: { happiness: -1 },
        text: 'Tôi gửi con những món ăn bổ, nói là tự nhiên muốn nấu. Con nhận, cảm ơn. Cả hai cùng biết, cùng không nói. Như tôi năm bảy mươi tuổi.' },
    ],
  },

   
  {
    id: 'ls79-bep-ga-cu', age: 79,
    title: 'Cái bếp ga ba mươi năm',
    text: 'Tuần này tôi hai lần quên tắt bếp, nồi cháo khét đen. Người hàng xóm ngửi thấy mùi, sang gõ cửa, rồi khuyên tôi đổi sang bếp điện tự ngắt, nói nhà họ có sẵn một cái dư. Tôi đã nấu bằng cái bếp ga này hơn ba mươi năm.',
    choices: [
      { label: 'Đổi sang bếp điện', effects: { health: 1, happiness: -1 },
        text: 'Bếp mới tự tắt khi nồi cạn. Món kho không còn dậy mùi như trước, tôi nêm mãi vẫn thấy thiếu. Nhưng từ đó, tôi ngủ trưa không còn phải bật dậy xem có mùi khét.' },
      { label: 'Giữ bếp cũ, dán giấy nhắc', effects: { happiness: 1, health: -1 },
        text: 'Tôi dán một tờ giấy ghi chữ thật to ngay trên bếp. Món kho vẫn đúng vị. Có hôm nồi vẫn khét, tôi mở cửa sổ cho bay mùi, không kể với ai.' },
    ],
  },
  {
    id: 'ls79-ky-uc-tre-tho', age: 79,
    title: 'Ký ức rõ nhất',
    text: 'Gần tám mươi, chuyện hôm qua tôi hay quên, còn chuyện năm năm tuổi thì nhớ rõ từng chi tiết. Đứa cháu hỏi tôi nhớ gì nhất về tuổi thơ. Tôi nghĩ một lúc, có hai chuyện cùng hiện lên.',
    choices: [
      { label: 'Kể về một ngày vui', effects: { happiness: 3 }, flags: ['ke_ngay_vui_tuoi_tho'],
        text: 'Tôi kể về một buổi chiều thả diều, con diều mắc trên ngọn cây. Đứa cháu cười, hỏi sau đó lấy xuống được không. Tôi nói không, nhưng hôm sau có một người bạn sang gọi tôi từ sớm.' },
      { label: 'Kể về một lần mình sai', effects: { happiness: 1, intelligence: 1 },
        text: 'Tôi kể về một lần mình nói dối khi còn nhỏ, và cái cảm giác nặng trĩu mấy ngày sau đó. Đứa cháu nghe rất chăm chú. Lúc đi, nó ôm tôi lâu hơn mọi khi.' },
    ],
  },
  {
    id: 'ls79-de-lai-loi-nhan', age: 79,
    title: 'Lời nhắn cho đời sau',
    text: 'Một dự án lưu giữ ký ức mời người già quay một đoạn video ngắn, nhắn gửi cho thế hệ năm mươi năm sau. Tôi ngồi trước máy quay, không biết nói gì với những người chưa sinh ra.',
    choices: [
      { label: 'Nói một điều mình tin', effects: { happiness: 2 }, flags: ['nhan_nam_muoi_nam'],
        text: 'Tôi nói: “Đừng để dành lời thương. Nói ngay khi còn nói được.” Người quay phim im lặng một lúc, rồi tắt máy. Ra về, tôi gọi cho một người thân, nói lời ấy.' },
      { label: 'Kể một chuyện đời thường', effects: { happiness: 1 },
        text: 'Tôi kể chuyện đi chợ, mua rau, mặc cả với bà bán cá. Người quay phim cười. Có lẽ năm mươi năm sau, người ta sẽ thấy lạ khi nghe về những phiên chợ như vậy.' },
    ],
  },
  {
    id: 'ls79-dem-mat-dien', age: 79,
    title: 'Đêm mất điện',
    text: 'Đêm mưa bão, khu nhà mất điện. Tôi ngồi trong bóng tối, đèn pin hết pin, điện thoại sắp tắt. Nhà bên có tiếng gõ cửa, người hàng xóm trẻ hỏi tôi có cần gì không.',
    choices: [
      { label: 'Nhờ người ấy ngồi lại một lúc', effects: { happiness: 3 }, flags: ['dem_bao_hang_xom'],
        text: 'Người hàng xóm mang sang cây nến, ngồi lại kể chuyện. Tôi kể những đêm bão ngày xưa, không có điện, cả xóm ngồi chung một hiên. Điện có lại lúc nửa đêm, hai người vẫn ngồi nói chuyện.' },
      { label: 'Cảm ơn, nói không sao', effects: { happiness: -1 },
        text: 'Người ấy để lại cây nến rồi về. Tôi ngồi một mình nhìn ngọn nến tới khi có điện. Tiếng mưa rất to, tiếng nến rất nhỏ.' },
    ],
  },
  {
    id: 'ls79-ban-doi-da-mat', age: 79, needs: ['widowed'],
    title: 'Lá thư chưa gửi',
    text: 'Dọn đồ của người bạn đời đã mất, tôi tìm thấy một lá thư người ấy viết cho tôi, chưa từng gửi. Phong bì ghi: “Mở khi mình không còn.” Tôi cầm lá thư rất lâu.',
    choices: [
      { label: 'Mở ra đọc', effects: { happiness: 2 }, flags: ['doc_thu_nguoi_mat'],
        text: 'Người ấy viết về những ngày đầu, những năm khó khăn, cảm ơn tôi những điều nhỏ mà tôi đã quên. Cuối thư viết: “Ăn uống đàng hoàng, đừng bỏ bữa.” Tôi bật cười, rồi khóc.' },
      { label: 'Để dành, đọc vào ngày giỗ', effects: { happiness: 1 },
        text: 'Tôi cất lá thư vào hộp, hẹn ngày giỗ đầu sẽ đọc. Mỗi tối, tôi nhìn cái hộp, biết trong đó còn một câu chuyện chưa nghe.' },
    ],
  },
  {
    id: 'ls79-mot-minh-sinh-nhat', age: 79, needs: ['neverMarried'],
    title: 'Sinh nhật lần thứ bảy mươi chín',
    text: 'Sinh nhật thứ bảy mươi chín, không có ai nhớ. Tôi tự mua một chiếc bánh nhỏ. Đi ngang công viên, thấy mấy đứa trẻ đang chơi, tôi có ý định mời tụi nó ăn bánh cùng.',
    choices: [
      { label: 'Mời tụi nhỏ ăn bánh', effects: { happiness: 4 }, flags: ['sinh_nhat_voi_tre'],
        text: 'Tụi nhỏ ngại lúc đầu, rồi ùa tới. Một đứa hỏi tôi bao nhiêu tuổi. Nghe xong, nó tròn mắt: “Lớn hơn ông cố con.” Tụi nhỏ hát chúc mừng sinh nhật, lệch tông, rất to.' },
      { label: 'Về nhà ăn một mình', effects: { happiness: -1 },
        text: 'Tôi về, cắm một cây nến, thổi, ăn một miếng. Phần còn lại cất vào tủ lạnh. Sáng hôm sau, tôi mang sang biếu người hàng xóm, không nói là bánh sinh nhật.' },
    ],
  },
  {
    id: 'ls79-con-chau-tu-hop', age: 79, needs: ['children'], childAge: [44, 62],
    title: 'Ngày họp mặt',
    text: 'Con cháu ở nhiều nơi, lâu không gặp đủ. Tôi muốn tổ chức một ngày họp mặt cả nhà, có thể là lần cuối đông đủ. Mỗi người một việc, khó sắp xếp.',
    choices: [
      { label: 'Tự gọi từng người', effects: { happiness: 4 }, flags: ['hop_mat_ca_nha'],
        text: 'Tôi gọi từng người, nói mình muốn gặp. Ngày họp mặt, nhà chật kín người. Tụi nhỏ chạy khắp nơi. Tôi ngồi ở giữa, nhìn quanh, đếm từng khuôn mặt.' },
      { label: 'Nhờ con lớn sắp xếp', effects: { happiness: 2 },
        text: 'Con lớn lên lịch, nhắn từng người. Hai người không về được. Ngày họp mặt vẫn vui. Tôi gọi video cho hai người vắng mặt, cho họ nhìn thấy cả nhà.' },
    ],
  },

   
  {
    id: 'ls-tu-cuoc-goi-cuoi', ages: [70, 88], requiresAny: ['tu_noi_lai', 'tu_ket_ban_im', 'dua_tu_di_kham', 'cho_tu_vay'],
    title: 'Cuộc gọi của Tú',
    text: 'Tú gọi, giọng yếu hẳn, nói đang nằm viện ở quê, bác sĩ bảo không còn bao lâu. Tú nói muốn nghe giọng tôi, kể lại chuyện con diều mắc trên ngọn cây năm nào.',
    choices: [
      { label: 'Về quê thăm Tú', effects: { happiness: 2, health: -2 }, flags: ['tham_tu_lan_cuoi'],
        text: 'Tôi về kịp. Tú nằm đó, gầy gò, cười khi thấy tôi. Hai đứa kể chuyện con diều, chuyện cái máy bay, chuyện cả một đời. Ba ngày sau, Tú đi. Tôi đứng ở hàng đầu tiễn Tú.' },
      { label: 'Kể chuyện qua điện thoại', effects: { happiness: 1 },
        text: 'Tôi kể chuyện con diều, kể rất chậm, rất kỹ. Đầu dây bên kia có tiếng Tú cười, rồi im. Người nhà Tú cầm máy, nói Tú ngủ rồi, ngủ rất yên. Một tuần sau họ báo tin.' },
    ],
  },
  {
    id: 'ls-nhom-binh-an-vang', ages: [72, 88], requires: ['nhom_bao_binh_an'],
    title: 'Một tin nhắn không tới',
    text: 'Sáng nay, nhóm báo bình an chỉ có ba tin nhắn. Người thứ tư không nhắn, gọi không nghe. Tôi là người ở gần nhà người ấy nhất, chân yếu, đi bộ mất hai mươi phút.',
    choices: [
      { label: 'Tự đi tới nhà', effects: { happiness: 1, health: -1 }, flags: ['di_toi_nha_ban'],
        text: 'Tôi đi, nghỉ hai lần dọc đường. Gõ cửa mãi, người ấy ra mở, ngái ngủ, nói quên sạc điện thoại. Hai người đứng ở cửa, cười tới chảy nước mắt. Cả nhóm thở phào.' },
      { label: 'Gọi người nhà của bạn', effects: { intelligence: 1 },
        text: 'Người nhà tới, gọi cửa. Người ấy bị ngã trong nhà tắm từ tối qua, may phát hiện kịp. Nhóm báo bình an thêm một quy tắc: mỗi người để một chìa khóa dự phòng ở nhà người khác.' },
    ],
  },
  {
    id: 'ls-hoi-ky-chau-doc', ages: [70, 90], requires: ['hoi_ky_that'],
    title: 'Người đọc hồi ký',
    text: 'Đứa cháu đọc xong cuốn hồi ký tôi viết, tìm tới hỏi về những trang tôi kể chuyện mình sai. Nó nói muốn hỏi thêm, vì nó đang gặp một chuyện y như vậy.',
    choices: [
      { label: 'Kể thêm những điều chưa viết', effects: { happiness: 3 }, flags: ['chau_doc_hoi_ky'],
        text: 'Hai người ngồi tới khuya. Tôi kể cả những điều không dám viết. Đứa cháu ghi lại. Lúc về, nó nói: “Con sẽ không sợ sai nữa, chỉ sợ không sửa.”' },
      { label: 'Hỏi chuyện của cháu', effects: { happiness: 2, intelligence: 1 },
        text: 'Tôi hỏi nó đang gặp chuyện gì. Nó kể, tôi nghe, không khuyên gì. Cuối cùng nó tự nói ra cách giải quyết. Tôi chỉ gật đầu.' },
    ],
  },
  {
    id: 'ls-vuon-rau-trao-lai', ages: [70, 85], requires: ['vuon_rau_chung'],
    title: 'Khu vườn chung',
    text: 'Khu vườn rau chung tôi khởi xướng ngày nào giờ xanh tốt, nhưng tôi không còn đủ sức chăm. Cả khu muốn tôi chọn người tiếp quản. Có một người trẻ nhiệt tình, và một người già hiểu rau hơn.',
    choices: [
      { label: 'Trao cho người trẻ', effects: { happiness: 2 }, flags: ['trao_vuon_nguoi_tre'],
        text: 'Người trẻ làm khác tôi nhiều: lắp hệ thống tưới, chia luống mới. Tôi ngồi ở ghế đá bên vườn, nhìn. Có hôm nó tới hỏi tôi về cây ớt, tôi chỉ, nó ghi lại.' },
      { label: 'Để hai người cùng lo', effects: { happiness: 1, intelligence: 1 },
        text: 'Hai người cãi nhau tuần đầu, rồi phân công rõ. Vườn tốt hơn. Chiều nào tôi cũng được mời ra ngồi, như một người chủ cũ được tôn trọng.' },
    ],
  },
];
