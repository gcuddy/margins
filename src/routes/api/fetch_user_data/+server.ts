import { error, json, type RequestHandler } from '@sveltejs/kit';
import { buildPodcast } from '$lib/rss/parser';
import { auth } from '$lib/lucia';
import { db } from '$lib/db';
export const GET: RequestHandler = async ({ request, url: Url }) => {
	try {
		const user = await auth.validateRequest(request);
		console.log({ user });
		const userData = await db.user.findFirst({
			where: {
				id: user.user['user_id'],
			},
			select: {
				username: true,
				feeds: true,
			},
		});
		return json(userData);
	} catch {
		throw error(401, 'unauthorized');
	}
};
