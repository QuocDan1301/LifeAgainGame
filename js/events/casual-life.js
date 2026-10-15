import { createCasualDatingEvent } from "../relationships/relationships.js";
import { RETIREMENT_AGE } from '../career/career-salary.js';
import { isServing } from '../career/street-work.js';
import { openMojiArt } from '../media/event-art.js';

const stories = {
  casual: [
    ['Một buổi sáng không đến lớp', 'Bạn bè lên lớp, còn tôi đứng trước quán nước, chưa biết hôm nay sẽ làm gì. Sự tự do vừa dễ chịu vừa khiến tôi lo lắng.',
      ['Tìm một việc nhỏ để bắt đầu', 'Tôi hỏi quanh xóm và nhận phụ việc. Tự kiếm được chút tiền khiến tôi tự hào.', 2, 2, 500_000],
      ['Học cách quản lý tiền', 'Tôi ghi lại từng khoản chi, nhận ra mình cần một kế hoạch mưu sinh.', 1, 4, 0],
      ['Ngồi chơi hết buổi', 'Tôi ngồi đến trưa. Một ngày trôi qua mà chẳng tiến thêm bước nào.', -2, 0, -100_000]],
    ['Bạn cũ khoe chuyện trường lớp', 'Tôi gặp bạn cũ ở quán nước. Bạn kể chuyện thi cử, còn tôi kể những việc mình làm để kiếm sống.',
      ['Lắng nghe, hỏi thăm bạn', 'Tôi vui vì mỗi người đang tự tìm một con đường riêng.', 4, 1, 0],
      ['Nhờ bạn giới thiệu khách', 'Bạn giới thiệu tôi với vài người quen trong khu phố.', 2, 1, 1_000_000],
      ['Né cuộc trò chuyện', 'Tôi thấy ngượng ngùng nên rời đi sớm, bỏ lỡ một buổi gặp bạn.', -3, 0, 0]],
    ['Một lời hứa với gia đình', 'Người nhà hỏi tôi có dự định gì. Tôi không muốn tiếp tục trả lời rằng để mai tính.',
      ['Lập kế hoạch mưu sinh', 'Tôi đặt mục tiêu tiết kiệm để mua phương tiện làm nghề.', 3, 3, 0],
      ['Nhận phụ việc trong xóm', 'Tôi phụ dọn hàng và nhận tiền công sau một ngày làm việc.', 2, 1, 700_000],
      ['Gạt chuyện sang một bên', 'Tôi hứa rồi lại để đó. Cả nhà lo lắng hơn về tôi.', -4, 0, 0]],
    ['Một tháng vắng việc', 'Việc phụ ít đi, tôi phải cân nhắc từng khoản chi. Không có lương cố định khiến tôi bồn chồn.',
      ['Sống tiết kiệm, tìm khách mới', 'Tôi giữ tiền cho những thứ thiết yếu và tìm thêm việc.', 1, 3, 0],
      ['Học một kỹ năng thực tế', 'Tôi học cách giao tiếp với khách và tính toán chi phí.', 2, 4, -500_000],
      ['Tiêu tiền để quên lo', 'Tôi vui một lúc rồi lại lo lắng khi nhìn số tiền còn lại.', 1, 0, -1_000_000]],
    ['Một người quen cần phụ chuyển đồ', 'Hàng xóm chuyển nhà và hỏi tôi có thể phụ một buổi không. Tôi cân nhắc sức mình trước khi nhận lời.',
      ['Nhận phụ, chia việc vừa sức', 'Chúng tôi chuyển xong đồ và tôi nhận tiền công.', 2, 1, 800_000],
      ['Giúp kết nối người chuyển đồ', 'Tôi tìm người phù hợp để giúp hàng xóm.', 3, 2, 0],
      ['Từ chối vì cần nghỉ ngơi', 'Tôi nghỉ một buổi để tránh làm quá sức.', 1, 0, 0]],
    ['Giữ nhịp sống của riêng mình', 'Nhiều năm tự kiếm sống giúp tôi hiểu rằng tự do cũng cần nề nếp. Tôi muốn những ngày sau bớt bấp bênh.',
      ['Sắp xếp giờ làm và giờ nghỉ', 'Tôi thấy nhẹ nhõm khi có một lịch sinh hoạt rõ ràng.', 4, 2, 0],
      ['Chia sẻ kinh nghiệm với người trẻ', 'Tôi kể cả những lần sai lầm để người trẻ đỡ vấp ngã.', 4, 2, 0],
      ['Cứ làm theo hứng', 'Tôi vẫn thích tùy hứng, nhưng chuyện thu chi chưa ổn định.', -1, 0, 0]],
    ['Nghĩ về những năm nghỉ ngơi', 'Tôi nhận ra mình không thể chạy việc mãi. Đến tuổi nghỉ hưu, tôi muốn còn sức để tận hưởng cuộc sống.',
      ['Rà lại khoản tiết kiệm', 'Tôi nhìn rõ hơn những gì cần chuẩn bị cho tuổi già.', 2, 3, 0],
      ['Giảm nhịp, dành thời gian cho người thân', 'Một bữa cơm thong thả làm tôi thấy ấm lòng.', 5, 0, -200_000],
      ['Tiếp tục thói quen cũ', 'Tôi chưa đổi được thói quen, nhưng vẫn ghi nhớ phải giữ sức.', -1, 0, 0]],
  ],
  'noodle-seller': [
    ['Nồi nước lèo đầu ngày', 'Tôi đẩy xe hủ tiếu ra chỗ quen. Mùi nước lèo nóng khiến vài vị khách dừng lại.',
      ['Giữ vị nước lèo ổn định', 'Khách ăn xong khen ngon và hẹn quay lại. Tôi rất vui.', 4, 2, 800_000],
      ['Thử một công thức mới', 'Tôi dành một buổi thử vị và ghi lại nhận xét của khách.', 2, 4, -300_000],
      ['Bán ít để nghỉ sớm', 'Tôi thu xe sớm, giữ sức cho ngày mai.', 2, 0, -200_000]],
    ['Khách quen dẫn cả gia đình tới ăn', 'Một vị khách quen dẫn người nhà đến xe hủ tiếu của tôi. Bàn nhỏ bỗng trở nên đông vui.',
      ['Phục vụ chu đáo', 'Tôi nhớ từng yêu cầu nhỏ. Khách hài lòng và giới thiệu thêm người quen.', 4, 1, 1_200_000],
      ['Tặng thêm chút rau và nước lèo', 'Một chút quan tâm giúp bữa ăn thêm ấm áp.', 5, 0, -100_000],
      ['Giữ nhịp phục vụ vừa sức', 'Tôi giải thích thời gian chờ để khách không sốt ruột.', 2, 2, 300_000]],
    ['Mưa bất chợt lúc mở hàng', 'Tôi vừa dọn xe hủ tiếu thì trời đổ mưa. Khách vắng, mái che lại bị gió tạt.',
      ['Che chắn, giữ đồ ăn sạch', 'Tôi ưu tiên an toàn thực phẩm, dù phải tốn thêm vật dụng.', 2, 2, -250_000],
      ['Thu xe về sớm', 'Tôi không cố bán giữa trời mưa, chấp nhận một buổi ít lời.', 1, 0, -400_000],
      ['Chờ tạnh rồi bán tiếp', 'Tôi kiên nhẫn đợi mưa nhẹ dần; vài người khách vẫn ghé ăn.', 2, 1, 200_000]],
    ['Nguyên liệu lên giá', 'Giá thịt và bánh hủ tiếu tăng. Tôi phải tính lại chi phí để không bán càng nhiều càng lỗ.',
      ['Tính lại giá, nói rõ với khách', 'Tôi giải thích mức giá mới và giữ chất lượng tô hủ tiếu.', 1, 4, 0],
      ['Tìm nguồn nguyên liệu đáng tin', 'Tôi tìm được nguồn hàng phù hợp, giảm bớt chi phí.', 2, 3, 600_000],
      ['Giữ giá, chịu phần giảm lời', 'Tôi giữ giá thêm một thời gian, nhưng lợi nhuận ít đi.', 2, 0, -600_000]],
    ['Một khách góp ý tô hủ tiếu', 'Khách nói hôm nay nước lèo hơi mặn. Tôi hơi ngượng nhưng muốn hiểu rõ góp ý.',
      ['Lắng nghe và sửa lại', 'Tôi cảm ơn khách rồi điều chỉnh nước lèo.', 3, 3, 0],
      ['Đổi tô khác cho khách', 'Khách nhận tô mới và mỉm cười. Tôi thấy nhẹ nhõm.', 4, 1, -100_000],
      ['Cãi lại khách', 'Cuộc cãi vã khiến vài người rời đi. Tôi hối hận vì nóng nảy.', -5, 0, -700_000]],
    ['Bánh xe hủ tiếu bị kẹt', 'Đang đẩy xe về, tôi phát hiện bánh xe kẹt và tay cầm lung lay. Phải sửa trước khi mở hàng lại.',
      ['Sửa xe cho chắc chắn', 'Chiếc xe được sửa xong, tôi yên tâm hơn khi đi bán.', 2, 1, -500_000],
      ['Nhờ người quen kiểm tra', 'Người quen giúp tôi chỉnh lại bánh và chỉ cách bảo dưỡng.', 3, 3, -200_000],
      ['Nghỉ bán một buổi để kiểm tra', 'Tôi dừng bán để tránh sự cố giữa đường.', 1, 2, -300_000]],
    ['Khách nhớ tô hủ tiếu ngày xưa', 'Một người quay lại sau nhiều năm, nhận ra xe hủ tiếu của tôi. Những câu chuyện cũ làm tôi xúc động.',
      ['Mời khách ngồi kể chuyện', 'Tôi thấy ấm lòng khi một món ăn giữ được bao kỷ niệm.', 5, 1, 0],
      ['Ghi lại công thức cho người thân', 'Tôi ghi kỹ từng bước để món hủ tiếu không bị quên.', 3, 4, 0],
      ['Chụp một tấm ảnh kỷ niệm', 'Tôi lưu lại một ngày bình dị mà đáng nhớ.', 4, 0, 0]],
  ],
  'motorbike-taxi': [
    ['Cuốc xe đầu buổi sáng', 'Tôi dắt xe máy ra đường, nhận một cuốc chở khách đi làm. Đường phố bắt đầu đông.',
      ['Đi bình tĩnh, đúng tuyến', 'Khách đến nơi an toàn và cảm ơn tôi.', 3, 2, 300_000],
      ['Hỏi khách đường đi thuận tiện', 'Chúng tôi thống nhất đường đi để tránh hiểu nhầm.', 2, 3, 200_000],
      ['Từ chối cuốc quá xa', 'Tôi chọn cuốc gần hơn để giữ sức.', 1, 0, 0]],
    ['Khách quên túi trên xe', 'Sau khi trả khách, tôi thấy chiếc túi nhỏ còn trên xe máy. Tôi nhớ người khách đang rất vội.',
      ['Liên hệ trả lại túi', 'Khách nhận lại đồ và cảm ơn. Tôi thấy nhẹ nhõm.', 5, 2, 0],
      ['Nhờ điểm đón hỗ trợ tìm khách', 'Tôi nhờ người hỗ trợ để chiếc túi về đúng chủ.', 3, 3, 0],
      ['Giữ túi để chờ khách quay lại', 'Tôi cất túi an toàn và chờ liên lạc từ khách.', 1, 1, 0]],
    ['Trời mưa giữa cuốc xe', 'Mưa đổ xuống khi tôi đang chở khách. Đường trơn làm tôi lo lắng.',
      ['Dừng trú mưa an toàn', 'Tôi nói rõ với khách rồi tìm chỗ trú. An toàn quan trọng hơn vài phút.', 3, 2, 0],
      ['Đi chậm, giữ khoảng cách', 'Chúng tôi đến nơi an toàn, dù muộn hơn dự kiến.', 2, 2, 100_000],
      ['Kết thúc sớm ở điểm an toàn', 'Tôi thống nhất với khách và giảm tiền cuốc xe.', 1, 1, -100_000]],
    ['Xe máy cần bảo dưỡng', 'Tiếng máy lạ và lốp mòn nhắc tôi rằng xe ôm cũng cần chăm phương tiện như chăm sức mình.',
      ['Bảo dưỡng trước khi nhận khách', 'Tôi sửa xe rồi mới tiếp tục chạy. Lòng nhẹ nhõm hơn.', 2, 2, -700_000],
      ['Nhờ thợ kiểm tra từng phần', 'Tôi hiểu rõ bộ phận nào cần thay, tránh chi tiền không cần thiết.', 1, 4, -400_000],
      ['Nghỉ chạy, dành thời gian sửa', 'Tôi chấp nhận nghỉ một buổi để xe an toàn hơn.', 2, 1, -300_000]],
    ['Một người khách hay chuyện', 'Khách kể đủ chuyện trên quãng đường. Tôi vừa nghe vừa tập trung lái xe.',
      ['Lắng nghe vừa đủ, giữ tập trung', 'Chuyến xe trôi qua vui vẻ và an toàn.', 4, 2, 100_000],
      ['Nhẹ nhàng xin tập trung lái', 'Khách hiểu và để tôi tập trung khi đường đông.', 2, 2, 0],
      ['Chỉ trả lời khi dừng xe', 'Tôi chọn lúc dừng an toàn để trò chuyện.', 2, 1, 0]],
    ['Giá xăng tăng, cuốc xe thưa', 'Tôi tính lại tiền xăng và thời gian chờ khách. Thu nhập chạy xe ôm không phải lúc nào cũng đều.',
      ['Chọn tuyến phù hợp, giảm chạy rỗng', 'Tôi sắp xếp quãng đường tốt hơn, tiết kiệm được chi phí.', 2, 4, 500_000],
      ['Trao đổi với các bác tài quen', 'Chúng tôi chia sẻ kinh nghiệm chọn giờ có khách.', 3, 3, 200_000],
      ['Nghỉ bớt giờ vắng khách', 'Tôi giữ sức, chấp nhận thu nhập ít hơn trong đợt này.', 2, 1, -300_000]],
    ['Người khách quen của nhiều năm', 'Một người khách nhận ra tôi và hỏi thăm những năm chạy xe. Tôi chợt thấy mình đã đi qua rất nhiều con đường.',
      ['Kể chuyện những cuốc xe đáng nhớ', 'Tôi nhớ lại cả niềm vui lẫn những bài học trên đường.', 5, 2, 0],
      ['Chia sẻ kinh nghiệm với tài xế trẻ', 'Tôi nhắc người trẻ giữ sức và đặt an toàn lên trước.', 4, 3, 0],
      ['Chạy ít lại, dành thời gian cho nhà', 'Tôi thấy vui khi có thêm những bữa cơm cùng người thân.', 5, 0, 0]],
  ],
};

