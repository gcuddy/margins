import type { PageServerLoad, Action } from './$types';
import { db } from '$lib/db';
import { getJsonFromRequest } from '$lib/utils';
export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.entry);
	const item = await db.rssFeedItem.findUnique({
		where: {
			id,
		},
		include: {
			RssFeed: true,
		},
	});
	// if (!item?.content && item?.link) {
	// 	// fetch content
	// 	// TODO
	// 	console.log(`Full content not found for id ${id}, let me try and fetch it.`);
	// 	const { content } = await _parse(item?.link);
	// 	await db.rssFeedItem.update({
	// 		where: {
	// 			id
	// 		},
	// 		data: {
	// 			content
	// 		}
	// 	});
	// }
	return {
		item,
	};
};

export const PATCH: Action = async ({ params, request }) => {
	try {
		const id = parseInt(params.entry);
		const json = await getJsonFromRequest(request);
		await db.rssFeedItem.update({
			where: {
				id,
			},
			data: {
				...json,
			},
		});
	} catch (e) {
		console.error(e);
	}
};
