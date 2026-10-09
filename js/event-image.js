// Unlimited reuse. Animated OpenMoji falls back to its original official SVG.
export function createEventImageRenderer(image, motionPreference) {
  let version = 0;
  let timeout;
  return function renderEventImage(src, alt = '', fallback = '', fallbackAlt = '', options = []) {
    const current = ++version;
    clearTimeout(timeout);
    image.onload = null;
    image.onerror = null;
    delete image.dataset.motion;
    const illustration = options[0] ?? {url:src,poster:fallback,alt};
    const poster = illustration.poster;
    const load = (url, final = false) => {
      if (current !== version) return;
      clearTimeout(timeout);
      if (!url) { image.hidden = true; image.removeAttribute('src'); return; }
      // Browsers can keep painting the previous image while the new URL loads.
      // Reserve its space, but reveal it only when this scene's image is ready.
      image.style.visibility = 'hidden';
      image.hidden = false;
      image.alt = illustration.alt || alt || fallbackAlt;
      image.dataset.mediaKind = 'animated-openmoji';
      image.onload = () => {
        if (current !== version) return;
        clearTimeout(timeout);
        image.style.visibility = '';
      };
      image.onerror = () => {
        if (current !== version) return;
        if (!final && poster && url !== poster) load(poster, true);
        else { clearTimeout(timeout); image.hidden = true; }
      };
      image.src = url;
      if (!final && poster && url !== poster) timeout = setTimeout(() => load(poster, true), 8000);
    };
    load(motionPreference.matches && poster ? poster : illustration.url, motionPreference.matches);
  };
}
