import { z } from 'zod';
import { FeedWhereInputObjectSchema } from './FeedWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedRelationFilter> = z
	.object({
		is: z
			.lazy(() => FeedWhereInputObjectSchema)
			.optional()
			.nullable(),
		isNot: z
			.lazy(() => FeedWhereInputObjectSchema)
			.optional()
			.nullable(),
	})
	.strict();

export const FeedRelationFilterObjectSchema = Schema;
