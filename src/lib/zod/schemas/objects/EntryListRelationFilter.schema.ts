import { z } from 'zod';
import { EntryWhereInputObjectSchema } from './EntryWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryListRelationFilter> = z
	.object({
		every: z.lazy(() => EntryWhereInputObjectSchema).optional(),
		some: z.lazy(() => EntryWhereInputObjectSchema).optional(),
		none: z.lazy(() => EntryWhereInputObjectSchema).optional(),
	})
	.strict();

export const EntryListRelationFilterObjectSchema = Schema;
