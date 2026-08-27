/**
 * Offline-first service worker for the /admin app.
 *
 * Emitted to <outDir>/sw.js by scripts/build-sw.mjs, which substitutes
 * __BUILD_ID__ with the same value astro.config.mjs injects into pages.
 * Do not load this file directly — the placeholder is not valid at runtime.
 */

const BUILD_ID = '__BUILD_ID__';
const CACHE = `kw-admin-v${BUILD_ID}`;

const SCOPE_PATH = '/admin';
const OFFLINE_URL = '/admin/offline';

/**
 * Routes fetched at install time. Their HTML is then scanned for the
 * /_astro/ assets it references, so the CSS and JS list cannot drift out
 * of sync with the build — it comes from the markup that actually uses it.
 */
const PRECACHE_ROUTES = [
	'/admin',
	'/admin/reservations',
	'/admin/reservations/create',
	'/admin/account',
	'/admin/users',
	OFFLINE_URL,
];

const PRECACHE_STATIC = [
	'/manifest-admin.webmanifest',
	'/favicon.svg',
	'/favicons/android-chrome-192x192.png',
	'/favicons/android-chrome-512x512.png',
	'/favicons/maskable_icon.png',
	'/favicons/apple-touch-icon.png',
];

/** Immutable, content-hashed build output — cache forever, never revalidate. */
const IMMUTABLE_PREFIXES = ['/_astro/', '/favicons/', '/fonts/'];

// ---------------------------------------------------------------------------
// install
// ---------------------------------------------------------------------------

self.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE);

			await Promise.all(PRECACHE_STATIC.map((url) => cacheStatic(cache, url)));

			// Install is always triggered from a page the admin is already signed
			// into, so these same-origin fetches carry the session cookie.
			const assetUrls = new Set();
			await Promise.all(
				PRECACHE_ROUTES.map(async (url) => {
					const html = await cacheDocument(cache, url);
					if (html) {
						for (const asset of extractAssetUrls(html)) assetUrls.add(asset);
					}
				}),
			);

			await Promise.all([...assetUrls].map((url) => cacheStatic(cache, url)));

			await self.skipWaiting();
		})(),
	);
});

async function cacheStatic(cache, url) {
	try {
		const response = await fetch(url, { cache: 'reload' });
		if (response.ok) await cache.put(url, response);
	} catch {
		// A precache miss degrades the offline experience but must not abort
		// install — a worker that never installs is worse than a partial cache.
	}
}

/**
 * Caches an admin document and returns its HTML, or null if it was not
 * cacheable.
 */
async function cacheDocument(cache, url) {
	try {
		const response = await fetch(url, { credentials: 'include', cache: 'reload' });
		if (!isCacheableDocument(response)) return null;

		// Read the body here, while we still own the response. Handing it to
		// cache.put() locks it, after which clone() throws.
		const html = await response.clone().text();
		await cache.put(url, response);
		return html;
	} catch {
		return null;
	}
}

/**
 * A 302 to /admin/login (no session) or to /admin (wrong role) arrives with
 * `redirected: true`, and a redirected Response throws when returned from
 * respondWith() for a navigation. Caching one bricks the route permanently,
 * so drop it — along with any non-200.
 */
function isCacheableDocument(response) {
	return response.ok && !response.redirected;
}

/**
 * Pulls /_astro/ stylesheet and script URLs out of a document.
 *
 * Unquoted attributes are not optional to support: astro-compress emits
 * `<link href=/_astro/x.css rel=stylesheet>` for prerendered pages (including
 * /admin/offline) and ignores its own `removeAttributeQuotes: false` option.
 * SSR admin pages are rendered at request time and keep their quotes, so both
 * forms occur in the same app.
 */
function extractAssetUrls(html) {
	const urls = new Set();
	const pattern = /(?:href|src)\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s"'>]+))/gi;
	let match;
	while ((match = pattern.exec(html)) !== null) {
		const url = match[1] ?? match[2] ?? match[3];
		if (url && url.startsWith('/_astro/')) urls.add(url);
	}
	return urls;
}

/**
 * Reads the build the server rendered this document from.
 *
 * Cannot assume attribute order: astro-compress rewrites the prerendered
 * offline page's tag to `<meta content=abc123 name=x-build-id>`, while SSR
 * pages keep the authored `name` then `content` order. Matching the whole tag
 * first and then pulling `content` out of it is order- and quote-agnostic.
 *
 * Getting this wrong fails silently — the background refresh keeps working and
 * only the "new version" signal quietly never fires.
 */
function extractBuildId(html) {
	for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
		if (!/name\s*=\s*["']?x-build-id["'\s>]/i.test(tag)) continue;
		const match = tag.match(/content\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i);
		if (match) return match[1] ?? match[2] ?? match[3] ?? null;
	}
	return null;
}

// ---------------------------------------------------------------------------
// activate
// ---------------------------------------------------------------------------

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			await self.clients.claim();
			const names = await caches.keys();
			await Promise.all(
				names
					.filter((name) => name.startsWith('kw-admin-v') && name !== CACHE)
					.map((name) => caches.delete(name)),
			);
		})(),
	);
});

// ---------------------------------------------------------------------------
// fetch
// ---------------------------------------------------------------------------

self.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);

	if (url.origin !== self.location.origin) return;

	if (request.method !== 'GET') {
		if (inScope(url)) event.respondWith(handleWrite(event));
		return;
	}

	if (request.mode === 'navigate') {
		if (inScope(url)) event.respondWith(handleNavigation(event));
		return;
	}

	if (IMMUTABLE_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) {
		event.respondWith(handleImmutable(request));
		return;
	}

	if (url.pathname === '/manifest-admin.webmanifest') {
		event.respondWith(handleImmutable(request));
	}
});

