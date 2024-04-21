import { zod } from '../utils/zod.js';
import { useUser } from '../user.js';
import { useTransaction } from '../utils/transaction.js';
import { z } from 'zod';
import type { Insertable } from 'kysely';
import type { Annotation } from '@margins/db/kysely/types';

export const Schema = z
	.object({
		body: z.string(),
		entryId: z.string(),
		id: z.string(),
	})
	.passthrough() satisfies z.ZodType<Insertable<Annotation>>;

export const create = zod(Schema, async (input) => {
	return useTransaction(async (db) => {
		await db
			.insertInto('Annotation')
			.values({
				...input,
				userId: useUser().id,
			})
			.executeTakeFirst();
	});
});

export const fromEntryId = zod(
	z.object({
		// forUser: z.coerce.boolean().optional().default(true),
		id: z.string(),
	}),
	async ({ id }) => {
		return useTransaction(async (tx) => {
			return tx
				.selectFrom('Annotation')
				.selectAll()
				.where('entryId', '=', id)
				.where('userId', '=', useUser().id)
				.execute();
		});
	},
);
