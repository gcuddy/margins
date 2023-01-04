import { z } from 'zod';
import { EntryDataOrderByRelationAggregateInputObjectSchema } from './EntryDataOrderByRelationAggregateInput.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { FeedOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './FeedOrderByWithRelationAndSearchRelevanceInput.schema';
import { InteractionOrderByRelationAggregateInputObjectSchema } from './InteractionOrderByRelationAggregateInput.schema';
import { EntryMediaOrderByRelationAggregateInputObjectSchema } from './EntryMediaOrderByRelationAggregateInput.schema';
import { AnnotationOrderByRelationAggregateInputObjectSchema } from './AnnotationOrderByRelationAggregateInput.schema';
import { BookmarkOrderByRelationAggregateInputObjectSchema } from './BookmarkOrderByRelationAggregateInput.schema';
import { TagOrderByRelationAggregateInputObjectSchema } from './TagOrderByRelationAggregateInput.schema';
import { EntryTagOrderByRelationAggregateInputObjectSchema } from './EntryTagOrderByRelationAggregateInput.schema';
import { ContextOrderByRelationAggregateInputObjectSchema } from './ContextOrderByRelationAggregateInput.schema';
import { EntryOrderByRelevanceInputObjectSchema } from './EntryOrderByRelevanceInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryOrderByWithRelationAndSearchRelevanceInput> = z
	.object({
		data: z.lazy(() => EntryDataOrderByRelationAggregateInputObjectSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		author: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		location: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		title: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		type: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		id: z.lazy(() => SortOrderSchema).optional(),
		uri: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		html: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		text: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		image: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		guid: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		original: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		wordCount: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		siteName: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		summary: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		media: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		published: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		updated: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		feedId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		feed: z.lazy(() => FeedOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		interactions: z.lazy(() => InteractionOrderByRelationAggregateInputObjectSchema).optional(),
		EntryMedia: z.lazy(() => EntryMediaOrderByRelationAggregateInputObjectSchema).optional(),
		annotations: z.lazy(() => AnnotationOrderByRelationAggregateInputObjectSchema).optional(),
		bookmarks: z.lazy(() => BookmarkOrderByRelationAggregateInputObjectSchema).optional(),
		tags: z.lazy(() => TagOrderByRelationAggregateInputObjectSchema).optional(),
		entrytags: z.lazy(() => EntryTagOrderByRelationAggregateInputObjectSchema).optional(),
		context: z.lazy(() => ContextOrderByRelationAggregateInputObjectSchema).optional(),
		_relevance: z.lazy(() => EntryOrderByRelevanceInputObjectSchema).optional(),
	})
	.strict();

export const EntryOrderByWithRelationAndSearchRelevanceInputObjectSchema = Schema;
