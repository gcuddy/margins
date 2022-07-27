import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
export const GET: RequestHandler = async ({ params }) => {
	const feedId = parseInt(params.feed);
	const uuid = params.entry;
	// const entryId = parseInt(params.entry);

	const item = await db.rssFeedItem.findUnique({
		where: {
			uuid
		}
	});

	return {
		body: {
			item
		},
		status: 200
	};
};
