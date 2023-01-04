import { z } from 'zod';
import { CollectionItemsWhereInputObjectSchema } from './CollectionItemsWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsRelationFilter> = z
	.object({
		is: z
			.lazy(() => CollectionItemsWhereInputObjectSchema)
			.optional()
			.nullable(),
		isNot: z
			.lazy(() => CollectionItemsWhereInputObjectSchema)
			.optional()
			.nullable(),
	})
	.strict();

export const CollectionItemsRelationFilterObjectSchema = Schema;
