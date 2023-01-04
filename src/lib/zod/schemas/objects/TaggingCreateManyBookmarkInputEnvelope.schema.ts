import { z } from 'zod';
import { TaggingCreateManyBookmarkInputObjectSchema } from './TaggingCreateManyBookmarkInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingCreateManyBookmarkInputEnvelope> = z
	.object({
		data: z.lazy(() => TaggingCreateManyBookmarkInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const TaggingCreateManyBookmarkInputEnvelopeObjectSchema = Schema;
