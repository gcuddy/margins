import { z } from 'zod';
import { SubscriptionWhereInputObjectSchema } from './SubscriptionWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionListRelationFilter> = z
	.object({
		every: z.lazy(() => SubscriptionWhereInputObjectSchema).optional(),
		some: z.lazy(() => SubscriptionWhereInputObjectSchema).optional(),
		none: z.lazy(() => SubscriptionWhereInputObjectSchema).optional(),
	})
	.strict();

export const SubscriptionListRelationFilterObjectSchema = Schema;
