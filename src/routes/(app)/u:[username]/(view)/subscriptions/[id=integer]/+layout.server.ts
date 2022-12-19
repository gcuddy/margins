import { error } from '@sveltejs/kit';

import { db } from '$lib/db';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, locals }) => {
	const { session, user } = await locals.validateUser();
	console.log({ params, user, session });
	if (user && user.username === params.username) {
		// const feed = await db.feed.findFirstOrThrow({
		// 	where: {
		// 		id: Number(params.id),
		// 	},
		// 	include: {
		// 		entries: {
		// 			include: {
		// 				interactions: true,
		// 				feed: true,
		// 			},
		// 		},
		// 		subscriptions: {
		// 			where: {
		// 				userId: user.userId,
		// 			},
		// 		},
		// 	},
		// });
		// return { feed };
		const subscription = await db.subscription.findUniqueOrThrow({
			where: {
				userId_feedId: {
					userId: user.userId,
					feedId: Number(params.id),
				},
			},
			include: {
				feed: {
					include: {
						entries: {
							include: {
								interactions: true,
							},
							orderBy: {
								published: 'desc',
							},
						},
					},
				},
			},
		});
		return {
			subscription,
		};
	} else {
		throw error(401, 'Not authorized');
	}
};
