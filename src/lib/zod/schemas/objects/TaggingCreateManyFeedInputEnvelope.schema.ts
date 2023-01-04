import { z } from 'zod';
import { TaggingCreateManyFeedInputObjectSchema } from './TaggingCreateManyFeedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingCreateManyFeedInputEnvelope> = z
	.object({
		data: z.lazy(() => TaggingCreateManyFeedInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const TaggingCreateManyFeedInputEnvelopeObjectSchema = Schema;
