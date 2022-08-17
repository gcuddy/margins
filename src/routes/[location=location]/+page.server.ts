import type { Location } from '$lib/types/schemas/Locations';
import type { RequestHandler } from '@sveltejs/kit';
import type { z } from 'zod';
import { db } from '$lib/db';
import { ArticleListSelect } from '$lib/types';

export const GET: RequestHandler = async ({ params, url }) => {
	try {
		const take = parseInt(url.searchParams.get('limit') || '20');
		const location = params.location.toUpperCase() as Location;
		console.log({ location });
		const articles = await db.article.findMany({
			orderBy: [
				{
					updatedAt: 'desc'
				},
				{
					position: 'asc'
				}
			],
			where: {
				location
			},
			take,
			select: ArticleListSelect
		});
		return {
			status: 200,
			body: {
				articles,
				location
			}
		};
	} catch (error) {
		return {
			status: 400
		};
	}
};
