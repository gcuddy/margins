import type { PageServerLoad, Action } from './$types';
import { db } from '$lib/db';
import { getJsonFromRequest } from '$lib/utils';
// export const load: PageServerLoad = async ({ params, parent }) => {
// 	const id = parseInt(params.entry);
// 	const data = await parent();
// 	const item = await db.rssFeedItem.findUnique({
// 		where: {
// 			id,
// 		},
// 		include: {
// 			feed: true,
// 		},
// 	});
// 	return {
// 		item,
// 		...data,
// 	};
// };

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
