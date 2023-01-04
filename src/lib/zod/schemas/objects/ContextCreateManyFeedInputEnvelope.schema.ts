import { z } from 'zod';
import { ContextCreateManyFeedInputObjectSchema } from './ContextCreateManyFeedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextCreateManyFeedInputEnvelope> = z
	.object({
		data: z.lazy(() => ContextCreateManyFeedInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const ContextCreateManyFeedInputEnvelopeObjectSchema = Schema;
