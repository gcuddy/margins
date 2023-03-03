import { build, files, prerendered, version } from '$service-worker';

const CACHE = `cache-${version}`;
const ASSETS = [
	...build,
	...files
];

self.addEventListener('install', async (e) => {
	async function addFilesToCache() {
		// console.log({ build, files, prerendered, version });
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
		console.log('Service Worker: Installed');
	}

	// @ts-ignore
	e.waitUntil(addFilesToCache())
});

self.addEventListener('activate', (event) => {
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

	// @ts-ignore
	event.waitUntil(deleteOldCaches());

});

self.addEventListener('fetch', (event) => {
	// ignore POST requests etc
	// @ts-ignore
	if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

	async function respond() {
		// @ts-ignore
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		// `build`/`files` can always be served from the cache
		if (ASSETS.includes(url.pathname)) {
			// @ts-ignore
			return cache.match(event.request);
		}

		// for everything else, try the network first, but
		// fall back to the cache if we're offline
		try {
			// @ts-ignore
			const response = await fetch(event.request);

			if (response.status === 200) {
				// @ts-ignore
				cache.put(event.request, response.clone());
			}

			return response;
		} catch {
			// @ts-ignore
			return cache.match(event.request);
		}
	}

	// @ts-ignore
	event.respondWith(respond());
});