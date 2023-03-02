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
		// currentList.set({
		// 	href: '/rss/unread',
		// 	items,
		// 	title: 'Unread',
		// });
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
