import { error } from '@sveltejs/kit';

import { db } from '$lib/db';
import { ArticleListSelect } from '$lib/types';

import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ params, locals, parent }) => {
	const { tag } = params;
	const raw = tag.split('/');
	const tags = [
		raw[0],
		...raw.slice(1).map((t) => {
			console.log(t);
			if (!t.startsWith('t:')) {
				throw error(404, 'Invalid tag');
			}
			return t.replace(/^t:/, '');
		}),
	];
	if (!tags) {
		throw error(404, 'Not found');
	}
	const { AUTHORIZED } = await parent();
	const items = await db.article.findMany({
		where: {
			AND: tags.map((tag) => {
				return {
					tags: {
						some: {
							name: tag,
						},
					},
				};
			}),
			user: {
				username: {
					equals: params.username,
				},
			},
			private: AUTHORIZED ? true : undefined,
		},
		select: {
			...ArticleListSelect,
			tags: {
				include: {
					favorite: true,
				},
			},
		},
	});
	return {
		tags,
		items,
	};
};
