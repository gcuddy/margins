import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionUserIdFeedIdCompoundUniqueInput> = z
	.object({
		userId: z.string(),
		feedId: z.number(),
	})
	.strict();

export const SubscriptionUserIdFeedIdCompoundUniqueInputObjectSchema = Schema;
