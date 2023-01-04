import { z } from 'zod';
import { InteractionWhereInputObjectSchema } from './InteractionWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionListRelationFilter> = z
	.object({
		every: z.lazy(() => InteractionWhereInputObjectSchema).optional(),
		some: z.lazy(() => InteractionWhereInputObjectSchema).optional(),
		none: z.lazy(() => InteractionWhereInputObjectSchema).optional(),
	})
	.strict();

export const InteractionListRelationFilterObjectSchema = Schema;
