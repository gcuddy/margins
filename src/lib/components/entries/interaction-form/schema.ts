import { entryIdAndTypeSchema } from '$lib/schemas/inputs/entry.schema';
import { types } from '$lib/types';
import type { Interaction } from '@prisma/client';
import { z } from 'zod';

const entryIdOrEntry = z.union([
	z.object({
		entryId: z.number().int(),
	}),
	z.object({
		entry: entryIdAndTypeSchema,
	}),
]);

export const baseInteractionSchema = z.object({
	finished: z.coerce
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.default(() => new Date().toISOString().slice(0, 10)),
	id: z.number().int(),
	note: z.string(),
	progress: z.number().min(0).max(1),
	rating: z.number().min(0).max(5),
	revisit: z.coerce.boolean(),
	started: z.coerce.date(),
	title: z.string(),
});

export const interactionSchema = baseInteractionSchema
	.partial()
	.and(entryIdOrEntry);

export const interactionLogInputSchema = baseInteractionSchema
	.pick({
		finished: true,
		note: true,
		rating: true,
		revisit: true,
		started: true,
		title: true,
		progress: true,
		id: true,
	})
	.partial()
	.extend({
		entryId: z.number().or(z.string()),
		// type modified ^^ entryid to be id of type
		type: z.enum(types),
	});

export type InteractionLogInputSchema = typeof interactionLogInputSchema;

export type InteractionLogInput = z.infer<typeof interactionLogInputSchema>;
