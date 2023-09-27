import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';

import type { SlimEntry } from '$lib/utils/entries';

const symbol = Symbol('entries');

export const currentEntryList = writable<Array<SlimEntry>>([]);

export function setEntryListContext(entries: Array<SlimEntry>) {
	setContext(symbol, entries);
}

export function getEntryListContext(): Array<SlimEntry> {
	return getContext(symbol) ?? [];
}
