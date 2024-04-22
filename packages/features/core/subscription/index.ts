import { z } from 'zod';
import { zod } from '../utils/zod.js';
import { useTransaction } from '../utils/transaction.js';
import { Feed, useUser } from '../index.js';
export const Schema = z.object({ title: z.string(), url: z.string() });

export const create = zod(Schema, async (input) =>
	useTransaction(async (tx) => {
		const feed = await Feed.create({
			url: input.url,
		});

		await tx
			.insertInto('Subscription')
			.ignore()
			.values({
				feedId: feed.id,
				title: input.title,
				updatedAt: new Date(),
				userId: useUser().id,
			})
			.execute();

		const subscription = await tx
			.selectFrom('Subscription')
			.where('id', '=', feed.id)
			.where('userId', '=', useUser().id)
			.executeTakeFirst();

		return subscription!;
	}),
);

export const fromUrl = zod(Schema.pick({ url: true }), async (input) =>
	useTransaction(async (tx) => {
		const subscription = await tx
			.selectFrom('Subscription')
			.innerJoin('Feed', 'Subscription.feedId', 'Feed.id')
			.where('Feed.feedUrl', '=', input.url)
			.where('Subscription.userId', '=', useUser().id)
			.executeTakeFirst();

		return subscription;
	}),
);
