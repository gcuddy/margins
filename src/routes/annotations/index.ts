import { db } from '$lib/db';
import { annotationSchema } from '$lib/types/schemas/Annotations';
import { getJsonFromRequest } from '$lib/utils';
import type { Prisma } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const json = await getJsonFromRequest(request);
		console.log({ json });
		const { body, articleId, target } = annotationSchema.parse(json);
		const createdAnnotation = await db.annotation.create({
			data: {
				body: body,
				articleId: articleId,
				target: target as Prisma.JsonObject
			}
		});
		return {
			status: 200,
			body: {
				id: createdAnnotation.id
			}
		};
	} catch (e) {
		console.error(e);
		return {
			status: 500
		};
	}
};
