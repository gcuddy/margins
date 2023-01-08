import type { Feed, Subscription } from '@prisma/client';
import { type Writable, writable } from 'svelte/store';

import type { EntryWithBookmark } from '$lib/entry.server';

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

export function createCurrentListStore() {
	const { subscribe, set, update } = writable<ICurrentList>();

	return {
		subscribe,
		set,
		update: update(val => {
			console.log(`current list being updated`)
			return val
		})
	}

}

export const currentList = writable<ICurrentList>();
