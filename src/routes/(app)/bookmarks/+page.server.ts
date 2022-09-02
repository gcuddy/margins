import { db } from '$lib/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const bookmarks = await db.bookmark.findMany();
		return {
			bookmarks
		};
	} catch (e) {
		console.log(e);
		throw error(404);
	}
};
