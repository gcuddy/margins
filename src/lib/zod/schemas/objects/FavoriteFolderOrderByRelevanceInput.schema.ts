import { z } from 'zod';
import { FavoriteFolderOrderByRelevanceFieldEnumSchema } from '../enums/FavoriteFolderOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteFolderOrderByRelevanceInput> = z
	.object({
		fields: z.union([
			z.lazy(() => FavoriteFolderOrderByRelevanceFieldEnumSchema),
			z.lazy(() => FavoriteFolderOrderByRelevanceFieldEnumSchema).array(),
		]),
		sort: z.lazy(() => SortOrderSchema),
		search: z.string(),
	})
	.strict();

export const FavoriteFolderOrderByRelevanceInputObjectSchema = Schema;
