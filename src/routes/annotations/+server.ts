import { db } from '$lib/db';
import { AnnotationSchema, delSchema } from '$lib/types/schemas/Annotations';
import { getJsonFromRequest } from '$lib/utils';
import type { Prisma } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const json = await getJsonFromRequest(request);
		console.log({ json });
		const { body, articleId, target, id, motivation } = AnnotationSchema.parse(json);
		const createdAnnotation = await db.annotation.upsert({
			where: {
				id: id === undefined ? -1 : id
			},
			update: {
				body,
				target
			},
			create: {
				body,
				articleId,
				target,
				motivation
			}
		});
		return {
			status: 200,
			body: createdAnnotation
		};
	} catch (e) {
		console.error(e);
		return {
			status: 500
		};
	}
};
