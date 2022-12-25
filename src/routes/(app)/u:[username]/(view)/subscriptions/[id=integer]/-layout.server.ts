import { error } from '@sveltejs/kit';

import { db } from '$lib/db';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, locals, parent }) => {
	const { session, user } = await locals.validateUser();
	console.log({ params, user, session });
	if (user && user.username === params.username) {
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
		const unread = subscription.feed.entries.filter((a, b) => !a.interactions[0]?.is_read);
		const data = await parent();
		return {
			...data,
			subscription,
			unread,
			user,
		};
	} else {
		throw error(401, 'Not authorized');
	}
};
