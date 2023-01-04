import { z } from 'zod';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { FavoriteUpdateOneWithoutTagNestedInputObjectSchema } from './FavoriteUpdateOneWithoutTagNestedInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { UserUpdateOneRequiredWithoutTagsNestedInputObjectSchema } from './UserUpdateOneRequiredWithoutTagsNestedInput.schema';
import { TaggingUpdateManyWithoutTagNestedInputObjectSchema } from './TaggingUpdateManyWithoutTagNestedInput.schema';
import { EntryUpdateManyWithoutTagsNestedInputObjectSchema } from './EntryUpdateManyWithoutTagsNestedInput.schema';

import type { Prisma } from '@prisma/client';

const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(jsonSchema.nullable())])
);

const Schema: z.ZodType<Prisma.TagUpdateWithoutEntryTagsInput> = z
	.object({
		name: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		createdAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		updatedAt: z
			.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)])
			.optional(),
		favorite: z.lazy(() => FavoriteUpdateOneWithoutTagNestedInputObjectSchema).optional(),
		viewOptions: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		user: z.lazy(() => UserUpdateOneRequiredWithoutTagsNestedInputObjectSchema).optional(),
		taggings: z.lazy(() => TaggingUpdateManyWithoutTagNestedInputObjectSchema).optional(),
		entries: z.lazy(() => EntryUpdateManyWithoutTagsNestedInputObjectSchema).optional(),
	})
	.strict();

export const TagUpdateWithoutEntryTagsInputObjectSchema = Schema;
