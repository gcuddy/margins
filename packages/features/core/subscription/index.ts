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
			.selectAll()
			.where('id', '=', feed.id)
			.where('userId', '=', useUser().id)
			.executeTakeFirst();

		return subscription!;
	}),
);

/**
 * Get subscription by url
 * If given an array, it will return the first matching subscription
 * (This is useful for checking through multiple feed urls on a website in one trip)
 */
export const fromUrl = zod(
	z.object({
		url: Schema.shape.url.or(z.array(Schema.shape.url)),
	}),
	async (input) =>
		useTransaction(async (tx) => {
			const urls = Array.isArray(input.url) ? input.url : [input.url];
			const subscription = await tx
				.selectFrom('Subscription')
				.selectAll()
				.innerJoin('Feed', 'Subscription.feedId', 'Feed.id')
				.where('Feed.feedUrl', 'in', urls)
				.where('Subscription.userId', '=', useUser().id)
				.executeTakeFirst();

			return subscription;
		}),
);
