import { derived, writable } from 'svelte/store';

import { page } from '$app/stores';

export const filterTerm = writable('');

export const filterInputActive = writable(false);

interface CurrentItemStore<T> {
	items: T[];
	keys: string[];
}

export function createItemStores<T>(startingItems: T[], ...keys: string[]) {
	// todo: ideally i want this to be able to be set the type later. how is that possible?
	let lastPath: string | undefined;
	const items = writable<CurrentItemStore<T>>({
		items: startingItems,
		keys
	});
	const { subscribe, set: _set, update } = items;
	const filterTerm = writable('');
	const set = (items: T[], ...keys: string[]) => {
		_set({
			items,
			keys,
		});
	};
	const filteredItems = derived([filterTerm, items, page], ([$term, $currentItems, $page]) => {
		if (!lastPath) {
			lastPath = $page.url.pathname;
		} else if (lastPath !== $page.url.pathname) {
			lastPath = $page.url.pathname;
			filterTerm.set('');
		}
		if (!$currentItems) {
			return [];
		}
		if ($term === '') {
			return $currentItems.items;
		}
		const { items, keys } = $currentItems;
		const filtered = items.filter((item) => searchObjectKeys(item, $term, ...keys));
		return filtered;
	});
	return {
		items: {
			set,
			subscribe,
			update
		},
		filteredItems,
		filterTerm,
	};
}

export function searchObjectKeys(object: any, term: string, ...keys: string[]) {
	if (keys.length === 0) {
		return false;
	}
	for (const key of keys) {
		if (object[key] && object[key].toString().toLowerCase().includes(term.toLowerCase())) {
			return true;
		}
	}
	return false;
}
