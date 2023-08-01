import {
    writable,
	type Invalidator,
	type StartStopNotifier,
	type Subscriber,
	type Unsubscriber,
	type Updater,
	type Writable
} from 'svelte/store';
import { KV } from './idb';
import type { Annotation } from '@prisma/client';
// import { persist, createIndexedDBStorage } from "@macfja/svelte-persistent-store"

import { browser } from '$app/environment';
import { make_state } from './utils';
// const db = browser ? new KV('margins', 'notes') : null;
type SubscribeInvalidateTuple<T> = [Subscriber<T>, Invalidator<T>];

const subscriber_queue: any[] = [];

export function noop() {}

/**
 * Create a generic Svelte store persisted in IndexedDB
 * @param {string} dbKey unique IndexedDB key for storing this value
 * @param {any} initialValue
 * @param {boolean} crossTab if true, changes are visible in other browser tabs (windows)
 * @returns {any}
 */
function makeIndexedDBStore<T>(
	dbKey: string,
	initialValue: T,
	crossTab: boolean,
	start: StartStopNotifier<T> = noop
) {
    if (!db) {
        return writable(initialValue, start);
    }
	function makeStoreMaker(dbKey: string, initialValue: T, crossTab: boolean) {
		const lsKey = 'store-notify:' + dbKey;
		let value = initialValue;
		let stop: Unsubscriber | null = null;
		const subscribers = new Set<SubscribeInvalidateTuple<T>>();

		function getCurrentValue() {
			db.get(dbKey).then((v) => {
				value = v || initialValue;
				subscribers.forEach(([, cb]) => cb(value));
			});
		}

		getCurrentValue();

		function set(new_value: T) {
			value = new_value;
			// store is ready
			if (stop) {
				const run_queue = !subscriber_queue.length;
				for (const subscriber of subscribers) {
					subscriber[1]();
					subscriber_queue.push(subscriber, value);
				}
				if (run_queue) {
					for (let i = 0; i < subscriber_queue.length; i += 2) {
						subscriber_queue[i][0](subscriber_queue[i + 1]);
					}
					subscriber_queue.length = 0;
				}

				db.set(dbKey, value).then((v) => {
					if (crossTab) {
						const n = +(localStorage.getItem(lsKey) || 0);
						localStorage.setItem(lsKey, `${n + 1}`);
					}
				});
			}
		}

		/**
		 * @param {StorageEvent} event
		 */
		function storageChanged(event: StorageEvent) {
			if (event.storageArea === localStorage && event.key === lsKey) {
				getCurrentValue();
			}
		}
		if (crossTab) {
			window?.addEventListener('storage', storageChanged, false);
		}

		function subscribe(run: Subscriber<T>, invalidate = noop) {
			const subscriber = [run, invalidate] as SubscribeInvalidateTuple<T>;
			subscribers.add(subscriber);
			if (subscribers.size === 1) {
				stop = start(set, update) || noop;
			}
			run(value);
			function unsubscribe() {
				subscribers.delete(subscriber);
				if (subscribers.size === 0 && stop) {
					stop();
					stop = null;
				}
			}
			return unsubscribe;
		}

		function update(fn: Updater<T>) {
			set(fn(value));
		}

		return { set, subscribe, update };
	}
	return makeStoreMaker(dbKey, initialValue, crossTab);
}

// export const notes: Writable<{
// 	[id: string]: Partial<Annotation>;
// }> = writable({});

const notes_store = make_state<Annotation, 'id'>('id');
export { notes_store as notes}


// This creates a store that is persisted in IndexedDB — but should test more
// export const notes = persist(notes_store, createIndexedDBStorage(), "notes")
