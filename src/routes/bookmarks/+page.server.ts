import { db } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	try {
		const bookmarks = await db.bookmark.findMany();
		return {
			body: {
				bookmarks
			}
		};
	} catch (e) {
		console.log(e);
	}
	return { status: 404 };
};
