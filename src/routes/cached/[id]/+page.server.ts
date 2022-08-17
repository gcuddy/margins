import { db } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	if (params.id) {
		const bookmark = await db.bookmark.findFirst({
			where: {
				id: parseInt(params.id)
			}
		});
		if (bookmark) {
			return {
				body: {
					bookmark
				}
			};
		}
	}
	return {
		status: 404
	};
};
