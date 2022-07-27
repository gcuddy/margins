import { db } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	console.log({ params });
	const tag = await db.tag.findFirst({
		where: {
			name: {
				equals: params.name
				// mode: 'insensitive' <- for when i use postgres
			}
		},
		include: {
			articles: true
		}
	});
	console.log({ tag });
	if (tag) {
		console.log('returning tag');
		return {
			body: { tag },
			status: 200
		};
	}
	return {
		status: 404
	};
};
