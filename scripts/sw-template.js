// Service worker của Life Again: lưu sẵn game để chơi khi không có mạng.
// Đây là khuôn; scripts/build.mjs điền phiên bản, danh sách tệp và phông chữ rồi ghi ra dist/sw.js.
const VERSION = __VERSION__;
const PRECACHE = __PRECACHE__;
const FONT_STYLESHEETS = __FONT_STYLESHEETS__;
const SHELL_CACHE = `life-again-${VERSION}`;
const RUNTIME_CACHE = "life-again-runtime";
const FONT_HOSTS = new Set(["fonts.googleapis.com", "fonts.gstatic.com", "cdnjs.cloudflare.com"]);

// Cài: tải đủ trang, code, giao diện và ảnh nhân vật. Thiếu một tệp thì không cài, giữ bản cũ.
self.addEventListener("install", event => {
  event.waitUntil(caches.open(SHELL_CACHE).then(cache =>
    cache.addAll(PRECACHE.map(path => new Request(path, { cache: "reload" })))));
});

// Trang chỉ cho bản mới thay bản cũ khi người chơi đang ở bến xe, để không đổi code giữa ván.
self.addEventListener("message", event => {
  if (event.data === "skip-waiting") self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith("life-again-") && key !== SHELL_CACHE && key !== RUNTIME_CACHE) await caches.delete(key);
    }
    await self.clients.claim();
    await Promise.all(FONT_STYLESHEETS.map(cacheStylesheetWithFonts));
  })());
});

// Phông chữ nằm ở máy chủ khác: lưu tệp CSS và mọi tệp phông nó gọi tới.
async function cacheStylesheetWithFonts(url) {
  try {
    const cache = await caches.open(RUNTIME_CACHE);
    if (await cache.match(url, { ignoreVary: true })) return;
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) return;
    const css = await response.clone().text();
    await cache.put(url, response);
    const fonts = [...css.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map(match => new URL(match[1], url).href);
    await Promise.all(fonts.map(async font => {
      if (await cache.match(font, { ignoreVary: true })) return;
      const fontResponse = await fetch(font, { mode: "cors" });
      if (fontResponse.ok) await cache.put(font, fontResponse);
    }));
  } catch {
    // Mất mạng lúc cài: phông sẽ được lưu dần khi trang tải chúng.
  }
}

self.addEventListener("fetch", event => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin === self.location.origin) {
    if (url.pathname.startsWith("/api/") || url.pathname === "/health") return;
    event.respondWith(request.mode === "navigate" ? openPage(request) : cacheFirst(request));
  } else if (FONT_HOSTS.has(url.hostname)) {
    event.respondWith(cacheFirst(request));
  }
});

// Trang luôn lấy từ bản đã lưu để khớp với code cùng phiên bản; không có thì hỏi mạng, mất mạng thì mở game.
async function openPage(request) {
  const cache = await caches.open(SHELL_CACHE);
  const cached = await cache.match(request, { ignoreSearch: true });
  if (cached) return cached;
  try {
    return await fetch(request);
  } catch {
    return (await cache.match("./")) ?? Response.error();
  }
}

// Tệp đã lưu thì dùng ngay; tệp khác (ảnh sự kiện, phông) tải một lần rồi giữ lại cho lần offline sau.
async function cacheFirst(request) {
  const cached = await caches.match(request, { ignoreVary: true });
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok || response.type === "opaque") {
      const copy = response.clone();
      caches.open(RUNTIME_CACHE).then(cache => cache.put(request, copy)).catch(() => {});
    }
    return response;
  } catch {
    return Response.error();
  }
}
