import { playOutcomeSound } from "./music.js";
// Học bằng lái: mỗi loại có 5 câu hỏi, mỗi câu 2 đáp án; correct là vị trí đáp án đúng.
// Giao diện không bao giờ hiện đáp án đúng, kể cả khi người chơi trả lời sai.
export const licenseTypes = [
  {
    id: "motorbike",
    icon: "🛵",
    name: "Bằng lái xe máy",
    questions: [
      { text: "Trước khi chạy xe, bạn đội mũ bảo hiểm thế nào?",
        answers: ["Đội ngay ngắn, cài quai đúng cách.", "Đội lên đầu là đủ, đi gần không cần cài."], correct: 0 },
      { text: "Đang chạy xe, điện thoại trong túi đổ chuông. Bạn làm gì?",
        answers: ["Một tay lái, một tay nghe nhanh.", "Tìm nơi được phép dừng an toàn rồi mới dùng điện thoại."], correct: 1 },
      { text: "Trời bất ngờ đổ mưa, bạn cần mặc áo mưa. Bạn chọn cách nào?",
        answers: ["Dừng ngay giữa đường để khỏi ướt.", "Quan sát và tìm nơi dừng an toàn rồi mặc."], correct: 1 },
      { text: "Muốn chuyển sang làn bên cạnh tại nơi được phép, bạn cần làm gì?",
        answers: ["Quan sát, bật tín hiệu và chỉ chuyển khi an toàn.", "Bật xi nhan rồi chuyển ngay, xe sau sẽ tránh."], correct: 0 },
      { text: "Khi mặc áo mưa đi xe máy, bạn cần chú ý điều gì?",
        answers: ["Để tà áo phủ hết phía trước xe cho kín.", "Sắp xếp tà áo gọn, không che đèn, gương hoặc vướng bánh xe."], correct: 1 },
    ],
  },
  {
    id: "car",
    icon: "🚗",
    name: "Bằng lái ô tô",
    questions: [
      { text: "Trước khi xe di chuyển, người ngồi ở ghế có dây đai cần làm gì?",
        answers: ["Thắt dây an toàn, kể cả khi ngồi ghế sau.", "Chỉ người ngồi phía trước mới cần thắt."], correct: 0 },
      { text: "Xe phía trước bất ngờ giảm tốc. Việc nào giúp bạn có thời gian xử lý?",
        answers: ["Đi sát xe trước để dễ theo dõi.", "Duy trì khoảng cách an toàn từ trước."], correct: 1 },
      { text: "Bạn bắt đầu buồn ngủ khi đang lái xe. Nên làm gì?",
        answers: ["Tìm nơi dừng đỗ an toàn để nghỉ.", "Mở nhạc thật lớn rồi cố chạy tiếp."], correct: 0 },
      { text: "Sau khi đỗ xe, trước khi mở cửa bước xuống, bạn cần làm gì?",
        answers: ["Mở hé cửa ngay để xe khác biết mà tránh.", "Quan sát trước, sau và phía mở cửa; chỉ mở khi an toàn."], correct: 1 },
      { text: "Khi lái ô tô dưới trời mưa, mặt đường trơn, bạn nên làm gì?",
        answers: ["Giảm tốc phù hợp và tăng khoảng cách với xe trước.", "Bám sát xe trước để đi theo vệt bánh của họ."], correct: 0 },
    ],
  },
];

// Chỉ được học và thi bằng lái khi nhân vật đủ 18 tuổi.
export const LICENSE_MIN_AGE = 18;

export const getLicenseType = (id) => licenseTypes.find((type) => type.id === id);
export const hasLicense = (player, id) => (player.licenses ?? []).some((license) => license.id === id);

