import { getJsonFromRequest } from '$lib/utils';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
export const POST: RequestHandler = async ({ request }) => {
	const json = await getJsonFromRequest(request);
	// const whereInput = z.object({

	// })
	const articles = await db.article.findMany({
		where: json,
		select: {
			id: true,
			title: true,
			author: true,
			tags: true,
			image: true,
			description: true
		}
	});
	return {
		status: 200,
		body: {
			articles
		}
	};
};
