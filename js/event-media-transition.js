import { getEventOpenMojiOptions } from './event-openmoji.js';

// Intermediate choices get a result screen without settling the year or
// applying the next scene's rewards. The next scene is saved for reloads.
export function createMediaTransition(choice, scene, nextScene, contentOverride) {
  const content = contentOverride ?? (choice.transitionText?.trim() || choice.text || `Bạn chọn: ${choice.label}`);
  const imageOptions = getEventOpenMojiOptions({ ...choice, text: content }, scene);
  const emoji = imageOptions[0];
  return {
    stage: 'result', mediaTransition: true, nextScene,
    category: scene.category,
    age: scene.age, title: 'Kết quả lựa chọn', content, mediaSceneTitle:scene.title, mediaChoiceLabel:choice.label,
    image: emoji?.url ?? '', imageAlt: emoji?.alt ?? '', imageOptions,
    imageFallback: emoji?.poster ?? '', imageFallbackAlt: emoji?.alt ?? '', confirmText: 'Tiếp tục',
  };
}
