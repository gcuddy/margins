import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';

export const GET: RequestHandler = async () => {
	// TODO: add limit? only those which have been used?
	const subscriptions = await db.rssFeed.findMany({
		select: {
			title: true,
			id: true
		},
		orderBy: {
			title: 'asc'
		}
	});
	return json(subscriptions);
};
