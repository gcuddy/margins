// src/lib/cache.js
// idea via https://github.com/sveltejs/kit/issues/7105
import { browser } from '$app/environment';

const cache = new Map();

export function createCachedValue<T>(key: any, fn: () => T): T {
	if (cache.has(key)) return cache.get(key);
	const value = fn();
	if (browser) cache.set(key, value);
	return value;
}
