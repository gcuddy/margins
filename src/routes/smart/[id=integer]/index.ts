import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import { z } from 'zod';
import { ArticleListSelect } from '$lib/types';
import { getJsonFromRequest } from '$lib/utils';

export const GET: RequestHandler = async ({ url, params }) => {
	console.time('smartlist');
	const list = await db.smartList.findFirst({
		where: {
			id: Number(params.id)
		},
		include: {
			favorite: true
		}
	});
	if (!list) {
		return {
			status: 400
		};
	}
	// duplicated from /fetch.json... not sure how to do this?
	const articles = await db.article.findMany({
		where: z.any().parse(list.filter),
		select: ArticleListSelect
	});
	console.timeEnd('smartlist');
	return {
		status: 200,
		body: {
			articles,
			list
		}
	};
};

export const PATCH: RequestHandler = async ({ params, request }) => {
	const json = await getJsonFromRequest(request);
	await db.smartList.update({
		where: {
			id: Number(params.id)
		},
		data: {
			...json
		}
	});
	return {
		status: 200
	};
};
