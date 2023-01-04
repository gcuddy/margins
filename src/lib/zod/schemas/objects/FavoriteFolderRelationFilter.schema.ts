import { z } from 'zod';
import { FavoriteFolderWhereInputObjectSchema } from './FavoriteFolderWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteFolderRelationFilter> = z
	.object({
		is: z
			.lazy(() => FavoriteFolderWhereInputObjectSchema)
			.optional()
			.nullable(),
		isNot: z
			.lazy(() => FavoriteFolderWhereInputObjectSchema)
			.optional()
			.nullable(),
	})
	.strict();

export const FavoriteFolderRelationFilterObjectSchema = Schema;
