import { z } from 'zod';
import { EntryWhereInputObjectSchema } from './EntryWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryRelationFilter> = z
	.object({
		is: z
			.lazy(() => EntryWhereInputObjectSchema)
			.optional()
			.nullable(),
		isNot: z
			.lazy(() => EntryWhereInputObjectSchema)
			.optional()
			.nullable(),
	})
	.strict();

export const EntryRelationFilterObjectSchema = Schema;
