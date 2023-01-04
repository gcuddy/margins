import { z } from 'zod';
import { BookmarkOrderByRelevanceFieldEnumSchema } from '../enums/BookmarkOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkOrderByRelevanceInput> = z
	.object({
		fields: z.union([
			z.lazy(() => BookmarkOrderByRelevanceFieldEnumSchema),
			z.lazy(() => BookmarkOrderByRelevanceFieldEnumSchema).array(),
		]),
		sort: z.lazy(() => SortOrderSchema),
		search: z.string(),
	})
	.strict();

export const BookmarkOrderByRelevanceInputObjectSchema = Schema;
