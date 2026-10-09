import { laterLifeStories } from "./special-later-life-data.js";

const art = (code, alt) => {
  const image = new URL(`./img/events/openmoji/color/svg/${code}.svg`, import.meta.url).href;
  return { image, imageAlt: alt, imageFallback: image, imageFallbackAlt: alt };
};
const rewards = {
  60: { money: 100_000_000, effects: { happiness: 15, intelligence: 5 }, achievement: "story-reward", item: ["kindness-toolkit", "Bộ dụng cụ nghĩa tình"] },
  65: { money: 500_000_000, effects: { intelligence: 5, happiness: 10 } },
  70: { money: 30_000_000, effects: { intelligence: 10, happiness: 15 }, achievement: "story-fraud", item: ["community-certificate", "Bằng khen vì cộng đồng"] },
  75: { money: 200_000_000, effects: { happiness: 10, intelligence: 5 }, item: ["friendship-photo", "Tấm ảnh tình bạn"] },
  80: { money: 500_000_000, effects: { happiness: 20 }, achievement: "story-lucky", item: ["lucky-ticket-80", "Tấm phiếu may mắn tuổi 80"] },
  85: { money: 200_000_000, effects: { intelligence: 5, happiness: 10 }, item: ["library-key", "Chiếc chìa khóa thư viện"] },
  90: { effects: {}, happiness: 100, achievement: "story-final-happiness", item: ["love-notebook", "Cuốn sổ yêu thương"], memory: ["birthday-90", "Sinh nhật tuổi 90"] },
  95: { money: 50_000_000, effects: { happiness: 10 }, item: ["homecoming-photo", "Bức ảnh ngày trở về"] },
  100: { effects: {}, happiness: 100, achievement: "story-old-together", item: ["lifelong-photo-pair", "Hai tấm ảnh, một lời hẹn"], memory: ["couple-100", "Một lời hẹn, hai tấm ảnh"] },
};
// Null ends the chain. A positive number advances; "win" resolves rewards.
const paths = {
  60: [[2, null], [3, 3, null], [4, 4, null], [5, 5, null], ["win", "win"]],
  65: [[2, "injury"], [3, "injury"], [4, "injury"], ["win", "injury"]],
  70: [[2, "fee", null], [3, null], [4, null], [5, null, null], ["win", "win"]],
  75: [[2, "injury"], [3, "injury"], [4, "injury"], ["win", "injury"]],
  80: [[2, null], [3, null], [4, 4], [5, null], ["win", "win"]],
  85: [[2, "injury"], [3, "injury"], [4, "injury"], ["win", "injury"]],
  90: [[2, 2, null], [3, 3, null], [4, 4, null], [5, 5, null], ["win", "win"]],
  95: [[2, "death"], [3, "death"], [4, "death"], ["win", "death"]],
  100: [[2, 2, null], [3, 3, null], [4, 4, null], [5, 5, null], ["win", "win"]],
  105: [[2, 2, 2], [3, 3], [4, 4, 4], ["ending", "ending", "ending"]],
};
const illustrations = {
  60: ["1F9F0", "1F6E0", "1F4FB", "1F327", "1F381"],
  65: ["1F5BC", "1F50D", "1F48C", "1F4B0"],
  70: ["1F4F1", "1F4AC", "1F9E9", "1F3AD", "1F3C5"],
  75: ["1F570", "1F4DA", "1F333", "1F510"],
  80: ["1F426", "1F388", "1F3AB", "2614", "1F340"],
  85: ["1F4DA", "1F4F8", "1F5C4", "1F511"],
  90: ["1F31E", "1F4F8", "1F373", "1F3A4", "1F382"],
  95: ["1F327", "1F45C", "1F6AA", "1F6DF"],
  100: ["1F31E", "1F4F8", "1FA91", "1F4AC", "1F90D"],
  105: ["1F4F1", "1F48C", "1F4D6", "1F56F"],
};
const stripDirections = text => text.replace(/(?:Sang|sang) (?:sự kiện|tình huống) \d+\.?/g, "").trim();

