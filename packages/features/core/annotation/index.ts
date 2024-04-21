import { zod } from '../utils/zod.js';
import { useUser } from '../user.js';
import { useTransaction } from '../utils/transaction.js';
import { z } from 'zod';
import type { InferResult, Insertable } from 'kysely';
import type { Annotation } from '@margins/db/kysely/types';
import { TargetSchema } from '@margins/annotator/schema';
import { type DB, json } from '@margins/db';
import { AnnotationType } from '@margins/db/kysely/enums';

function $selectAnnotation(db: DB) {
	return db
		.selectFrom('Annotation')
		.selectAll()
		.$narrowType<{
			target: TargetSchema;
		}>()
		.compile();
}

export type Item = InferResult<
	Awaited<ReturnType<typeof $selectAnnotation>>
>[number];

export const Schema = z
	.object({
		body: z.string().optional(),
		entryId: z.string(),
		id: z.string(),
		target: TargetSchema.optional(),
		type: z.nativeEnum(AnnotationType).optional(),
	})
	.passthrough() satisfies z.ZodType<Insertable<Annotation>>;

export const create = zod(Schema, async (input) => {
	return useTransaction(async (db) => {
		const { target, ...annotation } = input;
		await db
			.insertInto('Annotation')
			.values({
				...annotation,
				target: target ? json(target) : undefined,
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
				.$narrowType<{
					target: TargetSchema;
				}>()
				.where('entryId', '=', id)
				.where('userId', '=', useUser().id)
				.execute();
		});
	},
);
