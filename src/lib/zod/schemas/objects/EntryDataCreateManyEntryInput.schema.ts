import { z } from 'zod';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';

import type { Prisma } from '@prisma/client';

const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(jsonSchema.nullable())])
);

const Schema: z.ZodType<Prisma.EntryDataCreateManyEntryInput> = z
	.object({
		id: z.number().optional(),
		html: z.string().optional().nullable(),
		text: z.string().optional().nullable(),
		custom: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		image: z.string().optional().nullable(),
		wordCount: z.number().optional().nullable(),
		summary: z.string().optional().nullable(),
		data: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		published: z.date().optional().nullable(),
		updated: z.date().optional().nullable(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		userId: z.string(),
	})
	.strict();

export const EntryDataCreateManyEntryInputObjectSchema = Schema;