export function getPartnerRelationship(partner) {
  return Number.isFinite(partner?.relationship) ? partner.relationship : 80;
}
export function hasLivingSpouse(player) {
  return Boolean(player.partner && player.marriedAtAge != null && player.partner.isAlive !== false &&
    player.partner.deceased !== true && player.partner.stats?.health !== 0);
}
export function canStartCentennialStory(player) {
  return hasLivingSpouse(player) && getPartnerRelationship(player.partner) >= 80;
}

export function createLaterSpecialStep(age, stepNumber = 1, inventory = {}) {
  const story = laterLifeStories[age];
  const scene = story?.steps[stepNumber - 1];
  if (!scene) return null;
  const code = illustrations[age][stepNumber - 1];
  let text = scene.text;
  if (age === 80 && stepNumber === 5) text = text.replace("đúng số trên tấm vé mình giữ", `số ${inventory.ticket ?? "0080"} trên tấm vé mình giữ`);
  if (age === 90 && inventory.communityOnly) text = text.replace("chúng con, chúng cháu và bạn bè", "những người quý mến ông bà");
  if (age === 100 && inventory.spouseName) text = `${inventory.spouseName} vẫn là người bạn đời bên cạnh tôi.\n\n${text}`;
  const choices = scene.choices.map((original, choiceIndex) => {
    const destination = paths[age][stepNumber - 1][choiceIndex];
    const branch = { label: original.label };
    if (typeof destination === "number") {
      branch.nextStep = destination;
      branch.transitionText = stripDirections(original.text) + "\n\n";
      if (age === 80 && stepNumber === 2) branch.inventoryChanges = { ticket: "0080" };
      if (age === 80 && stepNumber === 3) branch.inventoryChanges = { ticket: choiceIndex === 0 ? "0080" : "8888" };
      if (age === 105 && stepNumber === 1) branch.inventoryChanges = { closed: choiceIndex === 2 };
      if (age === 105 && stepNumber === 3) branch.inventoryChanges = { closed: choiceIndex === 2 };
      return branch;
    }
    Object.assign(branch, { title: scene.title, text: stripDirections(original.text), effects: {},
      confirmText: "Tiếp tục cuộc đời", ...art(code, scene.title) });
    if (destination === "win") {
      const reward = rewards[age];
      branch.text += scene.afterChoices ? `\n\n${scene.afterChoices}` : "";
      branch.effects = { ...reward.effects };
      if (reward.money) branch.money = reward.money;
      if (reward.happiness) branch.statTargets = { happiness: reward.happiness };
      branch.achievementIds = reward.achievement ? [reward.achievement] : [];
      branch.logContent = story.log;
      branch.confirmText = reward.achievement ? "Nhận thành tựu!" : "Nhận phần thưởng!";
      if (reward.item) branch.keepsake = { id: reward.item[0], name: reward.item[1],
        description: age === 80 ? `Phiếu ${inventory.ticket ?? "0080"} trúng giải trong chương trình rút thăm miễn phí.` : scene.title };
      if (reward.memory) branch.memory = { id: reward.memory[0], title: reward.memory[1],
        text: story.log, image: art("1F4F8", "Ảnh kỷ niệm").image, people: inventory.people ?? [] };
      if (age === 60 && choiceIndex === 1) branch.unlockActivity = "free-repair-lessons";
      if (age === 100) branch.partnerRelationship = { id: inventory.spouseId, value: 100 };
      return branch;
    }
    if (destination === "injury") {
      branch.effects = { health: age === 85 ? -10 : -20 };
      branch.minimumHealth = 1;
      branch.nonFatal = true;
    }
    if (destination === "fee") branch.money = -500_000;
    if (destination === "death") {
      branch.death = true;
      branch.effects = { health: -100 };
      branch.confirmText = "Kết thúc cuộc đời";
    }
    if (destination === "ending") {
      // Refusing solitude once is never enough: the cold ending needs the
      // explicit withdrawal at scene 3 as well as rejection at the final door.
      const cold = choiceIndex === 2 && inventory.closed === true;
      branch.title = cold ? "🌑 Ra đi trong lạnh lẽo" : "🏆 Kết thúc viên mãn";
      branch.text = cold ? story.sadEnding : story.goodEnding;
      if (!cold && choiceIndex === 1) branch.text = "Tôi nhờ gọi một người để nghe giọng. Nếu chưa liên lạc được, người chăm sóc vẫn ở lại bên tôi.\n\n" + branch.text;
      if (!cold && choiceIndex === 2) branch.text = "Tôi muốn một khoảng yên tĩnh. Người thân quen tôn trọng ý tôi, vẫn ở gần và chăm sóc khi cần.\n\nTôi khép mắt, bình thản ra đi ở tuổi 105. Cuốn nhật ký được đóng lại, còn những điều tôi để lại vẫn tiếp tục trong ký ức của người khác.";
      branch.death = true;
      branch.effects = { health: -100 };
      branch.achievementIds = cold ? [] : ["ending-fulfilled"];
      branch.ending = cold ? "cold" : "fulfilled";
      branch.logContent = branch.text;
      branch.confirmText = "Khép lại cuộc đời";
      return branch;
    }
    branch.logContent = `Năm ${age} tuổi, tôi gặp câu chuyện ‘${story.steps[0].title}’. ${branch.text}`;
    return branch;
  });
  const extraClues = age === 95 ? [
    ["đã lên rõ rệt chỉ trong một lúc"],
    ["Giấy tờ, thuốc theo đơn và điện thoại đều ở đây rồi."],
    ["không tự chuyển vị trí"],
    ["tiếng hô đó dành cho người đang buộc dây ở đầu thuyền, không phải cho tôi"],
  ][stepNumber - 1] : [];
  return { id: `later-special-${age}-${stepNumber}`, kind: "special-chain",
    specialId: `later-${age}`, specialStep: stepNumber, specialInventory: { ...inventory },
    priority: age === 105, title: scene.title, text,
    warningPhrases: [...scene.warningPhrases, ...extraClues], ...art(code, scene.title), choices,
    referenceNotes: [75, 85].includes(age) ? story.steps.slice(0, stepNumber).map(step => `${step.title}\n${step.text}`).join("\n\n") : undefined };
}

