import type { PageServerLoad } from './$types';
import { db } from '$lib/db';
export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id);
	const article = await db.article.findUnique({
		where: {
			id
		}
	});
	return {
		article
	};
};
