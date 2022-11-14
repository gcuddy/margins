import { error, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import { auth } from '$lib/server/lucia';
export const POST: RequestHandler = async ({ params, locals, request, url }) => {
	try {
		const { userId } = await locals.getSession();
		if (!userId) {
			return error(401, 'Unauthorized');
		}
		const is_read = url.searchParams.get('unread') !== 'true';
		await db.rssFeedItem.update({
			where: {
				uuid: params.entry,
			},
			data: {
				// interactions not accessible?
				interactions: {
					upsert: {
						where: {
							userId_itemUuid: {
								userId,
								itemUuid: params.entry,
							},
						},
						create: {
							userId,
							is_read,
						},
						update: {
							is_read,
						},
					},
				},
			},
		});
		return new Response(undefined, { status: 200 });
	} catch (e) {
		console.error(e);
		throw error(500, e);
	}
};
