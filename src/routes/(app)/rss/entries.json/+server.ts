import { error, json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import { auth } from '$lib/lucia';
export const GET: RequestHandler = async ({ url, locals }) => {
	const cursor = url.searchParams.get('cursor');
	const unread = url.searchParams.get('unread');
	try {
		const user = await auth.validateAccessToken(
			locals.lucia.access_token,
			locals.lucia.fingerprint_token
		);
		console.log({ user });
		if (cursor) {
			const items = await db.rssFeedItem.findMany({
				where: {
					feed: {
						users: {
							some: {
								id: user['user_id'],
							},
						},
					},
					interactions:
						unread === 'true'
							? {
									some: {
										user: {
											id: user['user_id'],
										},
										is_read: false,
									},
							  }
							: undefined,
				},
				take: 50,
				cursor: {
					id: Number(cursor),
				},
				skip: 1,
				include: {
					interactions: {
						where: {
							userId: user['user_id'],
						},
					},
					feed: {
						select: {
							title: true,
							id: true,
						},
					},
				},
				// TODO select
			});
			return json({
				items,
				cursor: items[items.length - 1]?.id,
			});
		} else {
			const items = await db.rssFeedItem.findMany({
				where: {
					feed: {
						users: {
							some: {
								id: user['user_id'],
							},
						},
					},
					interactions:
						unread === 'true'
							? {
									some: {
										user: {
											id: user['user_id'],
										},
										is_read: false,
									},
							  }
							: undefined,
				},
				take: 50,
				include: {
					interactions: {
						where: {
							userId: user['user_id'],
						},
					},
					feed: {
						select: {
							title: true,
							id: true,
						},
					},
				},
				// TODO select
			});
			console.log({ items });
			return json({
				items,
				cursor: items[items.length - 1]?.id,
			});
		}
	} catch (e) {
		console.error(e);
		throw error(500, 'error');
	}
};
