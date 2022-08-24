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
