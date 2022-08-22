import { json as json$1 } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

import type { Prisma } from '@prisma/client';

import { db } from '$lib/db';
// TODO should this be json endpoint?
function isValidDate(d: Date | number) {
	return d instanceof Date && !isNaN(d);
}

export const GET: RequestHandler = async ({ request, url }) => {
	let select: Prisma.ArticleSelect | null = null;
	const fields = url.searchParams.get('fields')?.split(',');

	// gets only articles after date
	let where: Prisma.Enumerable<Prisma.ArticleWhereInput> | undefined = undefined;
	const date = url.searchParams.get('date')
		? new Date(url.searchParams.get('date') as string)
		: undefined;

	// ids that you have and don't want ??
	const have = url.searchParams.get('have')?.split(',');

	if (date && isValidDate(date)) {
		where = {
			updatedAt: {
				gte: date
			}
		};
	}

	const limit = parseInt(url.searchParams.get('limit') || '0') || undefined;
	if (fields && fields.length) {
		select = {
			...fields.reduce((acc, field) => {
				acc[field] = true;
				return acc;
			}, {} as Prisma.ArticleSelect)
		};
	}
	const articles = await db.article.findMany({
		select,
		take: limit,
		where
	});
	if (!articles) {
		return new Response(undefined, { status: 400 });
	}
	return json$1({
		articles
	}, {
		headers: {
			'cache-control': 'public, max-age=60, s-maxage=60'
		}
	});
};
