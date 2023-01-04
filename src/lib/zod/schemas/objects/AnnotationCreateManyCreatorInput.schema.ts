import { z } from 'zod';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { AnnotationTypeSchema } from '../enums/AnnotationType.schema';

import type { Prisma } from '@prisma/client';

const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(jsonSchema.nullable())])
);

const Schema: z.ZodType<Prisma.AnnotationCreateManyCreatorInput> = z
	.object({
		id: z.number().optional(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		body: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		type: z.lazy(() => AnnotationTypeSchema),
		private: z.boolean().optional(),
		target: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		entryId: z.number().optional().nullable(),
		parentId: z.number().optional().nullable(),
		deleted: z.date().optional().nullable(),
		sortOrder: z.number().optional(),
		bookmarkId: z.number().optional().nullable(),
	})
	.strict();

export const AnnotationCreateManyCreatorInputObjectSchema = Schema;
