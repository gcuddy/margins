import { z } from 'zod';
import { InteractionWhereInputObjectSchema } from './InteractionWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionRelationFilter> = z
	.object({
		is: z
			.lazy(() => InteractionWhereInputObjectSchema)
			.optional()
			.nullable(),
		isNot: z
			.lazy(() => InteractionWhereInputObjectSchema)
			.optional()
			.nullable(),
	})
	.strict();

export const InteractionRelationFilterObjectSchema = Schema;
