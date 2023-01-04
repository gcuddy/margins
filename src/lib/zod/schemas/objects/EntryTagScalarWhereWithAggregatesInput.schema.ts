import { z } from 'zod';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagScalarWhereWithAggregatesInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => EntryTagScalarWhereWithAggregatesInputObjectSchema),
				z.lazy(() => EntryTagScalarWhereWithAggregatesInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => EntryTagScalarWhereWithAggregatesInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => EntryTagScalarWhereWithAggregatesInputObjectSchema),
				z.lazy(() => EntryTagScalarWhereWithAggregatesInputObjectSchema).array(),
			])
			.optional(),
		createdAt: z
			.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.date()])
			.optional(),
		updatedAt: z
			.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.date()])
			.optional(),
		tagId: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number()]).optional(),
		entryId: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number()]).optional(),
		userId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
	})
	.strict();

export const EntryTagScalarWhereWithAggregatesInputObjectSchema = Schema;
