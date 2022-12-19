import { error } from '@sveltejs/kit';

import { db } from '$lib/db';

import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ params, locals }) => {
	console.log('subscriptions load');
	const { session, user } = await locals.validateUser();
	console.log({ params, user, session });
	if (user && user.username === params.username) {
		console.log('authorized');
		const subscriptions = await db.subscription.findMany({
			where: {
				userId: user.userId,
			},
			include: {
				feed: true,
			},
		});
		return { subscriptions };
	} else {
		throw error(401, 'Not authorized');
	}
};
