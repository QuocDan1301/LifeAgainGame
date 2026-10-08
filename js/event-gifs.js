import { cachedEventGifIds } from "./cached-event-gifs.js";
const cachedIds = new Set(cachedEventGifIds);
// Local audited GIFs, with remote URLs for the rest of the library.
const gif = (id, alt) => ({
  url: cachedIds.has(id)
    ? new URL(`./img/events/gifs/${id}.gif`, import.meta.url).href
    : `https://media.giphy.com/media/${id}/200w.gif`,
  source: `https://giphy.com/gifs/${id}`,
  alt,
});

// 100 extra, family-friendly GIFs grouped by the mood they illustrate.
const extraGifGroups = {
  cheer: [
    "BlVnrxJgTGsUw", "qPKdzt3x44wy4", "YnBntKOgnUSBkV7bQH", "AAfsNdpViiQZo7wexr", "03IoP34ByFpdRvT0wb",
    "t3sZxY5zS5B0z5zMIz", "WoYwgrfZP4yw8", "BcfbSp4hvude8", "12SXVd8bmXdSg0", "12UlfHpF05ielO",
  ],
  laugh: [
    "6qy5IgHaSPN6hzejlI", "iD1QQCbrl548I31Qww", "ajYIa6owWeEYblFRY9", "fUYhyT9IjftxrxJXcE", "l0ExayQDzrI2xOb8A",
    "7TM8kWy04HzcA", "gj0QdZ9FgqGhOBNlFS", "LWyocZkCLj2EHXTVcb", "vspv1bNkiyvkCOeaaw", "ek8qTx5yijpNQZV8Cb",
  ],
  celebrate: [
    "o75ajIFH0QnQC3nCeD", "MayT06htlXZxirHgzE", "7zYKTVt3vvbj7SC2Bl", "l3q2Z6S6n38zjPswo", "IjjVOxaYEceVFAhWHi",
    "0d6F8srKSlmtvsyBQF", "tj3t82Nm6CgiF64a2L", "elpqKJsaSNY1wYlonS", "993QZRYmq3kbvODe07", "xkJ0vi1tFbZQVNJ2E6",
  ],
  amaze: [
    "aWPGuTlDqq2yc", "28UMYUOhdbOzAVtKiK", "H9pf4JgAhkvTqEpvlC", "ep78UZy5FVbfN6mhCU", "ulSQCy5TONF3jYX47h",
    "5VKbvrjxpVJCM", "QUENDfi6DEMLzQ0CKt", "9jHuf9jKhR0upU5kDB", "OluyzCAatv35C", "T0WTbqlk6T1XzIvT5K",
  ],
  think: [
    "3o6fJ7uaPs0w3jLlXa", "SqfHFPbzxw98xwFOiE", "kDf0eEXhOhlZgdp2dy", "jLXCZYvV5D3VcPlEPR", "Q5BCsvHFAUnvsjYNWr",
    "BqTphFg9hBmR5DmDCb", "nTZt1E0IM8sKSEVirG", "RaN90gpPjcQXo5FqxO", "hTI1GE6i1tzaBjTZtg", "Tuz7SdYc6npuzzZjsS",
  ],
  confuse: [
    "1X7lCRp8iE0yrdZvwd", "l2Sqa2Tn2YNR87C24", "xT0xeuOy2Fcl9vDGiA", "uJUU5k5s2bi3PnMv0H", "uVtAU2EKHrsgifowFb",
    "U3rhXx0QXqVkVvWXMo", "d9B54V3NLZRtKX9ReV", "WrxCd2PFKIQ9F8YVqU", "QPGg0w2vvjwgWkvfBz", "HzOZw9XaKHu5kEJQg1",
  ],
  nervous: [
    "1FMaabePDEfgk", "yaGwXC64r5Rzd77vnN", "JogpSEYS1cjGJk9SWi", "U1n3E1PsnOm2mr0woz", "XnJpERzn7Lr2pNdu4w",
    "n0pAQs99X611RpiwQn", "9noPTEk8ayYAq3z8wQ", "l4FGIud8NOVJq0ev6", "c5BB6eygzNoZUETnFq", "MNi4u1GOzTgBwJLd5x",
  ],
  sad: [
    "Ld6YQCrqoWzk70ykXH", "iqslzcOrarFxwbtzMU", "Zb9UU4TTAIEjHecBVo", "uvzfDPPghFUOj7gcDI", "gRgrJoJHR6fusT6Yry",
    "R7vbPdtwwan3PE2mxZ", "jgF8S9tI4Tf184hht4", "YPFZW07dFFi0kaSdOz", "4TvCD9mwggxrB84bNF", "4GXOphKW64BZZdh0Au",
  ],
  sleepy: [
    "h7DyKGq716JMI", "I4G0jcOtIyagIT8Ory", "xT8qBvH1pAhtfSx52U", "l1KVaj5UcbHwrBMqI", "7XoIwpjnLLgBJNzZRy",
    "OjmrBW4ZQbWjkq6RkC", "ibdSCBrJ3BBCVUl8XD", "qAWGs0U38bTRxcEL0V", "iTnVKXAWDvRmw", "jE1HHWq6g4Z8dXsVPR",
  ],
  work: [
    "3o7aCTfyhYawdOXcFW", "UZQCbV4OW1mXdHJNPS", "13rQ7rrTrvZXlm", "l4FGEfO2es6g8w4AU", "toXKzaJP3WIgM",
    "PvvSfSDFoAL5e", "YAnpMSHcurJVS", "5Zesu5VPNGJlm", "SwImQhtiNA7io", "fQZX2aoRC1Tqw",
  ],
};

