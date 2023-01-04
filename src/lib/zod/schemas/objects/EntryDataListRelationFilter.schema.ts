import { z } from 'zod';
import { EntryDataWhereInputObjectSchema } from './EntryDataWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryDataListRelationFilter> = z
	.object({
		every: z.lazy(() => EntryDataWhereInputObjectSchema).optional(),
		some: z.lazy(() => EntryDataWhereInputObjectSchema).optional(),
		none: z.lazy(() => EntryDataWhereInputObjectSchema).optional(),
	})
	.strict();

export const EntryDataListRelationFilterObjectSchema = Schema;
