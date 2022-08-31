// should this be json.ts,and then load function in index.svelte?
import type { PageServerLoad, Action } from './$types';
import { db } from '$lib/db';

export const load: PageServerLoad = async () => {
	const items = await db.rssFeedItem.findMany({
		orderBy: [
			{
				createdAt: 'desc'
			}
		],
		where: {
			is_read: false
		},
		select: {
			title: true,
			id: true,
			pubDate: true,
			author: true,
			rssFeedId: true,
			RssFeed: true,
			is_read: true,
			uuid: true
		},
		take: 100
	});
	return {
		items
	};
};
