import { derived, writable } from 'svelte/store';

import type { ExtendedBookmark } from '$lib/bookmark';
import type { Entry } from '@prisma/client';
import type { EntryInList } from '$lib/prisma/selects/entry';

export const selectedItems = writable<EntryInList[]>([]);

export const selectedIds = derived(selectedItems, $selectedItems => $selectedItems.map(s => s.id))

export const createSelectedItemStore = <T>() => {
	return writable<T[]>([]);
};
