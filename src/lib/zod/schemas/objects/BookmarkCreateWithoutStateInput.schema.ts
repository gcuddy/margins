import { z } from 'zod';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { EntryCreateNestedOneWithoutBookmarksInputObjectSchema } from './EntryCreateNestedOneWithoutBookmarksInput.schema';
import { UserCreateNestedOneWithoutBookmarksInputObjectSchema } from './UserCreateNestedOneWithoutBookmarksInput.schema';
import { TaggingCreateNestedManyWithoutBookmarkInputObjectSchema } from './TaggingCreateNestedManyWithoutBookmarkInput.schema';
import { CollectionItemsCreateNestedManyWithoutBookmarkInputObjectSchema } from './CollectionItemsCreateNestedManyWithoutBookmarkInput.schema';
import { InteractionCreateNestedOneWithoutBookmarkInputObjectSchema } from './InteractionCreateNestedOneWithoutBookmarkInput.schema';
import { FavoriteCreateNestedOneWithoutBookmarkInputObjectSchema } from './FavoriteCreateNestedOneWithoutBookmarkInput.schema';
import { AnnotationCreateNestedManyWithoutBookmarkInputObjectSchema } from './AnnotationCreateNestedManyWithoutBookmarkInput.schema';

import type { Prisma } from '@prisma/client';

const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(jsonSchema.nullable())])
);

const Schema: z.ZodType<Prisma.BookmarkCreateWithoutStateInput> = z
	.object({
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		context: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		entry: z.lazy(() => EntryCreateNestedOneWithoutBookmarksInputObjectSchema).optional(),
		user: z.lazy(() => UserCreateNestedOneWithoutBookmarksInputObjectSchema),
		sortOrder: z.number().optional().nullable(),
		is_read: z.boolean().optional(),
		progress: z.number().optional(),
		data: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		private: z.boolean().optional(),
		tags: z.lazy(() => TaggingCreateNestedManyWithoutBookmarkInputObjectSchema).optional(),
		collections: z
			.lazy(() => CollectionItemsCreateNestedManyWithoutBookmarkInputObjectSchema)
			.optional(),
		interaction: z
			.lazy(() => InteractionCreateNestedOneWithoutBookmarkInputObjectSchema)
			.optional(),
		favorite: z.lazy(() => FavoriteCreateNestedOneWithoutBookmarkInputObjectSchema).optional(),
		favoriteId: z.number().optional().nullable(),
		annotations: z
			.lazy(() => AnnotationCreateNestedManyWithoutBookmarkInputObjectSchema)
			.optional(),
		deleted: z.date().optional().nullable(),
	})
	.strict();

export const BookmarkCreateWithoutStateInputObjectSchema = Schema;
