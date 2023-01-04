import { z } from 'zod';
import { AnnotationCreateManyBookmarkInputObjectSchema } from './AnnotationCreateManyBookmarkInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationCreateManyBookmarkInputEnvelope> = z
	.object({
		data: z.lazy(() => AnnotationCreateManyBookmarkInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const AnnotationCreateManyBookmarkInputEnvelopeObjectSchema = Schema;
