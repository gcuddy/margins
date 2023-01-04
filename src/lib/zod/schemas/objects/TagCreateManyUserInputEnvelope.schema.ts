import { z } from 'zod';
import { TagCreateManyUserInputObjectSchema } from './TagCreateManyUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagCreateManyUserInputEnvelope> = z
	.object({
		data: z.lazy(() => TagCreateManyUserInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const TagCreateManyUserInputEnvelopeObjectSchema = Schema;
