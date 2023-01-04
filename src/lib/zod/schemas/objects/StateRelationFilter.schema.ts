import { z } from 'zod';
import { StateWhereInputObjectSchema } from './StateWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateRelationFilter> = z
	.object({
		is: z
			.lazy(() => StateWhereInputObjectSchema)
			.optional()
			.nullable(),
		isNot: z
			.lazy(() => StateWhereInputObjectSchema)
			.optional()
			.nullable(),
	})
	.strict();

export const StateRelationFilterObjectSchema = Schema;
