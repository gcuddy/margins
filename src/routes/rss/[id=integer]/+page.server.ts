import type { PageServerLoad } from './$types';
import { db } from '$lib/db';
export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;
	const feed = await db.rssFeed.findFirst({
		where: {
			id: parseInt(id)
		},
		include: {
			items: {
				orderBy: {
					pubDate: 'desc'
				},
				select: {
					title: true,
					id: true,
					pubDate: true,
					author: true,
					rssFeedId: true,
					is_read: true,
					uuid: true,
					summary: true,
					contentSnippet: true
				}
			},
			favorite: true
		}
	});
	console.log(`Found ${feed.title}`);
	return {
		feed
	};
};
