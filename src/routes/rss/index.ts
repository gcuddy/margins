// should this be json.ts,and then load function in index.svelte?

import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import { z } from 'zod';
const getFeeds = db.rssFeed.findMany({
	orderBy: [
		{
			createdAt: 'desc'
		}
	],
	include: {
		items: true
	}
});

export const GET: RequestHandler = async ({ params, url }) => {
	const items = url?.searchParams?.get('items') !== 'false';
	// todo: add refresh
	const feeds = await db.rssFeed.findMany({
		orderBy: [
			{
				createdAt: 'desc'
			}
		],
		include: {
			items
		}
	});
	console.log({ feeds });
	if (feeds.length) {
		return {
			body: {
				feeds
			}
		};
	} else {
		return {
			body: {
				articles: []
			}
		};
	}
};

// POST = add feed

const urlRegex = /\[(\d+)\](.*?)$/;
const zUrl = z.string().url();

export const POST: RequestHandler = async ({ request }) => {
	const form = await request.formData();
	const feeds = form.getAll('feed-skelected') as string[];
	const rssFeedSchema = z.object({
		feedUrl: z.string(),
		uuid: z.string(),
		description: z.string().nullish().optional(),
		image: z.string().optional(),
		link: z.string().optional(),
		items: z
			.object({
				uuid: z.string(),
				title: z.string(),
				link: z.string(),
				description: z.string().optional(),
				pubDate: z.date().optional(),
				author: z.string().optional(),
				content: z.string().optional()
			})
			.array()
	});
	const fullFeeds = (form.getAll('feed') as string[]).map((f) =>
		rssFeedSchema.parse(JSON.parse(f))
	);
	console.log({ fullFeeds });
	const titles = form.getAll('feed-title') as string[];
	console.log({ feeds, titles });
	const data: { feedUrl: string; title: string }[] = [];

	// feeds.map()
	// feeds.forEach((f) => {
	// 	console.log({ f });
	// 	const _f = zUrl.parse(f);
	// 	// get first and second group from urlRegex of _f
	// 	const matches = _f.match(urlRegex);
	// 	if (matches) {
	// 		const id = parseInt(matches[1]);
	// 		const feedUrl = matches[2];
	// 		console.log({ id, url: feedUrl });
	// 		const title = titles[id] as string;
	// 		console.log({ title });
	// 		data.push({
	// 			feedUrl,
	// 			title
	// 		});
	// 	}
	// });
	const transactions = await db.$transaction([
		...fullFeeds.map((feed, i) => {
			return db.rssFeed.create({
				data: {
					...feed,
					title: titles[i],
					items: {
						create: feed.items
					}
				}
			});
		}),
		getFeeds
	]);
	// const addedFeeds2 = await db.rssFeed.createMany({
	// 	data: fullFeeds.map((feed, i) => {
	// 		return { ...feed, title: titles[i] };
	// 	})
	// });
	const allFeeds = [...transactions].pop();
	// duplicating this... (should it just be a general call)
	// const updatedFeeds = await db.rssFeed.findMany({
	// 	orderBy: [
	// 		{
	// 			createdAt: 'desc'
	// 		}
	// 	],
	// 	include: {
	// 		items: true
	// 	}
	// });
	return {
		status: 200,
		body: {
			feeds: allFeeds
		}
	};
};
