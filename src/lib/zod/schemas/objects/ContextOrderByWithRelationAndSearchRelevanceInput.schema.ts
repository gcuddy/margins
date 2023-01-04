import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { UserOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './UserOrderByWithRelationAndSearchRelevanceInput.schema';
import { EntryOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './EntryOrderByWithRelationAndSearchRelevanceInput.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { FeedOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './FeedOrderByWithRelationAndSearchRelevanceInput.schema';
import { ContextOrderByRelevanceInputObjectSchema } from './ContextOrderByRelevanceInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextOrderByWithRelationAndSearchRelevanceInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		user: z.lazy(() => UserOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		entry: z.lazy(() => EntryOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		entryId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		feed: z.lazy(() => FeedOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		feedId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		url: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		description: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		_relevance: z.lazy(() => ContextOrderByRelevanceInputObjectSchema).optional(),
	})
	.strict();

export const ContextOrderByWithRelationAndSearchRelevanceInputObjectSchema = Schema;
