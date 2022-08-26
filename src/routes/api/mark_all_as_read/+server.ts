import { db } from '$lib/db';
import { getJsonFromRequest } from '$lib/utils';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const json = await getJsonFromRequest(request);
	await db.rssFeedItem.updateMany({
		where: {
			rssFeedId: json.rssFeedId
		},
		data: {
			is_read: json.unread ? false : true
		}
	});
	return new Response(undefined);
};
