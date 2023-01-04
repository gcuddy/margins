import { z } from 'zod';
import { SubscriptionCreateManyUserInputObjectSchema } from './SubscriptionCreateManyUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionCreateManyUserInputEnvelope> = z
	.object({
		data: z.lazy(() => SubscriptionCreateManyUserInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const SubscriptionCreateManyUserInputEnvelopeObjectSchema = Schema;
