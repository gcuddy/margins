import type { Feed, Subscription } from '@prisma/client';
import { type Writable, writable } from 'svelte/store';

import type { ExtendedAnnotation } from '$lib/annotation';
import type { EntryWithAnnotations } from '$lib/entry.server';

export type FeedList = {
	type: 'rss';
	slug: string;
	items: EntryWithAnnotations[];
	feed: Feed;
	subscription: Subscription;
};

export type BookmarkList = {
	type: 'bookmarks';
	slug: string;
	items: ExtendedAnnotation[];
};

// export interface ICurrentList {
// 	type: 'rss' | 'bookmarks';
// 	slug: string;
// 	items: Entry[] | ExtendedAnnotation[];
// 	feed?: Feed;
// }
export type ICurrentList = FeedList | BookmarkList;

export type CurrentList = Writable<ICurrentList>;

export const currentList = writable<ICurrentList>();
