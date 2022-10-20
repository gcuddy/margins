import type { RssItemWithFeed } from '$lib/types/rss';
import type { RssFeedItemModel } from '$lib/types/schemas/rssfeeditem';
import { sortFeedItems } from '$lib/utils';
import type { RssFeedItem } from '@prisma/client';
import { derived, writable } from 'svelte/store';
import type { z } from 'zod';

export const currentItem = writable<RssItemWithFeed | null>(null);

interface CurrentList {
	href: string;
	items: z.infer<typeof RssFeedItemModel>[];
	title?: string;
}

// current list derived from feed store?

export const currentList = writable<CurrentList>();

// derive from viewoptions?
export const sortedItems = derived(currentList, ($currentList) => {
	if (!$currentList) return [];
	return sortFeedItems($currentList.items, {
		sort: 'date',
	});
});

export const panes = writable<[HTMLElement | null, HTMLElement | null, HTMLElement | null]>([
	null,
	null,
	null,
]);
