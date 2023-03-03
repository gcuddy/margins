import type { z } from 'zod';

import type { RssFeedItemModel } from '$lib/types/schemas/rssfeeditem';

import { currentList } from '../store';
import type { PageLoad } from './$types';
export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('/rss/entries.json');
	try {
		const data = await res.json();
		console.log({ data });
		// const items = RssFeedItemModel.array().parse(data);,
		const { items, cursor } = data as { items: z.infer<typeof RssFeedItemModel>[]; cursor: number };
		console.log({ items, cursor });
		// currentList.set({
		// 	href: '/rss/entries',
		// 	items,
		// 	title: 'All Entries',
		// });
		// if (browser) {
		// 	// is this safe to do?
		// 	user.update((u) => {
		// 		u.feedItems = items;
		// 		return u;
		// 	});
		// }
		return {
			items,
			cursor,
			currentList,
		};
	} catch (e) {
		console.error(e);
		return {
			items: [],
		};
	}
};
