import { z } from 'zod';
import { StateWhereInputObjectSchema } from './StateWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateListRelationFilter> = z
	.object({
		every: z.lazy(() => StateWhereInputObjectSchema).optional(),
		some: z.lazy(() => StateWhereInputObjectSchema).optional(),
		none: z.lazy(() => StateWhereInputObjectSchema).optional(),
	})
	.strict();

export const StateListRelationFilterObjectSchema = Schema;
