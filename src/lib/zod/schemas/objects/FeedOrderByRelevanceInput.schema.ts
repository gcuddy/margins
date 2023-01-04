import { z } from 'zod';
import { FeedOrderByRelevanceFieldEnumSchema } from '../enums/FeedOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedOrderByRelevanceInput> = z
	.object({
		fields: z.union([
			z.lazy(() => FeedOrderByRelevanceFieldEnumSchema),
			z.lazy(() => FeedOrderByRelevanceFieldEnumSchema).array(),
		]),
		sort: z.lazy(() => SortOrderSchema),
		search: z.string(),
	})
	.strict();

export const FeedOrderByRelevanceInputObjectSchema = Schema;
