import { db } from '$lib/db';
import type { DB } from '$lib/prisma/kysely/types';
import type { collectionsInputSchema } from '$lib/schemas/inputs';
import type { stringComparatorSchema } from '$lib/schemas/inputs/comparators';
import type { Ctx, GetCtx } from '../types';
import { applyFilter, generateComparatorClause } from '../utils/comparators';

// TODO figure out if schemas should be colocated or in their own folder

export async function collections({ ctx, input }: GetCtx<typeof collectionsInputSchema>) {
	const take = 50;
	let query = db
		.selectFrom('Collection')
		.where('userId', '=', ctx.userId)
		.orderBy('updatedAt', 'asc')
		.limit(take + 1)
		.selectAll();
	if (input.filter) {
		const filter = input.filter;
		query = query.where((eb) => {
			// Desired API:
			// applyFilter(eb, input.filter)
			console.time(`applying filter`);
			const f = applyFilter(eb, filter);
			console.timeEnd(`applying filter`);
			return f;
		});
	}

	let nextCursor: typeof input.cursor = null;
	const collections = await query.execute();
	const hasNextPage = collections.length > take;
	if (hasNextPage) {
		const nextItem = collections.pop();
		if (nextItem) {
			nextCursor = nextItem.updatedAt;
		}
	}
	return {
		collections,
		nextCursor,
		hasNextPage
	};
}
