import { z } from 'zod';
import { CollectionItemsWhereInputObjectSchema } from './CollectionItemsWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsListRelationFilter> = z
	.object({
		every: z.lazy(() => CollectionItemsWhereInputObjectSchema).optional(),
		some: z.lazy(() => CollectionItemsWhereInputObjectSchema).optional(),
		none: z.lazy(() => CollectionItemsWhereInputObjectSchema).optional(),
	})
	.strict();

export const CollectionItemsListRelationFilterObjectSchema = Schema;
