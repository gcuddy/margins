import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { FeedOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './FeedOrderByWithRelationAndSearchRelevanceInput.schema';
import { UserOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './UserOrderByWithRelationAndSearchRelevanceInput.schema';
import { SubscriptionOrderByRelevanceInputObjectSchema } from './SubscriptionOrderByRelevanceInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionOrderByWithRelationAndSearchRelevanceInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		feed: z.lazy(() => FeedOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		feedId: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		user: z.lazy(() => UserOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		title: z.lazy(() => SortOrderSchema).optional(),
		download_full: z.lazy(() => SortOrderSchema).optional(),
		_relevance: z.lazy(() => SubscriptionOrderByRelevanceInputObjectSchema).optional(),
	})
	.strict();

export const SubscriptionOrderByWithRelationAndSearchRelevanceInputObjectSchema = Schema;
