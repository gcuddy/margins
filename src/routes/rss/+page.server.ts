// should this be json.ts,and then load function in index.svelte?
import type { PageServerLoad, Action } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/db';
import { z } from 'zod';
import { getJsonFromRequest } from '$lib/utils';

import Parser from 'rss-parser';
import { buildItem, isXml, linkSelectors, resolveUrl } from './_rss-utils';
import parse from 'node-html-parser';

export const load: PageServerLoad = async () => {
	const feeds = await db.rssFeed.findMany({
		orderBy: [
			{
				title: 'asc',
			},
		],
	});
	return {
		feeds,
	};
};

// POST = add feed

const zUrl = z.string().url();

async function parseFeed(xml: string) {
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
async function findFeed(url: string): Promise<{
	xml: string;
	url: string;
}> {
	const response = await fetch(url);
	const body = await response.text();
	const contentType = response.headers.get('content-type');
	if (contentType && isXml(contentType)) {
		return {
			xml: body,
			url,
		};
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
		return {
			xml: await fetch(href).then((res) => res.text()),
			url: href,
		};
	}
}

export const POST: Action = async ({ request }) => {
	const json = await getJsonFromRequest(request);
	try {
		// This assumes we're getting a *single* url
		const url = zUrl.parse(json.url);
		// TODO: build my own parser
		const { xml, url: feedUrl } = await findFeed(url);
		const parsedFeed = await parseFeed(xml);
		console.log(`***This is the Parsed Feed***`, parsedFeed);
		parsedFeed.items[0];
		const createdFeed = await db.rssFeed.create({
			data: {
				title: parsedFeed.title,
				feedUrl,
				link: parsedFeed.link,
				description: parsedFeed.description,
				imageUrl: parsedFeed.image?.url,
				items: {
					// TODO: there's some gotcha I'm missing in here, like parsing out enclosures. But this will do for now.
					createMany: {
						data: parsedFeed.items.map((item) => buildItem(parsedFeed.feedUrl || '', item)),
					},
				},
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
