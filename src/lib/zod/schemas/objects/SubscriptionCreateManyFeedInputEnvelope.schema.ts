import { z } from 'zod';
import { SubscriptionCreateManyFeedInputObjectSchema } from './SubscriptionCreateManyFeedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionCreateManyFeedInputEnvelope> = z
	.object({
		data: z.lazy(() => SubscriptionCreateManyFeedInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const SubscriptionCreateManyFeedInputEnvelopeObjectSchema = Schema;
