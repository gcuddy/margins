import { z } from 'zod';
import { CollectionWhereInputObjectSchema } from './CollectionWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionListRelationFilter> = z
	.object({
		every: z.lazy(() => CollectionWhereInputObjectSchema).optional(),
		some: z.lazy(() => CollectionWhereInputObjectSchema).optional(),
		none: z.lazy(() => CollectionWhereInputObjectSchema).optional(),
	})
	.strict();

export const CollectionListRelationFilterObjectSchema = Schema;
