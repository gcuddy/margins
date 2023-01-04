import { z } from 'zod';
import { EntryCreateManyFeedInputObjectSchema } from './EntryCreateManyFeedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryCreateManyFeedInputEnvelope> = z
	.object({
		data: z.lazy(() => EntryCreateManyFeedInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const EntryCreateManyFeedInputEnvelopeObjectSchema = Schema;
