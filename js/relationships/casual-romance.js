// Điều chỉnh gameplay theo hoàn cảnh hiện tại, không dựa vào số tiền trong ví.
export function getCasualRomanceAdjustment(player) {
  if (!player.casualLife || player.age >= 62) return 0;
  if (player.employmentStatus === 'employed') return 0;
  const work = [...(player.sideJobs ?? []), ...(player.streetJobs ?? []).filter(entry => {
    const asset = entry.id === 'noodle-seller' ? 'noodle-cart' : entry.id === 'motorbike-taxi' ? 'motorbike' : null;
    return asset && (player.purchases ?? []).some(item => item.id === asset);
  })];
  if (!work.length) return -0.2;
  return work.some(entry => Number.isInteger(entry.startedAtAge) && player.age - entry.startedAtAge >= 2) ? 0 : -0.05;
}

export function getCasualRomanceNote(player) {
  const adjustment = getCasualRomanceAdjustment(player);
  return adjustment === -0.2 ? 'Tôi chưa có việc và hướng đi rõ ràng; một số người muốn làm bạn trước.'
    : adjustment === -0.05 ? 'Tôi đang bắt đầu mưu sinh; người ấy muốn có thêm thời gian để hiểu cuộc sống của tôi.'
    : 'Việc làm đều đặn giúp người ấy thấy tôi đang có trách nhiệm với cuộc sống của mình.';
}
