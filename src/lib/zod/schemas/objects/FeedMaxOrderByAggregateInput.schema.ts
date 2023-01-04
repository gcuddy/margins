import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedMaxOrderByAggregateInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		itunes_id: z.lazy(() => SortOrderSchema).optional(),
		feedUrl: z.lazy(() => SortOrderSchema).optional(),
		title: z.lazy(() => SortOrderSchema).optional(),
		link: z.lazy(() => SortOrderSchema).optional(),
		creator: z.lazy(() => SortOrderSchema).optional(),
		description: z.lazy(() => SortOrderSchema).optional(),
		lastBuildDate: z.lazy(() => SortOrderSchema).optional(),
		imageUrl: z.lazy(() => SortOrderSchema).optional(),
		podcast: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		active: z.lazy(() => SortOrderSchema).optional(),
		velocity: z.lazy(() => SortOrderSchema).optional(),
	})
	.strict();

export const FeedMaxOrderByAggregateInputObjectSchema = Schema;
