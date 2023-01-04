import { z } from 'zod';
import { LocationSchema } from '../enums/Location.schema';
import { DocumentTypeSchema } from '../enums/DocumentType.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';

import type { Prisma } from '@prisma/client';

const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(jsonSchema.nullable())])
);

const Schema: z.ZodType<Prisma.EntryCreateManyFeedInput> = z
	.object({
		createdAt: z.date().optional(),
		author: z.string().optional().nullable(),
		location: z
			.lazy(() => LocationSchema)
			.optional()
			.nullable(),
		title: z.string().optional().nullable(),
		type: z.lazy(() => DocumentTypeSchema).optional(),
		updatedAt: z.date().optional(),
		id: z.number().optional(),
		uri: z.string().optional().nullable(),
		html: z.string().optional().nullable(),
		text: z.string().optional().nullable(),
		image: z.string().optional().nullable(),
		guid: z.string().optional().nullable(),
		original: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		wordCount: z.number().optional().nullable(),
		siteName: z.string().optional().nullable(),
		summary: z.string().optional().nullable(),
		media: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		published: z.date().optional().nullable(),
		updated: z.date().optional().nullable(),
	})
	.strict();

export const EntryCreateManyFeedInputObjectSchema = Schema;
