import { build, files, prerendered, version } from '$service-worker';

const cache_name = `cache-${version}`;
self.addEventListener('install', async (e) => {
	console.log('Service Worker: Installed');
	console.log({ build, files, prerendered, version });
	const cache = await caches.open(`offline-${version}`);
	await cache.addAll(files);
});

/**
 * Fetch the asset from the network and store it in the cache.
 * Fall back to the cache if the user is offline.
 * @param {Request} request
 * @returns
 */
async function fetchAndCache(request) {
	const cache = await caches.open(cache_name);

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

self.addEventListener('fetch', (event) => {
	console.log({ event });
	const { request } = event;

	// Prevent Chrome Developer Tools error:
	// Failed to execute 'fetch' on 'ServiceWorkerGlobalScope': 'only-if-cached' can be set only with 'same-origin' mode
	//
	// See also https://stackoverflow.com/a/49719964/1217468
	console.log(`serviceworker`, { request });
	if (
		request.method !== 'GET' ||
		(request.cache === 'only-if-cached' && request.mode !== 'same-origin')
	) {
		return;
	}

	event.respondWith(
		(async function () {
			const cache = await caches.open(cache_name);

			const cachedResponsePromise = await cache.match(request);
			const networkResponsePromise = fetch(request);

			if (request.url.startsWith(self.location.origin)) {
				console.log('serviceworker working');
				event.waitUntil(
					(async function () {
						const networkResponse = await networkResponsePromise;

						await cache.put(request, networkResponse.clone());
					})()
				);
			}

			return cachedResponsePromise || networkResponsePromise;
		})()
	);
});

// Clean up caches other than current.
self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async function () {
			const cacheNames = await caches.keys();

			await Promise.all(
				cacheNames
					.filter((cacheName) => {
						const deleteThisCache = cacheName !== cache_name;

						return deleteThisCache;
					})
					.map((cacheName) => caches.delete(cacheName))
			);
		})()
	);
});

// if (e.request.method !== 'GET') {
// 	// console.log('Service Worker: Fetch', e.request.method, e.request.url);
// 	return;
// }
// if (e.request.destination === 'image') {
// 	e.respondWith(
// 		caches.open(cache_name).then((cache) => {
// 			return cache.match(e.request).then((cachedResponse) => {
// 				const fetchedResponse = fetch(e.request).then((networkResponse) => {
// 					cache.put(e.request, networkResponse.clone());
// 					return networkResponse;
// 				});
// 				return cachedResponse || fetchedResponse;
// 			});
// 		})
// 		// fetch(e.request).catch(() => {
// 		// 	return caches.match('/images/placeholder.png');
// 		// })
// 	);
// 	return;
// }
// console.log('Service Worker: Fetching');
// console.log({ e });
