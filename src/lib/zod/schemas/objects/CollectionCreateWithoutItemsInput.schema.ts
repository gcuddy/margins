import { z } from 'zod';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { UserCreateNestedOneWithoutCollectionsInputObjectSchema } from './UserCreateNestedOneWithoutCollectionsInput.schema';

import type { Prisma } from '@prisma/client';

const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(jsonSchema.nullable())])
);

const Schema: z.ZodType<Prisma.CollectionCreateWithoutItemsInput> = z
	.object({
		name: z.string(),
		private: z.boolean().optional(),
		icon: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		user: z.lazy(() => UserCreateNestedOneWithoutCollectionsInputObjectSchema),
		description: z.string().optional().nullable(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
	})
	.strict();

export const CollectionCreateWithoutItemsInputObjectSchema = Schema;
