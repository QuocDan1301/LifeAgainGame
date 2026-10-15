 
 
const VERSION = __VERSION__;
const PRECACHE = __PRECACHE__;
const FONT_STYLESHEETS = __FONT_STYLESHEETS__;
const SHELL_CACHE = `life-again-${VERSION}`;
const RUNTIME_CACHE = `life-again-runtime-${VERSION}`;
const FONT_HOSTS = new Set(["fonts.googleapis.com", "fonts.gstatic.com", "cdnjs.cloudflare.com"]);

 
self.addEventListener("install", event => {
  event.waitUntil(caches.open(SHELL_CACHE).then(cache =>
    cache.addAll(PRECACHE.map(path => new Request(path, { cache: "reload" })))));
});

 
self.addEventListener("message", event => {
  if (event.data === "skip-waiting") event.waitUntil(self.skipWaiting());
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

 
async function cacheStylesheetWithFonts(url) {
  try {
    const cache = await caches.open(RUNTIME_CACHE);
    if (await cache.match(url, { ignoreVary: true })) return;
    // Font warming is optional: a stalled CDN must not hold activation open.
    const signal = AbortSignal.timeout(5000);
    const response = await fetch(url, { mode: "cors", signal });
    if (!response.ok) return;
    const css = await response.clone().text();
    await cache.put(url, response);
    const fonts = [...css.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map(match => new URL(match[1], url).href);
    await Promise.all(fonts.map(async font => {
      if (await cache.match(font, { ignoreVary: true })) return;
      const fontResponse = await fetch(font, { mode: "cors", signal });
      if (fontResponse.ok) await cache.put(font, fontResponse);
    }));
  } catch {
     
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

 
async function openPage(request) {
  const cache = await caches.open(SHELL_CACHE);
   
  const cached = await cache.match(request, { ignoreSearch: true }) ??
    await cache.match(new URL(request.url).pathname + ".html");
  if (cached) return cached;
  try {
    return await fetch(request);
  } catch {
    return (await cache.match("./")) ?? Response.error();
  }
}

 
async function cacheFirst(request) {
  const shell = await caches.open(SHELL_CACHE);
  const runtime = await caches.open(RUNTIME_CACHE);
  const cached = await shell.match(request, { ignoreVary: true }) ??
    await runtime.match(request, { ignoreVary: true });
  if (cached) return cached;
  try {
    // Pending CDN fetch events can also delay replacement of the active worker.
    const options = FONT_HOSTS.has(new URL(request.url).hostname)
      ? { signal: AbortSignal.timeout(5000) } : undefined;
    const response = await fetch(request, options);
    if (response.ok || response.type === "opaque") {
      const copy = response.clone();
      caches.open(RUNTIME_CACHE).then(cache => cache.put(request, copy)).catch(() => {});
    }
    return response;
  } catch {
    return Response.error();
  }
}
