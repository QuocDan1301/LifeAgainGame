export const studyAbroadStories = [
  { id: 'ls19-abroad-language', age: 19, needs: ['studyAbroad'],
    title: 'Một câu nói giữa lớp',
    text: 'Trong buổi thảo luận ở trường nước ngoài, tôi biết đáp án nhưng cứ sợ phát âm sai. Người ngồi cạnh đẩy tờ ghi chú về phía tôi: “Cứ nói, mọi người đang chờ ý kiến của bạn.” Tôi nhìn quanh lớp, rồi nhìn xuống tay mình.',
    choices: [
      { label: 'Thử nói và nhờ sửa', effects: { intelligence: 3, happiness: 1 }, text: 'Tôi nói chậm, vấp hai lần. Một bạn sửa giúp tôi từ dùng sai rồi hỏi thêm về ý tưởng. Lần đầu tiên, tôi thấy tiếng nói của mình có chỗ trong căn phòng này.' },
      { label: 'Đưa ghi chú cho bạn', effects: { happiness: -1 }, text: 'Bạn trình bày giúp tôi. Bài được đánh giá tốt, nhưng trên đường về ký túc xá tôi vẫn tập lại câu mở đầu đã không dám nói.' },
    ] },
  { id: 'ls20-abroad-homesick', age: 20, needs: ['studyAbroad'],
    title: 'Bữa cơm qua màn hình',
    text: 'Tối cuối tuần, tiếng người trong bếp ký túc xá vọng đến phòng. Tôi mở lại ảnh cũ ở nhà, rồi nhìn chồng bài tập trên bàn. Bạn cùng phòng gõ cửa, hỏi tôi có muốn xuống nấu chung không. Tôi chưa quyết định gọi về hay ra ngoài.',
    choices: [
      { label: 'Gọi về rồi nấu cùng bạn', effects: { happiness: 3 }, text: 'Tôi kể chuyện học hành qua điện thoại, rồi mang phần thực phẩm có sẵn xuống bếp. Món ăn không giống ở nhà, nhưng tối nay căn bếp có tiếng cười và tôi không ăn một mình.' },
      { label: 'Ở phòng làm bài', effects: { intelligence: 2, happiness: -2 }, text: 'Tôi làm xong bài trước hạn. Khi đóng máy, hành lang đã yên lặng. Tôi nhắn một câu về nhà rồi tự hứa lần sau sẽ mở cửa.' },
    ] },
  { id: 'ls21-abroad-project', age: 21, needs: ['studyAbroad'],
    title: 'Bản trình bày cuối khóa',
    text: 'Nhóm của tôi chuẩn bị báo cáo cuối khóa. Một thành viên gửi phần việc muộn, người khác muốn xóa tên bạn ấy. Tôi giữ bản tài liệu chung, nghe cả hai tranh luận. Ngày bảo vệ đến gần, nhưng chúng tôi vẫn chưa thống nhất cách bàn giao.',
    choices: [
      { label: 'Chia lại việc và kiểm tra chung', effects: { intelligence: 3, happiness: 1 }, text: 'Chúng tôi ghi rõ phần việc còn thiếu và kiểm tra từng mục. Buổi bảo vệ không hoàn hảo, nhưng cả nhóm trả lời được câu hỏi. Tôi giữ bản dự án để chuẩn bị hồ sơ xin việc sau tốt nghiệp.' },
      { label: 'Tự sửa toàn bộ trong đêm', effects: { intelligence: 1, health: -3 }, text: 'Bản trình bày kịp hạn, còn tôi gần như ngủ gục trong buổi bảo vệ. Tôi hiểu rằng làm hết thay mọi người không phải cách dẫn dắt một nhóm lâu dài.' },
    ] },
];
