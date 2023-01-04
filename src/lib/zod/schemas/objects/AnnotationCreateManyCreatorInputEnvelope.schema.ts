import { z } from 'zod';
import { AnnotationCreateManyCreatorInputObjectSchema } from './AnnotationCreateManyCreatorInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationCreateManyCreatorInputEnvelope> = z
	.object({
		data: z.lazy(() => AnnotationCreateManyCreatorInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const AnnotationCreateManyCreatorInputEnvelopeObjectSchema = Schema;
