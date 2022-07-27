import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
export const GET: RequestHandler = async ({ url }) => {
	const q = url.searchParams.get('q');
	console.log({ q });
	if (!q) {
		return {
			status: 200,
			body: {
				results: []
			}
		};
	}
	const results = await db.article.findMany({
		where: {
			content: {
				search: q
			}
		},
		include: {
			tags: true
		}
	});
	console.log({ results });
	return {
		status: 200,
		body: {
			results
		}
	};
};
