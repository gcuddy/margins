import { db } from '$lib/db';
import { error, redirect } from '@sveltejs/kit';
/** @type {import('./$types').PageLoad} */
export async function load({ params, locals }) {
	const { userId } = locals.getSession();
	if (!userId) {
		throw redirect(302, '/login');
	}
	const { name } = params;
	const articles = await db.article.findMany({
		where: {
			author: {
				equals: name,
			},
			userId,
		},
	});
	return {
		articles,
	};
}
