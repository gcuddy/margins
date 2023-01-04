import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { TagOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './TagOrderByWithRelationAndSearchRelevanceInput.schema';
import { EntryOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './EntryOrderByWithRelationAndSearchRelevanceInput.schema';
import { UserOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './UserOrderByWithRelationAndSearchRelevanceInput.schema';
import { EntryTagOrderByRelevanceInputObjectSchema } from './EntryTagOrderByRelevanceInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagOrderByWithRelationAndSearchRelevanceInput> = z
	.object({
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		tag: z.lazy(() => TagOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		tagId: z.lazy(() => SortOrderSchema).optional(),
		entry: z.lazy(() => EntryOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		entryId: z.lazy(() => SortOrderSchema).optional(),
		user: z.lazy(() => UserOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		userId: z.lazy(() => SortOrderSchema).optional(),
		_relevance: z.lazy(() => EntryTagOrderByRelevanceInputObjectSchema).optional(),
	})
	.strict();

export const EntryTagOrderByWithRelationAndSearchRelevanceInputObjectSchema = Schema;
