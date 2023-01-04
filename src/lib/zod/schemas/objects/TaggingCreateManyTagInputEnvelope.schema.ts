import { z } from 'zod';
import { TaggingCreateManyTagInputObjectSchema } from './TaggingCreateManyTagInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingCreateManyTagInputEnvelope> = z
	.object({
		data: z.lazy(() => TaggingCreateManyTagInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const TaggingCreateManyTagInputEnvelopeObjectSchema = Schema;
