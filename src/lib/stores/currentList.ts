import type { Feed, Subscription } from '@prisma/client';
import { type Writable, writable } from 'svelte/store';

import type { EntryWithBookmark } from '$lib/entry.server';

interface List {
	items: EntryWithBookmark[];
	slug: string;
}
interface FeedList extends List {
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

export type CurrentList = Writable<ICurrentList>;

export const currentList = writable<ICurrentList>();
