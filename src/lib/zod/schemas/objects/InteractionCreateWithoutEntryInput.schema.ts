import { z } from 'zod';
import { UserCreateNestedOneWithoutInteractionsInputObjectSchema } from './UserCreateNestedOneWithoutInteractionsInput.schema';
import { BookmarkCreateNestedOneWithoutInteractionInputObjectSchema } from './BookmarkCreateNestedOneWithoutInteractionInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionCreateWithoutEntryInput> = z
	.object({
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		is_read: z.boolean().optional().nullable(),
		progress: z.number().optional().nullable(),
		finished: z.boolean().optional().nullable(),
		user: z.lazy(() => UserCreateNestedOneWithoutInteractionsInputObjectSchema),
		bookmark: z.lazy(() => BookmarkCreateNestedOneWithoutInteractionInputObjectSchema).optional(),
		last_viewed: z.date().optional(),
		last_annotated: z.date().optional(),
		last_interaction: z.date().optional(),
	})
	.strict();

export const InteractionCreateWithoutEntryInputObjectSchema = Schema;
