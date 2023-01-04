import { z } from 'zod';
import { EntryMediaWhereInputObjectSchema } from './EntryMediaWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaListRelationFilter> = z
	.object({
		every: z.lazy(() => EntryMediaWhereInputObjectSchema).optional(),
		some: z.lazy(() => EntryMediaWhereInputObjectSchema).optional(),
		none: z.lazy(() => EntryMediaWhereInputObjectSchema).optional(),
	})
	.strict();

export const EntryMediaListRelationFilterObjectSchema = Schema;
