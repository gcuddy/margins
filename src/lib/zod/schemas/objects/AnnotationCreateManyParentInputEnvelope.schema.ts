import { z } from 'zod';
import { AnnotationCreateManyParentInputObjectSchema } from './AnnotationCreateManyParentInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationCreateManyParentInputEnvelope> = z
	.object({
		data: z.lazy(() => AnnotationCreateManyParentInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const AnnotationCreateManyParentInputEnvelopeObjectSchema = Schema;
