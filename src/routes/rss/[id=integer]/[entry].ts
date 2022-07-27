import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import _parse from '../../add/_parse';
export const GET: RequestHandler = async ({ params }) => {
	const id = parseInt(params.entry);
	const item = await db.rssFeedItem.findUnique({
		where: {
			id
		}
	});
	if (!item?.content && item?.link) {
		// fetch content
		console.log('Full content not found, let me try and fetch it.');
		const { content } = await _parse(item?.link);
		await db.rssFeedItem.update({
			where: {
				id
			},
			data: {
				content
			}
		});
	}
	return {
		body: {
			item
		},
		status: 200
	};
};
