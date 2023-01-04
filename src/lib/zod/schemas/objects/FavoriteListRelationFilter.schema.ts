import { z } from 'zod';
import { FavoriteWhereInputObjectSchema } from './FavoriteWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteListRelationFilter> = z
	.object({
		every: z.lazy(() => FavoriteWhereInputObjectSchema).optional(),
		some: z.lazy(() => FavoriteWhereInputObjectSchema).optional(),
		none: z.lazy(() => FavoriteWhereInputObjectSchema).optional(),
	})
	.strict();

export const FavoriteListRelationFilterObjectSchema = Schema;
