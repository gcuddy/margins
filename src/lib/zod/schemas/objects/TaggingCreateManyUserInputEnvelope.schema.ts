import { z } from 'zod';
import { TaggingCreateManyUserInputObjectSchema } from './TaggingCreateManyUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingCreateManyUserInputEnvelope> = z
	.object({
		data: z.lazy(() => TaggingCreateManyUserInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const TaggingCreateManyUserInputEnvelopeObjectSchema = Schema;
