import { z } from 'zod';
import { BookmarkWhereInputObjectSchema } from './BookmarkWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkListRelationFilter> = z
	.object({
		every: z.lazy(() => BookmarkWhereInputObjectSchema).optional(),
		some: z.lazy(() => BookmarkWhereInputObjectSchema).optional(),
		none: z.lazy(() => BookmarkWhereInputObjectSchema).optional(),
	})
	.strict();

export const BookmarkListRelationFilterObjectSchema = Schema;
