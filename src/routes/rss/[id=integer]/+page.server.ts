import type { Action, PageServerLoad } from './$types';
import { db } from '$lib/db';
import { getJsonFromRequest } from '$lib/utils';
export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;
	const feed = await db.rssFeed.findFirst({
		where: {
			id: parseInt(id),
		},
		include: {
			items: {
				orderBy: {
					pubDate: 'desc',
				},
				select: {
					title: true,
					id: true,
					pubDate: true,
					author: true,
					rssFeedId: true,
					is_read: true,
					summary: true,
					contentSnippet: true,
				},
			},
			favorite: true,
		},
	});
	console.log(`Found ${feed.title}`);
	return {
		feed,
	};
};

export const PATCH: Action = async ({ request, params }) => {
	const json = await getJsonFromRequest(request);
	console.log(`patch`, json);
	try {
		const createdFeed = await db.rssFeed.update({
			where: {
				id: Number(params.id),
			},
			data: {
				...json,
			},
		});
		return {
			location: `/rss/${createdFeed.id}`,
		};
	} catch (error) {
		console.error(error);
		throw error(400);
	}
};

export const DELETE: Action = async ({ params }) => {
	try {
		await db.rssFeed.delete({
			where: {
				id: Number(params.id),
			},
		});
	} catch (error) {
		console.error(error);
		throw error(400);
	}
};
