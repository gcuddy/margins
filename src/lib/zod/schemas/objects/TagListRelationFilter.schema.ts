import { z } from 'zod';
import { TagWhereInputObjectSchema } from './TagWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagListRelationFilter> = z
	.object({
		every: z.lazy(() => TagWhereInputObjectSchema).optional(),
		some: z.lazy(() => TagWhereInputObjectSchema).optional(),
		none: z.lazy(() => TagWhereInputObjectSchema).optional(),
	})
	.strict();

export const TagListRelationFilterObjectSchema = Schema;
