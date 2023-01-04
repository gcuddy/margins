import { z } from 'zod';
import { FavoriteCreateNestedOneWithoutTagInputObjectSchema } from './FavoriteCreateNestedOneWithoutTagInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { UserCreateNestedOneWithoutTagsInputObjectSchema } from './UserCreateNestedOneWithoutTagsInput.schema';
import { TaggingCreateNestedManyWithoutTagInputObjectSchema } from './TaggingCreateNestedManyWithoutTagInput.schema';
import { EntryTagCreateNestedManyWithoutTagInputObjectSchema } from './EntryTagCreateNestedManyWithoutTagInput.schema';

import type { Prisma } from '@prisma/client';

const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(jsonSchema.nullable())])
);

const Schema: z.ZodType<Prisma.TagCreateWithoutEntriesInput> = z
	.object({
		name: z.string(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		favorite: z.lazy(() => FavoriteCreateNestedOneWithoutTagInputObjectSchema).optional(),
		viewOptions: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		user: z.lazy(() => UserCreateNestedOneWithoutTagsInputObjectSchema),
		taggings: z.lazy(() => TaggingCreateNestedManyWithoutTagInputObjectSchema).optional(),
		entryTags: z.lazy(() => EntryTagCreateNestedManyWithoutTagInputObjectSchema).optional(),
	})
	.strict();

export const TagCreateWithoutEntriesInputObjectSchema = Schema;
