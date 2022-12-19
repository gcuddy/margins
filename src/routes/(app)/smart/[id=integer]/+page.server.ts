import type { PageServerLoad, Action } from './$types';
import { db } from '$lib/db';
import { z } from 'zod';
import { ArticleListSelect } from '$lib/types';
import { getJsonFromRequest } from '$lib/utils';
import { SmartListModelSchema } from '$lib/types/schemas/SmartList';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url, params }) => {
	console.time('smartlist');
	const list = await db.smartList.findFirst({
		where: {
			id: Number(params.id),
		},
		include: {
			favorite: true,
		},
	});
	if (!list) {
		throw error(404, 'List not found');
	}
	// duplicated from /fetch.json... not sure how to do this?
	const articles = await db.article.findMany({
		where: z.any().parse(list.filter),
		select: ArticleListSelect,
	});
	console.timeEnd('smartlist');
	console.log({ articles, list });
	return {
		articles,
		list,
	};
};

export const PATCH: Action = async ({ params, request }) => {
	const json = await getJsonFromRequest(request);
	const parsed = SmartListModelSchema.partial().parse(json);
	await db.smartList.update({
		where: {
			id: Number(params.id),
		},
		data: {
			viewOptions: parsed.viewOptions,
			filter: JSON.stringify(parsed.filter),
			name: parsed.name,
		},
	});
};
