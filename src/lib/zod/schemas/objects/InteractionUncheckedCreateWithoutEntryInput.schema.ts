import { z } from 'zod';
import { BookmarkUncheckedCreateNestedOneWithoutInteractionInputObjectSchema } from './BookmarkUncheckedCreateNestedOneWithoutInteractionInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionUncheckedCreateWithoutEntryInput> = z
	.object({
		id: z.number().optional(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		is_read: z.boolean().optional().nullable(),
		progress: z.number().optional().nullable(),
		finished: z.boolean().optional().nullable(),
		userId: z.string(),
		bookmark: z
			.lazy(() => BookmarkUncheckedCreateNestedOneWithoutInteractionInputObjectSchema)
			.optional(),
		last_viewed: z.date().optional(),
		last_annotated: z.date().optional(),
		last_interaction: z.date().optional(),
	})
	.strict();

export const InteractionUncheckedCreateWithoutEntryInputObjectSchema = Schema;
