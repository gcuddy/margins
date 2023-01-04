import { z } from 'zod';
import { TaggingCreateManyAnnotationInputObjectSchema } from './TaggingCreateManyAnnotationInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingCreateManyAnnotationInputEnvelope> = z
	.object({
		data: z.lazy(() => TaggingCreateManyAnnotationInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const TaggingCreateManyAnnotationInputEnvelopeObjectSchema = Schema;
