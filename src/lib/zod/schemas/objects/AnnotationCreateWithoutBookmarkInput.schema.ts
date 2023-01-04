import { z } from 'zod';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { TaggingCreateNestedManyWithoutAnnotationInputObjectSchema } from './TaggingCreateNestedManyWithoutAnnotationInput.schema';
import { AnnotationTypeSchema } from '../enums/AnnotationType.schema';
import { EntryCreateNestedOneWithoutAnnotationsInputObjectSchema } from './EntryCreateNestedOneWithoutAnnotationsInput.schema';
import { AnnotationCreateNestedOneWithoutChildrenInputObjectSchema } from './AnnotationCreateNestedOneWithoutChildrenInput.schema';
import { AnnotationCreateNestedManyWithoutParentInputObjectSchema } from './AnnotationCreateNestedManyWithoutParentInput.schema';
import { UserCreateNestedOneWithoutAnnotationsInputObjectSchema } from './UserCreateNestedOneWithoutAnnotationsInput.schema';
import { CollectionItemsCreateNestedOneWithoutAnnotationInputObjectSchema } from './CollectionItemsCreateNestedOneWithoutAnnotationInput.schema';
import { FavoriteCreateNestedOneWithoutAnnotationInputObjectSchema } from './FavoriteCreateNestedOneWithoutAnnotationInput.schema';

import type { Prisma } from '@prisma/client';

const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(jsonSchema.nullable())])
);

const Schema: z.ZodType<Prisma.AnnotationCreateWithoutBookmarkInput> = z
	.object({
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		body: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		tags: z.lazy(() => TaggingCreateNestedManyWithoutAnnotationInputObjectSchema).optional(),
		type: z.lazy(() => AnnotationTypeSchema),
		private: z.boolean().optional(),
		target: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		entry: z.lazy(() => EntryCreateNestedOneWithoutAnnotationsInputObjectSchema).optional(),
		parent: z.lazy(() => AnnotationCreateNestedOneWithoutChildrenInputObjectSchema).optional(),
		children: z.lazy(() => AnnotationCreateNestedManyWithoutParentInputObjectSchema).optional(),
		deleted: z.date().optional().nullable(),
		creator: z.lazy(() => UserCreateNestedOneWithoutAnnotationsInputObjectSchema),
		sortOrder: z.number().optional(),
		collections: z
			.lazy(() => CollectionItemsCreateNestedOneWithoutAnnotationInputObjectSchema)
			.optional(),
		favorite: z.lazy(() => FavoriteCreateNestedOneWithoutAnnotationInputObjectSchema).optional(),
	})
	.strict();

export const AnnotationCreateWithoutBookmarkInputObjectSchema = Schema;
