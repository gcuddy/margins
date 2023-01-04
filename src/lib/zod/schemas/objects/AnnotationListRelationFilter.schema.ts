import { z } from 'zod';
import { AnnotationWhereInputObjectSchema } from './AnnotationWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationListRelationFilter> = z
	.object({
		every: z.lazy(() => AnnotationWhereInputObjectSchema).optional(),
		some: z.lazy(() => AnnotationWhereInputObjectSchema).optional(),
		none: z.lazy(() => AnnotationWhereInputObjectSchema).optional(),
	})
	.strict();

export const AnnotationListRelationFilterObjectSchema = Schema;
