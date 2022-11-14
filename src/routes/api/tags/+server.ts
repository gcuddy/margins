import { json } from '@sveltejs/kit';
import { reportZodOrPrismaError } from '$lib/api-utils';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import { getJsonFromRequest } from '$lib/utils';
import { tagRequestSchema } from '$lib/types/schemas/Tags';
import { auth } from '$lib/server/lucia';

export const GET: RequestHandler = async () => {
	// TODO: add limit? only those which have been used?
	const tags = await db.tag.findMany();
	return json(tags);
};

// patch/post: used for patching articles with tags
export const POST: RequestHandler = async ({ request, locals }) => {
	const { userId } = await locals.getSession();
	console.log('received tag request');
	try {
		// const { userId } = await auth.validateRequest(request);
		console.log({ userId });
		const data = await getJsonFromRequest(request);
		const parsed = tagRequestSchema.parse(data);
		const tags = parsed.tags?.map((name) => ({ name, userId }));
		if (tags?.length) {
			await db.tag.createMany({
				data: tags,
				skipDuplicates: true,
			});
		}
		const articles = await db.$transaction(
			parsed.ids.map((id) => {
				return db.article.update({
					where: {
						id: Number(id),
					},
					data: {
						tags: {
							set:
								tags.map((t) => {
									return {
										name_userId: {
											name: t.name,
											userId: t.userId,
										},
									};
								}) || [],
						},
					},
					select: {
						id: true,
					},
				});
			})
		);
		// only return ids of updated articles
		return new Response(JSON.stringify({ ids: articles.map((a) => a.id) }), { status: 200 });
		// return json(articles);
	} catch (e) {
		console.error(e);
		return new Response(undefined, { status: 500 });
	}
};
