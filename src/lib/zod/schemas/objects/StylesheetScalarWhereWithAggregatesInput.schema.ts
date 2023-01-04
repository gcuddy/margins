import { z } from 'zod';
import { IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { IntNullableWithAggregatesFilterObjectSchema } from './IntNullableWithAggregatesFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetScalarWhereWithAggregatesInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => StylesheetScalarWhereWithAggregatesInputObjectSchema),
				z.lazy(() => StylesheetScalarWhereWithAggregatesInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => StylesheetScalarWhereWithAggregatesInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => StylesheetScalarWhereWithAggregatesInputObjectSchema),
				z.lazy(() => StylesheetScalarWhereWithAggregatesInputObjectSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number()]).optional(),
		domain: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
		css: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
		userEntryId: z
			.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		userId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
	})
	.strict();

export const StylesheetScalarWhereWithAggregatesInputObjectSchema = Schema;
