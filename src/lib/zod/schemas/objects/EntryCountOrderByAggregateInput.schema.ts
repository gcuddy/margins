import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryCountOrderByAggregateInput> = z
	.object({
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		author: z.lazy(() => SortOrderSchema).optional(),
		location: z.lazy(() => SortOrderSchema).optional(),
		title: z.lazy(() => SortOrderSchema).optional(),
		type: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		id: z.lazy(() => SortOrderSchema).optional(),
		uri: z.lazy(() => SortOrderSchema).optional(),
		html: z.lazy(() => SortOrderSchema).optional(),
		text: z.lazy(() => SortOrderSchema).optional(),
		image: z.lazy(() => SortOrderSchema).optional(),
		guid: z.lazy(() => SortOrderSchema).optional(),
		original: z.lazy(() => SortOrderSchema).optional(),
		wordCount: z.lazy(() => SortOrderSchema).optional(),
		siteName: z.lazy(() => SortOrderSchema).optional(),
		summary: z.lazy(() => SortOrderSchema).optional(),
		media: z.lazy(() => SortOrderSchema).optional(),
		published: z.lazy(() => SortOrderSchema).optional(),
		updated: z.lazy(() => SortOrderSchema).optional(),
		feedId: z.lazy(() => SortOrderSchema).optional(),
	})
	.strict();

export const EntryCountOrderByAggregateInputObjectSchema = Schema;
