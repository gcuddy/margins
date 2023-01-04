import { z } from 'zod';
import { IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { IntNullableWithAggregatesFilterObjectSchema } from './IntNullableWithAggregatesFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaScalarWhereWithAggregatesInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => EntryMediaScalarWhereWithAggregatesInputObjectSchema),
				z.lazy(() => EntryMediaScalarWhereWithAggregatesInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => EntryMediaScalarWhereWithAggregatesInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => EntryMediaScalarWhereWithAggregatesInputObjectSchema),
				z.lazy(() => EntryMediaScalarWhereWithAggregatesInputObjectSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number()]).optional(),
		url: z
			.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		size: z
			.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		duration: z
			.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		type: z
			.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		title: z
			.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		documentDataId: z
			.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number()])
			.optional(),
		entryId: z
			.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
	})
	.strict();

export const EntryMediaScalarWhereWithAggregatesInputObjectSchema = Schema;
