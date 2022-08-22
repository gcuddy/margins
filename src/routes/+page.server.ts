import type { PageServerLoad } from './$types';
import { db } from '$lib/db';
import { ArticleListSelect } from '$lib/types';

export const load: PageServerLoad = async ({ url }) => {
	const take = parseInt(url.searchParams.get('limit') || '20');
	const articles = await db.article.findMany({
		orderBy: [
			{
				createdAt: 'desc'
			},
			{
				position: 'asc'
			}
		],
		where: {
			NOT: {
				location: 'ARCHIVE'
			}
		},
		select: ArticleListSelect,
		take
	});
	return {
		articles
	};
};
