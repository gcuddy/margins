import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionAvgAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		progress: z.literal(true).optional(),
		entryId: z.literal(true).optional(),
	})
	.strict();

export const InteractionAvgAggregateInputObjectSchema = Schema;
