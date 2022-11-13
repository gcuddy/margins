import { build, files, prerendered, version } from '$service-worker';

const cache_name = `cache-${version}`;
self.addEventListener('install', (e) => {
	console.log('Service Worker: Installed');
	console.log({ build, files, prerendered, version });
});

/**
 * Fetch the asset from the network and store it in the cache.
 * Fall back to the cache if the user is offline.
 * @param {Request} request
 * @returns
 */
async function fetchAndCache(request) {
	const cache = await caches.open(`offline-${version}`);

	try {
		const response = await fetch(request);
		cache.put(request, response.clone());
		return response;
	} catch (err) {
		const response = await cache.match(request);
		if (response) return response;

		throw err;
	}
}

self.addEventListener('fetch', (e) => {
	if (e.request.method !== 'GET') {
		// console.log('Service Worker: Fetch', e.request.method, e.request.url);
		return;
	}
	if (e.request.destination === 'image') {
		e.respondWith(
			caches.open(cache_name).then((cache) => {
				return cache.match(e.request).then((cachedResponse) => {
					const fetchedResponse = fetch(e.request).then((networkResponse) => {
						cache.put(e.request, networkResponse.clone());
						return networkResponse;
					});
					return cachedResponse || fetchedResponse;
				});
			})
			// fetch(e.request).catch(() => {
			// 	return caches.match('/images/placeholder.png');
			// })
		);
		return;
	}
	// console.log('Service Worker: Fetching');
	// console.log({ e });
});
