import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import { getJsonFromRequest } from '$lib/utils';
export const GET: RequestHandler<{ id: string }> = async ({ request, url, params }) => {
	const { id } = params;

	try {
		const list = await db.list.findUnique({
			where: {
				id: parseInt(id)
			},
			include: {
				items: {
					include: {
						article: true
						// select: {
						// 	id: true,
						// 	title: true,
						// 	author: true,
						// 	readProgress: true,
						// 	image: true,
						// 	description: true,
						// 	url: true
						// }
					}
				}
			}
		});
		return {
			status: 200,
			body: {
				list
			}
		};
	} catch (e) {
		console.error(e);
		return {
			status: 400
		};
	}
};

export const PATCH: RequestHandler<{ id: string }> = async ({ request, url, params }) => {
	const { id } = params;
	console.log('patching beep beep');
	try {
		const data = await getJsonFromRequest(request);
		const { name, description, items } = data;
		console.log('here we go', data);
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

		return {
			status: 200,
			body: {
				list
			}
		};
	} catch (e) {
		console.error(e);
		return {
			status: 400
		};
	}
};

//PUT- used for putting list item (from articleId) in list
export const PUT: RequestHandler<{ id: string }> = async ({ request, params }) => {
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
		return {
			status: 200,
			body: {
				list
			}
		};
	} catch (e) {
		console.error(e);
		return {
			status: 400
		};
	}
};