export function initLicenses(state, { renderLogEntry }) {
  const $ = (id) => document.getElementById(id);
  const dialog = $("license-dialog");
  const body = $("license-body");

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const button = (className, text, onClick) => {
    const node = element("button", className, text);
    node.type = "button";
    node.addEventListener("click", onClick);
    return node;
  };
  const focusFirst = () => (body.querySelector(".license-type:not(:disabled), .license-answer")
    ?? body.querySelector("button:not(:disabled)"))?.focus({ preventScroll: true });

  function renderPicker() {
    body.replaceChildren(button("shop-back", "← Quay lại Hoạt động", () => {
      dialog.close();
      $("activities-dialog").showModal();
    }));
    const tooYoung = state.player.age < LICENSE_MIN_AGE;
    if (tooYoung) {
      const wait = LICENSE_MIN_AGE - state.player.age;
      body.append(element("p", "license-age-note",
        `🔞 Bạn cần đủ ${LICENSE_MIN_AGE} tuổi mới được học bằng lái. Còn ${wait} năm nữa nhé!`));
    }
    const list = element("div", "shop-groups");
    for (const type of licenseTypes) {
      const owned = hasLicense(state.player, type.id);
      const label = owned ? `${type.icon} ${type.name} · Đã có`
        : tooYoung ? `${type.icon} ${type.name} · Từ ${LICENSE_MIN_AGE} tuổi` : `${type.icon} ${type.name}`;
      const choice = button("shop-group license-type", label, () => renderQuestion(type));
      choice.dataset.license = type.id;
      choice.disabled = owned || tooYoung;
      list.append(choice);
    }
    body.append(list);
    focusFirst();
  }

  function renderQuestion(type) {
    if (state.player.age < LICENSE_MIN_AGE) return renderPicker();
    const question = type.questions[Math.floor(Math.random() * type.questions.length)];
    // Đảo vị trí hai đáp án để người chơi không học thuộc theo thứ tự.
    const order = Math.random() < 0.5 ? [0, 1] : [1, 0];
    const card = element("section", "dialog-card");
    card.append(element("h3", "", `${type.icon} ${type.name}`), element("p", "license-question", question.text));
    const answers = element("div", "license-answers");
    order.forEach((index, position) => {
      answers.append(button("license-answer", `${"AB"[position]}. ${question.answers[index]}`,
        () => renderResult(type, index === question.correct)));
    });
    card.append(answers);
    body.replaceChildren(button("shop-back", "← Quay lại chọn bằng", renderPicker), card);
    focusFirst();
  }

  function renderResult(type, passed) {
    playOutcomeSound(passed ? "success" : "failure");
    const card = element("section", "dialog-card license-result");
    if (passed && !hasLicense(state.player, type.id) && state.player.age >= LICENSE_MIN_AGE) {
      state.player.licenses = [...(state.player.licenses ?? []), { id: type.id, receivedAtAge: state.player.age }];
      const log = { age: state.player.age, content: `🪪 Thi đạt và nhận ${type.name}.`, summary: `🪪 Nhận ${type.name}.` };
      state.logs.push(log);
      localStorage.setItem("lifeAgainSave", JSON.stringify(state));
      renderLogEntry(log);
    }
    card.append(
      element("h3", "", passed ? `🎉 Chúc mừng! Bạn đã có ${type.name}` : "📋 Chưa đạt"),
      element("p", "", passed
        ? `${type.name} đã được thêm vào Tài sản. Giờ bạn có thể mua ${type.id === "car" ? "ô tô" : "xe máy"} trong Mua sắm.`
        : "Câu trả lời chưa đúng. Hãy ôn lại luật giao thông rồi thử với một câu hỏi khác nhé."),
    );
    const actions = element("div", "license-actions");
    if (!passed) actions.append(button("license-answer", "🔁 Thử lại", () => renderQuestion(type)));
    actions.append(button("shop-back", "← Quay lại chọn bằng", renderPicker));
    card.append(actions);
    body.replaceChildren(card);
    focusFirst();
  }

  $("activity-degrees").addEventListener("click", () => {
    if (state.player.isAlive === false) return;
    $("activities-dialog").close();
    dialog.showModal();
    renderPicker();
  });
  $("close-license").addEventListener("click", () => dialog.close());
  // Popup Tài sản tự mở trong life-profile.js; ở đây chỉ vẽ danh sách bằng lái.
  $("assets").addEventListener("click", () => {
    const list = $("life-licenses");
    list.replaceChildren();
    for (const license of state.player.licenses ?? []) {
      const type = getLicenseType(license.id);
      if (type) list.append(element("li", "", `${type.icon} ${type.name} · Nhận lúc ${license.receivedAtAge} tuổi`));
    }
  });
}
