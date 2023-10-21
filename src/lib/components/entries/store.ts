import { getContext, setContext } from 'svelte';
import { derived, get, writable } from 'svelte/store';

import type { SlimEntry } from '$lib/utils/entries';

const symbol = Symbol('entries');

function createCurrentEntryListStore() {
	const currentEntryList = writable<Array<SlimEntry>>([]);

	return {
		...currentEntryList,
		has: (id: number) => {
			const list = get(currentEntryList);
			return list.some((entry) => entry.id === id);
		},
	};
}
export const currentEntryList = writable<Array<SlimEntry>>([]);

function derivedEntryListDetails(id: number) {
	return derived(currentEntryList, (list) => {});
}

export function setEntryListContext(entries: Array<SlimEntry>) {
	setContext(symbol, entries);
}

export function getEntryListContext(): Array<SlimEntry> {
	return getContext(symbol) ?? [];
}
