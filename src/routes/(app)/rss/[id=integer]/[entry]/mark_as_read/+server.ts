import { error, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import { auth } from '$lib/lucia';
export const POST: RequestHandler = async ({ params, locals, request, url }) => {
	try {
		const { user } = await auth.validateRequest(request);
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
								itemUuid: params.entry,
								userId: user.user_id,
							},
						},
						create: {
							is_read,
							userId: user.user_id,
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
