import { writable } from 'svelte/store';

import type { ExtendedBookmark } from '$lib/bookmark';

export const selectedItems = writable<ExtendedBookmark[]>([]);

export const createSelectedItemStore = <T>() => {
	return writable<T[]>([]);
};
