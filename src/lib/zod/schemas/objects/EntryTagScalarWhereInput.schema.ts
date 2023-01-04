import { z } from 'zod';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagScalarWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => EntryTagScalarWhereInputObjectSchema),
				z.lazy(() => EntryTagScalarWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => EntryTagScalarWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => EntryTagScalarWhereInputObjectSchema),
				z.lazy(() => EntryTagScalarWhereInputObjectSchema).array(),
			])
			.optional(),
		createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		tagId: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		entryId: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
	})
	.strict();

export const EntryTagScalarWhereInputObjectSchema = Schema;
