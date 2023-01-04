import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ArticleMaxOrderByAggregateInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		title: z.lazy(() => SortOrderSchema).optional(),
		content: z.lazy(() => SortOrderSchema).optional(),
		textContent: z.lazy(() => SortOrderSchema).optional(),
		author: z.lazy(() => SortOrderSchema).optional(),
		private: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		readProgress: z.lazy(() => SortOrderSchema).optional(),
		slug: z.lazy(() => SortOrderSchema).optional(),
		url: z.lazy(() => SortOrderSchema).optional(),
		siteName: z.lazy(() => SortOrderSchema).optional(),
		colorHash: z.lazy(() => SortOrderSchema).optional(),
		date: z.lazy(() => SortOrderSchema).optional(),
		image: z.lazy(() => SortOrderSchema).optional(),
		wordCount: z.lazy(() => SortOrderSchema).optional(),
		starred: z.lazy(() => SortOrderSchema).optional(),
		css: z.lazy(() => SortOrderSchema).optional(),
		description: z.lazy(() => SortOrderSchema).optional(),
		wiki: z.lazy(() => SortOrderSchema).optional(),
		classification: z.lazy(() => SortOrderSchema).optional(),
		pdf: z.lazy(() => SortOrderSchema).optional(),
		html: z.lazy(() => SortOrderSchema).optional(),
		readLater: z.lazy(() => SortOrderSchema).optional(),
		bookmark: z.lazy(() => SortOrderSchema).optional(),
		position: z.lazy(() => SortOrderSchema).optional(),
		trash: z.lazy(() => SortOrderSchema).optional(),
		location: z.lazy(() => SortOrderSchema).optional(),
		type: z.lazy(() => SortOrderSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		favoriteId: z.lazy(() => SortOrderSchema).optional(),
	})
	.strict();

export const ArticleMaxOrderByAggregateInputObjectSchema = Schema;
