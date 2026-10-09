import { ensureEventOpenMoji } from "./event-openmoji.js";
const image = new URL("./img/events/openmoji/color/svg/1F308.svg", import.meta.url).href;
const labels = { heterosexual: "Thẳng", bisexual: "Song tính", pansexual: "Toàn tính" };

export function getOrientationLabel(orientation, gender) {
  if (orientation === "homosexual") return gender === "female" ? "Lesbian" : "Gay";
  return labels[orientation] ?? "";
}

export function getOrientationSymbol(orientation, gender) {
  if (orientation === "homosexual") return gender === "female" ? "⚢" : "⚣";
  return { heterosexual: "⚤", bisexual: "⚥", pansexual: "🌈" }[orientation]
    ?? (gender === "female" ? "♀" : "♂");
}

export function createOrientationEvent(player, step = 1) {
  const art = { image, imageAlt: "OpenMoji: Cầu vồng khám phá bản thân",
    imageFallback: image, imageFallbackAlt: "OpenMoji: Cầu vồng khám phá bản thân" };
  if (step === 1) return {
    kind: "orientation-chain", specialStep: 1,
    title: "💭 Những cảm xúc mới ở tuổi 24",
    text: "Dạo này, một tin nhắn cũng khiến tôi cười cả buổi. Trái tim bật thông báo, mà tôi chưa hiểu nó muốn gì! Tôi quyết định tìm hiểu xem mình thật sự rung động trước ai.",
    choices: [{ label: "💬 Lắng nghe trái tim mình", nextStep: 2 }], ...art,
  };
  if (step !== 2) return null;
  const sameGender = player.gender === "female" ? "Đồng tính nữ (Lesbian)" : "Đồng tính nam (Gay)";
  const choices = [
    ["heterosexual", "Dị tính - Thẳng (Heterosexual)", "Hấp dẫn với người khác giới."],
    ["homosexual", sameGender, "Hấp dẫn với người cùng giới."],
    ["bisexual", "Song tính (Bisexual)", "Hấp dẫn với cả hai giới (nam và nữ) hoặc nhiều giới."],
    ["pansexual", "Toàn tính (Pansexual)", "Hấp dẫn với mọi người bất kể giới tính hay bản dạng giới nào."],
  ].map(([orientation, label, description]) => {
    const name = getOrientationLabel(orientation, player.gender);
    const text = `Tôi là ${name.toLocaleLowerCase("vi-VN")} và tự hào về bản thân! Cứ sống thoải mái, đàng hoàng, tôn trọng mọi người và không làm tổn thương ai. 💖`;
    return ensureEventOpenMoji({
      label: `${label}: ${description}`, orientation,
      title: `🌈 Tự hào là chính mình — ${name}`, text,
      effects: {}, confirmText: "💖 Sống tự tin thôi!",
      logSummary: `🌈 24 tuổi: Tôi hiểu thêm về bản thân — ${name}.`,
      logContent: `🌈 Ở tuổi 24, tôi dành thời gian tìm hiểu cảm xúc và xu hướng tính dục của mình.\n${text}`,
      ...art,
    });
  });
  return {
    kind: "orientation-chain", specialStep: 2,
    title: "🌈 Hiểu thêm về chính mình",
    text: "Lắng nghe trái tim, tôi nhận ra xu hướng tính dục của mình là:",
    choices, ...art,
  };
}
