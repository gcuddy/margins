import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionCreateManyFeedInput> = z
	.object({
		id: z.number().optional(),
		userId: z.string(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		title: z.string(),
		download_full: z.boolean().optional(),
	})
	.strict();

export const SubscriptionCreateManyFeedInputObjectSchema = Schema;