const extraGifAlt = {
  cheer: "Phản ứng vui vẻ và phấn khích",
  laugh: "Phản ứng bật cười vui nhộn",
  celebrate: "Phản ứng ăn mừng thành công",
  amaze: "Phản ứng ngạc nhiên và ấn tượng",
  think: "Phản ứng tập trung suy nghĩ",
  confuse: "Phản ứng bối rối và phân vân",
  nervous: "Phản ứng hồi hộp và căng thẳng",
  sad: "Phản ứng buồn và thất vọng",
  sleepy: "Phản ứng mệt mỏi và buồn ngủ",
  work: "Phản ứng chăm chỉ học tập và làm việc",
};

const extraGifs = Object.fromEntries(
  Object.entries(extraGifGroups).flatMap(([group, ids]) =>
    ids.map((id, index) => [`${group}Extra${index + 1}`, gif(id, extraGifAlt[group])]),
  ),
);

export const giphyGifs = {
  typing: gif("JIX9t2j0ZTN9S", "Meme mèo gõ bàn phím cực kỳ chăm chỉ"),
  cozy: gif("3oriO0OEd9QIDdllqo", "Mèo con nằm thư giãn và được vuốt ve"),
  sleepy: gif("l0MYu38R0PPhIXe36", "Meme ngủ gật, mắt nhắm nghiền"),
  amazed: gif("26ufdipQqU2lhNA4g", "Meme há hốc miệng vì quá bất ngờ"),
  chaos: gif("13HgwGsXF0aiGY", "Meme vẫn gõ máy tính giữa cảnh hỗn loạn"),
  success: gif("111ebonMs90YLu", "Cậu bé giơ ngón tay cái sau khi dùng máy tính"),
  blink: gif("l3q2K5jinAlChoCLS", "Meme chớp mắt ngỡ ngàng vì chuyện bất ngờ"),
  thinking: gif("d3mlE7uhX8KFgEmY", "Meme chỉ tay vào đầu, nghĩ ra một cách xử lý"),
  babyReaction: gif("9Y5BbDSkSTiY8", "Em bé với biểu cảm hài hước"),
  applause: gif("11sBLVxNs7v6WA", "Các Minion vỗ tay reo vui"),
  cheering: gif("1BXa2alBjrCXC", "Meme reo lên phấn khích để ăn mừng"),
  laughEmoji: gif("1Z0g3Y5WxKqU7FdHbI", "Biểu tượng cười nghiêng ngả vui nhộn"),
  cuteLaugh: gif("ylumbI48QpaRAjKEda", "Phản ứng bật cười đáng yêu"),
  bigLaugh: gif("cFTC7n3MYXi50O22lm", "Phản ứng cười đầy sảng khoái"),
  excited: gif("l0MYsC1UC0BGwG2SQ", "Phản ứng phấn khích và tràn đầy năng lượng"),
  mischievous: gif("xUOxfpjFfGq6ra2UuI", "Phản ứng thích thú và tinh nghịch"),
  teamCelebration: gif("BYlRdbXG1uPSjd687J", "Cả nhóm cùng ăn mừng thành công"),
  puzzledCrowd: gif("l0K45fwBufXrJM2jK", "Mọi người ngơ ngác suy nghĩ"),
  puzzled: gif("aRC1wi718lF9tvpQr9", "Chú chó hoạt hình buồn, mắt rưng rưng"),
  unsure: gif("vH68MhfG17CNp1U4fs", "Phản ứng chưa chắc chắn và cân nhắc"),
  nervous: gif("Njxl6gCPWVSoIYh9Ft", "Phản ứng hồi hộp và căng thẳng"),
  cuteSurprise: gif("cvTf155wwXmGxH9HMM", "Nhân vật hoạt hình bất ngờ tròn mắt"),
  techSurprise: gif("OuHINGgTww5wIhatHG", "Phản ứng bất ngờ trước điều vừa thấy"),
  amazedStar: gif("3o8dFn5CXJlCV9ZEsg", "Phản ứng kinh ngạc và ấn tượng"),
  sleepyFace: gif("xAEom6Vs8yqaaaPQXX", "Phản ứng mệt rũ và buồn ngủ"),
  dozing: gif("3o7bu51UtfDTU8OEG4", "Nhân vật ngủ gật vì kiệt sức"),
  cozyCat: gif("sseU7pBJm4fF5rpYal", "Căn phòng ấm áp, yên tĩnh bên ánh lửa"),
  plantGrowing: gif("rq4uFXgYbiT5RawwWm", "Cây non lớn lên từ chậu đất"),
  ...extraGifs,
};

