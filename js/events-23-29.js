import { getEmploymentContext } from "./career-jobs.js";
import { ensureEventGif } from "./event-gifs.js";

const choice = (label, title, text, effects) => ({ label, title, text, effects, confirmText: "Tiếp tục" });

const illustration = (code, alt) => {
  const image = new URL(`./img/events/stickers/${code}.svg`, import.meta.url).href;
  return {
    image, imageAlt: `OpenMoji: ${alt}`,
    imageFallback: image, imageFallbackAlt: `OpenMoji: ${alt}`,
  };
};

function addEverydayMedia(events) {
  const removeEmoji = text => text.replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F\u200D]/gu, "").trim();
  const scenes = [
    [/cà phê/i, "2615", "Tách cà phê"],
    [/ví/i, "1F4B0", "Túi tiền"],
    [/lưng/i, "1F4AA", "Vận động khỏe mạnh"],
    [/sinh nhật/i, "1F389", "Tiệc sinh nhật"],
    [/ba mươi/i, "1F9ED", "La bàn định hướng"],
    [/dọn nhà/i, "1F9F9", "Chổi dọn nhà"],
    [/mạng/i, "1F4F1", "Điện thoại"],
    [/nấu/i, "1F373", "Nấu ăn"],
    [/trồng cây/i, "1F331", "Cây non"],
    [/kỹ năng/i, "1F9E9", "Mảnh ghép kỹ năng"],
    [/bạn cũ/i, "1F4F8", "Máy ảnh kỷ niệm"],
    [/giày/i, "1F45F", "Giày thể thao"],
  ];
  const resultImages = {
    "2615": ["1F91D", "1F9FC"],
    "1F4B0": ["1F9EE", "1F37D"],
    "1F4AA": ["1F6B6", "1F6CC"],
    "1F389": ["1F373", "1F4D6"],
    "1F9ED": ["1F3AF", "1F5FA"],
    "1F9F9": ["1F9FA", "1F4F8"],
    "1F4F1": ["1F4DA", "1F634"],
    "1F373": ["1F525", "1F37D"],
    "1F331": ["1F33F", "1F381"],
    "1F9E9": ["1F4DD", "1F6B6"],
    "1F4F8": ["1F465", "1F4AC"],
    "1F45F": ["1F3C3", "1F9F9"],
  };
  const emojiFor = code => String.fromCodePoint(parseInt(code, 16));
  const titleEmojis = { "1F4B0": "1F4B8", "1F389": "1F382", "1F9F9": "1F4E6" };
  return events.map(event => {
    const [, code, alt] = scenes.find(([pattern]) => pattern.test(event.title))
      ?? [null, "1F31F", "Trải nghiệm mới"];
    return {
      ...event, title: `${emojiFor(titleEmojis[code] ?? code)} ${removeEmoji(event.title)}`, text: removeEmoji(event.text),
      ...illustration(code, alt),
      choices: event.choices.map((branch, index) => ensureEventGif({
        ...branch,
        label: removeEmoji(branch.label),
        title: `${emojiFor(resultImages[code]?.[index] ?? "2728")} ${removeEmoji(branch.title)}`,
        text: removeEmoji(branch.text),
        ...illustration(resultImages[code]?.[index] ?? "2728", removeEmoji(branch.label)),
      })),
    };
  });
}

