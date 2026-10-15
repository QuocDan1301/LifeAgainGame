import { openMojiArt } from "../media/event-art.js";
import { createAdmirer, getDatingUpdates, canStartRelationship } from "./relationships.js";
import { getAcquaintanceChance, getRomanceChance, getSocialContext, getStartingBond } from "../stats/appearance-rules.js";

 
 
const CONTEXT_TEXT = {
  school: { place: "lớp học", who: "một bạn cùng trường", icon: "1F3EB" },
  work: { place: "nơi làm việc", who: "một đồng nghiệp ở bộ phận bên cạnh", icon: "1F3E2" },
  community: { place: "buổi sinh hoạt cộng đồng", who: "một người cùng tham gia", icon: "1F91D" },
};
const art = (code, alt) => openMojiArt(code, alt);
const friendUpdate = (player, person, age, bond) => ({
  friends: [...(player.friends ?? []), { id: person.id, name: person.name, gender: person.gender, since: age, bond }],
});

export function createAcquaintanceEvent(player, age, random = Math.random) {
  const context = getSocialContext(player, age);
  if (!context || random() >= getAcquaintanceChance(player, age)) return null;
  const setting = CONTEXT_TEXT[context];
  const person = { ...createAdmirer(player, age, random), ...(age < 18 ? { ageAtMeeting: age } : {}) };
  const romanceOpen = age >= 18 && canStartRelationship(player);
  const accepted = random() < getRomanceChance(player);
  const choices = [
    { label: "💬 Trò chuyện thêm, làm bạn", title: "💬 Một người bạn mới",
      text: `Tôi và ${person.name} nói chuyện về đủ thứ ở ${setting.place}. Từ hôm đó, chúng tôi thành bạn.`,
      effects: { happiness: 3 }, playerUpdates: friendUpdate(player, person, age, 50), confirmText: "Vui ghê", ...art("1F4AC", "Trò chuyện làm quen") },
    { label: "🎨 Rủ cùng làm một sở thích chung", title: "🎨 Chung một niềm vui",
      text: `Hóa ra ${person.name} cũng thích những điều tôi thích. Chúng tôi hẹn nhau cùng tham gia mỗi tuần.`,
      effects: { happiness: 4 }, playerUpdates: friendUpdate(player, person, age, 60), confirmText: "Hẹn tuần sau", ...art("1F3A8", "Sở thích chung") },
  ];
  if (romanceOpen) {
    choices.push(accepted
      ? { label: "💞 Mời một buổi cà phê để tìm hiểu", title: "💞 Bắt đầu tìm hiểu",
        text: `${person.name} vui vẻ nhận lời. Sau vài buổi cà phê, cả hai quyết định tìm hiểu nhau nghiêm túc. Mối quan hệ lâu dài sẽ do cách cư xử và sự quan tâm mỗi ngày quyết định.`,
        effects: { happiness: 4 }, playerUpdates: getDatingUpdates(player, { ...person, relationship: getStartingBond(player) }, age),
        achievementIds: ["first-love"], confirmText: "Hồi hộp quá", ...art("2615", "Buổi cà phê tìm hiểu") }
      : { label: "💞 Mời một buổi cà phê để tìm hiểu", title: "🤝 Làm bạn trước đã",
        text: `${person.name} cảm ơn lời mời nhưng muốn làm bạn trước. Tôi tôn trọng điều đó, và chúng tôi vẫn giữ liên lạc như những người bạn.`,
        effects: { happiness: 1 }, playerUpdates: friendUpdate(player, person, age, 45), confirmText: "Không sao", ...art("1F91D", "Làm bạn trước") });
  }
  choices.push({ label: "🙂 Chào hỏi lịch sự, chưa muốn kết thân", title: "🙂 Một lời chào",
    text: `Tôi cảm ơn ${person.name} và trò chuyện vài câu. Không phải cuộc gặp nào cũng cần đi xa hơn.`,
    effects: {}, confirmText: "Tiếp tục", ...art("1F44B", "Lời chào") });
  return {
    id: `acquaintance-${age}`, kind: "acquaintance", category: romanceOpen ? "love" : "social",
    title: "👋 Một lời làm quen",
    text: `Ở ${setting.place}, ${setting.who} tên ${person.name} chủ động bắt chuyện với tôi. Người ấy ${person.reason}.`,
    ...art(setting.icon, "Một lời làm quen"),
    choices,
  };
}