export function createCasualLifeEvents(age, player) {
  if (age < 19 || age >= RETIREMENT_AGE || isServing(player) || player.isAlive === false) return [];
  const active = (player.streetJobs ?? []).filter(entry => {
    const asset = entry.id === 'noodle-seller' ? 'noodle-cart' : entry.id === 'motorbike-taxi' ? 'motorbike' : null;
    return asset && (player.purchases ?? []).some(item => item.id === asset);
  });
  const pools = active.length ? active.map(entry => entry.id) : player.casualLife ? ['casual'] : [];
  const ordinary = pools.flatMap(pool => {
    const catalog = stories[pool];
     
    const start = age >= 55 ? 6 : age >= 35 ? 3 : 0;
    const indexes = [start, (age - 19) % 6, (age - 17) % 6];
    return [...new Set(indexes)].map(index => {
      const [title, text, ...choices] = catalog[index];
      return { id: `street-${pool}-${index}`, kind: 'street-life', category: 'everyday', catalogVersion: 1,
        title, text, ...openMojiArt(pool === 'noodle-seller' ? '1F35C' : pool === 'motorbike-taxi' ? '1F6F5' : '1F9ED', title),
        choices: choices.map(([label, text, happiness, intelligence, money]) => ({ label, title, text,
          effects: { happiness, intelligence }, money })) };
    });
  });
  if (player.casualLife && !player.partner && age % 3 === 0) {
    const romance = createCasualDatingEvent(player, age);
    if (romance) ordinary.push(romance);
  }
  if (player.casualLife && player.partner) ordinary.push({
    id: "casual-couple-plans", kind: "street-life", category: "love", catalogVersion: 1,
    title: "💬 Người yêu hỏi về những ngày sắp tới",
    text: `${player.partner.name} hỏi tôi dự định thế nào với việc làm và cuộc sống. Người ấy muốn chúng tôi nói rõ mong đợi, thay vì đoán suy nghĩ của nhau.`,
    choices: [
      { label: "🤝 Bàn kế hoạch thực tế cùng nhau", text: "Tôi lắng nghe và cùng người ấy đặt những mục tiêu nhỏ có thể làm được. Tôi thấy nhẹ nhõm vì không phải lo một mình.", effects: { happiness: 5, intelligence: 2 } },
      { label: "💬 Nói thật những điều đang khó khăn", text: "Tôi chia sẻ cả nỗi lo và việc mình đang cố gắng. Chúng tôi hiểu nhau hơn sau cuộc trò chuyện.", effects: { happiness: 3, intelligence: 1 } },
      { label: "😶 Né tránh cuộc nói chuyện", text: "Tôi lảng sang chuyện khác. Những điều chưa nói khiến cả hai thấy xa cách hơn.", effects: { happiness: -4 } },
    ],
  });
  return ordinary;
}
