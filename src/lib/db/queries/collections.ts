import { z } from 'zod';

import { db } from '$lib/db';
import type { collectionsInputSchema } from '$lib/schemas/inputs';

import type { GetCtx } from '../types';
import { applyFilter } from '../utils/comparators';

// TODO figure out if schemas should be colocated or in their own folder

export async function collections({
	ctx,
	input,
}: GetCtx<typeof collectionsInputSchema>) {
	const take = 50;
	let query = db
		.selectFrom('Collection')
		.where('userId', '=', ctx.userId)
		.orderBy('updatedAt', 'asc')
		.orderBy('createdAt', 'asc')
		.limit(take + 1)
		.selectAll();
	if (input.filter) {
		const filter = input.filter;
		query = query.where((eb) => {
			// Desired API:
			// applyFilter(eb, input.filter)
			const f = applyFilter(eb, filter);
			return f;
		});
	}
	if (input.cursor) {
		const cursor = input.cursor;
		query = query.where((eb) =>
			eb.or([
				eb('updatedAt', '>', cursor),
				eb.and([eb('updatedAt', '=', cursor), eb('createdAt', '>', cursor)]),
			]),
		);
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
		hasNextPage,
		nextCursor,
	};
}

export const collectionUpdateInputSchema = z.object({
	bgColor: z.string().nullable(),
	color: z.string().nullable(),
	description: z.string().nullable(),
	font: z.string().nullable(),
	icon: z.string().nullable(),
	name: z.string(),
	private: z.number(),
	// TODO: icon and color
});

export const collectionUpdateSchema = z.object({
	data: collectionUpdateInputSchema.partial(),
	id: z.number(),
});

export async function collectionUpdate({
	ctx,
	input,
}: GetCtx<typeof collectionUpdateSchema>) {
	await db
		.updateTable('Collection')
		.where('id', '=', input.id)
		.where('userId', '=', ctx.userId)
		.set(input.data)
		.execute();
}
