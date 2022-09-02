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
		console.log(`Here's our userData`, { userData });
		if (!userData) {
			throw error(400, 'User not found');
		}
		return json(userData);
		return json({
			username: 'test',
			feeds: [],
			favorites: [],
			articles: [],
		});
	} catch (e) {
		console.error(e);
		throw error(401, 'unauthorized');
	}
};
