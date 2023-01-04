import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetAvgAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		userEntryId: z.literal(true).optional(),
	})
	.strict();

export const StylesheetAvgAggregateInputObjectSchema = Schema;