function inScope(url) {
	return url.pathname === SCOPE_PATH || url.pathname.startsWith(`${SCOPE_PATH}/`);
}

/**
 * Navigations are cache-first, never network-first with a cache fallback.
 *
 * `fetch().catch(() => cache)` only fires when the device is properly
 * offline. On a network that is technically up and crawling, the worker just
 * waits: measured against an already-cached page, 8s of injected latency
 * produced 8.1s to first paint network-first and 64ms cache-first.
 *
 * Freshness is handled separately, in refreshInBackground(), so no launch
 * ever pays network latency to solve a problem that happens on deploy day.
 */
async function handleNavigation(event) {
	const cache = await caches.open(CACHE);

	// ignoreSearch so /admin/reservations/edit?id=7 and /admin?upcoming_offset=20
	// resolve to their cached base route offline. The row or page will be the
	// cached one rather than the requested one; the alternative is a blank screen.
	const cached = await cache.match(event.request, { ignoreSearch: true });

	if (cached) {
		event.waitUntil(refreshInBackground(event.request, cache));
		return cached;
	}

	try {
		const response = await fetch(event.request);
		if (isCacheableDocument(response)) {
			const html = await response.clone().text();
			await cache.put(event.request, response.clone());
			event.waitUntil(cacheReferencedAssets(cache, html));
		}
		return response;
	} catch {
		const offline = await cache.match(OFFLINE_URL);
		return offline ?? new Response('Offline', { status: 503, statusText: 'Offline' });
	}
}

/**
 * Refetches a served page, silently freshens the cache, and only notifies
 * clients when the *build* changed — never when the data did.
 *
 * A whole-body diff is wrong here: admin HTML embeds live reservation rows,
 * timestamps and the signed-in email, so it would differ on nearly every
 * launch and the banner would become noise. The x-build-id meta tag changes
 * only when a new build is deployed.
 */
async function refreshInBackground(request, cache) {
	let response;
	try {
		response = await fetch(request, { credentials: 'include' });
	} catch {
		return; // offline; the cached copy stands
	}

	if (!isCacheableDocument(response)) return;

	const html = await response.clone().text();
	await cache.put(request, response);
	await cacheReferencedAssets(cache, html);

	const serverBuildId = extractBuildId(html);
	if (serverBuildId && serverBuildId !== BUILD_ID) {
		await notifyClients({ type: 'UPDATE_AVAILABLE', buildId: serverBuildId });
	}
}

/** Adds any /_astro/ asset the document references but the cache is missing. */
async function cacheReferencedAssets(cache, html) {
	await Promise.all(
		[...extractAssetUrls(html)].map(async (url) => {
			if (!(await cache.match(url))) await cacheStatic(cache, url);
		}),
	);
}

/** Content-hashed assets never change under a given URL. */
async function handleImmutable(request) {
	const cache = await caches.open(CACHE);
	const cached = await cache.match(request);
	if (cached) return cached;

	const response = await fetch(request);
	if (response.ok) await cache.put(request, response.clone());
	return response;
}

/**
 * Writes are never queued. Background Sync does not exist on iOS Safari, the
 * session cookie may be dead by the time a queue drains, and replaying a POST
 * against data that has since changed is worse than a clear failure.
 */
async function handleWrite(event) {
	const url = new URL(event.request.url);

	// Security: logging out must not leave the previous user's authenticated
	// admin HTML sitting in CacheStorage. Purging here rather than in a page
	// script means it cannot be skipped by a page that unloads mid-redirect,
	// and it runs whether or not the server responded.
	if (url.pathname === '/admin/logout') {
		event.waitUntil(purgeAllCaches());
	}

	try {
		return await fetch(event.request);
	} catch {
		return offlineWriteResponse();
	}
}

async function purgeAllCaches() {
	const names = await caches.keys();
	await Promise.all(names.map((name) => caches.delete(name)));
}

function offlineWriteResponse() {
	const body = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#172c33">
<title>Not saved - KW Admin</title>
<style>
  :root { color-scheme: dark }
  body { margin:0; min-height:100dvh; display:grid; place-items:center;
         background:#172c33; color:#e8eef0; text-align:center;
         font-family: system-ui, -apple-system, sans-serif;
         padding: max(env(safe-area-inset-top), 1.5rem) max(env(safe-area-inset-right), 1.5rem)
                  max(env(safe-area-inset-bottom), 1.5rem) max(env(safe-area-inset-left), 1.5rem) }
  main { max-width: 28rem; display:flex; flex-direction:column; gap:.75rem }
  h1 { font-size:1.5rem; margin:0 }
  p { margin:0; color:#e8eef0b3; line-height:1.6 }
  button { margin-top:.75rem; min-height:2.75rem; border:0; border-radius:.5rem;
           background:#c9fed3; color:#0f2a19; font:inherit; font-weight:600 }
</style>
</head>
<body>
<main role="alert">
  <h1>Not saved &mdash; you're offline</h1>
  <p>This change was not sent to the server and has not been queued. Your form entries are
     still on the previous page.</p>
  <p>Go back, reconnect, and submit again.</p>
  <button type="button" onclick="history.back()">Go back</button>
</main>
</body>
</html>`;

	return new Response(body, {
		status: 503,
		statusText: 'Offline',
		headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
	});
}

async function notifyClients(message) {
	const clients = await self.clients.matchAll({ includeUncontrolled: true });
	for (const client of clients) client.postMessage(message);
}

// ---------------------------------------------------------------------------
// messages
// ---------------------------------------------------------------------------

self.addEventListener('message', (event) => {
	if (event.data?.type === 'PURGE_CACHES') {
		event.waitUntil(purgeAllCaches());
	}
});
