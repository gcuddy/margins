import type { Location } from '$lib/types/schemas/Locations';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/db';
import { ArticleListSelect } from '$lib/types';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ params, url }) => {
	try {
		const take = parseInt(url.searchParams.get('limit') || '20');
		const location = params.location.toUpperCase() as Location | 'ALL';
		const articles = await db.article.findMany({
			orderBy: [
				{
					updatedAt: 'desc',
				},
				{
					position: 'asc',
				},
			],
			where: {
				location: location === 'ALL' ? undefined : location,
			},
			take,
			select: ArticleListSelect,
		});
		console.log({ articles });
		return {
			articles,
			location,
		};
	} catch (e) {
		error(400, 'error fetching articles');
	}
};
