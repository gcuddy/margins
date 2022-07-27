import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import { getJsonFromRequest } from '$lib/utils';
import { tagRequestSchema } from '$lib/types/schemas/Tags';

export const GET: RequestHandler = async ({ params, url }) => {
	const { id } = params;
	// TODO: optimize this for performance
	const tags = await db.tag.findMany();
	const article = await db.article.findFirst({
		where: {
			id: parseInt(id)
		},
		include: {
			tags: true
		}
	});
	if (article) {
		return {
			body: {
				article,
				tags
			}
		};
	} else {
		return {
			status: 404
		};
	}
};

const createRedirect = (id: string | number) => {
	return {
		headers: {
			location: `/${id}/tags`
		}
	};
};

export const POST: RequestHandler = async ({ request, params }) => {
	const id = params.id;
	const json = await getJsonFromRequest(request);
	console.log({ json });
	try {
		const parsed = tagRequestSchema.parse(json);

		// create tags
		const tags = await db.tag.createMany({
			data: parsed.tags.map((name) => ({ name })),
			skipDuplicates: true
		});

		// deleteMany where articles.length is 0, bookmarkId doesn't exist, and rssfeeditemid doesn't exist
		// thisi is probably a very stupid way to do it
		// await db.tag.deleteMany({
		// 	where: {
		// 		articles: {
		// 			none: {
		// 				id: {
		// 					gte: 0
		// 				}
		// 			}
		// 		}
		// 	}
		// });

		//TODO: maybe make this a batch transaction
		// TODO: delete old tags with no relevant articleId

		// now set them
		const article = await db.article.update({
			where: {
				id: parseInt(id)
			},
			data: {
				tags: {
					// TODO: replace current tags with these new ones, not adding them
					// can use set, but that requires existing tags, doesn't it?
					set: parsed.tags.map((name) => ({ name }))
				}
			}
		});
		// const article = await db.article.update({
		// 	where: {
		// 		id: parseInt(id)
		// 	},
		// 	data: {
		// 		tags: {
		// 			// TODO: replace current tags with these new ones, not adding them
		// 			// can use set, but that requires existing tags, doesn't it?
		// 			connectOrCreate: parsed.tags.map((name) => {
		// 				return {
		// 					where: {
		// 						name
		// 					},
		// 					create: {
		// 						name
		// 					}
		// 				};
		// 			})
		// 		}
		// 	}
		// });
		return {
			status: 303,
			body: {
				article
			},
			...createRedirect(id)
		};
	} catch (e) {
		console.error(e);
		return {
			status: 404,
			...createRedirect(id)
		};
	}
};
