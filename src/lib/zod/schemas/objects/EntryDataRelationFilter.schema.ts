import { z } from 'zod';
import { EntryDataWhereInputObjectSchema } from './EntryDataWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryDataRelationFilter> = z
	.object({
		is: z.lazy(() => EntryDataWhereInputObjectSchema).optional(),
		isNot: z.lazy(() => EntryDataWhereInputObjectSchema).optional(),
	})
	.strict();

export const EntryDataRelationFilterObjectSchema = Schema;
