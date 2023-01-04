import { z } from 'zod';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';

import type { Prisma } from '@prisma/client';

const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(jsonSchema.nullable())])
);

const Schema: z.ZodType<Prisma.BookmarkCreateManyEntryInput> = z
	.object({
		id: z.number().optional(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		context: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		userId: z.string(),
		sortOrder: z.number().optional().nullable(),
		is_read: z.boolean().optional(),
		progress: z.number().optional(),
		data: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		stateId: z.number().optional().nullable(),
		private: z.boolean().optional(),
		interactionId: z.number().optional().nullable(),
		favoriteId: z.number().optional().nullable(),
		deleted: z.date().optional().nullable(),
	})
	.strict();

export const BookmarkCreateManyEntryInputObjectSchema = Schema;
