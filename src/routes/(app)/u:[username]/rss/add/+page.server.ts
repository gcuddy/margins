import { type Actions, error } from '@sveltejs/kit';
import normalizeUrl from 'normalize-url';

import { db } from '$lib/db';
import { buildRssFeed, findFeed } from '$lib/rss/parser.server';
import { getJsonFromRequest } from '$lib/utils';
export const actions: Actions = {
	default: async ({ request, locals, fetch }) => {
		console.log({ locals });
		try {
			const { userId } = await locals.validate();
			const json = await getJsonFromRequest(request);
			const url = normalizeUrl(json.url, {
				stripWWW: false,
				removeTrailingSlash: false,
			});
			// vs...
			// const url = zUrl.parse(json.url);
			// TODO: build my own parser
			console.log({ url });
			const u = new URL(url);
			u.searchParams.set('url', url);
			const response = await fetch(`/api/download?url=${url}`);
			console.log(await response.text());
			console.log({ response });
			return;
			const data = await findFeed(url, fetch);
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
			// throw redirect(302, `/rss/${createdFeed.id}`);
			// return {
			// 	location: `/rss/${createdFeed.id}`,
			// };
		} catch (e) {
			console.error(e);
			throw error(400);
		}
	},
};
