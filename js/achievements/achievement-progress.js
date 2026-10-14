// Progress shared by annual accounting and game settlement. Legacy saves start
// missing counters at zero; no past wins, bets or audiences are invented.
export function educationEntryAchievementIds(careerPath, age) {
  if (careerPath?.id === 'military') return ['voluntary-enlistment'];
  return age === 18 && careerPath?.school && careerPath.school.type !== 'academy'
    ? ['university-18'] : [];
}

export const CREATOR_AUDIENCE_GROWTH = [100_000, 400_000, 1_000_000];
export function collectCreatorAudienceYear(player, age, payment) {
  const id = payment?.careerId ?? player.careerPath?.id;
  if (!['tiktok', 'youtube'].includes(id) || !payment || payment.retired ||
      !Number.isInteger(age) || player.isAlive === false || player.employmentStatus !== 'employed' ||
      (player.prison && player.prison.releaseAge > player.age) ||
      player.creatorAudienceAge >= age) return null;
  const field = id === 'tiktok' ? 'tiktokFollowers' : 'youtubeSubscribers';
  const level = Math.max(1, Math.min(3, Number(payment.careerLevel ?? player.careerLevel) || 1));
  const gain = CREATOR_AUDIENCE_GROWTH[level - 1];
  const previous = Number.isFinite(player[field]) ? Math.max(0, player[field]) : 0;
  player[field] = previous + gain;
  player.creatorAudienceAge = age;
  const platform = id === 'tiktok' ? 'TikTok' : 'YouTube';
  return { field, gain, total: player[field], content:
    `📣 ${platform}: thêm ${gain.toLocaleString('vi-VN')} người ${id === 'tiktok' ? 'theo dõi' : 'đăng ký'}, tổng ${player[field].toLocaleString('vi-VN')}.` };
}

export function recordGamblingLoss(player, round, stake, payout) {
  if (!round || round.gamblingLossRecorded || round.game === 'box' ||
      !Number.isFinite(stake) || !Number.isFinite(payout) || stake < 0 || payout < 0) return 0;
  const loss = Math.max(0, stake - payout);
  const previous = Number.isFinite(player.gamblingLosses) ? Math.max(0, player.gamblingLosses) : 0;
  player.gamblingLosses = previous + loss;
  round.gamblingLossRecorded = true;
  return loss;
}
