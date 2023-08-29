import type { Config } from '@sveltejs/adapter-vercel';
import { json } from '@sveltejs/kit';
import parse from 'node-html-parser';

import { db } from '$lib/db';
import { entrySelect, type ListEntry } from '$lib/db/selects';
import { linksSchema } from '$lib/schemas/inputs/links';

import type { RequestHandler } from './$types';

export const config: Config = {
	runtime: 'nodejs18.x',
};

async function getLinkMetadata(url: string) {
	// see if it's in db
	// const entry = await db
	// 	.selectFrom('Entry as e')
	// 	.where('e.uri', '=', url)
	// 	.select(entrySelect)
	// 	.executeTakeFirst();

	// if (entry) {
	// 	return {
	// 		entry,
	// 	};
	// }

	const res = await fetch(url);
	const html = await res.text();

	const doc = parse(html);

	const title = doc.querySelector('title')?.textContent;

	const description = doc
		.querySelector('meta[name="description"]')
		?.getAttribute('content');

	const image = doc
		.querySelector('meta[name="og:image"]')
		?.getAttribute('content');

	return {
		title,
		description,
		image,
	};
}

export const POST = (async ({ request, setHeaders }) => {
	const data = await request.json();

	const parsed = linksSchema.parse(data);

	const urlToDataMap = new Map<
		string,
		{
			title: string;
            href: string;
			entry?: ListEntry;
		}
	>();

	const entries = await db
		.selectFrom('Entry as e')
		.where('e.uri', 'in', parsed)
		.select(entrySelect)
		.execute();

	for (const url of parsed) {
		if (entries.some((e) => e.uri === url)) {
			const entry = entries.find((e) => e.uri === url);
			urlToDataMap.set(url, {
				entry,
				title: entry?.title ?? '',
                href: url
			});
		} else {
			const data = await getLinkMetadata(url);
			urlToDataMap.set(url, {
				title: data.title ?? '',
                href: url
			});
		}
	}

	// const links = await Promise.all(parsed.map(getLinkMetadata));

	const cacheTime = 60 * 60; // 1 hour
	setHeaders({
		'Cache-Control': `public, s-maxage=${cacheTime}`,
	});

	return json(Array.from(urlToDataMap.values()));

	// get data from hrefs (maybe cache with redis)

	// for each link, we need to go see if it's a valid link....
}) satisfies RequestHandler;
