import { z } from 'zod';
import { EntryCreateNestedOneWithoutInteractionsInputObjectSchema } from './EntryCreateNestedOneWithoutInteractionsInput.schema';
import { UserCreateNestedOneWithoutInteractionsInputObjectSchema } from './UserCreateNestedOneWithoutInteractionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionCreateWithoutBookmarkInput> = z
	.object({
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		is_read: z.boolean().optional().nullable(),
		progress: z.number().optional().nullable(),
		finished: z.boolean().optional().nullable(),
		entry: z.lazy(() => EntryCreateNestedOneWithoutInteractionsInputObjectSchema),
		user: z.lazy(() => UserCreateNestedOneWithoutInteractionsInputObjectSchema),
		last_viewed: z.date().optional(),
		last_annotated: z.date().optional(),
		last_interaction: z.date().optional(),
	})
	.strict();

export const InteractionCreateWithoutBookmarkInputObjectSchema = Schema;
