import { z } from 'zod';
import { AnnotationCreateManyEntryInputObjectSchema } from './AnnotationCreateManyEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationCreateManyEntryInputEnvelope> = z
	.object({
		data: z.lazy(() => AnnotationCreateManyEntryInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const AnnotationCreateManyEntryInputEnvelopeObjectSchema = Schema;
