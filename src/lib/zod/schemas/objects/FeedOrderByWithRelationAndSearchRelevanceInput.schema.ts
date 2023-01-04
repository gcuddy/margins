import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { EntryOrderByRelationAggregateInputObjectSchema } from './EntryOrderByRelationAggregateInput.schema';
import { TaggingOrderByRelationAggregateInputObjectSchema } from './TaggingOrderByRelationAggregateInput.schema';
import { FavoriteOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './FavoriteOrderByWithRelationAndSearchRelevanceInput.schema';
import { SubscriptionOrderByRelationAggregateInputObjectSchema } from './SubscriptionOrderByRelationAggregateInput.schema';
import { ContextOrderByRelationAggregateInputObjectSchema } from './ContextOrderByRelationAggregateInput.schema';
import { FeedOrderByRelevanceInputObjectSchema } from './FeedOrderByRelevanceInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedOrderByWithRelationAndSearchRelevanceInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		itunes_id: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		feedUrl: z.lazy(() => SortOrderSchema).optional(),
		title: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		link: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		creator: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		description: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		lastBuildDate: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		imageUrl: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		entries: z.lazy(() => EntryOrderByRelationAggregateInputObjectSchema).optional(),
		tags: z.lazy(() => TaggingOrderByRelationAggregateInputObjectSchema).optional(),
		podcast: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		favorite: z
			.lazy(() => FavoriteOrderByWithRelationAndSearchRelevanceInputObjectSchema)
			.optional(),
		active: z.lazy(() => SortOrderSchema).optional(),
		velocity: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		subscriptions: z.lazy(() => SubscriptionOrderByRelationAggregateInputObjectSchema).optional(),
		context: z.lazy(() => ContextOrderByRelationAggregateInputObjectSchema).optional(),
		_relevance: z.lazy(() => FeedOrderByRelevanceInputObjectSchema).optional(),
	})
	.strict();

export const FeedOrderByWithRelationAndSearchRelevanceInputObjectSchema = Schema;
