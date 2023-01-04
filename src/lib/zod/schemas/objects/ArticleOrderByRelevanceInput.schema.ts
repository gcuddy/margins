import { z } from 'zod';
import { ArticleOrderByRelevanceFieldEnumSchema } from '../enums/ArticleOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ArticleOrderByRelevanceInput> = z
	.object({
		fields: z.union([
			z.lazy(() => ArticleOrderByRelevanceFieldEnumSchema),
			z.lazy(() => ArticleOrderByRelevanceFieldEnumSchema).array(),
		]),
		sort: z.lazy(() => SortOrderSchema),
		search: z.string(),
	})
	.strict();

export const ArticleOrderByRelevanceInputObjectSchema = Schema;
