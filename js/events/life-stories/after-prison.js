// A record opens the story; choices leave permanent flags, progress uses current lifePath.
export const afterPrisonStories = [
  {
    id: 'ls-tro-ve-ho-so', ages: [19, 100], needs: ['criminalRecord', 'outsidePrison'],
    title: 'Tờ giấy trong túi',
    text: 'Tôi mang giấy ra trại tới nơi hỗ trợ việc làm. Người tiếp nhận đặt một tờ đăng ký trước mặt, hỏi tôi muốn kể chuyện cũ ngay hay hẹn một buổi riêng. Tôi kéo ghế lại để trả lời.',
    choices: [
      { label: 'Kể ngay chuyện của mình', effects: { happiness: -2, intelligence: 1 }, flags: ['tro_ve_ke_chuyen'], text: 'Tôi kể chậm từng đoạn. Người tiếp nhận ghi lại rồi hẹn tôi quay lại với một người có thể xác nhận quá trình sinh hoạt. Những người ngoài cửa vẫn nghe tiếng tôi.' },
      { label: 'Hẹn một buổi riêng', effects: { happiness: 1, intelligence: -1 }, flags: ['tro_ve_hen_rieng'], text: 'Tôi nhận lịch hẹn và cất giấy vào túi. Không ai ngoài bàn tiếp nhận nghe chuyện cũ, nhưng tôi phải chờ thêm trước khi hồ sơ được xem tiếp.' },
    ],
  },
  {
    id: 'ls-tro-ve-nguoi-xac-nhan', ages: [20, 101], needs: ['criminalRecord', 'outsidePrison'], requiresAny: ['tro_ve_ke_chuyen', 'tro_ve_hen_rieng'],
    title: 'Một người ký tên',
    text: 'Người phụ trách hồ sơ gọi lại, nhắc tôi cần người xác nhận những việc đang làm. Một người hàng xóm đồng ý gặp, nhưng muốn biết cả chuyện trong bản án. Tôi ngồi trước cổng nhà, nghĩ xem sẽ mở lời thế nào.',
    choices: [
      { label: 'Mang giấy sang nói rõ', effects: { happiness: -2, intelligence: 2 }, flags: ['tro_ve_nho_xac_nhan'], playerUpdates: { lifePath: 'reformed' }, text: 'Tôi mang giấy sang và trả lời từng câu. Người hàng xóm chưa ký ngay, chỉ hẹn cùng làm những việc chung rồi tính tiếp. Tôi ghi ngày hẹn vào mặt sau tờ giấy.' },
      { label: 'Xin thêm thời gian chuẩn bị', effects: { happiness: 1, intelligence: -1 }, flags: ['tro_ve_chuan_bi'], text: 'Tôi xin lùi buổi gặp. Người hàng xóm gấp tờ giấy lại, bảo khi nào sẵn sàng thì sang. Chỗ ký tên vẫn để trống, còn tôi giữ được một buổi tối yên tĩnh.' },
    ],
  },
  {
    id: 'ls-tro-ve-cuoc-hen', ages: [21, 102], needs: ['criminalRecord', 'outsidePrison'], requiresAny: ['tro_ve_nho_xac_nhan', 'tro_ve_chuan_bi'],
    title: 'Lịch hẹn cuối tuần',
    text: 'Người hàng xóm gửi lịch sửa phòng sinh hoạt chung. Cùng hôm đó, một người quen cũ rủ tôi tới cuộc gặp mà tôi từng muốn tránh. Tôi đặt hai tin nhắn cạnh nhau, chọn nơi sẽ đến.',
    choices: [
      { label: 'Giữ hẹn ở phòng sinh hoạt', effects: { health: -2, happiness: 2 }, flags: ['tro_ve_giu_hen'], playerUpdates: { lifePath: 'reformed' }, text: 'Tôi tới đúng giờ và làm tới chiều. Tay tôi mỏi khi cất dụng cụ, nhưng người hàng xóm ghi thêm tên tôi vào lịch tháng sau. Tin nhắn còn lại vẫn chưa được trả lời.' },
      { label: 'Gặp người quen, nghe chuyện cũ', effects: { happiness: 2, intelligence: -2 }, flags: ['tro_ve_gap_cu'], text: 'Tôi ngồi lại với người quen tới tối. Những chuyện cũ khiến cuộc nói chuyện dễ dàng, còn người hàng xóm nhắn rằng mọi người đã tự chia phần việc của tôi.' },
    ],
  },
  {
    id: 'ls-tro-ve-ban-an', ages: [23, 103], needs: ['criminalRecord', 'outsidePrison', 'partner'], requiresAny: ['tro_ve_giu_hen', 'tro_ve_gap_cu'],
    title: 'Chỗ ngồi bên bàn',
    text: 'Trong bữa tối, {tenBanDoi} hỏi vì sao tôi ít kể về những cuộc hẹn gần đây. Người ấy đặt điện thoại xuống và chờ. Tôi muốn nói rõ mọi chuyện, nhưng cũng cần một khoảng riêng để tự thu xếp.',
    choices: [
      { label: 'Kể cả điều chưa làm được', effects: { happiness: -1, intelligence: 1 }, flags: ['tro_ve_noi_voi_ban_doi'], text: 'Tôi kể cả lần bỏ hẹn. {tenBanDoi} hỏi ngày hẹn tiếp theo rồi ghi vào lịch chung. Bữa cơm nguội đi trong lúc tôi tìm lời cho những đoạn khó nói.' },
      { label: 'Xin được tự thu xếp trước', effects: { happiness: 1, intelligence: -1 }, flags: ['tro_ve_giu_rieng'], text: 'Tôi xin thêm thời gian. {tenBanDoi} gật đầu và cất điện thoại, nhưng không hỏi tiếp. Tôi có khoảng riêng mình cần, còn chiếc lịch chung vẫn để trống.' },
    ],
  },
  {
    id: 'ls-tro-ve-buoi-sang', ages: [23, 103], needs: ['criminalRecord', 'outsidePrison'], requires: ['tro_ve_gap_cu'],
    title: 'Tin nhắn sáng hôm sau',
    text: 'Sau cuộc gặp người quen cũ, tôi thấy lịch việc chung vẫn được gửi tới. Người hàng xóm hỏi tôi có muốn nhận một phần nhỏ, đủ để bắt đầu lại hay không. Tôi đọc tin nhắn khi mọi người đã ra khỏi nhà.',
    choices: [
      { label: 'Nhận phần việc nhỏ', effects: { health: -1, happiness: 1 }, flags: ['tro_ve_giu_hen'], playerUpdates: { lifePath: 'reformed' }, text: 'Tôi nhận một phần việc và nhắn giờ sẽ có mặt. Người hàng xóm gửi lại địa chỉ. Buổi nghỉ của tôi ngắn đi, nhưng lần này có người chờ tôi tới.' },
      { label: 'Xin giữ liên lạc, chưa nhận việc', effects: { happiness: 1, intelligence: -1 }, flags: ['tro_ve_chua_san_sang'], text: 'Tôi nhắn rằng mình chưa thu xếp được. Người hàng xóm trả lời ngắn rồi giao việc cho người khác. Tôi giữ số điện thoại, nhưng không còn tên trong lịch tuần này.' },
    ],
  },
  {
     
    id: 'ls-tro-ve-goi-lai', ages: [25, 104], needs: ['criminalRecord', 'outsidePrison'], requires: ['tro_ve_chua_san_sang'],
    title: 'Cuộc gọi sau một năm',
    text: 'Người hàng xóm gọi lại sau một thời gian dài, nói phòng sinh hoạt chung đang thiếu người trông kho mỗi sáng thứ bảy. Việc không có tiền công và phải dậy sớm, nhưng tên tôi sẽ trở lại trong lịch tháng. Tôi cầm máy, cân nhắc có nhận lời lần này hay không.',
    choices: [
      { label: 'Nhận trông kho sáng thứ bảy', effects: { health: -1, happiness: 1 }, flags: ['tro_ve_giu_hen'], playerUpdates: { lifePath: 'reformed' }, text: 'Tôi nhận lời và đặt báo thức sớm hơn mọi ngày. Sáng thứ bảy đầu tiên, người hàng xóm đưa tôi chùm chìa khóa kho rồi đi lo việc khác. Những buổi sáng nghỉ của tôi ngắn lại, còn tên tôi đã có trong lịch tháng.' },
      { label: 'Cảm ơn, xin tự lo theo cách riêng', effects: { happiness: 1 }, flags: ['tro_ve_tu_lo'], text: 'Tôi cảm ơn và nói mình muốn tự tìm việc theo cách riêng. Người hàng xóm không hỏi thêm, chỉ bảo cửa phòng sinh hoạt vẫn mở. Tôi giữ được những buổi sáng thứ bảy, nhưng không còn ai đứng ra xác nhận quá trình của tôi.' },
    ],
  },
  {
    id: 'ls-tro-ve-thu-gioi-thieu', ages: [26, 104], needs: ['criminalRecord', 'outsidePrison', 'reformationReady'], requires: ['tro_ve_giu_hen'],
    title: 'Lá thư có chữ ký',
    text: 'Sau những năm giữ hẹn, người phụ trách đặt trước tôi lá thư ghi nhận quá trình làm lại. Lá thư có thể đi cùng hồ sơ xin việc. Tôi được hỏi muốn nhận trước nhóm hay nhận riêng sau buổi gặp.',
    choices: [
      { label: 'Nhận thư trước mọi người', effects: { happiness: -1, intelligence: 2 }, flags: ['hoan_luong_nhan_thu'], rehabilitation: true,
        keepsake: { id: 'reformation-letter', name: 'Lá thư giới thiệu', icon: '✉️' },
        text: 'Tôi đứng lên nhận thư, nghe tên mình được đọc giữa phòng. Lá thư giúp hồ sơ không còn bị giảm cơ hội vì tiền án. Người từng chờ tôi tới hẹn kéo ghế lại gần, dù chuyện cũ vẫn nằm trong hồ sơ.' },
      { label: 'Nhận thư sau buổi gặp', effects: { happiness: 2, intelligence: -1 }, flags: ['hoan_luong_nhan_thu'], rehabilitation: true,
        keepsake: { id: 'reformation-letter', name: 'Lá thư giới thiệu', icon: '✉️' },
        text: 'Tôi chờ mọi người về rồi nhận thư. Hồ sơ xin việc không còn bị giảm cơ hội vì tiền án. Tôi gọi báo cho người thân, nhưng bỏ lỡ buổi trò chuyện chung khi những chiếc ghế đã được xếp lại.' },
    ],
  },
];
