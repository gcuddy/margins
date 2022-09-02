import { error, json, type RequestHandler } from '@sveltejs/kit';
import { auth } from '$lib/lucia';
import { db } from '$lib/db';
import { ArticleListSelect } from '$lib/types';
export const GET: RequestHandler = async ({ request, url: Url }) => {
	console.log('Received fetch user data request');
	try {
		const user = await auth.validateRequest(request);
		console.log(`here's what we got for fetch_user_data`, { user });
		const userData = await db.user.findFirst({
			where: {
				id: user.user['user_id'],
			},
			select: {
				username: true,
				feeds: true,
				favorites: true,
				articles: {
					select: ArticleListSelect,
				},
			},
		});
		if (!userData) {
			throw error(400, 'User not found');
		}
		console.log({ userData });
		return json(userData);
	} catch {
		throw error(401, 'unauthorized');
	}
};
