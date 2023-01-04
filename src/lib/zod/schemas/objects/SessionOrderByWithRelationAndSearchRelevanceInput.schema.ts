import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { UserOrderByWithRelationAndSearchRelevanceInputObjectSchema } from './UserOrderByWithRelationAndSearchRelevanceInput.schema';
import { SessionOrderByRelevanceInputObjectSchema } from './SessionOrderByRelevanceInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SessionOrderByWithRelationAndSearchRelevanceInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		user_id: z.lazy(() => SortOrderSchema).optional(),
		expires: z.lazy(() => SortOrderSchema).optional(),
		idle_expires: z.lazy(() => SortOrderSchema).optional(),
		user: z.lazy(() => UserOrderByWithRelationAndSearchRelevanceInputObjectSchema).optional(),
		_relevance: z.lazy(() => SessionOrderByRelevanceInputObjectSchema).optional(),
	})
	.strict();

export const SessionOrderByWithRelationAndSearchRelevanceInputObjectSchema = Schema;
