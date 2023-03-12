import type { Feed, Subscription } from '@prisma/client';
import { type Writable, writable } from 'svelte/store';

import type { EntryWithBookmark } from '$lib/entry.server';
import type { EntryInList } from '$lib/prisma/selects/entry';
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

export type CurrentListStore = {
   entries: EntryInList[];
   slug?: string;
//    optionally, subscription etc
}

export function createCurrentListStore() {
	const { subscribe, set, update } = writable<CurrentListStore>({
        entries: []
    });

	return {
		subscribe,
		set,
		update: update(val => {
			console.log(`current list being updated`)
			return val
		})
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
