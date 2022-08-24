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
		include: {
			RssFeed: true
		},
		take: 100
	});
	return {
		items
	};
};
