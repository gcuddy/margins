import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetCountAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		domain: z.literal(true).optional(),
		css: z.literal(true).optional(),
		userEntryId: z.literal(true).optional(),
		userId: z.literal(true).optional(),
		_all: z.literal(true).optional(),
	})
	.strict();

export const StylesheetCountAggregateInputObjectSchema = Schema;
