import { db } from '$lib/db';
import { ArticleListSelect } from '$lib/types';
import { getJsonFromRequest } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, Action } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	console.log({ params });
	const tag = await db.tag.findFirst({
		where: {
			name: {
				equals: params.name,
				// mode: 'insensitive' <- for when i use postgres
			},
		},
		include: {
			articles: {
				select: ArticleListSelect,
			},
			favorite: true,
		},
	});
	console.log({ tag });
	return { tag };
};

export const PATCH: Action = async ({ params, request }) => {
	console.log('Patching Tag');
	const json = await getJsonFromRequest(request);
	console.log({ json });
	const tag = await db.tag.update({
		where: {
			name: params.name,
		},
		data: {
			...json,
		},
	});
	if (!tag) {
		throw error(400);
	}
};
