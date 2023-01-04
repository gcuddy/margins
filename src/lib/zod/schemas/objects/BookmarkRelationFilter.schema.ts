import { z } from 'zod';
import { BookmarkWhereInputObjectSchema } from './BookmarkWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkRelationFilter> = z
	.object({
		is: z
			.lazy(() => BookmarkWhereInputObjectSchema)
			.optional()
			.nullable(),
		isNot: z
			.lazy(() => BookmarkWhereInputObjectSchema)
			.optional()
			.nullable(),
	})
	.strict();

export const BookmarkRelationFilterObjectSchema = Schema;
