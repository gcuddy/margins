import { db } from '$lib/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params: { id } }) => {
	const bookmark = await db.bookmark.findFirst({
		where: {
			id: parseInt(id)
		}
	});
	if (bookmark) {
		return {
			bookmark
		};
	}
};
