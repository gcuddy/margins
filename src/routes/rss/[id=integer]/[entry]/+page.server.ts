import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import _parse from '../../../add/_parse';
import { getJsonFromRequest } from '$lib/utils';
export const GET: RequestHandler = async ({ params }) => {
	const id = parseInt(params.entry);
	const item = await db.rssFeedItem.findUnique({
		where: {
			id
		},
		include: {
			RssFeed: true
		}
	});
	if (!item?.content && item?.link) {
		// fetch content
		// TODO
		console.log(`Full content not found for id ${id}, let me try and fetch it.`);
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

export const PATCH: RequestHandler = async ({ params, request }) => {
	try {
		const feedId = parseInt(params.id);
		const id = parseInt(params.entry);
		const json = await getJsonFromRequest(request);
		const updatedItem = await db.rssFeedItem.update({
			where: {
				id
			},
			data: {
				...json
			}
		});
		return {
			status: 200,
			body: {
				updatedItem
			}
		};
	} catch (e) {
		return {
			status: 400
		};
	}
};
