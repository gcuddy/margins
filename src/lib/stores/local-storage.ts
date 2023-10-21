import { onDestroy } from 'svelte';
import { writable } from 'svelte/store';

import { isBrowser } from '$lib/helpers';

export const createLocalStorageStore = <TStore>(
	key: string,
	initialValue: TStore,
) => {
	const store = writable<TStore>();
	store.set(
		isBrowser && localStorage.getItem(key)
			? (JSON.parse(localStorage.getItem(key) as string) as TStore)
			: initialValue,
	);
	onDestroy(
		store.subscribe((v) => {
			if (!isBrowser) {
				return;
			}
			localStorage.setItem(key, JSON.stringify(v));
		}),
	);

	return store;
};
