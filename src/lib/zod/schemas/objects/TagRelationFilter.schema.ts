import { z } from 'zod';
import { TagWhereInputObjectSchema } from './TagWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagRelationFilter> = z
	.object({
		is: z
			.lazy(() => TagWhereInputObjectSchema)
			.optional()
			.nullable(),
		isNot: z
			.lazy(() => TagWhereInputObjectSchema)
			.optional()
			.nullable(),
	})
	.strict();

export const TagRelationFilterObjectSchema = Schema;
