import type { Interaction } from '@prisma/client';
import { z } from 'zod';

export const interactionSchema = z.object({
	entryId: z.number().int(),
	finished: z.coerce
		.date()
		.or(z.string().datetime())
		.default(() => new Date().toISOString().slice(0, 10))
		.transform((v) => new Date(v)),
	id: z.number().int(),
	note: z.string(),
	progress: z.number().min(0).max(1),
	rating: z.number().min(0).max(5),
	revisit: z.coerce.boolean().transform((v) => +v),
	started: z.coerce.date(),
	title: z.string(),
});

export const interactionLogInputSchema = interactionSchema
	.pick({
		entryId: true,
		finished: true,
		note: true,
		rating: true,
		revisit: true,
		started: true,
		title: true,
	})
	.partial()
	.required({
		entryId: true,
	});

export type InteractionLogInputSchema = typeof interactionLogInputSchema;

export type InteractionLogInput = z.infer<typeof interactionLogInputSchema>;
