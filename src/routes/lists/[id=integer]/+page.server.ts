import type { PageServerLoad, Action } from './$types';
import { db } from '$lib/db';
import { getJsonFromRequest } from '$lib/utils';
import { ArticleListSelect } from '$lib/types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;
	try {
		const list = await db.list.findUnique({
			where: {
				id: Number(id)
			},
			include: {
				items: {
					include: {
						article: {
							select: ArticleListSelect
						}
					}
				}
			}
		});
		return {
			list
		};
	} catch (e) {
		console.error(e);
		throw error(404, 'List not found');
	}
};

export const PATCH: Action = async ({ request, params }) => {
	const { id } = params;
	try {
		const data = await getJsonFromRequest(request);
		// TODO: zod schema
		const { name, description, items } = data;
		const listItems = await db.listItem.createMany({
			data: items?.map((article) => {
				return {
					articleId: parseInt(article),
					listId: parseInt(id),
					type: 'ARTICLE'
				};
			}),
			skipDuplicates: true
		});
		const list = await db.list.update({
			where: {
				id: parseInt(id)
			},
			data: {
				name,
				description,
				items: {
					set: listItems || []
				}
			}
		});
	} catch (e) {
		throw error(400, 'error updating list');
	}
};

//PUT- used for putting list item (from articleId) in list
export const PUT: Action = async ({ request, params }) => {
	const { id } = params;
	try {
		const data = await getJsonFromRequest(request);
		/// TODO: flesh out
		const { articleId } = data;
		const list = await db.listItem.create({
			data: {
				articleId: parseInt(articleId),
				listId: parseInt(id),
				type: 'ARTICLE'
			}
		});
	} catch (e) {
		throw error(400, 'error updating list');
	}
};
