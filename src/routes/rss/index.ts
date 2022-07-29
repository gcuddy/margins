// should this be json.ts,and then load function in index.svelte?

import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db';
import { z } from 'zod';
import { getJsonFromRequest } from '$lib/utils';

import Parser from 'rss-parser';
import dayjs from 'dayjs';
import { buildItem, getRefreshedFeeds, isXml, linkSelectors, resolveUrl } from './_rss-utils';
import parse from 'node-html-parser';

export const GET: RequestHandler = async ({ params, url }) => {
	const items = url?.searchParams?.get('items') !== 'false';
	// todo: add refresh
	// lol this can't be the right way to do this
	// const feeds = await getRefreshedFeeds();
	const feeds = await db.rssFeed.findMany({
		orderBy: [
			{
				createdAt: 'desc'
			}
		],
		include: {
			items: {
				include: {
					RssFeed: true
					// RssFeed: {
					// 	select: {
					// 		id: true,
					// 		link: true,
					// 		imageUrl: true
					// 	}
					// }
				}
			}
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

const zUrl = z.string().url();

async function parseFeed(xml: string) {
	console.log(`attempting to parse feed from xml`, xml);
	const parser = new Parser();
	try {
		const feed = await parser.parseString(xml);
		return feed;
	} catch (e) {
		console.log(e);
		throw Error('Could not parse feed');
	}
}

/**
 *
 * @param url the url of the site to find the feed for
 * @returns XML String of the feed
 */
async function findFeed(url: string) {
	const response = await fetch(url);
	const body = await response.text();
	const contentType = response.headers.get('content-type');
	if (contentType && isXml(contentType)) {
		return body;
	} else {
		const root = parse(body);
		const links = root.querySelectorAll(linkSelectors);
		let href = '';
		// const href = link?.attributes.href;
		while (!href && links.length) {
			const link = links.shift();
			// (todo: support json)
			if (link && !link.attributes.href.endsWith('.json')) {
				href = link.attributes.href;
			}
		}
		if (!href) {
			throw Error('Could not find rss feed!');
		}
		href = resolveUrl(url, href);
		console.log({ href });
		return fetch(href).then((res) => res.text());
	}
}

export const POST: RequestHandler = async ({ request }) => {
	const json = await getJsonFromRequest(request);
	try {
		// This assumes we're getting a *single* url
		const url = zUrl.parse(json.url);
		console.log({ url });
		// TODO: build my own parser
		const xml = await findFeed(url);
		const parsedFeed = await parseFeed(xml);
		parsedFeed.items[0];
		console.log({ parsedFeed });
		const createdFeed = await db.rssFeed.create({
			data: {
				title: parsedFeed.title,
				feedUrl: parsedFeed.feedUrl as string,
				link: parsedFeed.link,
				description: parsedFeed.description,
				imageUrl: parsedFeed.image?.url,
				items: {
					// TODO: there's some gotcha I'm missing in here, like parsing out enclosures. But this will do for now.
					createMany: {
						data: parsedFeed.items.map((item) => buildItem(parsedFeed.feedUrl || '', item))
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