export function createCentennialMemorial(player) {
  if (!player.partner || player.marriedAtAge == null || hasLivingSpouse(player)) return null;
  const name = player.partner.name;
  return { id: "centennial-memorial", title: "🕯️ Một lời hẹn còn được nhớ",
    text: `Sinh nhật tuổi 100, tôi nhìn bức ảnh của ${name}, người bạn đời đã mất. Tôi nhớ lời hẹn chụp lại một tấm ảnh cùng nhau. Hôm nay, tôi muốn giữ lời hẹn bằng một cách khác, để những ngày đã có nhau vẫn được nhớ đến.`,
    ...art("1F56F", "Kỷ niệm về người bạn đời đã mất"),
    choices: [
      { label: "Kể một kỷ niệm về mình cho người thân quen.", text: `Tôi kể về ${name}, cả những lần cùng vượt khó lẫn những chuyện nhỏ khiến hai người bật cười.`, effects: { happiness: 3 } },
      { label: "Viết một lời nhắn cạnh bức ảnh cũ.", text: `Tôi viết lời cảm ơn ${name} bên tấm ảnh. Một khoảng yên tĩnh đủ để nhớ và trân trọng những ngày đã bên nhau.`, effects: { happiness: 2, intelligence: 1 } },
    ].map(choice => ({ ...choice, title: "Một người vẫn ở trong ký ức", ...art("1F56F", "Kỷ niệm về người bạn đời"), confirmText: "Tiếp tục hành trình" })) };
}

export function createLaterSpecialEvent(age, player = {}) {
  if (!laterLifeStories[age]) return null;
  if (age === 100 && !canStartCentennialStory(player)) return null;
  const livingPartner = hasLivingSpouse(player) && getPartnerRelationship(player.partner) >= 60 ? player.partner : null;
  const livingChildren = (player.children ?? []).filter(child => child.isAlive !== false && child.deceased !== true && child.stats?.health !== 0 && getPartnerRelationship(child) >= 60);
  const people = [...(livingPartner ? [livingPartner.name] : []), ...livingChildren.map(child => child.name)];
  return createLaterSpecialStep(age, 1, { ticket: "0080", closed: false,
    spouseId: age === 100 ? player.partner.id : null, spouseName: age === 100 ? player.partner.name : null,
    communityOnly: people.length === 0, people: people.length ? people : ["Hàng xóm và những người bạn còn giữ liên lạc"] });
}
