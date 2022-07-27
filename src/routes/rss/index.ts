// should this be json.ts,and then load function in index.svelte?

import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import { z } from 'zod';
import { getJsonFromRequest } from '$lib/utils';

import Parser from 'rss-parser';
import dayjs from 'dayjs';

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
				feeds: []
			}
		};
	}
};

// POST = add feed

const urlRegex = /\[(\d+)\](.*?)$/;
const zUrl = z.string().url();

async function parseFeed(url: string) {
	const parser = new Parser();
	try {
		const feed = await parser.parseURL(url);
		return feed;
	} catch (e) {
		console.log(e);
		throw Error('Could not parse feed');
	}
}

export const POST: RequestHandler = async ({ request }) => {
	const json = await getJsonFromRequest(request);
	try {
		// This assumes we're getting a *single* url
		const url = zUrl.parse(json.url);
		console.log({ url });
		// TODO: build my own parser
		const parsedFeed = await parseFeed(url);
		parsedFeed.items[0];
		console.log({ parsedFeed });
		const createdFeed = await db.rssFeed.create({
			data: {
				title: parsedFeed.title,
				feedUrl: parsedFeed.feedUrl,
				link: parsedFeed.link,
				description: parsedFeed.description,
				imageUrl: parsedFeed.image?.url,
				items: {
					// TODO: there's some gotcha I'm missing in here, like parsing out enclosures. But this will do for now.
					createMany: {
						data: parsedFeed.items.map((item) => ({
							// have to do it this way so id doesn't accidentally get passed through
							title: item.title,
							contentSnippet: item.contentSnippet,
							content: item.content,
							link: item.link,
							guid: item.guid,
							pubDate: dayjs(item.pubDate).isValid()
								? dayjs(item.pubDate).format()
								: dayjs().format(),
							creator: item.creator,
							summary: item.summary
						}))
					}
				}
			}
		});
		console.log({ createdFeed });
		return {
			status: 200,
			body: {
				feed: createdFeed
			}
		};
	} catch (error) {
		console.log(error);
		return {
			status: 400
		};
	}
};
