import { json } from '@sveltejs/kit';
import { db } from '$lib/db';
import { AnnotationSchema } from '$lib/types/schemas/Annotations';
import { getJsonFromRequest } from '$lib/utils';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await getJsonFromRequest(request);
		const { body, articleId, target, id, motivation } = AnnotationSchema.parse(data);
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
		return json(createdAnnotation);
	} catch (e) {
		console.error(e);
		return new Response(undefined, { status: 500 });
	}
};
