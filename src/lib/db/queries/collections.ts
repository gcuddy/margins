import { z } from 'zod';

import { db } from '$lib/db';
import type { collectionsInputSchema } from '$lib/schemas/inputs';

import type { GetCtx } from '../types';
import { applyFilter } from '../utils/comparators';
import { collectionItemWidthSchema } from '$lib/schemas/inputs/collection.schema';
import { nameSchema } from '$lib/schemas';
import { query } from '$lib/server/utils';
import {
	add_to_collection,
	baseAddToCollectionInput,
	s_add_to_collection,
} from '$lib/queries/server';

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
	defaultItemWidth: collectionItemWidthSchema.nullable(),
	deleted: z.coerce.date().nullable(),
	description: z.string().nullable(),
	font: z.string().nullable(),
	icon: z.string().nullable(),
	name: z.string(),
	private: z.coerce.number(),
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

const collectionCreateInput = z.object({
	name: z.string(),
	items: baseAddToCollectionInput
		.omit({
			collectionId: true,
			width: true,
		})
		.optional(),
});

export type CollectionCreateInput = z.infer<typeof collectionCreateInput>;

export async function collectionCreate({
	ctx,
	input,
}: GetCtx<typeof collectionCreateInput>) {
	const { name, items } = input;

	// todo: wrap in transaction?
	const collection = await db
		.insertInto('Collection')
		.values({ name, updatedAt: new Date(), userId: ctx.userId })
		.executeTakeFirst();
	const id = Number(collection.insertId);

	if (items) {
		// then add items
		await add_to_collection({
			collectionId: id,
			...items,
			userId: ctx.userId,
		});
	}

	return {
		id,
	};
}

export const collectionCreateMutation = query({
	schema: collectionCreateInput,
	fn: collectionCreate,
});
