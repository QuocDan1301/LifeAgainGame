// Shared consequences for street crime and workplace convictions; fictional game rules.
export const hasRecord = player => (player.criminalRecord?.length ?? 0) > 0;
export const isRehabilitated = player => hasRecord(player) && player.lifePath === 'reformed' &&
  (player.reformedYears ?? 0) >= 3 && player.reformationRecognized === true;

export function getRecordPenalty(player) {
  if (!hasRecord(player) || isRehabilitated(player)) return 0;
  return player.lifePath === 'reformed' && !player.prison ? 0.1 : 0.2;
}

export function getConvictionSocialUpdates(player) {
  return {
    reformedYears: 0, reformationRecognized: false,
    relatives: (player.relatives ?? []).map(person => person.alive ? { ...person, bond: Math.max(0, (person.bond ?? 70) - 8) } : person),
    friends: (player.friends ?? []).map(person => ({ ...person, bond: Math.max(0, (person.bond ?? 50) - 5) })),
    ...(player.partner ? { partner: { ...player.partner, relationship: Math.max(0, (player.partner.relationship ?? 80) - 12) } } : {}),
    ...(player.otherPartners ? { otherPartners: player.otherPartners.map(person => ({ ...person, relationship: Math.max(0, (person.relationship ?? 80) - 12) })) } : {}),
  };
}

export function collectReformationYear(player, age) {
  if (!hasRecord(player) || player.lastReformationYear >= age) return;
  const lastSentence = player.criminalRecord.at(-1);
  const release = player.releasedAtAge ?? lastSentence.age + lastSentence.years;
  const clean = player.lifePath === 'reformed' && !player.prison && age > release &&
    (player.crimeActionAge ?? -1) < age - 1 && !player.workInvestigation;
  player.lastReformationYear = age;
  player.reformedYears = clean ? (player.reformedYears ?? 0) + 1 : 0;
  if (!clean) player.reformationRecognized = false;
   
  if (clean && player.reformedYears >= 5 && player.storyFlags?.includes('hoan_luong_nhan_thu')) player.reformationRecognized = true;
}

export function getReformationUpdates(player) {
  if (!hasRecord(player) || player.lifePath !== 'reformed' || (player.reformedYears ?? 0) < 3 || player.prison || player.workInvestigation) return {};
  return { reformationRecognized: true,
    relatives: (player.relatives ?? []).map(person => person.alive ? { ...person, bond: Math.min(100, (person.bond ?? 70) + 4) } : person),
    ...(player.partner ? { partner: { ...player.partner, relationship: Math.min(100, (player.partner.relationship ?? 80) + 4) } } : {}),
  };
}

export function describeCrimeEnding(player) {
  if (!hasRecord(player)) return '';
  if (isRehabilitated(player)) return 'Những năm làm lại: tôi giữ tờ thư giới thiệu bên giấy ra trại. Tiền án còn trong hồ sơ, còn những người ở lại đã trao cho tôi việc để cùng làm.';
  if (player.prison) return 'Phía sau cánh cổng: cuộc đời khép lại khi bản án chưa kết thúc. Những cuộc hẹn bên ngoài còn nằm trên tờ lịch.';
  if (player.lifePath === 'reformed') return 'Con đường còn dở: tôi đã bắt đầu làm lại, nhưng chưa kịp đi hết những cuộc hẹn để gây dựng lòng tin.';
  return 'Chiếc ghế bỏ trống: những lựa chọn cũ tiếp tục theo tôi. Tờ giấy ghi tiền án nằm cạnh những số điện thoại lâu rồi tôi không gọi.';
}