const gifPools = {
  typing: ["typing"],
  cozy: ["cozy", "cozyCat"],
  sleepy: ["sleepy", "dozing"],
  amazed: ["cuteSurprise", "amazedStar"],
  chaos: ["chaos"],
  success: ["success", "teamCelebration"],
  blink: ["blink", "puzzledCrowd"],
  thinking: ["thinking", "unsure"],
  applause: ["applause", "teamCelebration"],
  cheering: [
    "excited", "applause",
  ],
};

const stableHash = (value) =>
  [...value].reduce((hash, char) => ((hash * 31) + char.codePointAt(0)) >>> 0, 0);

export function getEventGif(key, target = {}) {
  const pool = gifPools[key] ?? [key];
  const identity = `${target.id ?? ""}|${target.title ?? ""}|${target.text ?? target.label ?? ""}`;
  return giphyGifs[pool[stableHash(identity) % pool.length]];
}

// Only selected scenes/results use GIFs; all other slots keep OpenMoji.
// Choice indices follow the event's existing order, starting at zero.
export const eventGifs = {
  "a1-first-steps": { choices: { 0: "applause" } },
  "a1-bath-time": { choices: { 0: "cuteLaugh" } },
  "a2-picture-book": { choices: { 0: "thinking" } },
  "a2-block-tower": { scene: "blink" },
  "a2-lost-toy": { choices: { 0: "thinking" } },
  "a3-playground": { choices: { 0: "cheering" } },
  "a4-painting": { choices: { 1: "amazed" } },
  "a4-garden": { choices: { 0: "plantGrowing" } },
  "a5-letter": { choices: { 0: "thinking" } },
  "a5-storytelling": { choices: { 0: "applause" } },
  "a6-first-school": { choices: { 0: "cheering" } },
  "a6-pencil": { scene: "blink" },
  "a6-reading": { choices: { 0: "applause" } },
  "a7-tag": { choices: { 0: "cheering" } },
  "a1-bedtime": { choices: { 0: "cozy" } },
  "a3-nap": { scene: "sleepy" },
  "a4-buttons": { choices: { 0: "success" } },
  "a5-puzzle": { choices: { 0: "thinking" } },
  "a7-late-cartoon": { choices: { 1: "sleepy" } },
  "a8-hard-math": { scene: "amazed", choices: { 0: "thinking" } },
  "a8-library": { choices: { 1: "cheering" } },
  "a9-school-photo": { choices: { 1: "cheering" } },
  "a9-haircut": { choices: { 1: "blink" } },
  "a9-school-fair": { choices: { 1: "applause" } },
  "a10-class-test": { choices: { 0: "thinking" } },
  "a8-group-project": { choices: { 1: "typing" } },
  "a10-science": { choices: { 1: "amazed" } },
  "teen-11-2": { choices: { 1: "amazed" } },
  "teen-12-1": { scene: "amazed" },
  "teen-11-1": { choices: { 0: "thinking" } },
  "teen-12-2": { scene: "blink" },
  "teen-13-1": { choices: { 0: "applause" } },
  "teen-13-3": { choices: { 0: "cheering" } },
  "teen-14-3": { choices: { 0: "cheering" } },
  "teen-16-2": { scene: "blink", choices: { 0: "thinking" } },
  "teen-16-3": { choices: { 0: "thinking" } },
  "teen-17-2": { choices: { 1: "blink" } },
  "teen-17-3": { choices: { 1: "cheering" } },
  "teen-12-3": { choices: { 1: "typing" } },
  "teen-14-1": { choices: { 1: "sleepy" } },
  "teen-14-2": { choices: { 1: "chaos" } },
  "teen-16-1": { scene: "typing", choices: { 0: "success", 1: "chaos" } },
  "teen-17-1": { choices: { 1: "sleepy" } },
  "teen-18-2": { choices: { 0: "success" } },
  "teen-19-1": { scene: "amazed" },
  "teen-19-3": { scene: "typing", choices: { 0: "success" } },
  "teen-20-1": { choices: { 0: "success" } },
};

