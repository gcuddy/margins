import { error } from '@sveltejs/kit';

import { db } from '$lib/db';

import type {
	Action,
	PageServerLoad,
} from '../../../../../../../.svelte-kit/types/src/routes/(app)/u:[username]/article/[id=integer]/[slug]/$types';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;
	const article = await db.article.findFirst({
		where: {
			id: parseInt(id as string),
		},
		include: {
			annotations: true,
			tags: true,
			context: {
				include: {
					Article: {
						select: {
							id: true,
							title: true,
						},
					},
				},
			},
		},
	});
	if (!article) {
		throw error(404, 'Article not found');
	}
	return {
		article,
	};
};

export const PATCH: Action = async ({ params, request }) => {
	const { id } = params;
	const json = await request.json();
	if (id && json) {
		await db.article.update({
			where: {
				id: parseInt(id),
			},
			data: { ...json },
			include: {
				annotations: true,
				highlights: true,
				tags: true,
			},
		});
	} else {
		return {
			errors: {
				message: 'missing id or json',
			},
		};
	}
};

export const DELETE: Action = async ({ params }) => {
	const { id } = params;
	await db.article.delete({
		where: {
			id: parseInt(id),
		},
	});
};
