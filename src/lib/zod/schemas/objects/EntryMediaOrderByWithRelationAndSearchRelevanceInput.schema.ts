import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { EntryDataOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './EntryDataOrderByWithRelationAndSearchRelevanceInput.schema';
import { EntryOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './EntryOrderByWithRelationAndSearchRelevanceInput.schema';
import { EntryMediaOrderByRelevanceInputObjectSchema } from './EntryMediaOrderByRelevanceInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaOrderByWithRelationAndSearchRelevanceInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		url: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		size: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		duration: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		type: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		title: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		DocumentData: z
			.lazy(() => EntryDataOrderByWithRelationAndSearchRelevanceInputObjectSchema)
			.optional(),
		documentDataId: z.lazy(() => SortOrderSchema).optional(),
		Entry: z.lazy(() => EntryOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		entryId: z
			.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputObjectSchema)])
			.optional(),
		_relevance: z.lazy(() => EntryMediaOrderByRelevanceInputObjectSchema).optional(),
	})
	.strict();

export const EntryMediaOrderByWithRelationAndSearchRelevanceInputObjectSchema = Schema;
