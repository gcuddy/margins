import type { Entry, Feed, Subscription } from '@prisma/client';
import { type Writable, writable, derived, get } from 'svelte/store';

import type { EntryWithBookmark } from '$lib/entry.server';
import { getContext, setContext } from 'svelte';

interface List {
	slug: string;
	ids: number[];
	type?: "rss";
}
interface ListItems extends List {
	items: EntryWithBookmark[];
}

interface FeedList extends ListItems {
	feed: Feed;
	subscription: Subscription;
}
// export type FeedList = {
// 	type: 'rss';
// 	slug: string;
// 	items: EntryWithBookmark[];
// };

// export interface ICurrentList {
// 	type: 'rss' | 'bookmarks';
// 	slug: string;
// 	items: Entry[] | ExtendedAnnotation[];
// 	feed?: Feed;
// }
export type ICurrentList = List | FeedList;
// export type ICurrentList = List | FeedList;

export type CurrentList = Writable<ICurrentList>;


type BasicEntryInList = Pick<Entry, "id">

export type CurrentListStore<T extends BasicEntryInList = BasicEntryInList> = {
	entries: T[];
	slug?: string;
	context?: "bookmarks" | "rss";
	//    optionally, subscription etc

	// INFINITE QUERIES
	cursor?: string | Date | number | null;
	fetcher?: (cursor: Date) => Promise<{ entries: T[]; nextCursor?: Date | null; }>;


	// State
	loading?: boolean;
}

export function createCurrentListStore() {
	const store = writable<CurrentListStore>({
		entries: []
	});
	const { subscribe, set, update } = store;

	return {
		subscribe,
		set,
		update: update(val => {
			console.log(`current list being updated`)
			return val
		}),
		hasMore: derived(store, $store => !!$store.cursor),
		fetch: async () => {
			store.update(store => {
				store.loading = true;
				return store;
			})
			const state = get(store)
			if (!state.cursor) {
				throw new Error(`No cursor set`)
			}
			if (!state.fetcher) {
				throw new Error(`No fetcher set`)
			}
			const { entries, nextCursor } = await state.fetcher(state.cursor);
			store.update((store) => {
				store.cursor = nextCursor;
				store.entries = [...store.entries, ...entries];
				store.loading = false;
				return store;
			})
		}
	}
}

export const CURRENT_LIST_KEY = 'current_list';

export const getCurrentListContext = () => {
	const current_list = getContext(CURRENT_LIST_KEY);
	if (!current_list) {
		throw new Error(`Current list context not found`)
	}
	return current_list as ReturnType<typeof createCurrentListStore>
}

export const setCurrentListContext = (current_list: ReturnType<typeof createCurrentListStore>) => setContext(CURRENT_LIST_KEY, current_list)
