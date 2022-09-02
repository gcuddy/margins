import type { PageServerLoad } from './$types';
import { db } from '$lib/db';
export const load: PageServerLoad = async () => {
	const css = await db.css.findMany({
		orderBy: [
			{
				createdAt: 'asc'
			}
		]
	});
	return {
		css
	};
};
