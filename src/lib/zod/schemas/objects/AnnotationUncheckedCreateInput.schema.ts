import { z } from 'zod';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { TaggingUncheckedCreateNestedManyWithoutAnnotationInputObjectSchema } from './TaggingUncheckedCreateNestedManyWithoutAnnotationInput.schema';
import { AnnotationTypeSchema } from '../enums/AnnotationType.schema';
import { AnnotationUncheckedCreateNestedManyWithoutParentInputObjectSchema } from './AnnotationUncheckedCreateNestedManyWithoutParentInput.schema';
import { CollectionItemsUncheckedCreateNestedOneWithoutAnnotationInputObjectSchema } from './CollectionItemsUncheckedCreateNestedOneWithoutAnnotationInput.schema';
import { FavoriteUncheckedCreateNestedOneWithoutAnnotationInputObjectSchema } from './FavoriteUncheckedCreateNestedOneWithoutAnnotationInput.schema';

import type { Prisma } from '@prisma/client';

const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(jsonSchema.nullable())])
);

const Schema: z.ZodType<Prisma.AnnotationUncheckedCreateInput> = z
	.object({
		id: z.number().optional(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		body: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		tags: z
			.lazy(() => TaggingUncheckedCreateNestedManyWithoutAnnotationInputObjectSchema)
			.optional(),
		type: z.lazy(() => AnnotationTypeSchema),
		private: z.boolean().optional(),
		target: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		entryId: z.number().optional().nullable(),
		parentId: z.number().optional().nullable(),
		children: z
			.lazy(() => AnnotationUncheckedCreateNestedManyWithoutParentInputObjectSchema)
			.optional(),
		deleted: z.date().optional().nullable(),
		userId: z.string(),
		sortOrder: z.number().optional(),
		collections: z
			.lazy(() => CollectionItemsUncheckedCreateNestedOneWithoutAnnotationInputObjectSchema)
			.optional(),
		favorite: z
			.lazy(() => FavoriteUncheckedCreateNestedOneWithoutAnnotationInputObjectSchema)
			.optional(),
		bookmarkId: z.number().optional().nullable(),
	})
	.strict();

export const AnnotationUncheckedCreateInputObjectSchema = Schema;
