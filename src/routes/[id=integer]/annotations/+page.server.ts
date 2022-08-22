import { db } from '$lib/db';
import { ArticleListSelect } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const articleId = parseInt(params.id);
	const annotations = await db.annotation.findMany({
		where: {
			articleId
		},
		include: {
			article: {
				select: ArticleListSelect
			}
		}
	});
	return {
		annotations
	};
};

// For POST and PATCH, refer to the /annotations endpoint
