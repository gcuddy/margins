import { z } from 'zod';
import { FavoriteOrderByRelevanceFieldEnumSchema } from '../enums/FavoriteOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteOrderByRelevanceInput> = z
	.object({
		fields: z.union([
			z.lazy(() => FavoriteOrderByRelevanceFieldEnumSchema),
			z.lazy(() => FavoriteOrderByRelevanceFieldEnumSchema).array(),
		]),
		sort: z.lazy(() => SortOrderSchema),
		search: z.string(),
	})
	.strict();

export const FavoriteOrderByRelevanceInputObjectSchema = Schema;
