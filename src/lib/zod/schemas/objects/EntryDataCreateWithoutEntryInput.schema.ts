import { z } from 'zod';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { EntryMediaCreateNestedManyWithoutDocumentDataInputObjectSchema } from './EntryMediaCreateNestedManyWithoutDocumentDataInput.schema';
import { UserCreateNestedOneWithoutDocumentDataInputObjectSchema } from './UserCreateNestedOneWithoutDocumentDataInput.schema';

import type { Prisma } from '@prisma/client';

const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(jsonSchema.nullable())])
);

const Schema: z.ZodType<Prisma.EntryDataCreateWithoutEntryInput> = z
	.object({
		html: z.string().optional().nullable(),
		text: z.string().optional().nullable(),
		custom: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		image: z.string().optional().nullable(),
		wordCount: z.number().optional().nullable(),
		summary: z.string().optional().nullable(),
		media: z.lazy(() => EntryMediaCreateNestedManyWithoutDocumentDataInputObjectSchema).optional(),
		data: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		published: z.date().optional().nullable(),
		updated: z.date().optional().nullable(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		user: z.lazy(() => UserCreateNestedOneWithoutDocumentDataInputObjectSchema),
	})
	.strict();

export const EntryDataCreateWithoutEntryInputObjectSchema = Schema;