export function findGiphyGif(url) {
  return Object.values(giphyGifs).find((illustration) => illustration.url === url);
}

// Choose a relevant GIF only when a mixed event needs one.
export function ensureEventGif(target) {
  if (findGiphyGif(target.image)) return target;
  const text = `${target.title ?? ""} ${target.text ?? target.content ?? ""} ${target.label ?? ""}`.toLocaleLowerCase("vi");
  let key = "thinking";
  if (/thiếu ngủ|ngủ muộn|ngủ trưa|ngủ ngon|ngủ sớm|đi ngủ|buồn ngủ|mệt|kiệt sức|uể oải|hết pin/u.test(text)) key = "sleepy";
  else if (/tưới|gieo hạt|chăm cây|cây lớn|cây xanh|làm vườn|rễ|chậu cây/u.test(text)) key = "plantGrowing";
  else if (/buồn|tủi|tiếc/u.test(text)) key = "puzzled";
  else if (/hồi hộp|căng thẳng|áp lực|khó tin|chưa thể tin/u.test(text)) key = "unsure";
  else if (/tin đồn|tranh cãi|hiểu lầm|thất lạc|để quên|khó chịu|tạch/u.test(text)) key = "blink";
  else if (/bất ngờ|thí nghiệm|khám phá/u.test(text)) key = "amazed";
  else if (/lập trình|dòng mã|website|bàn phím|dựng video/u.test(text)) key = "typing";
  else if (/bật cười|cười vui|cười nghiêng|cười khanh|hài hước|ngộ nghĩnh|tiếng cười/u.test(text)) key = "cuteLaugh";
  else if (/ăn mừng|ngày hội|biểu diễn|sân khấu|chiến thắng/u.test(text)) key = "cheering";
  else if (/thành công|hoàn thành|làm được|ghép đúng|vỗ tay|khen|giải được|tự hào/u.test(text)) key = "applause";
  else if (/thư giãn|nghỉ ngơi|ấm áp|yêu thương|gia đình|bình an/u.test(text)) key = "cozy";
  else if ((target.effects?.happiness ?? 0) < 0) key = "blink";
  else if ((target.effects?.happiness ?? 0) > 0) key = "applause";

  const gif = getEventGif(key, target);
  target.imageFallback ||= target.image?.includes("/events/stickers/")
    ? target.image
    : new URL("./img/events/stickers/1F4DA.svg", import.meta.url).href;
  target.imageFallbackAlt ||= target.imageAlt || "Nhãn dán minh họa sự kiện";
  target.image = gif.url;
  target.imageAlt = gif.alt;
  return target;
}

// Keep both GIFs and OpenMoji in each story and its possible results.
export function mixEventMedia(event) {
  const slots = [event, ...(event.choices ?? [])];
  if (slots.length < 2) return event;
  const hash = [...(event.id ?? event.title ?? "")].reduce((value, char) => value + char.codePointAt(0), 0);
  if (!slots.some(slot => findGiphyGif(slot.image))) {
    const resultSlots = event.choices ?? [];
    ensureEventGif(resultSlots.length ? resultSlots[hash % resultSlots.length] : event);
  }
  if (slots.every(slot => findGiphyGif(slot.image))) {
    const sticker = slots[hash % slots.length];
    sticker.image = sticker.imageFallback;
    sticker.imageAlt = sticker.imageFallbackAlt;
  }
  return event;
}