export function createYoungAdultEvents(age, careerPath) {
  const place = getEmploymentContext(careerPath?.id).place;
  const events = {
    23: [
      {
        title: "Cà phê cứu ngày mới",
        text: `Tôi ghé ${place}, định bắt chuyện cho bớt ngại thì làm đổ cà phê. Màn ra mắt thơm thật, nhưng hơi ướt!`,
        choices: [
          choice("Dọn sạch rồi cười cái đã!", "Quen nhau nhờ cà phê", "Tôi xin lỗi, dọn sạch và bắt chuyện tự nhiên hơn. Ai cũng từng có một ngày vụng về!", { happiness: 3 }),
          choice("Im lặng, dọn nhanh!", "Sạch là được", "Tôi lặng lẽ lau bàn. Chưa quen thêm ai, nhưng ít nhất không để lại một hồ cà phê.", { intelligence: 1 }),
        ],
      },
      {
        title: "Lương về, ví gọi!",
        text: "Tôi ngồi tính tiền ăn, tiền ở và tiền vui chơi. Máy tính chưa nóng mà đầu tôi đã nóng rồi!",
        choices: [
          choice("Chia khoản, để dành chút!", "Ví có kế hoạch", "Tôi lập kế hoạch chi tiêu, dành một khoản dự phòng và vẫn chừa tiền cho niềm vui nhỏ.", { intelligence: 3 }),
          choice("Ăn ngon rồi tính!", "Một bữa đáng nhớ", "Tôi tự thưởng một bữa ngon. Vui thì có vui, nhưng mai vẫn phải ngồi tính lại ngân sách!", { happiness: 3, intelligence: -1 }),
        ],
      },
    ],
    26: [
      {
        title: "Cái lưng lên tiếng",
        text: "Ngồi lâu quá, tôi đứng dậy nghe lưng kêu rắc. Hai mươi sáu tuổi mà hiệu ứng âm thanh như cửa gỗ cũ!",
        choices: [
          choice("Đứng dậy, vận động thôi!", "Đổi thói quen nhỏ", "Tôi bắt đầu đi bộ và nghỉ vận động giữa giờ. Cơ thể dễ chịu, tinh thần cũng nhẹ hơn.", { health: 4, happiness: 2 }),
          choice("Về nhà nằm tiếp!", "Nghỉ một chút", "Tôi nghỉ ngơi cho đỡ mệt, nhưng biết mình vẫn cần vận động đều đặn hơn.", { happiness: 1 }),
        ],
      },
      {
        title: "Sinh nhật không cần hoành tráng",
        text: "Bạn bè rủ tôi tổ chức sinh nhật. Một đứa đề nghị tiệc sang, đứa còn lại hỏi có được mang mì gói không.",
        choices: [
          choice("Nấu chung cho vui!", "Bữa tiệc ấm áp", "Mọi người cùng nấu ăn, kể chuyện và cười đến quên chụp ảnh. Tôi thấy mình thật may mắn.", { happiness: 4 }),
          choice("Dành ngày cho bản thân!", "Một ngày nhẹ nhàng", "Tôi đọc sách, đi dạo và tự chúc mình thêm một tuổi bình an.", { intelligence: 2, happiness: 2 }),
        ],
      },
    ],
    29: [
      {
        title: "Sắp ba mươi rồi đó!",
        text: "Tôi nhìn lại những năm vừa qua: vài lần vấp ngã, vài điều làm được và một danh sách việc muốn thử vẫn dài như hóa đơn siêu thị.",
        choices: [
          choice("Chọn một mục tiêu trước!", "Từng bước trưởng thành", "Tôi chọn một mục tiêu vừa sức và chia thành bước nhỏ. Không cần chạy đua với cuộc đời của người khác.", { intelligence: 3, happiness: 2 }),
          choice("Đi chơi, lấy cảm hứng!", "Đổi góc nhìn", "Một chuyến đi ngắn giúp tôi thư giãn và có thêm những ý tưởng mới.", { happiness: 4 }),
        ],
      },
      {
        title: "Dọn nhà, đào kỷ niệm",
        text: "Tôi dọn phòng và tìm thấy những món đồ cũ. Tờ giấy ghi mục tiêu năm xưa vẫn còn, riêng mục ‘ngủ sớm’ thì chưa hoàn thành!",
        choices: [
          choice("Dọn gọn, bắt đầu mới!", "Góc nhỏ dễ thở", "Tôi giữ lại món đồ ý nghĩa, sắp xếp phòng và đặt giờ ngủ đều đặn hơn.", { health: 2, happiness: 2 }),
          choice("Gửi ảnh, rủ bạn ôn chuyện!", "Kỷ niệm nối lại", "Một tấm ảnh kéo theo cả buổi trò chuyện. Có những người lâu không gặp mà vẫn thấy gần gũi.", { happiness: 4 }),
        ],
      },
    ],
  };
  const extraEvents = {
    24: [
      ["Một ngày bớt lướt mạng", "Tôi định xem điện thoại năm phút, ngẩng lên đã hết buổi tối. Ngón tay chăm chỉ hơn cả tôi!", "Cất máy, đọc sách!", "Tôi đọc vài trang sách và thấy đầu óc dễ chịu hơn.", { intelligence: 3 }, "Tắt máy, ngủ sớm!", "Tôi ngủ một giấc ngon, sáng dậy tỉnh táo hơn.", { health: 3 }],
      ["Tập nấu món mới", "Tôi thử nấu một món mới. Công thức bảo vàng giòn, chảo của tôi lại hơi… đen huyền bí!", "Thử lại, giảm lửa!", "Lần thứ hai ngon hơn hẳn. Kiên nhẫn cũng là một loại gia vị.", { intelligence: 2, happiness: 2 }, "Rủ bạn ăn ngoài!", "Tôi kể chuyện cái chảo cháy, cả bàn cười vui vẻ.", { happiness: 3 }],
    ],
    25: [
      ["Trồng cây trên bàn", "Tôi mua một chậu cây nhỏ. Người bán bảo dễ chăm, còn tôi hy vọng cây chịu được chủ hay quên!", "Đặt lịch tưới cây!", "Góc bàn xanh hơn, tôi cũng tập được thói quen chăm chút mỗi ngày.", { happiness: 2, intelligence: 1 }, "Tặng bạn mê cây!", "Chậu cây tìm được người chăm khéo, còn tôi được một lời cảm ơn.", { happiness: 3 }],
      ["Học thêm một kỹ năng", "Tôi thấy một lớp học thú vị. Não bảo thử đi, cái ghế lại bảo ngồi tiếp!", "Đăng ký học thử!", "Tôi học thêm điều mới và thấy mình có thể tiến bộ từng chút.", { intelligence: 3 }, "Đi dạo trước đã!", "Một vòng đi bộ giúp tôi thư giãn và nghĩ rõ hơn về điều muốn học.", { health: 2, happiness: 1 }],
    ],
    28: [
      ["Hẹn bạn cũ", "Nhóm bạn cũ rủ gặp mặt. Lịch hẹn đổi ba lần, cuối cùng mọi người thống nhất: ai tới trước giữ bàn!", "Đi gặp, kể chuyện!", "Chúng tôi ôn chuyện cũ và cười như chưa từng xa nhau.", { happiness: 4 }, "Gọi hỏi thăm thôi!", "Một cuộc gọi ngắn vẫn đủ nối lại những câu chuyện thân quen.", { happiness: 2 }],
      ["Đôi giày phủ bụi", "Tôi tìm thấy đôi giày thể thao lâu không dùng. Nó còn mới, chỉ có quyết tâm tập luyện là hơi cũ!", "Mang giày, chạy nhẹ!", "Tôi vận động vừa sức và quyết định giữ thói quen này.", { health: 4 }, "Dọn phòng cho gọn!", "Tôi sắp xếp lại đồ đạc, căn phòng thoáng hơn hẳn.", { health: 1, happiness: 2 }],
    ],
  };
  if (extraEvents[age]) return addEverydayMedia(extraEvents[age].map(([title, text, first, firstText, firstEffects, second, secondText, secondEffects]) => ({
    title, text, choices: [
      choice(first, "Một trải nghiệm mới", firstText, firstEffects),
      choice(second, "Một ngày nhẹ nhàng", secondText, secondEffects),
    ],
  })));
  // Chỉ dùng sự kiện thường ở tuổi 27 khi không có lịch nâng bậc.
  return addEverydayMedia(events[age] ?? (age === 27 ? events[26] : []));
}
