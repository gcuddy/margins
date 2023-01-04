import { z } from 'zod';
import { EntryTagWhereInputObjectSchema } from './EntryTagWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagListRelationFilter> = z
	.object({
		every: z.lazy(() => EntryTagWhereInputObjectSchema).optional(),
		some: z.lazy(() => EntryTagWhereInputObjectSchema).optional(),
		none: z.lazy(() => EntryTagWhereInputObjectSchema).optional(),
	})
	.strict();

export const EntryTagListRelationFilterObjectSchema = Schema;
