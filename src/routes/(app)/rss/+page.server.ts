import { db } from '$lib/db';
import { getJsonFromRequest } from '$lib/utils';
import { buildRssFeed, findFeed } from '$lib/rss/parser.server';
import { auth } from '$lib/server/lucia';
import normalizeUrl from 'normalize-url';
import { invalid, type Actions } from '@sveltejs/kit';

export const action: Actions = {
	default: async ({ request, locals }) => {
		try {
			// his assumes we're getting a *single* url
			const { userId } = locals.getSession();
			console.log({ userId });
			if (!userId) {
				return invalid(403, {
					error: 'Unauthorized',
				});
			}
			const json = await getJsonFromRequest(request);
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
							id: userId,
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
							id: userId,
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
	},
};