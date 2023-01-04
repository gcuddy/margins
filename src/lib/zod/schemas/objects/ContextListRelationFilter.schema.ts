import { z } from 'zod';
import { ContextWhereInputObjectSchema } from './ContextWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextListRelationFilter> = z
	.object({
		every: z.lazy(() => ContextWhereInputObjectSchema).optional(),
		some: z.lazy(() => ContextWhereInputObjectSchema).optional(),
		none: z.lazy(() => ContextWhereInputObjectSchema).optional(),
	})
	.strict();

export const ContextListRelationFilterObjectSchema = Schema;
