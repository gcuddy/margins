import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
export const GET: RequestHandler = async () => {
	const cssRules = await db.css.findMany({
		orderBy: [
			{
				createdAt: 'asc'
			}
		]
	});
	return {
		status: 200,
		body: {
			cssRules
		}
	};
};
