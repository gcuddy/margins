import { get, set as put } from 'idb-keyval';
import { writable } from 'svelte/store';

/*
 * Svelte persistent store that saves to IndexedDB.
 *
 * Usage, store.js:
 * export const count = persistable('count', 0)
 */
export function persistableIdb<T>(key: string, defaultValue: T) {
	let currentValue = defaultValue;
	const { subscribe, set, update } = writable(defaultValue);
	try {
		get(key).then((persisted) => {
			if (persisted) {
				currentValue = persisted;
				set(persisted);
			}
		});
	} catch (error) {
		console.warn(error);
	}
	function persistentSet(value: T) {
		currentValue = value;
		set(value);
		try {
			put(key, value);
		} catch (error) {
			console.warn(error);
		}
	}
	function persistentUpdate(fn) {
		persistentSet(fn(currentValue));
	}
	return {
		subscribe,
		set: persistentSet,
		update: persistentUpdate
	};
}
