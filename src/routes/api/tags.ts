import { reportZodOrPrismaError } from '$lib/api-utils';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import { getJsonFromRequest } from '$lib/utils';
import { tagRequestSchema } from '$lib/types/schemas/Tags';

// get: get all tags
export const GET: RequestHandler = async () => {
	const tags = await db.tag.findMany();
	return {
		status: 200,
		body: tags
	};
};

// patch/post: used for patching articles with tags
export const POST: RequestHandler = async ({ request }) => {
	const json = await getJsonFromRequest(request);
	console.log({ json });
	try {
		const parsed = tagRequestSchema.parse(json);
		const tags = parsed.tags?.map((name) => ({ name }));
		console.log({ tags });
		const createdTags = await db.tag.createMany({
			data: tags || [],
			skipDuplicates: true
		});
		const articles = await db.$transaction(
			parsed.ids.map((id) => {
				return db.article.update({
					where: {
						id: Number(id)
					},
					data: {
						tags: {
							set: tags || []
							// connectOrCreate: parsed.tags.map((tag) => {
							// 	return {
							// 		where: { name: tag },
							// 		create: { name: tag }
							// 	};
							// })
						}
					},
					include: {
						tags: true
					}
				});
			})
		);
		return {
			status: 200,
			body: articles
		};
	} catch (e) {
		console.error(e);
		return {
			status: 400,
			body: {
				error: reportZodOrPrismaError(e)
			}
		};
	}
};
