import { z } from 'zod';
import { AnnotationWhereInputObjectSchema } from './AnnotationWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationRelationFilter> = z
	.object({
		is: z
			.lazy(() => AnnotationWhereInputObjectSchema)
			.optional()
			.nullable(),
		isNot: z
			.lazy(() => AnnotationWhereInputObjectSchema)
			.optional()
			.nullable(),
	})
	.strict();

export const AnnotationRelationFilterObjectSchema = Schema;
