import { z } from 'zod';
import { ArticleWhereInputObjectSchema } from './ArticleWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ArticleListRelationFilter> = z
	.object({
		every: z.lazy(() => ArticleWhereInputObjectSchema).optional(),
		some: z.lazy(() => ArticleWhereInputObjectSchema).optional(),
		none: z.lazy(() => ArticleWhereInputObjectSchema).optional(),
	})
	.strict();

export const ArticleListRelationFilterObjectSchema = Schema;
