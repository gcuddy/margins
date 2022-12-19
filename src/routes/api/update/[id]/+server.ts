import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	const { id } = params;
	console.log(request.headers.get('content-type'));
	const json = await request.json();

	if (id && json) {
		console.log({ json });
		const article = await db.article.update({
			where: {
				id: parseInt(id),
			},
			data: { ...json },
		});
		console.log(`updated article ${article.id}`);
		return new Response(undefined, {
			status: 303,
			headers: {
				Location: `/${id}`,
			},
		});
	}
	return new Response(undefined, { status: 303 });
};
