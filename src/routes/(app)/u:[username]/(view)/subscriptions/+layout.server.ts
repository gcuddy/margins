import { error } from '@sveltejs/kit';

import { db } from '$lib/db';

import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = async ({ params, locals }) => {
	const { session, user } = await locals.validateUser();
	if (user && user.username === params.username) {
		const subscriptions = await db.subscription.findMany({
			where: {
				userId: user.userId,
			},
			select: {
				title: true,
				id: true,
				feedId: true,
				feed: {
					select: {
						imageUrl: true,
						link: true,
						feedUrl: true,
					},
				},
			},
			// include: {
			// 	feed: true,
			// },
		});
		return { subscriptions, user };
	} else {
		throw error(401, 'Not authorized');
	}
};
