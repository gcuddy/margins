import { db } from '$lib/db';
import { getJsonFromRequest } from '$lib/utils';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	console.log('got post request for marking item as read!');
	const json = await getJsonFromRequest(request);
	if (json) {
		const { id, unread } = json;
		if (id) {
			const feed = await db.rssFeedItem.update({
				where: {
					id: parseInt(id)
				},
				data: {
					is_read: unread ? false : true
				}
			});
		}
	}
	return new Response(undefined);
};
