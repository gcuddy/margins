import { z } from 'zod';
import { ContextNodeWhereInputObjectSchema } from './ContextNodeWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextNodeListRelationFilter> = z
	.object({
		every: z.lazy(() => ContextNodeWhereInputObjectSchema).optional(),
		some: z.lazy(() => ContextNodeWhereInputObjectSchema).optional(),
		none: z.lazy(() => ContextNodeWhereInputObjectSchema).optional(),
	})
	.strict();

export const ContextNodeListRelationFilterObjectSchema = Schema;
