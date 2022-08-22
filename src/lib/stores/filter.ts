import { page } from '$app/stores';
import type { ArticleInList } from '$lib/types';
import { derived, writable } from 'svelte/store';

export const filterTerm = writable('');

export const filterInputActive = writable(false);

interface CurrentItemStore<T> {
	items: T[];
	keys: string[];
}

function createCurrentItemStore() {
	// todo: ideally i want this to be able to be set the type later. how is that possible?
	const { subscribe, set, update } = writable<CurrentItemStore<Partial<ArticleInList>> | null>(
		null
	);

	const setCurrentItems = <T>(items: ArticleInList[], ...keys: string[]) => {
		set({
			items,
			keys
		});
	};
	return {
		subscribe,
		setCurrentItems
	};
}

//TODO: fix type
export const currentItems = createCurrentItemStore();

function searchObjectKeys(object: any, term: string, ...keys: string[]) {
	if (keys.length === 0) {
		return false;
	}
	for (const key of keys) {
		if (object[key] && object[key].toString().toLowerCase().includes(term)) {
			return true;
		}
	}
	return false;
}

let lastPath: string | undefined;

export const filteredItems = derived(
	[filterTerm, currentItems, page],
	([$term, $currentItems, $page]) => {
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
	}
);
