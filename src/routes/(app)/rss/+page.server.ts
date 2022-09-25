// should this be json.ts,and then load function in index.svelte?
import type { Action } from './$types';
import { db } from '$lib/db';
import { getJsonFromRequest } from '$lib/utils';
import { buildRssFeed, findFeed } from '$lib/rss/parser.server';
import { auth } from '$lib/lucia';
import normalizeUrl from 'normalize-url';

export const POST: Action = async ({ request, locals }) => {
	console.log({ locals });
	try {
		// This assumes we're getting a *single* url
		console.log({ headers: request.headers.get('Authorization') });
		const { user } = await auth.validateRequest(request);
		const json = await getJsonFromRequest(request);
		console.log({ user });
		const url = normalizeUrl(json.url, {
			stripWWW: false,
		});
		console.log({ url });
		// vs...
		// const url = zUrl.parse(json.url);
		// TODO: build my own parser
		const data = await findFeed(url);
		// const parsedFeed = await parseFeed(xml);
		const builtFeed = await buildRssFeed(data, url);
		// console.log({ builtFeed, items: builtFeed.items });
		const createdFeed = await db.rssFeed.upsert({
			where: {
				feedUrl: builtFeed.feedUrl,
			},
			update: {
				users: {
					connect: {
						id: user.user_id,
					},
				},
				items: {
					createMany: {
						data: builtFeed.items,
						skipDuplicates: true,
					},
				},
			},
			create: {
				title: builtFeed.title,
				link: builtFeed.link,
				description: builtFeed.description,
				imageUrl: builtFeed.imageUrl,
				feedUrl: builtFeed.feedUrl,
				items: {
					createMany: {
						data: builtFeed.items.map((item) => {
							return {
								...item,
							};
						}),
						skipDuplicates: true,
					},
				},
				users: {
					connect: {
						id: user.user_id,
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
