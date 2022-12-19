import type { PageServerLoad, Action } from './$types';
import { db } from '$lib/db';
import { getJsonFromRequest } from '$lib/utils';
import { ArticleListSelect } from '$lib/types';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import { AddToListSchema } from '$lib/types/schemas/List';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;
	try {
		const list = await db.collection.findUnique({
			where: {
				id: Number(id),
			},
			include: {
				items: {
					include: {
						article: {
							select: ArticleListSelect,
						},
						annotation: true,
					},
				},
			},
		});
		return {
			list,
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
					type: 'ARTICLE',
				};
			}),
			skipDuplicates: true,
		});
		const list = await db.collection.update({
			where: {
				id: parseInt(id),
			},
			data: {
				name,
				description,
				items: {
					set: listItems || [],
				},
			},
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
		const { articleId, annotationId } = AddToListSchema.parse(data);
		console.log({ data });
		if (articleId) {
			if (Array.isArray(articleId)) {
				await db.listItem.createMany({
					data: articleId.map((articleId) => ({
						articleId: Number(articleId),
						listId: Number(id),
					})),
					skipDuplicates: true,
				});
			} else {
				await db.listItem.create({
					data: {
						articleId: Number(articleId),
						listId: Number(id),
					},
				});
			}
		}
		if (annotationId) {
			if (Array.isArray(annotationId)) {
				await db.listItem.createMany({
					data: annotationId.map((annotationId) => ({
						annotationId: Number(annotationId),
						listId: Number(id),
					})),
					skipDuplicates: true,
				});
			} else {
				await db.listItem.create({
					data: {
						annotationId: Number(annotationId),
						listId: Number(id),
					},
				});
			}
		}
	} catch (e) {
		throw error(400, 'error updating list');
	}
};
