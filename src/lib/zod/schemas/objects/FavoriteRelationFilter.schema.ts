import { z } from 'zod';
import { FavoriteWhereInputObjectSchema } from './FavoriteWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteRelationFilter> = z
	.object({
		is: z
			.lazy(() => FavoriteWhereInputObjectSchema)
			.optional()
			.nullable(),
		isNot: z
			.lazy(() => FavoriteWhereInputObjectSchema)
			.optional()
			.nullable(),
	})
	.strict();

export const FavoriteRelationFilterObjectSchema = Schema;
