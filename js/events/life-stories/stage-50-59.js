 
 
export const stage50To59 = [
   
  {
    id: 'ls50-kham-tong-quat', age: 50,
    title: 'Năm mươi tuổi',
    text: 'Năm mươi tuổi, bác sĩ khuyên nội soi đại tràng tầm soát, vì tuổi này bắt đầu có nguy cơ. Phải nhịn ăn, uống thuốc xổ, nghỉ một ngày. Tôi thấy mình còn khỏe, chưa có triệu chứng gì.',
    choices: [
      { label: 'Đi nội soi', effects: { health: 3, happiness: -1 }, flags: ['noi_soi_50'],
        text: 'Một ngày vật vã. Bác sĩ cắt hai cái polyp nhỏ, nói may phát hiện sớm. Tôi về nhà ăn tô cháo, thấy tô cháo ngon nhất đời.' },
      { label: 'Để năm sau', effects: { happiness: 1 },
        text: 'Tôi gấp giấy hẹn của bác sĩ, kẹp vào sổ. Năm sau, giấy hẹn vẫn nằm đó, mép giấy đã vàng.' },
    ],
  },
  {
    id: 'ls50-cuoi-con-ban', age: 50,
    title: 'Đám cưới con của bạn',
    text: 'Con của người bạn thân cưới. Bạn nhờ tôi đứng ra phát biểu thay mặt nhà trai, vì ba của đứa nhỏ đã mất. Tôi chưa từng phát biểu ở đám cưới. Bạn nói: “Ngoài mày ra, không ai hiểu nhà tao.”',
    choices: [
      { label: 'Nhận lời', effects: { happiness: 2 }, flags: ['phat_bieu_cuoi_chau'],
        text: 'Tôi viết bài phát biểu ba đêm. Lên sân khấu, giọng run, nói được nửa bài thì quên, nói tiếp bằng những gì mình nhớ về ba đứa nhỏ. Cả hội trường lặng đi.' },
      { label: 'Gợi ý người lớn tuổi hơn trong họ', effects: { intelligence: 1 },
        text: 'Một ông chú trong họ phát biểu, nói tròn trịa. Tôi ngồi ở bàn đầu, lúc cô dâu chú rể đi chào bàn, đứa nhỏ ôm tôi rất lâu.' },
    ],
  },
  {
    id: 'ls50-tien-luong-huu', age: 50, needs: ['employed'],
    title: 'Mười hai năm nữa',
    text: 'Công ty mời tư vấn về lương hưu. Tính ra, nếu cứ như bây giờ, lương hưu chỉ bằng một phần ba thu nhập hiện tại. Có thể đóng thêm bảo hiểm tự nguyện, mỗi tháng bớt đi một khoản đáng kể.',
    choices: [
      { label: 'Đóng thêm', effects: { intelligence: 1, happiness: -1 }, flags: ['dong_them_huu'],
        text: 'Mỗi tháng chi tiêu chật hơn. Tôi bỏ thói quen cà phê sáng. Ngồi tính lại, mười hai năm nữa sẽ đủ sống. Mười hai năm, nghe vừa xa vừa gần.' },
      { label: 'Giữ như cũ', effects: { happiness: 1 },
        text: 'Tôi giữ cuộc sống như hiện tại. Đến lúc nào thì tính lúc đó. Có đêm mất ngủ, tôi mở bảng tính lương hưu ra xem, rồi đóng lại.' },
    ],
  },
  {
    id: 'ls50-khong-co-huu', age: 50, needs: ['notEmployed'],
    title: 'Không có lương hưu',
    text: 'Tôi làm tự do nhiều năm, không đóng bảo hiểm xã hội đủ. Năm mươi tuổi, tính ra sau này sẽ không có lương hưu. Có gói đóng bù, mỗi tháng tốn gần một nửa thu nhập hiện tại.',
    choices: [
      { label: 'Đóng bù', effects: { happiness: -2, intelligence: 1 }, flags: ['dong_bu_bao_hiem'],
        text: 'Tôi cắt mọi khoản không cần thiết. Ăn uống đơn giản, không đi đâu xa. Mỗi tháng đóng tiền xong, tôi thấy như đang gửi tiền cho chính mình của mười năm sau.' },
      { label: 'Tự để dành theo cách mình', effects: { happiness: 1 },
        text: 'Tôi mở một tài khoản tiết kiệm riêng, mỗi tháng gửi khi được khi không. Có tháng phải rút ra lo việc gấp. Con số tăng chậm, lâu lâu lại giảm.' },
    ],
  },
  {
    id: 'ls50-ban-doi-tuoi-nam-muoi', age: 50, needs: ['partner'],
    title: 'Hai người trong căn nhà',
    text: 'Con cái đi xa hết, nhà còn hai người. Bữa cơm im lặng, mỗi người một góc. {tenBanDoi} đề nghị hai đứa học chung một thứ gì đó, như hồi mới quen, để có chuyện mà nói.',
    choices: [
      { label: 'Học khiêu vũ', effects: { happiness: 3, health: 1 }, money: -3000000, flags: ['hoc_khieu_vu'],
        text: 'Hai đứa đạp chân nhau suốt tuần đầu. Tháng thứ ba, nhảy được một bài trọn vẹn. Về nhà, {tenBanDoi} mở nhạc trong bếp, kéo tôi nhảy giữa lúc đang rửa chén.' },
      { label: 'Trồng rau trên sân thượng', effects: { happiness: 2 },
        text: 'Hai đứa cãi nhau chuyện tưới nhiều hay ít. Rau lên được. Chiều nào cũng có chuyện để nói: luống này sâu, luống kia mới nhú.' },
    ],
  },
  {
    id: 'ls50-mot-minh-nam-muoi', age: 50, needs: ['single'],
    title: 'Danh sách năm mươi',
    text: 'Năm mươi tuổi, sống một mình, tôi lập một danh sách những việc muốn làm trước sáu mươi. Danh sách dài mười dòng. Dòng đầu tiên là học bơi. Dòng thứ hai là viết thư cho một người đã lâu không liên lạc.',
    choices: [
      { label: 'Bắt đầu từ dòng đầu', effects: { health: 2, happiness: 1 }, flags: ['danh_sach_50'],
        text: 'Lớp học bơi người lớn có toàn người già hơn tôi. Tháng thứ hai, tôi bơi được hai mươi mét. Tôi gạch dòng đầu tiên, gạch rất mạnh.' },
      { label: 'Viết lá thư trước', effects: { happiness: 2 },
        text: 'Tôi viết cho người bạn cũ đã giận nhau từ hai mươi năm trước. Một tháng sau mới có thư trả lời, chỉ ba dòng: “Tao cũng nhớ mày. Mình gặp nhau đi.”' },
    ],
  },
  {
    id: 'ls50-con-cuoi', age: 50, needs: ['children'], childAge: [22, 32],
    title: 'Đám cưới của con',
    text: '{tenCon} sắp cưới. Hai bên gia đình bàn chuyện tổ chức, nhà bên kia muốn làm thật lớn, tốn kém. {tenCon} muốn làm nhỏ, chỉ mời người thân. Hai đứa nhỏ nhờ tôi nói chuyện với nhà bên kia.',
    choices: [
      { label: 'Đứng ra nói chuyện', effects: { intelligence: 1 }, flags: ['noi_chuyen_thong_gia'],
        text: 'Buổi nói chuyện căng ở đầu, dịu ở cuối. Hai nhà chọn cách giữa: tiệc vừa phải, mời người thân và bạn thân. {tenCon} ôm tôi, nói: “Cảm ơn ba mẹ.”' },
      { label: 'Để hai nhà tự thỏa thuận', effects: { happiness: -1 },
        text: 'Nhà bên kia làm theo ý họ. Đám cưới hoành tráng. {tenCon} cười suốt buổi, tối về nhắn tôi: “Con mệt quá.” Tôi gọi điện, nghe con kể một tiếng.' },
    ],
  },

   
  {
    id: 'ls51-dien-thoai-thong-minh', age: 51,
    title: 'Mạng xã hội',
    text: 'Dạo này tôi lướt mạng mỗi tối ba, bốn tiếng, đọc tin tức, xem video, cãi nhau với người lạ trong phần bình luận. Đêm nào cũng ngủ muộn, sáng dậy thấy bực bội mà không rõ vì sao.',
    choices: [
      { label: 'Xóa ứng dụng một tháng', effects: { happiness: 2, health: 1 }, flags: ['bo_mang_xa_hoi'],
        text: 'Tuần đầu tay cứ vô thức với lấy điện thoại. Tuần thứ ba, tôi đọc xong một cuốn sách. Hết tháng, tôi cài lại, nhưng tắt hết thông báo.' },
      { label: 'Giữ như cũ', effects: { happiness: -1, health: -1 },
        text: 'Tôi vẫn lướt mỗi tối. Có hôm cãi nhau với một người tới hai giờ sáng về chuyện chẳng liên quan gì tới mình. Sáng ra, tôi không nhớ người ấy tên gì.' },
    ],
  },
  {
    id: 'ls51-ban-dau-tu-chung-khoan', age: 51, minMoney: 50000000,
    title: 'Lời khuyên của người bạn giàu',
    text: 'Một người bạn kiếm được nhiều tiền nhờ đầu tư, khuyên tôi bỏ tiền dưỡng già vào một mã cổ phiếu “chắc chắn tăng”. Bạn ấy chưa từng nói sai trong mấy năm qua. Đó là gần hết số tiền tôi để dành.',
    choices: [
      { label: 'Bỏ một phần nhỏ', effects: { intelligence: 1 }, money: -10000000, flags: ['dau_tu_nho'],
        text: 'Cổ phiếu lên rồi xuống. Sau một năm, tôi lỗ một ít. Bạn tôi lỗ nhiều hơn. Hai đứa ngồi uống trà, bạn nói: “Lần đầu tao sai.”' },
      { label: 'Không đầu tư', effects: { happiness: 1 },
        text: 'Tôi giữ tiền trong ngân hàng. Sáu tháng sau mã cổ phiếu ấy giảm một nửa. Tôi không nói gì với bạn, chỉ gửi một tin hỏi thăm.' },
    ],
  },
  {
    id: 'ls51-nguoi-quen-cu', age: 51,
    title: 'Người từng làm mình khổ',
    text: 'Ở bệnh viện, tôi gặp người sếp cũ từng chèn ép tôi suốt nhiều năm. Ông ấy ngồi xe lăn, một mình, đang loay hoay với tờ giấy khám bệnh, không biết đi phòng nào. Ông chưa nhận ra tôi.',
    choices: [
      { label: 'Lại giúp ông', effects: { happiness: 2 }, flags: ['giup_sep_cu'],
        text: 'Tôi đẩy xe đưa ông đi làm xét nghiệm. Ông nhận ra tôi, im lặng một lúc lâu, rồi nói: “Ngày đó tôi hơi quá.” Tôi gật đầu. Tôi không biết mình đã tha thứ hay chưa.' },
      { label: 'Gọi nhân viên bệnh viện giúp', effects: { intelligence: 1 },
        text: 'Tôi gọi một y tá tới giúp ông, rồi đi tiếp. Ông không nhận ra tôi. Tôi thấy nhẹ nhõm, và thấy hơi tiếc một điều gì đó.' },
    ],
  },
  {
    id: 'ls51-sep-tre-khong-can', age: 51, needs: ['employed'],
    title: 'Người không còn được hỏi ý',
    text: 'Gần đây các cuộc họp quan trọng không còn mời tôi. Sếp mới nói tôi “cứ làm việc chuyên môn”. Đồng nghiệp trẻ nhìn tôi lịch sự, xa cách. Có một vị trí cố vấn ở công ty nhỏ hơn đang mời.',
    choices: [
      { label: 'Chuyển sang làm cố vấn', effects: { happiness: 2 }, flags: ['lam_co_van'],
        text: 'Lương thấp hơn, nhưng mọi người hỏi ý tôi mỗi ngày. Tôi lại thấy mình có ích. Đôi khi nhớ văn phòng cũ, nhưng không nhớ cảm giác ngồi ngoài cửa phòng họp.' },
      { label: 'Ở lại, làm tốt phần mình', effects: { intelligence: 1, happiness: -1 },
        text: 'Tôi làm việc lặng lẽ, đúng giờ về. Có lần dự án gặp sự cố, sếp mới phải tìm tới tôi. Tôi giúp, không nói gì thêm.' },
    ],
  },
  {
    id: 'ls51-viec-trong-xe', age: 51, needs: ['notEmployed'],
    title: 'Trông giữ xe',
    text: 'Có một việc trông giữ xe ở một tòa nhà, ca đêm, ngồi một chỗ mười hai tiếng. Lương đều, công việc không nặng. Con cái, người thân sẽ thấy tôi ngồi đó mỗi lần đi ngang.',
    choices: [
      { label: 'Nhận việc', effects: { health: -1, happiness: 1 }, money: 5000000, flags: ['giu_xe_dem'],
        text: 'Đêm dài, tôi mang theo sách, đọc hết cả chục cuốn. Có cô sinh viên làm thêm hay ghé hỏi bài, tôi giảng được. Người quen đi ngang, tôi chào trước.' },
      { label: 'Tìm việc khác', effects: { happiness: -1 },
        text: 'Tôi tiếp tục tìm, nhận vài việc lặt vặt. Ba tháng sau, việc trông xe ấy đã có người nhận, một ông cụ còn già hơn tôi.' },
    ],
  },
  {
    id: 'ls51-ban-doi-nghi-huu', age: 51, needs: ['partner'],
    title: '{tenBanDoi} nghỉ sớm',
    text: '{tenBanDoi} được đề nghị nghỉ hưu sớm, nhận một khoản tiền. {tenBanDoi} muốn nhận, để ở nhà chăm sóc bản thân, đi đây đi đó. Tôi lo thu nhập trong nhà giảm, và lo {tenBanDoi} ở nhà sẽ buồn.',
    choices: [
      { label: 'Ủng hộ {tenBanDoi} nghỉ', effects: { happiness: 2 }, flags: ['ban_doi_nghi_huu_som'],
        text: '{tenBanDoi} nghỉ, tháng đầu ngủ bù, tháng thứ hai đăng ký học vẽ, tháng thứ ba đi du lịch với nhóm bạn. Về nhà kể chuyện liên tục. Tiền ít đi, nhưng bữa cơm nói chuyện nhiều hơn.' },
      { label: 'Khuyên làm thêm vài năm', effects: { happiness: -1 },
        text: '{tenBanDoi} ở lại làm. Tối về mệt, ít nói. Có lần {tenBanDoi} nói: “Lúc mình nghỉ được thì chân cũng yếu rồi.” Tôi không biết trả lời sao.' },
    ],
  },
  {
    id: 'ls51-mot-minh-ban-cu', age: 51, needs: ['single'],
    title: 'Người cũ nhắn tin',
    text: 'Một người từng thích tôi thời trẻ, giờ đã góa, nhắn tin hỏi thăm. Người ấy hỏi tôi có muốn đi một chuyến du lịch ngắn cùng nhóm bạn cũ không, có người ấy đi cùng.',
    choices: [
      { label: 'Đi cùng nhóm', effects: { happiness: 3 }, flags: ['di_cung_nguoi_cu'],
        text: 'Ba ngày ở biển, cả nhóm cười như thời sinh viên. Tối cuối, người ấy ngồi cạnh tôi trên bãi cát, kể chuyện người bạn đời đã mất. Hai người im lặng nghe sóng.' },
      { label: 'Từ chối nhẹ nhàng', effects: { intelligence: 1 },
        text: 'Tôi chúc chuyến đi vui. Nhóm gửi ảnh, người ấy đứng ở rìa, cười. Tôi xem tấm ảnh hơi lâu, rồi lưu lại.' },
    ],
  },
  {
    id: 'ls51-chau-dau', age: 51, needs: ['children'], childAge: [23, 35],
    title: 'Đứa cháu đầu',
    text: '{tenCon} sinh con đầu lòng, nhờ tôi lên ở cùng ba tháng để giúp. Lên thì phải bỏ hết nếp sinh hoạt của mình, ngủ không đủ giấc. Con nói nếu không lên được thì sẽ thuê người, không sao.',
    choices: [
      { label: 'Lên ở cùng ba tháng', effects: { happiness: 2, health: -2 }, flags: ['len_trong_chau'],
        text: 'Ba tháng thức đêm, bế cháu, nấu cơm cữ. Có đêm cháu ngủ trên ngực tôi, thở đều. Ngày về, {tenCon} tiễn ra bến xe, nói con không biết sẽ làm sao nếu không có tôi.' },
      { label: 'Gửi tiền thuê người, lên thăm cuối tuần', effects: { happiness: -1 },
        text: 'Cuối tuần nào tôi cũng lên, bế cháu một ngày. Cháu quen người giúp việc hơn quen tôi. Có lần cháu khóc khi tôi bế, đòi người kia.' },
    ],
  },

   
  {
    id: 'ls52-nguoi-than-noi-doi', age: 52,
    title: 'Bản di chúc',
    text: 'Luật sư khuyên tôi lập di chúc, nói ở tuổi này nên làm, để sau này người thân khỏi tranh chấp. Lập di chúc nghĩa là phải nghĩ tới chuyện mình không còn, và phải quyết định ai được gì.',
    choices: [
      { label: 'Lập di chúc ngay', effects: { intelligence: 2, happiness: -1 }, flags: ['lap_di_chuc'],
        text: 'Tôi ngồi với luật sư hai buổi. Có những dòng viết xong phải dừng lại uống nước. Bản di chúc cất trong tủ, tôi thấy nhẹ lòng hơn mình tưởng.' },
      { label: 'Để sau', effects: { happiness: 1 },
        text: 'Tôi nói còn trẻ, chưa cần. Luật sư gật đầu, đưa danh thiếp. Tấm danh thiếp nằm trong ví, cạnh ảnh gia đình.' },
    ],
  },
  {
    id: 'ls52-ban-bi-lua', age: 52,
    title: 'Người bạn bị lừa',
    text: 'Người bạn già gọi điện, khoe sắp nhận một món quà trúng thưởng lớn, chỉ cần chuyển trước phí vận chuyển năm triệu. Tôi nghe là biết lừa đảo. Bạn rất tin, đang trên đường ra ngân hàng.',
    choices: [
      { label: 'Chạy ra ngân hàng chặn bạn', effects: { happiness: 1, health: -1 }, flags: ['chan_ban_bi_lua'],
        text: 'Tôi tới kịp, kéo bạn ngồi xuống ghế chờ. Bạn giận, nói tôi ghen tị. Nửa tiếng sau, người kia gọi giục, nói năng lộ liễu. Bạn ngồi im, rồi xóa số.' },
      { label: 'Gọi người nhà của bạn', effects: { intelligence: 1 },
        text: 'Con trai bạn gọi lại cho bạn, khuyên mãi. Bạn không chuyển tiền. Mấy hôm sau bạn gọi tôi, nói: “Tao già rồi, dễ tin quá.”' },
    ],
  },
  {
    id: 'ls52-chua-benh-ban-than', age: 52,
    title: 'Kết quả sinh thiết',
    text: 'Bác sĩ nói kết quả sinh thiết có tế bào bất thường, cần mổ, có thể không sao, có thể phải điều trị lâu dài. Tôi chưa nói với ai. Mai là sinh nhật một người thân, cả nhà đang chuẩn bị tiệc.',
    choices: [
      { label: 'Nói với người thân ngay', effects: { happiness: 1 }, flags: ['noi_benh_ngay'],
        text: 'Mọi người im lặng, rồi xúm lại. Bữa tiệc vẫn diễn ra, nhưng ai cũng hỏi han tôi. Ca mổ thành công. Tôi nhớ lúc ấy có người nắm tay tôi suốt.' },
      { label: 'Đợi qua sinh nhật mới nói', effects: { happiness: -1 }, flags: ['giu_benh_mot_minh'],
        text: 'Tôi cười cả buổi tiệc. Tối về, ngồi một mình ở bếp rất lâu. Hai ngày sau mới nói. Mọi người trách, nhưng hiểu.' },
    ],
  },
  {
    id: 'ls52-mat-viec-tuoi-lon', age: 52, needs: ['employed'],
    title: 'Người được giữ lại',
    text: 'Công ty cắt giảm, chỉ giữ một trong hai người: tôi hoặc một đồng nghiệp trẻ hơn, đang nuôi con nhỏ, vừa vay mua nhà. Sếp hỏi ý tôi, nói nếu tôi tự nguyện nghỉ, công ty trả thêm một khoản.',
    choices: [
      { label: 'Tự nguyện nghỉ', effects: { happiness: 1 }, money: 30000000, flags: ['tu_nguyen_nghi'],
        text: 'Ngày cuối, đồng nghiệp trẻ ôm tôi, không nói được gì. Tôi ôm thùng giấy ra về, nhẹ nhõm và trống rỗng cùng lúc. Tháng sau, tôi bắt đầu tìm việc khác.' },
      { label: 'Đề nghị công ty quyết theo năng lực', effects: { intelligence: 1 },
        text: 'Công ty giữ tôi lại. Đồng nghiệp trẻ ra đi, nói không trách tôi. Mấy tháng sau, cậu ấy nhắn tin báo đã có việc mới, gửi kèm ảnh con.' },
    ],
  },
  {
    id: 'ls52-viec-moi-tuoi-nam-hai', age: 52, needs: ['notEmployed'],
    title: 'Người bạn mở xưởng',
    text: 'Người bạn mở xưởng mộc nhỏ, rủ tôi về phụ, học nghề từ đầu. Tôi chưa từng cầm đục. Bạn nói tay chân còn dẻo, học được, mà làm đồ gỗ thì càng già càng khéo.',
    choices: [
      { label: 'Về học nghề mộc', effects: { happiness: 2, health: 1 }, flags: ['hoc_nghe_moc'],
        text: 'Ba tháng đầu tay chai, đứt mấy lần. Sáu tháng sau, tôi đóng được chiếc ghế đầu tiên, hơi khập khiễng. Chiếc ghế được đặt ở góc nhà, ai tới cũng phải ngồi thử.' },
      { label: 'Cảm ơn, tìm việc khác', effects: { intelligence: 1 },
        text: 'Tôi tìm được việc bán hàng ở cửa hàng điện máy. Thỉnh thoảng ghé xưởng bạn, ngửi mùi gỗ, nhìn bạn làm. Bạn tặng tôi một cái hộp gỗ nhỏ.' },
    ],
  },
  {
    id: 'ls52-ban-doi-quen', age: 52, needs: ['partner'],
    title: 'Những lần quên',
    text: 'Gần đây {tenBanDoi} hay quên: quên tắt bếp, quên đã hẹn ai, có lần đi chợ về quên đường. {tenBanDoi} cười, nói tại già. Tôi đọc nhiều, sợ là chuyện khác. {tenBanDoi} không muốn đi khám.',
    choices: [
      { label: 'Thuyết phục đi khám', effects: { intelligence: 1, happiness: -1 }, flags: ['ban_doi_di_kham_tri_nho'],
        text: '{tenBanDoi} giận, rồi đồng ý. Bác sĩ nói suy giảm nhận thức nhẹ, chưa nặng, có thể làm chậm lại. Hai đứa về, {tenBanDoi} nắm tay tôi suốt quãng đường.' },
      { label: 'Âm thầm để ý, nhắc nhở', effects: { happiness: -1 },
        text: 'Tôi dán giấy nhắc ở bếp, ở cửa, ghi lịch hẹn giùm. {tenBanDoi} không biết, hoặc biết mà không nói. Mọi thứ vẫn ổn, nhưng tôi ngủ không sâu nữa.' },
    ],
  },
  {
    id: 'ls52-mot-minh-o-voi-ai', age: 52, needs: ['single'],
    title: 'Viện dưỡng lão thăm thử',
    text: 'Tôi đi thăm một viện dưỡng lão có tiếng, để biết trước. Ở đó sạch, yên, có người chăm, có bạn cùng tuổi. Người quản lý nói nên đăng ký giữ chỗ sớm, danh sách chờ mười năm.',
    choices: [
      { label: 'Đăng ký giữ chỗ', effects: { intelligence: 1 }, money: -10000000, flags: ['giu_cho_vien_duong_lao'],
        text: 'Tôi điền đơn, đóng tiền giữ chỗ. Ra về, tôi đi bộ quanh khu vườn của viện, thấy một bà cụ đang trồng hoa. Bà ngẩng lên chào tôi như chào một người hàng xóm sắp tới.' },
      { label: 'Về nghĩ thêm', effects: { happiness: -1 },
        text: 'Tôi về, ngồi nhìn căn nhà của mình. Mọi thứ quen thuộc. Tôi chưa nghĩ ra được câu trả lời, chỉ biết mình chưa muốn rời nơi này.' },
    ],
  },

   
  {
    id: 'ls53-lop-hoc-may-tinh', age: 53,
    title: 'Lớp học cho người lớn tuổi',
    text: 'Phường mở lớp hướng dẫn dùng điện thoại, mạng xã hội, chuyển khoản cho người lớn tuổi. Tôi dùng được những thứ cơ bản, nhưng hay phải nhờ người thân. Lớp học toàn người lớn tuổi hơn tôi.',
    choices: [
      { label: 'Đi học', effects: { intelligence: 2, happiness: 1 }, flags: ['lop_dien_thoai'],
        text: 'Tôi là người trẻ nhất lớp, học nhanh, nên được cô giáo nhờ chỉ lại cho mấy bác. Một bác cầm tay tôi, nói: “Cháu dạy dễ hiểu hơn con bác.”' },
      { label: 'Tự học qua video', effects: { intelligence: 1 },
        text: 'Tôi xem video, tự mày mò. Học được, nhưng có những chỗ xem đi xem lại vẫn không hiểu. Cuối cùng tôi vẫn phải nhờ người thân.' },
    ],
  },
  {
    id: 'ls53-nguoi-ban-thoi-tho', age: 53,
    title: 'Ngôi trường cũ',
    text: 'Ngôi trường tiểu học cũ của tôi sắp bị đập để xây trung tâm thương mại. Hội cựu học sinh kêu gọi ký đơn phản đối, tổ chức buổi gặp mặt cuối cùng ở sân trường. Tôi chưa quay lại đó ba mươi năm.',
    choices: [
      { label: 'Về dự buổi gặp mặt', effects: { happiness: 2 }, flags: ['ve_truong_cu'],
        text: 'Sân trường nhỏ hơn tôi nhớ nhiều. Cây phượng vẫn còn. Tôi đứng ở cửa lớp ba, nhớ mình từng đứng đó nhìn một bình hoa vỡ. Một người bạn cũ tới vỗ vai tôi.' },
      { label: 'Ký đơn, không về', effects: { happiness: -1 },
        text: 'Tôi ký đơn trên mạng. Nhóm gửi ảnh buổi gặp mặt, có tấm chụp cây phượng. Tôi phóng to, tìm cái gốc ngày xưa mình hay bắn bi.' },
    ],
  },
  {
    id: 'ls53-bao-hanh-xe', age: 53,
    title: 'Đứa trẻ đi xe đạp',
    text: 'Một đứa trẻ đi xe đạp quẹt vào xe tôi đang đỗ, làm trầy một mảng sơn. Đứa trẻ sợ khóc, nói nhà nghèo, xin đừng nói với ba mẹ vì sẽ bị đánh. Mảng sơn sửa hết vài trăm nghìn.',
    choices: [
      { label: 'Cho đứa trẻ đi', effects: { happiness: 2 },
        text: 'Tôi xoa đầu đứa trẻ, nói lần sau đi cẩn thận. Đứa trẻ đạp đi, ngoái lại mấy lần. Vết trầy tôi để nguyên, mỗi lần thấy lại nhớ cái mặt mếu máo ấy.' },
      { label: 'Dắt đứa trẻ về nhà, nói chuyện', effects: { intelligence: 1 }, flags: ['dat_tre_ve_nha'],
        text: 'Mẹ đứa trẻ cúi đầu xin lỗi, đòi trả tiền. Tôi không lấy, chỉ dặn chị đừng đánh con. Chị gật đầu. Đứa trẻ nhìn tôi, lần này không khóc.' },
    ],
  },
  {
    id: 'ls53-viec-ban-thoi-gian', age: 53, needs: ['employed'],
    title: 'Làm ít ngày hơn',
    text: 'Công ty cho phép nhân viên lớn tuổi làm bốn ngày một tuần, lương giảm một phần năm. Có thêm một ngày, tôi có thể làm những việc vẫn để dành. Nhưng lương giảm đúng lúc chi phí sức khỏe tăng.',
    choices: [
      { label: 'Làm bốn ngày', effects: { happiness: 2, health: 1 }, flags: ['lam_bon_ngay'],
        text: 'Thứ sáu tôi đi chợ sớm, nấu cơm, đọc sách, đi bộ. Tuần nào cũng có một ngày như vậy, nghe như một kỳ nghỉ nhỏ. Tiền ít đi, tôi bớt mua những thứ không cần.' },
      { label: 'Giữ năm ngày', effects: { intelligence: 1 },
        text: 'Tôi giữ nguyên lịch làm. Tiền đủ cho những lần đi khám. Đồng nghiệp làm bốn ngày kể chuyện thứ sáu của họ, tôi nghe, thấy hơi thèm.' },
    ],
  },
  {
    id: 'ls53-viec-cho-thue-nha', age: 53, needs: ['notEmployed'],
    title: 'Cho thuê phòng',
    text: 'Nhà tôi có một phòng trống. Một cô sinh viên tỉnh lẻ hỏi thuê, giá rẻ, hứa giữ gìn sạch sẽ. Có thêm thu nhập, nhưng nhà sẽ có người lạ, mất đi sự yên tĩnh tôi đã quen.',
    choices: [
      { label: 'Cho thuê', effects: { happiness: 2 }, money: 2000000, flags: ['cho_sinh_vien_thue'],
        text: 'Cô sinh viên ngoan, sáng nào cũng chào. Có tối cô nấu dư, mời tôi ăn cùng. Nhà có tiếng người trở lại. Ngày cô ra trường, cô khóc, hứa sẽ về thăm.' },
      { label: 'Giữ phòng trống', effects: { happiness: -1 },
        text: 'Căn phòng vẫn trống, sạch sẽ. Tôi thỉnh thoảng mở cửa cho thoáng. Thu nhập vẫn chật vật như cũ.' },
    ],
  },
  {
    id: 'ls53-ban-doi-giu-ky-niem', age: 53, needs: ['partner'],
    title: 'Chuyến đi trăng mật muộn',
    text: 'Hồi cưới, hai đứa không có tiền đi trăng mật. {tenBanDoi} gợi ý năm nay đi bù, đúng nơi ngày ấy từng mơ. Chuyến đi tốn một khoản, sức khỏe hai đứa cũng không còn như xưa.',
    choices: [
      { label: 'Đi', effects: { happiness: 4 }, flags: ['trang_mat_muon'],
        text: 'Hai đứa đi chậm, nghỉ nhiều, chụp ảnh như hai đứa trẻ. Tối cuối, {tenBanDoi} nói: “Ba mươi năm trước mà tới đây chắc mình cãi nhau suốt.” Hai đứa cười tới chảy nước mắt.' },
      { label: 'Đi gần, giữ tiền', effects: { happiness: 1, intelligence: 1 },
        text: 'Hai đứa đi một nơi gần, rẻ hơn. Vẫn vui. Tối về, {tenBanDoi} mở tấm ảnh nơi ngày ấy từng mơ, nhìn rất lâu.' },
    ],
  },
  {
    id: 'ls53-mot-minh-hoc-nau', age: 53, needs: ['single'],
    title: 'Bữa cơm cho một người',
    text: 'Tôi nhận ra mấy năm nay mình toàn ăn cơm hộp, ăn cho xong. Một người hàng xóm rủ tôi tham gia nhóm nấu ăn của mấy người sống một mình trong khu, mỗi tuần nấu chung một bữa.',
    choices: [
      { label: 'Tham gia nhóm', effects: { happiness: 3, health: 1 }, flags: ['nhom_nau_an'],
        text: 'Nhóm có năm người, đủ mọi tuổi. Mỗi người nấu một món, ăn chung, kể chuyện. Tối thứ năm thành buổi tối tôi mong nhất tuần.' },
      { label: 'Tự học nấu cho mình', effects: { health: 2 },
        text: 'Tôi học nấu những món đơn giản, ăn ngồi ở bàn chứ không trước tivi. Bữa cơm vẫn một người, nhưng có hoa trên bàn.' },
    ],
  },

   
  {
    id: 'ls54-ban-cu-mat-tri-nho', age: 54,
    title: 'Người bạn không nhớ',
    text: 'Tôi tới thăm người bạn thân thời thanh niên, nghe nói bạn bị lẫn. Bạn nhìn tôi, lịch sự hỏi tôi là ai. Vợ bạn nói bạn hay nhắc tên tôi, nhưng giờ thấy mặt thì không nhận ra.',
    choices: [
      { label: 'Ngồi kể chuyện cũ', effects: { happiness: 1 }, flags: ['ke_chuyen_ban_lan'],
        text: 'Tôi kể chuyện hai đứa trốn học đi xem phim, bị bắt. Bạn nghe, cười, như nghe chuyện người khác. Lúc tôi về, bạn nói: “Chuyện vui ghê, lần sau kể nữa nha.”' },
      { label: 'Ngồi im, nắm tay bạn', effects: { happiness: -1 },
        text: 'Tôi ngồi cạnh bạn, không nói nhiều. Bạn để yên tay trong tay tôi, nhìn ra cửa sổ. Lúc về, vợ bạn nói hôm nay bạn yên hơn mọi ngày.' },
    ],
  },
  {
    id: 'ls54-giup-tre-hang-xom', age: 54,
    title: 'Đứa trẻ nhà bên',
    text: 'Đứa trẻ nhà bên, ba mẹ đi làm xa, ở với bà ngoại già yếu. Chiều nào nó cũng ngồi ở bậc thềm một mình tới tối. Hôm nay nó hỏi tôi có biết làm bài Toán lớp năm không.',
    choices: [
      { label: 'Kèm bài cho nó', effects: { happiness: 3 }, flags: ['kem_bai_tre_hang_xom'],
        text: 'Chiều nào tôi cũng ngồi với nó nửa tiếng. Toán lớp năm khó hơn tôi nhớ. Cuối năm nó được học sinh tiên tiến, chạy sang khoe giấy khen trước cả bà ngoại.' },
      { label: 'Chỉ bài hôm nay', effects: { happiness: 1 },
        text: 'Tôi giảng xong bài hôm đó. Mấy hôm sau nó lại ngồi ở bậc thềm, không hỏi nữa. Tôi đi ngang, chào nó, nó chào lại.' },
    ],
  },
  {
    id: 'ls54-tham-my', age: 54,
    title: 'Những nếp nhăn',
    text: 'Đứa cháu chụp ảnh, tôi nhìn thấy những nếp nhăn mình chưa từng để ý. Một người quen giới thiệu tiêm làm đẹp, nói tuổi này ai cũng làm, chỉ mất vài triệu, nhìn trẻ hẳn.',
    choices: [
      { label: 'Đi tiêm thử', effects: { appearance: 2, happiness: -1 }, flags: ['tiem_dep'],
        text: 'Mặt căng hơn, nhưng cười thấy lạ. Bạn bè khen trẻ ra. Tôi soi gương, không chắc người trong gương là mình.' },
      { label: 'Để nguyên', effects: { happiness: 1 },
        text: 'Tôi lưu tấm ảnh lại. Mỗi nếp nhăn là một năm đã sống. Có những nếp là do cười nhiều, tôi để ý thấy.' },
    ],
  },
  {
    id: 'ls54-dao-tao-tre', age: 54, needs: ['employed'],
    title: 'Lời mời đi giảng',
    text: 'Một trường đại học mời tôi thỉnh giảng, mỗi tuần một buổi tối, chia sẻ kinh nghiệm thực tế cho sinh viên. Thù lao ít, phải chuẩn bị nhiều. Tôi chưa từng đứng lớp.',
    choices: [
      { label: 'Nhận lời', effects: { intelligence: 2, happiness: 2, health: -1 }, money: 3000000, flags: ['thinh_giang'],
        text: 'Buổi đầu tôi nói vấp, sinh viên ngủ gật. Tới buổi thứ năm, sinh viên ở lại hỏi tới khuya. Có một bạn viết email cảm ơn, tôi in ra, dán lên bàn làm việc.' },
      { label: 'Từ chối', effects: { happiness: -1 },
        text: 'Tôi nói không có thời gian. Trường mời người khác. Đôi khi đi ngang trường đại học, tôi nhìn vào sân, thấy sinh viên đi lại.' },
    ],
  },
  {
    id: 'ls54-ban-buon-banh', age: 54, needs: ['notEmployed'],
    title: 'Bánh nhà làm',
    text: 'Bánh tôi làm được hàng xóm khen, có người đặt mua. Một tiệm cà phê đề nghị lấy bánh mỗi ngày, số lượng lớn, phải dậy từ ba giờ sáng làm. Tiền khá, nhưng ở tuổi này dậy ba giờ sáng mỗi ngày không dễ.',
    choices: [
      { label: 'Nhận đơn hàng', effects: { health: -2, happiness: 2 }, money: 6000000, flags: ['ban_banh_quan'],
        text: 'Ba tháng đầu tôi mệt rã, lưng đau. Rồi quen. Khách quán khen bánh, quán ghi tên tôi lên bảng thực đơn. Tôi chụp ảnh tấm bảng, gửi cho tất cả người quen.' },
      { label: 'Chỉ bán cho hàng xóm', effects: { happiness: 1 },
        text: 'Tôi làm bánh khi có người đặt, mỗi tuần vài mẻ. Tiền không nhiều, nhưng tôi vui khi thấy hàng xóm cầm bánh về, có đứa trẻ đứng ngoài cổng chờ.' },
    ],
  },
  {
    id: 'ls54-ban-doi-noi-chuyen-cuoi-doi', age: 54, needs: ['partner'],
    title: 'Ai đi trước',
    text: 'Một tối, {tenBanDoi} hỏi bất ngờ: “Nếu một đứa đi trước, đứa còn lại sẽ sống thế nào?” {tenBanDoi} muốn hai đứa nói chuyện thật nghiêm túc về chuyện ấy, kể cả chuyện tiền bạc, chỗ ở.',
    choices: [
      { label: 'Nói chuyện nghiêm túc', effects: { intelligence: 2 }, flags: ['ban_ve_ai_di_truoc'],
        text: 'Hai đứa nói tới khuya: tài khoản, giấy tờ nhà, ai muốn được chôn ở đâu. Có lúc khóc, có lúc cười. Cuối cùng {tenBanDoi} nói: “Giờ thì yên tâm rồi.” Rồi ngủ ngay.' },
      { label: 'Gạt đi, nói chuyện khác', effects: { happiness: -1 },
        text: 'Tôi nói còn lâu, đừng nói gở. {tenBanDoi} im, rồi gật đầu. Đêm đó tôi nằm nghe tiếng thở của {tenBanDoi}, nghĩ về câu hỏi ấy tới sáng.' },
    ],
  },
  {
    id: 'ls54-mot-minh-don-nha', age: 54, needs: ['single'],
    title: 'Dọn bớt đồ',
    text: 'Nhà tôi đầy đồ: sách cũ, quần áo không mặc, đồ lưu niệm. Một người bạn rủ tôi theo cách sống tối giản, cho bớt đi. Tôi nhìn quanh, đồ nào cũng có một câu chuyện.',
    choices: [
      { label: 'Cho bớt một nửa', effects: { happiness: 2 }, flags: ['don_bot_do'],
        text: 'Tôi chụp ảnh từng món trước khi cho. Căn nhà thoáng hẳn. Có đêm tôi mở lại những tấm ảnh, nhớ ra vài món đã cho, không thấy tiếc như mình tưởng.' },
      { label: 'Giữ lại hết', effects: { happiness: 1 },
        text: 'Tôi sắp xếp lại, dán nhãn từng thùng. Căn nhà vẫn đầy, nhưng ngăn nắp. Đi giữa những thùng đồ, tôi thấy như đi giữa đời mình.' },
    ],
  },

   
  {
    id: 'ls55-tai-nan-nho', age: 55,
    title: 'Cú ngã trong nhà tắm',
    text: 'Tôi trượt chân trong nhà tắm, đập hông, đau mấy ngày. Không gãy gì. Bác sĩ khuyên lắp tay vịn, thảm chống trơn, dùng ghế khi tắm. Tôi thấy những thứ ấy là đồ của người già.',
    choices: [
      { label: 'Lắp đủ hết', money: -10000000, effects: { health: 2 }, flags: ['lap_tay_vin'],
        text: 'Thợ lắp xong trong một buổi. Tay vịn sáng loáng, nhìn lạ mắt. Một tháng sau, tôi vịn vào nó mà không còn nghĩ gì.' },
      { label: 'Chỉ trải thảm chống trơn', money: -500000, effects: { health: 1 },
        text: 'Tôi trải thảm, tắm cẩn thận hơn. Có lần đứng dậy hơi choáng, tôi vịn vào bồn rửa mặt, nghĩ tới cái tay vịn bác sĩ dặn.' },
    ],
  },
  {
    id: 'ls55-ve-que-dam-tang', age: 55,
    title: 'Người thầy cũ mất',
    text: 'Người thầy dạy tôi năm cuối cấp mất, thọ chín mươi tuổi. Gia đình thầy nhờ học trò cũ viết vài dòng để đọc trong lễ tang. Không ai trong lớp nhận viết. Tôi từng được thầy khen văn hay.',
    choices: [
      { label: 'Viết và đọc', effects: { happiness: 2, intelligence: 1 }, flags: ['doc_dieu_van_thay'],
        text: 'Tôi viết một đêm, đọc trong lễ tang, giọng run. Con gái thầy nói thầy hay kể về một học trò mê viết văn. Tôi không biết thầy nói về mình.' },
      { label: 'Gửi vòng hoa, không viết', effects: { happiness: -1 },
        text: 'Một người khác viết, đọc rất trang trọng. Tôi đứng ở cuối, nghe không lọt câu nào. Về nhà, tôi viết vài dòng vào sổ riêng, không cho ai đọc.' },
    ],
  },
  {
    id: 'ls55-dong-nghiep-quay-roi', age: 55, needs: ['employed'],
    title: 'Lời nhận xét không hay',
    text: 'Trong cuộc họp, một đồng nghiệp trẻ nói to rằng những người lớn tuổi làm chậm cả phòng. Mọi người im lặng. Tôi biết câu ấy nhắm vào mình. Trưởng phòng nhìn tôi, chờ phản ứng.',
    choices: [
      { label: 'Trả lời bình tĩnh', effects: { intelligence: 1, happiness: 1 }, flags: ['tra_loi_binh_tinh'],
        text: 'Tôi nói tôi chậm thật, nhưng ít sai. Tôi đưa ra con số những lỗi phòng đã tránh được. Cả phòng gật gù. Đồng nghiệp trẻ ngồi im tới hết buổi họp.' },
      { label: 'Im lặng', effects: { happiness: -2 },
        text: 'Cuộc họp tiếp tục. Tôi ngồi đó, nghe tim mình đập. Tối về, tôi viết một email trả lời rất dài, rồi không gửi.' },
    ],
  },
  {
    id: 'ls55-viec-bao-ve', age: 55, needs: ['notEmployed'],
    title: 'Làm bảo vệ trường học',
    text: 'Trường tiểu học gần nhà cần người bảo vệ, chủ yếu mở cổng, trông xe, giữ trật tự giờ tan học. Lương thấp, nhưng có bảo hiểm, giờ giấc đều. Mỗi ngày sẽ có mấy trăm đứa trẻ chạy qua trước mặt.',
    choices: [
      { label: 'Nhận việc', effects: { happiness: 2 }, money: 4000000, flags: ['bao_ve_truong'],
        text: 'Tụi nhỏ gọi tôi là “bác bảo vệ”. Có đứa ba mẹ hay đón trễ, tôi ngồi chờ cùng nó, mua cho nó cái bánh bao. Tôi nhớ có một người từng ngồi chờ cùng mình như vậy.' },
      { label: 'Tìm việc khác', effects: { happiness: -1 },
        text: 'Tôi đi tìm việc khác, nhận vài việc lặt vặt. Đi ngang trường giờ tan học, tôi dừng lại, nhìn tụi nhỏ ùa ra cổng.' },
    ],
  },
  {
    id: 'ls55-ban-doi-thoi-quen', age: 55, needs: ['partner'],
    title: 'Ba mươi năm một thói quen',
    text: 'Ba mươi năm nay, {tenBanDoi} có một thói quen làm tôi khó chịu: bóp kem đánh răng từ giữa tuýp. Hôm nay tôi nhận ra mình đã nhịn chuyện nhỏ ấy suốt ba mươi năm.',
    choices: [
      { label: 'Nói ra, cười', effects: { happiness: 2 }, flags: ['noi_chuyen_kem'],
        text: '{tenBanDoi} cười ngặt nghẽo, nói biết từ lâu, cố tình làm để xem bao giờ tôi nói. Hôm sau, có hai tuýp kem đánh răng trong nhà tắm, mỗi người một tuýp.' },
      { label: 'Tiếp tục nhịn', effects: { happiness: 1 },
        text: 'Tôi vuốt lại tuýp kem như mọi sáng. Ba mươi năm rồi, thêm một năm cũng được. Có hôm tôi thấy {tenBanDoi} cũng lén vuốt lại tuýp kem giùm tôi.' },
    ],
  },
  {
    id: 'ls55-mot-minh-nuoi-chau', age: 55, needs: ['single'],
    title: 'Đứa cháu cần người chăm',
    text: 'Đứa cháu họ, ba mẹ ly hôn, không ai nhận nuôi trọn vẹn. Người trong họ hỏi tôi có thể nhận nó vài năm, vì tôi sống một mình, có thời gian. Đứa trẻ mười tuổi, rất lặng lẽ.',
    choices: [
      { label: 'Nhận nuôi', effects: { happiness: 2, health: -1 }, flags: ['nuoi_chau'],
        text: 'Năm đầu đứa trẻ không nói chuyện nhiều. Năm thứ hai, nó bắt đầu kể chuyện ở trường. Một tối, nó hỏi tôi: “Có bỏ con đi không?” Tôi nói không.' },
      { label: 'Giúp tiền, không nhận nuôi', effects: { happiness: -1 },
        text: 'Tôi gửi tiền hằng tháng. Đứa trẻ ở với bà nội, già yếu. Mỗi lần về quê, tôi mang quà cho nó. Nó nhận, cảm ơn, rồi đi vào nhà.' },
    ],
  },

   
  {
    id: 'ls56-di-hien-tang', age: 56,
    title: 'Thẻ hiến tạng',
    text: 'Bệnh viện vận động đăng ký hiến mô tạng sau khi mất. Tôi đọc tài liệu, thấy việc này giúp được nhiều người. Nhưng trong họ, nhiều người lớn tuổi cho rằng chết phải còn nguyên vẹn.',
    choices: [
      { label: 'Đăng ký', effects: { happiness: 2 }, flags: ['dang_ky_hien_tang'],
        text: 'Tôi nhận một tấm thẻ nhỏ, cất trong ví. Kể với người thân, có người im lặng, có người khóc. Một người nói: “Vậy cũng là sống tiếp theo cách khác.”' },
      { label: 'Chưa đăng ký', effects: { happiness: -1 },
        text: 'Tôi cất tờ tài liệu vào ngăn kéo. Thỉnh thoảng nghe tin có người được ghép tạng, tôi lại nghĩ tới tờ giấy ấy.' },
    ],
  },
  {
    id: 'ls56-hang-xom-moi', age: 56,
    title: 'Hàng xóm ồn ào',
    text: 'Nhà bên mới có một gia đình trẻ, con nhỏ khóc đêm, tối nào cũng nấu nướng mùi rất nặng. Tôi mất ngủ cả tháng. Họ chào tôi rất lễ phép mỗi sáng, không biết mình làm phiền.',
    choices: [
      { label: 'Sang nói chuyện nhẹ nhàng', effects: { happiness: 1 }, flags: ['noi_chuyen_hang_xom_moi'],
        text: 'Hai vợ chồng trẻ xin lỗi rối rít, lắp thêm quạt hút mùi, dời giường đứa nhỏ sang phòng bên kia. Tuần sau họ mang sang một đĩa bánh. Tôi ngủ ngon hơn.' },
      { label: 'Chịu đựng, mua nút bịt tai', effects: { health: -1 },
        text: 'Tôi đeo nút bịt tai đi ngủ, đóng kín cửa sổ. Ngủ được, nhưng sáng dậy đầu nặng. Mỗi sáng họ vẫn chào, tôi vẫn cười.' },
    ],
  },
  {
    id: 'ls56-nghi-huu-hay-o-lai', age: 56, needs: ['employed'],
    title: 'Người được mời ở lại',
    text: 'Công ty có đợt nghỉ hưu sớm tự nguyện với chế độ tốt. Tôi đủ điều kiện. Nhận thì có một khoản lớn, rảnh tay sáu năm trước tuổi. Ở lại thì vẫn còn việc, còn đồng nghiệp, còn lý do để thức dậy mỗi sáng.',
    choices: [
      { label: 'Nghỉ hưu sớm', effects: { happiness: 2 }, money: 50000000, flags: ['nghi_huu_som'],
        text: 'Tháng đầu, tôi ngủ dậy lúc chín giờ, đi chợ, nấu cơm. Tháng thứ ba bắt đầu thấy ngày dài. Tôi đăng ký đi tình nguyện ở thư viện, mỗi tuần hai buổi.' },
      { label: 'Ở lại làm', effects: { intelligence: 1 },
        text: 'Tôi ở lại. Những người cùng tuổi nghỉ gần hết. Bữa trưa giờ tôi ngồi với tụi trẻ, nghe chuyện của tụi nó, nhiều chuyện tôi không hiểu.' },
    ],
  },
  {
    id: 'ls56-viec-xe-om', age: 56, needs: ['notEmployed'],
    title: 'Chở hàng cho tiệm quen',
    text: 'Tiệm tạp hóa đầu hẻm nhờ tôi chở hàng giao cho khách quanh khu, trả theo chuyến. Việc nhẹ, linh động, nhưng mưa nắng ngoài đường. Bác sĩ dặn tôi hạn chế phơi nắng vì huyết áp.',
    choices: [
      { label: 'Nhận việc', effects: { health: -1, happiness: 1 }, money: 3000000, flags: ['cho_hang_tiem'],
        text: 'Tôi chở hàng mỗi sáng sớm, tránh giờ nắng. Khách quen dần, có bà cụ hay giữ tôi lại uống ly trà. Tôi biết tên gần hết người trong khu.' },
      { label: 'Từ chối', effects: { health: 1 },
        text: 'Tôi giữ sức khỏe, sống bằng tiền dành dụm, tiêu dè sẻn. Ngày nào cũng giống ngày nào, yên, hơi dài.' },
    ],
  },
  {
    id: 'ls56-ban-doi-hoc-cung', age: 56, needs: ['partner'],
    title: 'Chiếc xe máy cũ',
    text: '{tenBanDoi} muốn bán chiếc xe máy cũ hai đứa đi từ hồi mới cưới, giờ hư hỏng nhiều, sửa tốn kém. Tôi muốn giữ lại, dù không đi nữa. Chiếc xe nằm trong góc nhà, phủ bạt.',
    choices: [
      { label: 'Giữ lại, sửa cho chạy được', effects: { happiness: 2 }, flags: ['giu_xe_cu'],
        text: 'Tôi mang xe đi sửa, tốn gần bằng tiền mua xe mới. Chủ nhật, hai đứa chạy một vòng quanh hồ, chậm rì. {tenBanDoi} ngồi sau, ôm eo tôi như ba mươi năm trước.' },
      { label: 'Bán đi', effects: { intelligence: 1 },
        text: 'Người mua là một cậu thanh niên mê xe cổ. Cậu hứa sẽ giữ gìn. Hai đứa đứng ở cổng nhìn cậu chạy đi, {tenBanDoi} nắm tay tôi.' },
    ],
  },
  {
    id: 'ls56-mot-minh-ve-que', age: 56, needs: ['single'],
    title: 'Về quê hay ở lại',
    text: 'Tôi tính chuyện về quê sống những năm tới. Ở quê có họ hàng, không khí trong lành, nhưng ít bệnh viện tốt, bạn bè ở thành phố hết. Ở thành phố thì tiện, nhưng ngày càng thấy mình lạc lõng.',
    choices: [
      { label: 'Về quê', effects: { happiness: 2, health: 1 }, flags: ['ve_que_song_mot_minh'],
        text: 'Năm đầu, họ hàng tới thăm liên tục, mang rau, mang cá. Năm sau ít dần, nhưng tôi đã quen hàng xóm. Đi bệnh viện thì vất vả, phải đi xe hai tiếng.' },
      { label: 'Ở lại thành phố', effects: { intelligence: 1 },
        text: 'Tôi ở lại, tham gia câu lạc bộ người cao tuổi trong phường. Tuần nào cũng có lịch sinh hoạt. Về quê vào dịp giỗ, Tết, như một người khách.' },
    ],
  },
  {
    id: 'ls56-con-ly-hon', age: 56, needs: ['children'], childAge: [28, 40],
    title: 'Con muốn ly hôn',
    text: '{tenCon} gọi điện, khóc, nói muốn ly hôn. Hai vợ chồng trẻ không hợp, cãi nhau triền miên. Họ hàng nói con cái nhỏ, ráng giữ. {tenCon} hỏi tôi nên làm gì.',
    choices: [
      { label: 'Nói: “Con quyết thế nào ba mẹ cũng ở bên”', effects: { happiness: 1 }, flags: ['ung_ho_con_ly_hon'],
        text: '{tenCon} im lặng, rồi khóc to hơn. Sau đó con và người kia đi tư vấn hôn nhân. Một năm sau, hai người chia tay trong hòa bình. {tenCon} nói: “Cảm ơn vì không ép con.”' },
      { label: 'Khuyên con thử thêm', effects: { intelligence: 1 },
        text: '{tenCon} nghe lời, thử thêm một năm. Có những tháng khá hơn, có những tháng tệ hơn. Cuối cùng con vẫn ly hôn, nhẹ nhàng, nói ít ra mình đã thử hết.' },
    ],
  },

   
  {
    id: 'ls57-tro-lai-truong', age: 57,
    title: 'Lớp học tiếng nước ngoài',
    text: 'Tôi muốn học một ngoại ngữ để đi du lịch tự túc khi về già. Lớp học toàn sinh viên. Giáo viên nói người lớn tuổi học chậm, nhưng nhớ lâu. Học phí bằng một tháng chi tiêu.',
    choices: [
      { label: 'Đăng ký', effects: { intelligence: 3 }, money: -5000000, flags: ['hoc_ngoai_ngu_57'],
        text: 'Tôi học chậm thật, phải ghi chép nhiều. Tụi sinh viên giúp tôi luyện nói giờ giải lao. Một năm sau, tôi gọi được món ăn bằng thứ tiếng ấy, người phục vụ hiểu.' },
      { label: 'Học qua ứng dụng', effects: { intelligence: 1 },
        text: 'Mỗi ngày tôi học mười lăm phút trên điện thoại. Học được mấy trăm từ. Nói thì chưa dám nói với ai.' },
    ],
  },
  {
    id: 'ls57-hien-mau-gia', age: 57,
    title: 'Người đồng hương xa',
    text: 'Một người đồng hương tôi chưa từng gặp nhắn tin, nhờ tìm giúp mộ người thân bị thất lạc từ thời chiến, chỉ có vài thông tin mơ hồ. Việc này có thể mất rất nhiều thời gian, đi lại nhiều.',
    choices: [
      { label: 'Nhận giúp', effects: { happiness: 2, health: -1 }, flags: ['tim_mo_giup'],
        text: 'Tôi đi hỏi các cụ già trong làng, lục sổ sách ở xã. Sáu tháng sau tìm được một ngôi mộ không tên, khớp với mô tả. Người đồng hương bay về, quỳ trước mộ rất lâu.' },
      { label: 'Chỉ cho số người có thể giúp', effects: { intelligence: 1 },
        text: 'Tôi giới thiệu một nhóm chuyên tìm mộ liệt sĩ. Họ nhận lời. Một năm sau, người đồng hương nhắn: đã tìm được. Tin nhắn kèm ảnh một nén nhang.' },
    ],
  },
  {
    id: 'ls57-chuyen-giao-viec', age: 57, needs: ['employed'],
    title: 'Bài học cuối',
    text: 'Còn vài năm nữa tôi nghỉ hưu. Một nhân viên trẻ hỏi xin tôi dạy những kỹ năng không có trong tài liệu: cách nói chuyện với khách khó, cách xử lý khi có sai sót. Dạy thì mất thêm thời gian ngoài giờ.',
    choices: [
      { label: 'Dạy cậu ấy', effects: { happiness: 2 }, flags: ['day_nguoi_tre'],
        text: 'Mỗi tuần tôi ngồi với cậu ấy hai buổi, kể chuyện, chỉ việc. Cậu ghi chép kỹ. Một năm sau, cậu xử lý một khách khó y như tôi từng làm. Tôi đứng xa, không nói gì.' },
      { label: 'Gửi cậu ấy tài liệu', effects: { intelligence: 1 },
        text: 'Tôi gom những ghi chép cũ, gửi cho cậu. Cậu cảm ơn, đọc kỹ. Có những chuyện không viết ra được, cậu phải tự học, tự vấp.' },
    ],
  },
  {
    id: 'ls57-viec-tu-thien', age: 57, needs: ['notEmployed'],
    title: 'Bếp ăn từ thiện',
    text: 'Một bếp ăn từ thiện cho bệnh nhân nghèo cần người nấu buổi sáng, không có lương, chỉ có bữa trưa. Tôi đang không có việc, thời gian nhiều, tiền không có thêm.',
    choices: [
      { label: 'Tham gia', effects: { happiness: 3 }, flags: ['bep_tu_thien'],
        text: 'Sáng nào tôi cũng tới từ năm giờ, nấu cùng mấy người khác. Một người bệnh nhân lâu năm nhớ mặt tôi, hay nói: “Hôm nay canh ngon.” Tôi thấy mình được trả công.' },
      { label: 'Tìm việc có lương trước', effects: { intelligence: 1 },
        text: 'Tôi tiếp tục tìm việc, nhận được một chỗ bán thời gian. Tháng nào dư tiền, tôi mang tới bếp ăn một bao gạo.' },
    ],
  },
  {
    id: 'ls57-ban-doi-benh-tri-nho', age: 57, needs: ['partner'],
    title: 'Ngày {tenBanDoi} quên tên',
    text: 'Sáng nay, {tenBanDoi} gọi tôi bằng một cái tên khác. Rồi giật mình, xin lỗi, cười gượng. Đây là lần thứ ba trong tháng. {tenBanDoi} hỏi tôi: “Mình có bị gì không?”',
    choices: [
      { label: 'Nói thật mình lo, đi khám cùng', effects: { intelligence: 1 }, flags: ['di_kham_tri_nho_cung'],
        text: 'Hai đứa đi khám. Bác sĩ nói có dấu hiệu suy giảm trí nhớ, cần theo dõi. Trên đường về, {tenBanDoi} nói: “Nếu sau này quên mình, mình nhớ nhắc nha.” Tôi gật đầu.' },
      { label: 'Nói: “Ai cũng vậy mà”', effects: { happiness: 1 },
        text: '{tenBanDoi} cười, yên tâm. Tôi để ý thêm. Có những ngày bình thường, có những ngày không. Tôi bắt đầu ghi lại những ngày ấy vào một cuốn sổ.' },
    ],
  },
  {
    id: 'ls57-mot-minh-gap-lai', age: 57, needs: ['single'],
    title: 'Bạn đồng hành',
    text: 'Ở câu lạc bộ đi bộ buổi sáng, có một người cũng sống một mình, hay đi cạnh tôi. Người ấy rủ tôi đi một chuyến du lịch theo nhóm, hai người sẽ ở chung phòng cho rẻ. Hàng xóm đã bắt đầu bàn tán.',
    choices: [
      { label: 'Đi cùng', effects: { happiness: 3 }, money: -5000000, flags: ['ban_dong_hanh'],
        text: 'Chuyến đi vui. Hai người ngủ hai giường, nói chuyện tới khuya. Về, hàng xóm hỏi, tôi cười không trả lời. Sáng hôm sau, hai người lại đi bộ cùng nhau.' },
      { label: 'Từ chối vì lời ra tiếng vào', effects: { happiness: -1 },
        text: 'Người ấy đi với người khác. Sáng hôm sau đi bộ, người ấy vẫn chào, nhưng không đi cạnh tôi nữa. Tôi đi một mình, nhanh hơn.' },
    ],
  },
  {
    id: 'ls57-chau-noi-ngoai', age: 57, needs: ['children'], childAge: [28, 40],
    title: 'Trông cháu',
    text: '{tenCon} nhờ tôi trông cháu mỗi ngày để hai vợ chồng đi làm. Cháu bốn tuổi, hiếu động. Tôi thương cháu, nhưng sức khỏe không còn như trước, cũng có những dự định riêng.',
    choices: [
      { label: 'Nhận trông cháu', effects: { happiness: 2, health: -2 }, flags: ['trong_chau'],
        text: 'Ngày nào cũng mệt rã. Nhưng chiều nào cháu cũng ôm tôi, đòi kể chuyện. Tôi kể chuyện hồi nhỏ của ba mẹ nó. Cháu cười ngặt nghẽo, hỏi: “Thật hả?”' },
      { label: 'Trông vài ngày một tuần', effects: { happiness: 1 },
        text: 'Tôi trông cháu ba ngày, hai ngày còn lại {tenCon} gửi trường. Tôi vẫn có thời gian đi tập thể dục, gặp bạn. Cháu thuộc lịch, sáng thứ ba thứ năm tự đứng ở cửa chờ tôi.' },
    ],
  },

   
  {
    id: 'ls58-di-thi-the-thao', age: 58,
    title: 'Giải cầu lông người cao tuổi',
    text: 'Câu lạc bộ cầu lông rủ tôi tham gia giải đấu cho người trên năm mươi lăm tuổi. Tôi chơi được, nhưng đầu gối hay đau. Đồng đội nói thiếu một người là không đủ đội.',
    choices: [
      { label: 'Tham gia', effects: { health: -1, happiness: 3 }, flags: ['giai_cau_long'],
        text: 'Đội tôi thua ở vòng hai. Tôi đánh được một trận thắng, đầu gối đau cả tuần. Cả đội đi ăn sau giải, cười như vừa vô địch.' },
      { label: 'Đi cổ vũ thôi', effects: { happiness: 1 },
        text: 'Đội tìm được người khác. Tôi ngồi khán đài, hò hét. Hết giải, cả đội kéo tôi xuống chụp ảnh, nói tôi là thành viên danh dự.' },
    ],
  },
  {
    id: 'ls58-nghe-tin-ban-gia', age: 58,
    title: 'Người bạn vào viện dưỡng lão',
    text: 'Người bạn thân vào viện dưỡng lão, con cái ở xa không chăm được. Bạn gọi điện, giọng buồn, nói ở đó không quen ai. Viện cách nhà tôi một tiếng đi xe.',
    choices: [
      { label: 'Hẹn thăm mỗi tuần', effects: { happiness: 2 }, money: -2000000, flags: ['tham_ban_vien_duong_lao'],
        text: 'Chủ nhật nào tôi cũng tới, mang theo bánh, báo. Bạn giới thiệu tôi với mấy người trong viện. Dần dần bạn có bạn mới. Có tuần bạn bận chơi cờ, nói tôi về sớm.' },
      { label: 'Gọi điện thường xuyên', effects: { happiness: 1 },
        text: 'Tôi gọi điện mỗi tối, nghe bạn kể chuyện trong viện. Bạn nói gọi vậy là vui rồi. Tôi định thăm, rồi dời mãi.' },
    ],
  },
  {
    id: 'ls58-giu-gin-nha', age: 58,
    title: 'Sửa lại căn nhà',
    text: 'Căn nhà tôi ở hai mươi năm đã xuống cấp: thấm dột, điện cũ, cầu thang dốc. Sửa lớn thì tốn một khoản không nhỏ. Không sửa thì ở tạm cũng được, nhưng càng già càng khó.',
    choices: [
      { label: 'Sửa lại cho người già ở', money: -100000000, effects: { health: 2, happiness: 1 }, flags: ['sua_nha_cho_gia'],
        text: 'Thợ làm ba tháng. Cầu thang thoai thoải hơn, có tay vịn, phòng ngủ dời xuống tầng trệt. Khoản chi lớn, nhưng nhà như mới. Tôi đi lại dễ dàng.' },
      { label: 'Sửa những chỗ hỏng thôi', money: -20000000, effects: { intelligence: 1 },
        text: 'Tôi sửa mái dột, thay dây điện. Cầu thang vẫn dốc, mỗi lần lên xuống tôi đi chậm, vịn tường. Tiền vẫn còn, để dành.' },
    ],
  },
  {
    id: 'ls58-khach-hang-cu', age: 58, needs: ['employed'],
    title: 'Khách hàng ba mươi năm',
    text: 'Một khách hàng quen từ ba mươi năm trước gọi, đòi chỉ làm việc với tôi, không chịu người trẻ. Sếp muốn tôi chuyển giao dần cho người mới, vì vài năm nữa tôi nghỉ hưu.',
    choices: [
      { label: 'Đưa người mới đi gặp khách', effects: { intelligence: 1 }, flags: ['chuyen_giao_khach'],
        text: 'Tôi giới thiệu người mới, kể chuyện ba mươi năm làm ăn. Khách cười, nói tin người tôi tin. Người mới cúi chào rất thấp.' },
      { label: 'Tiếp tục tự làm', effects: { happiness: 1 },
        text: 'Khách hàng hài lòng. Sếp nhắc mấy lần. Tôi biết đến lúc phải chuyển, nhưng chưa nỡ.' },
    ],
  },
  {
    id: 'ls58-viec-dan-sach', age: 58, needs: ['notEmployed'],
    title: 'Tiệm sách cũ',
    text: 'Ông chủ tiệm sách cũ gần nhà già yếu, muốn tìm người trông tiệm buổi chiều. Lương ít, khách vắng. Nhưng tôi sẽ được ngồi giữa những kệ sách, đọc cả chiều.',
    choices: [
      { label: 'Nhận việc', effects: { happiness: 3, intelligence: 1 }, money: 2000000, flags: ['trong_tiem_sach'],
        text: 'Chiều nào tôi cũng ngồi trong tiệm, đọc sách, chờ khách. Có cậu học sinh hay tới đọc chùa, tôi để yên. Ông chủ nói: “Tôi cũng từng để yên cho một đứa như vậy.”' },
      { label: 'Tìm việc có lương cao hơn', effects: { intelligence: 1 },
        text: 'Tôi tìm được việc khác, lương khá hơn. Thỉnh thoảng ghé tiệm sách mua vài cuốn. Ông chủ nhận ra, giảm giá cho tôi.' },
    ],
  },
  {
    id: 'ls58-ban-doi-hen-ho', age: 58, needs: ['partner'],
    title: 'Buổi hẹn như ngày xưa',
    text: '{tenBanDoi} đề nghị một buổi tối hẹn hò đúng như ngày mới quen: ăn ở quán cũ, đi bộ ở con đường cũ, mặc đẹp. Quán cũ đã đổi chủ, con đường cũ giờ đông xe. Tôi thấy hơi ngượng.',
    choices: [
      { label: 'Đi', effects: { happiness: 3 }, money: -1000000, flags: ['hen_ho_nhu_xua'],
        text: 'Quán đổi chủ, món ăn khác, nhưng cái bàn trong góc vẫn còn. Hai đứa ngồi đúng chỗ ấy, kể chuyện hôm đầu gặp nhau. Mỗi người nhớ một kiểu, cãi nhau rất vui.' },
      { label: 'Đề nghị làm ở nhà', effects: { happiness: 1 },
        text: 'Hai đứa nấu món ngày xưa, ăn dưới ánh nến. Đồ ăn hơi khét. {tenBanDoi} vẫn khen ngon, như ngày xưa từng khen.' },
    ],
  },
  {
    id: 'ls58-mot-minh-nhan-nuoi-meo', age: 58, needs: ['single'],
    title: 'Con mèo hoang ở cửa',
    text: 'Có con mèo hoang hay tới cửa nhà tôi xin ăn. Gần đây nó dẫn theo ba con mèo con. Hàng xóm phàn nàn mèo kêu ồn. Tôi không biết mình có đủ sức chăm bốn con mèo không.',
    choices: [
      { label: 'Nhận nuôi cả bốn', effects: { happiness: 3, health: -1 }, flags: ['nuoi_bon_meo'],
        text: 'Nhà đầy tiếng mèo. Tôi đi tiêm phòng, triệt sản cho cả bốn, tốn một khoản. Tối nào cũng có bốn con mèo nằm quanh chân. Hàng xóm thôi phàn nàn khi thấy mèo được nuôi đàng hoàng.' },
      { label: 'Tìm người nhận mèo con', effects: { intelligence: 1 },
        text: 'Tôi đăng bài, ba con mèo con có người nhận. Con mèo mẹ vẫn tới cửa mỗi tối. Tôi để sẵn cho nó một chén cơm.' },
    ],
  },

   
  {
    id: 'ls59-ky-niem-60', age: 59,
    title: 'Sắp sáu mươi',
    text: 'Sắp sáu mươi tuổi. Người thân muốn tổ chức mừng thọ thật lớn. Tôi muốn dùng số tiền ấy làm một việc có ích hơn: xây một cây cầu nhỏ ở quê, nơi tụi trẻ phải lội suối đi học.',
    choices: [
      { label: 'Góp tiền xây cầu', money: -10000000, effects: { happiness: 4 }, flags: ['xay_cau'],
        text: 'Cây cầu xây xong sau sáu tháng, nhỏ, bằng xi măng. Ngày khánh thành, tụi nhỏ chạy qua lại trên cầu, cười. Người làng gắn một tấm biển nhỏ, tôi xin họ đừng ghi tên mình.' },
      { label: 'Làm tiệc nhỏ, góp một phần', effects: { happiness: 2 },
        text: 'Tiệc nhỏ, ấm cúng. Tôi góp một phần tiền vào quỹ xây cầu của xã. Năm sau cây cầu mới xong, tôi về đi qua đó một lần.' },
    ],
  },
  {
    id: 'ls59-suc-khoe-tim', age: 59,
    title: 'Hai chọn lựa',
    text: 'Bác sĩ nói tim tôi có vấn đề, có hai cách: đặt stent, nhanh, tốn tiền; hoặc uống thuốc lâu dài, thay đổi lối sống, rẻ hơn nhưng rủi ro cao hơn. Bác sĩ để tôi chọn.',
    choices: [
      { label: 'Đặt stent', money: -80000000, effects: { health: 3 }, flags: ['dat_stent'],
        text: 'Ca can thiệp nhanh, nằm viện ba ngày. Tiền dành dụm vơi đi nhiều. Về nhà, tôi leo được cầu thang mà không thở dốc. Lâu rồi mới thấy lại cảm giác ấy.' },
      { label: 'Uống thuốc, đổi lối sống', money: -6000000, effects: { health: 1, intelligence: 1 },
        text: 'Tôi bỏ thịt mỡ, đi bộ mỗi ngày, uống thuốc đúng giờ. Tim ổn định. Mỗi lần đi khám, tôi lại hồi hộp chờ bác sĩ đọc kết quả.' },
    ],
  },
  {
    id: 'ls59-viet-hoi-ky', age: 59,
    title: 'Những trang hồi ký',
    text: 'Tôi bắt đầu viết lại những chuyện đời mình, để người thân đọc. Viết tới những đoạn không vui, tôi không biết có nên viết thật không: những lần mình sai, những người mình làm tổn thương.',
    choices: [
      { label: 'Viết thật hết', effects: { intelligence: 2, happiness: 1 }, flags: ['hoi_ky_that'],
        text: 'Có những trang viết xong phải đi ra ngoài đứng một lúc. Cuốn hồi ký dày dần. Tôi không biết ai sẽ đọc, nhưng thấy đã nói được điều mình cần nói.' },
      { label: 'Chỉ viết những chuyện đẹp', effects: { happiness: 2 },
        text: 'Cuốn hồi ký đầy những kỷ niệm vui. Đọc lại, thấy đời mình đẹp. Những chuyện không viết, tôi vẫn nhớ.' },
    ],
  },
  {
    id: 'ls59-chuan-bi-nghi-huu', age: 59, needs: ['employed'],
    title: 'Ba năm cuối',
    text: 'Còn ba năm nữa nghỉ hưu. Công ty có dự án lớn cuối cùng, cần người dẫn dắt, kéo dài ba năm, rất mệt. Nhận thì kết thúc sự nghiệp bằng một dấu ấn. Không nhận thì ba năm cuối nhẹ nhàng.',
    choices: [
      { label: 'Nhận dự án', effects: { intelligence: 2, health: -2 }, flags: ['du_an_cuoi'],
        text: 'Ba năm làm việc như hồi trẻ. Dự án hoàn thành ngay trước khi tôi nghỉ. Ngày chia tay, cả phòng đứng dậy vỗ tay. Tôi về nhà, ngủ một giấc dài nhất đời.' },
      { label: 'Ba năm nhẹ nhàng', effects: { happiness: 2 },
        text: 'Tôi làm việc vừa phải, về đúng giờ, chuẩn bị cho cuộc sống sau nghỉ hưu. Người khác dẫn dắt dự án. Tôi giúp khi được hỏi.' },
    ],
  },
  {
    id: 'ls59-chua-co-viec-on-dinh', age: 59, needs: ['notEmployed'],
    title: 'Những năm còn lại',
    text: 'Gần sáu mươi, tôi vẫn chưa có việc ổn định, sống nhờ tiền dành dụm và vài việc lặt vặt. Một người bạn rủ góp vốn mở một quán nước nhỏ cho hai đứa có việc làm, có chỗ ngồi chơi.',
    choices: [
      { label: 'Góp vốn mở quán', money: -30000000, effects: { happiness: 3 }, flags: ['quan_nuoc_gia'],
        text: 'Quán nhỏ đầu hẻm, toàn khách quen là người già. Tiền lời đủ tiền chợ. Chiều nào hai đứa cũng ngồi đánh cờ, khách tới thì tự rót trà.' },
      { label: 'Giữ tiền, sống tằn tiện', effects: { intelligence: 1 },
        text: 'Tôi giữ tiền, tiêu dè sẻn. Bạn mở quán với người khác. Chiều nào tôi cũng ghé uống ly trà, trả tiền đầy đủ.' },
    ],
  },
  {
    id: 'ls59-ban-doi-chon-noi-gia', age: 59, needs: ['partner'],
    title: 'Nơi để già',
    text: '{tenBanDoi} muốn tìm một nơi để sống những năm cuối: một căn hộ có thang máy, gần bệnh viện. Căn nhà hiện tại có nhiều kỷ niệm, nhưng cầu thang dốc, xa bệnh viện. Bán thì mới đủ tiền.',
    choices: [
      { label: 'Bán nhà, chuyển đi', effects: { health: 2, happiness: -1 }, flags: ['ban_nha_chuyen_di'],
        text: 'Ngày dọn đi, hai đứa đứng giữa căn nhà trống. {tenBanDoi} chạm tay lên vết bút chì đánh dấu chiều cao của con năm nào trên khung cửa. Căn hộ mới có thang máy, sạch sẽ, xa lạ.' },
      { label: 'Ở lại, sửa cho tiện', effects: { happiness: 1 },
        text: 'Hai đứa sửa lại nhà, dời phòng ngủ xuống dưới. Cầu thang vẫn dốc, nhưng ít khi phải lên. Vết bút chì trên khung cửa vẫn còn đó.' },
    ],
  },
  {
    id: 'ls59-mot-minh-an-tang', age: 59, needs: ['single'],
    title: 'Chuyện hậu sự',
    text: 'Tôi sống một mình, không con cái. Tôi muốn sắp xếp trước chuyện hậu sự, để sau này không làm phiền ai. Người thân nghe thì gạt đi, nói còn trẻ, nói gở.',
    choices: [
      { label: 'Tự sắp xếp, ghi rõ', effects: { intelligence: 2 }, flags: ['sap_xep_hau_su'],
        text: 'Tôi gặp luật sư, viết rõ từng điều, mua sẵn một chỗ ở nghĩa trang gần quê. Xong việc, tôi đi uống một ly cà phê, thấy lòng nhẹ như vừa trả xong một món nợ.' },
      { label: 'Nói chuyện với người thân trước', effects: { happiness: 1 },
        text: 'Lần đầu người thân nghe hết, không gạt đi. Có người hứa sẽ lo, có người nói sẽ thay phiên. Tôi không biết họ có nhớ không, nhưng đã có người nghe.' },
    ],
  },

   
  {
    id: 'ls-cay-xoai-nha-cu', ages: [50, 70], requires: ['cay_xoai'], blocks: ['chuyen_nha'],
    title: 'Cây xoài trong sân cũ',
    text: 'Căn nhà thời thơ ấu được rao bán, chủ mới muốn chặt cây xoài để xây thêm phòng. Cây xoài ba trồng năm tôi bốn tuổi giờ cao hơn mái nhà, chỗ nhánh gãy năm xưa vẫn là một cái mấu u.',
    choices: [
      { label: 'Xin chủ mới giữ lại cây', effects: { happiness: 2 }, flags: ['giu_cay_xoai'],
        text: 'Tôi kể chuyện cây xoài, chuyện nhánh gãy. Chủ mới nghe, gật đầu, sửa bản vẽ để giữ cây. Năm sau, họ gửi cho tôi một thùng xoài, kèm ảnh cây đầy trái.' },
      { label: 'Xin một nhánh về ghép', effects: { happiness: 1 }, flags: ['ghep_cay_xoai'],
        text: 'Tôi cắt một nhánh mang về, nhờ người ghép vào gốc mới ở nhà mình. Cây xoài cũ bị chặt. Cây con của nó lớn chậm, năm thứ năm mới ra trái.' },
    ],
  },
  {
    id: 'ls-tu-toc-bac', ages: [50, 62], requiresAny: ['cho_tu_vay', 'cho_tu_vay_mot_nua', 'du_cuoi_tu', 'tu_o_nho'],
    title: 'Tú lên thăm',
    text: 'Tú lên thành phố đi khám bệnh, ghé thăm tôi. Tóc Tú bạc gần hết, đi đứng chậm. Tú nói bác sĩ bảo phải mổ, đang đắn đo. Tú hỏi tôi có biết bác sĩ nào tốt không.',
    choices: [
      { label: 'Đưa Tú đi khám, ở lại cùng', effects: { happiness: 3, health: -1 }, flags: ['dua_tu_di_kham'],
        text: 'Tôi đưa Tú đi khám ở chỗ quen, ngồi chờ suốt buổi. Ca mổ thành công. Tối trong viện, Tú nói: “Hồi nhỏ mày cho tao con diều, giờ mày cho tao cái mạng.” Hai đứa cười.' },
      { label: 'Giới thiệu bác sĩ quen', effects: { happiness: 1 },
        text: 'Tôi gọi điện nhờ người quen. Tú được khám sớm, mổ tốt. Về quê, Tú gửi lên một thùng đồ quê, kèm cái mô hình máy bay đã lắp xong: “Trả lại mày.”' },
    ],
  },
  {
    id: 'ls-con-cho-gia', ages: [48, 60], requires: ['con_nuoi_cho'],
    title: 'Con chó của con',
    text: 'Con chó {tenCon} nuôi hồi nhỏ giờ đã già, mắt mờ, đi lại khó. {tenCon} ở xa, gọi điện hỏi thăm nó mỗi tuần. Bác sĩ thú y nói nó không còn bao lâu, hỏi tôi có muốn báo con về không.',
    choices: [
      { label: 'Báo con về', effects: { happiness: 1 }, flags: ['con_ve_tien_cho'],
        text: '{tenCon} về, ngồi ôm nó cả đêm. Sáng hôm sau, nó ra đi trong lòng con. {tenCon} tự tay chôn nó dưới gốc cây sau nhà, như tôi từng chôn con chó của mình năm nào.' },
      { label: 'Tự lo, kể với con sau', effects: { happiness: -1 },
        text: 'Tôi chăm nó tới ngày cuối. Gọi báo, {tenCon} im lặng rất lâu, rồi nói: “Sao không cho con về?” Tôi không biết trả lời sao.' },
    ],
  },
  {
    id: 'ls-tre-do-dau-lon', ages: [52, 65], requires: ['do_dau_tre'],
    title: 'Đứa trẻ năm ấy',
    text: 'Đứa trẻ tôi đỡ đầu ở chùa năm nào giờ đã đi làm, gọi điện mời tôi tới dự lễ cưới. Nó nói muốn tôi ngồi ở vị trí phụ huynh, vì nó không có ba mẹ, chỉ có tôi.',
    choices: [
      { label: 'Nhận lời ngồi ghế phụ huynh', effects: { happiness: 4 }, flags: ['ngoi_ghe_phu_huynh'],
        text: 'Tôi mặc bộ đồ đẹp nhất, ngồi ở hàng ghế đầu. Lúc làm lễ, nó quỳ lạy tôi. Tôi đỡ nó dậy, tay run, không nói được câu nào.' },
      { label: 'Tới dự, ngồi ghế khách', effects: { happiness: 2 },
        text: 'Tôi nói chỗ ấy nên để cho sư cô đã nuôi nó. Nó gật đầu. Trong lễ, nó vẫn đi tới bàn tôi trước tiên, cúi chào rất thấp.' },
    ],
  },
  {
    id: 'ls-nha-cu-giu-lai', ages: [50, 75], requires: ['giu_nha_cu'],
    title: 'Mái nhà dột',
    text: 'Căn nhà ba mẹ để lại, tôi giữ suốt mấy năm nay, giờ mái dột, cột mối mọt. Người cô trông nhà đã già, không trông được nữa. Sửa lại thì tốn kém, mà tôi chỉ về mỗi năm vài lần.',
    choices: [
      { label: 'Sửa lại, cho người trong họ ở', effects: { happiness: 2 }, money: -60000000, flags: ['nha_cu_co_nguoi_o'],
        text: 'Một đứa cháu trong họ mới cưới, chưa có nhà, dọn về ở. Nhà có tiếng trẻ con. Mỗi lần tôi về giỗ, tụi nó dọn sẵn phòng cũ của tôi, chiếc giường vẫn kê ở chỗ cũ.' },
      { label: 'Bán đi', effects: { happiness: -1 }, money: 120000000,
        text: 'Tôi bán nhà, chia tiền cho người cô một phần. Ngày giao nhà, tôi ngồi lại ở bậc thềm một lúc, nhặt một viên gạch vỡ mang về.' },
    ],
  },
];
