import { z } from 'zod';

import { db, values } from '$lib/db';
import { booleanNumberSchema } from '$lib/schemas/inputs/helpers';

import type { GetCtx } from '../types';

const batchEntries = z.object({
	entries: z.array(z.coerce.number()),
	id: z.never(),
});

const idSchema = z.object({
	id: z.coerce.number(),
});

export const saveInteractionSchema = z
	.object({
		entryId: z.coerce.number().int().or(z.array(z.coerce.number())).optional(),
		finished: z.coerce.date().nullish(),
		id: z.coerce.number().int().optional(),
		is_read: booleanNumberSchema.optional(),
		last_viewed: z.coerce.date().optional(),
		progress: z.coerce
			.number()
			.min(0)
			.transform((n) => Math.min(n, 1))
			.nullish(),
		seen: booleanNumberSchema.optional(),
	})
	.refine((v) => v.entryId || v.id, 'Must provide either entryId or id');

export async function saveInteraction({
	ctx,
	input,
}: GetCtx<typeof saveInteractionSchema>) {
	if (input.id) {
		const { entryId, id, ...restInput } = input;
		await db
			.updateTable('EntryInteraction')
			.where('id', '=', input.id)
			.where('userId', '=', ctx.userId)
			.set({
				...restInput,
			})
			.execute();
		return {
			id,
		};
	} else if (input.entryId) {
		const { entryId, ...restInput } = input;
		const entryIds = Array.isArray(entryId) ? entryId : [entryId];
		const result = await db
			.insertInto('EntryInteraction')
			.values(
				entryIds.map((entryId) => ({
					...restInput,
					entryId,
					updatedAt: new Date(),
					userId: ctx.userId,
				})),
			)
			.onDuplicateKeyUpdate(({ ref }) => ({
				finished: values(ref('finished')),
				is_read: values(ref('is_read')),
				last_viewed: values(ref('last_viewed')),
				progress: values(ref('progress')),
				seen: values(ref('seen')),
				updatedAt: new Date(),
			}))
			.executeTakeFirst();
		return {
			id: Number(result.insertId),
		};
	} else {
		throw new Error('Must provide entryId or id');
	}
}
