import { z } from 'zod';
import { useTransaction } from '../utils/transaction.js';
import { zod } from '../utils/zod.js';

export const Schema = z.object({
	url: z.string(),
});

export const create = zod(Schema, async (input) =>
	useTransaction(async (tx) => {
		await tx
			.insertInto('Feed')
			.ignore()
			.values({
				feedUrl: input.url,
				updatedAt: new Date(),
			})
			.execute();

		const feed = await tx
			.selectFrom('Feed')
			.selectAll()
			.where('feedUrl', '=', input.url)
			.executeTakeFirst();

		return feed!;
	}),
);
