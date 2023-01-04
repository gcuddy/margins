import { z } from 'zod';
import { FavoriteFolderWhereInputObjectSchema } from './FavoriteFolderWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteFolderListRelationFilter> = z
	.object({
		every: z.lazy(() => FavoriteFolderWhereInputObjectSchema).optional(),
		some: z.lazy(() => FavoriteFolderWhereInputObjectSchema).optional(),
		none: z.lazy(() => FavoriteFolderWhereInputObjectSchema).optional(),
	})
	.strict();

export const FavoriteFolderListRelationFilterObjectSchema = Schema;
