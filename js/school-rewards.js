const statNames = { health: "Sức khỏe", intelligence: "Trí tuệ", happiness: "Hạnh phúc", appearance: "Ngoại hình" };
const milestones = {
  6: { id: "primary", title: "🎒 Vào cấp 1", minimum: 1, money: 0 },
  11: { id: "secondary", title: "📚 Vào cấp 2", minimum: 2, money: 500_000 },
  15: { id: "high", title: "🏫 Vào cấp 3", minimum: 3, money: 1_000_000 },
};

// Prepare once and save with the result so reloading cannot reroll the reward.
export function createSchoolEntryReward(player, age, updates = {}, random = Math.random) {
  if (player.isAlive === false || updates.isAlive === false) return null;
  let milestone = player.age < age ? milestones[age] : null;
  const path = updates.careerPath;
  if (!milestone && path?.id !== "military" && path?.school &&
      path.school.type !== "academy" && /Đại học|Học viện/i.test(path.school.name ?? "")) {
    milestone = { id: "university", title: "🎓 Vào đại học", money: 2_000_000 };
  }
  if (!milestone || player.schoolRewardsReceived?.[milestone.id]) return null;
  const rewardUpdates = {};
  const changes = [];
  if (milestone.minimum) {
    for (const [stat, label] of Object.entries(statNames)) {
      const oldValue = updates[stat] ?? player[stat];
      const points = milestone.minimum + Math.floor(random() * 2);
      rewardUpdates[stat] = Math.min(100, oldValue + points);
      changes.push(`${label} +${rewardUpdates[stat] - oldValue}`);
    }
  }
  if (milestone.money) {
    rewardUpdates.money = (updates.money ?? player.money) + milestone.money;
    changes.push(`Tiền +${milestone.money.toLocaleString("vi-VN")} VNĐ`);
  }
  rewardUpdates.schoolRewardsReceived = { ...(player.schoolRewardsReceived ?? {}), [milestone.id]: true };
  return { id: milestone.id, updates: rewardUpdates, content: `${milestone.title}\n${changes.join(" · ")}` };
}
