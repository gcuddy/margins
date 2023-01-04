import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { FavoriteOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './FavoriteOrderByWithRelationAndSearchRelevanceInput.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { UserOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './UserOrderByWithRelationAndSearchRelevanceInput.schema';
import { TaggingOrderByRelationAggregateInputObjectSchema } from './TaggingOrderByRelationAggregateInput.schema';
import { EntryTagOrderByRelationAggregateInputObjectSchema } from './EntryTagOrderByRelationAggregateInput.schema';
import { EntryOrderByRelationAggregateInputObjectSchema } from './EntryOrderByRelationAggregateInput.schema';
import { TagOrderByRelevanceInputObjectSchema } from './TagOrderByRelevanceInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagOrderByWithRelationAndSearchRelevanceInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		name: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		favorite: z
			.lazy(() => FavoriteOrderByWithRelationAndSearchRelevanceInputObjectSchema)
			.optional(),
		viewOptions: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		user: z.lazy(() => UserOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		taggings: z.lazy(() => TaggingOrderByRelationAggregateInputObjectSchema).optional(),
		entryTags: z.lazy(() => EntryTagOrderByRelationAggregateInputObjectSchema).optional(),
		entries: z.lazy(() => EntryOrderByRelationAggregateInputObjectSchema).optional(),
		_relevance: z.lazy(() => TagOrderByRelevanceInputObjectSchema).optional(),
	})
	.strict();

export const TagOrderByWithRelationAndSearchRelevanceInputObjectSchema = Schema;
