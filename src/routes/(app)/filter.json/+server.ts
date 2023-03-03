import type { RequestHandler } from '@sveltejs/kit';
import { json as json$1 } from '@sveltejs/kit';

import { db } from '$lib/db';
import { ArticleListSelect } from '$lib/types';
import { getJsonFromRequest } from '$lib/utils';
export const POST: RequestHandler = async ({ request }) => {
	const json = await getJsonFromRequest(request);
	// const whereInput = z.object({

	// })
	const articles = await db.article.findMany({
		where: json,
		select: ArticleListSelect,
	});
	return json$1({
		articles,
	});
};
