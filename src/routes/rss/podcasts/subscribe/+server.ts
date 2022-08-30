import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getJsonFromRequest } from '$lib/utils';
import { z } from 'zod';
import { db } from '$lib/db';
const RssFeedModel = z.object({
	id: z.number().int().optional(),
	feedUrl: z.string(),
	title: z.string().nullish(),
	link: z.string().nullish(),
	description: z.string().nullish(),
	lastBuildDate: z.date().nullish(),
	imageUrl: z.string().nullish(),
	creator: z.string().nullish(),
});
export const POST: RequestHandler = async ({ request }) => {
	try {
		const json = await getJsonFromRequest(request);
		const data = RssFeedModel.parse(json);
		//TODO: user interaction
		await db.rssFeed.create({
			data: {
				feedUrl: data.feedUrl,
				title: data.title,
				description: data.description,
				imageUrl: data.imageUrl,
				creator: data.creator,
				podcast: true,
			},
		});
		return new Response(undefined, { status: 200 });
	} catch (e) {
		console.error(e);
		return new Response(undefined, { status: 400 });
	}
};
