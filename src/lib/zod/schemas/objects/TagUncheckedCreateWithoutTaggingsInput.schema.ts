import { z } from 'zod';
import { FavoriteUncheckedCreateNestedOneWithoutTagInputObjectSchema } from './FavoriteUncheckedCreateNestedOneWithoutTagInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { EntryTagUncheckedCreateNestedManyWithoutTagInputObjectSchema } from './EntryTagUncheckedCreateNestedManyWithoutTagInput.schema';
import { EntryUncheckedCreateNestedManyWithoutTagsInputObjectSchema } from './EntryUncheckedCreateNestedManyWithoutTagsInput.schema';

import type { Prisma } from '@prisma/client';

const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(jsonSchema.nullable())])
);

const Schema: z.ZodType<Prisma.TagUncheckedCreateWithoutTaggingsInput> = z
	.object({
		id: z.number().optional(),
		name: z.string(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		favorite: z.lazy(() => FavoriteUncheckedCreateNestedOneWithoutTagInputObjectSchema).optional(),
		viewOptions: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		userId: z.string(),
		entryTags: z
			.lazy(() => EntryTagUncheckedCreateNestedManyWithoutTagInputObjectSchema)
			.optional(),
		entries: z.lazy(() => EntryUncheckedCreateNestedManyWithoutTagsInputObjectSchema).optional(),
	})
	.strict();

export const TagUncheckedCreateWithoutTaggingsInputObjectSchema = Schema;
