import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	const { id } = params;
	console.log('patch', id);
	const json = await request.json();
	console.log('patch', { json });

	if (id && json) {
		console.log('inside id and json patching');
		const article = await db.article.update({
			where: {
				id: parseInt(id)
			},
			data: { ...json },
			include: {
				annotations: true,
				highlights: true,
				tags: true
			}
		});
		return {
			status: 200,
			body: article
		};
	} else {
		return {
			status: 303
		};
	}
};
