import { z } from 'zod';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { FavoriteUncheckedCreateNestedOneWithoutSmartListInputObjectSchema } from './FavoriteUncheckedCreateNestedOneWithoutSmartListInput.schema';

import type { Prisma } from '@prisma/client';

const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
	z.union([literalSchema, z.array(jsonSchema.nullable()), z.record(jsonSchema.nullable())])
);

const Schema: z.ZodType<Prisma.SmartListUncheckedCreateInput> = z
	.object({
		id: z.number().optional(),
		name: z.string(),
		filter: z.union([z.lazy(() => JsonNullValueInputSchema), jsonSchema]),
		viewOptions: z.union([z.lazy(() => NullableJsonNullValueInputSchema), jsonSchema]).optional(),
		favorite: z
			.lazy(() => FavoriteUncheckedCreateNestedOneWithoutSmartListInputObjectSchema)
			.optional(),
	})
	.strict();

export const SmartListUncheckedCreateInputObjectSchema = Schema;
