import { z } from 'zod';
import { IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { JsonWithAggregatesFilterObjectSchema } from './JsonWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SmartListScalarWhereWithAggregatesInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => SmartListScalarWhereWithAggregatesInputObjectSchema),
				z.lazy(() => SmartListScalarWhereWithAggregatesInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => SmartListScalarWhereWithAggregatesInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => SmartListScalarWhereWithAggregatesInputObjectSchema),
				z.lazy(() => SmartListScalarWhereWithAggregatesInputObjectSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number()]).optional(),
		name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
		filter: z.lazy(() => JsonWithAggregatesFilterObjectSchema).optional(),
		viewOptions: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
	})
	.strict();

export const SmartListScalarWhereWithAggregatesInputObjectSchema = Schema;
