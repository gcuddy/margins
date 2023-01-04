import { z } from 'zod';
import { CollectionWhereInputObjectSchema } from './CollectionWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionRelationFilter> = z
	.object({
		is: z.lazy(() => CollectionWhereInputObjectSchema).optional(),
		isNot: z.lazy(() => CollectionWhereInputObjectSchema).optional(),
	})
	.strict();

export const CollectionRelationFilterObjectSchema = Schema;
