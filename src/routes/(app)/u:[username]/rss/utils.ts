import { buildRssFeed, findFeed } from '$lib/rss/parser.server';
import { db } from '$lib/db';
export async function addFeed({
	url,
	userId,
	title,
}: {
	url: string;
	userId: string;
	title?: string;
}) {
	const data = await findFeed(url);
	if (!data) return;
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
	return createdFeed;
}
