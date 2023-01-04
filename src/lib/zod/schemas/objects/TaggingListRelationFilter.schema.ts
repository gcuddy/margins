import { z } from 'zod';
import { TaggingWhereInputObjectSchema } from './TaggingWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingListRelationFilter> = z
	.object({
		every: z.lazy(() => TaggingWhereInputObjectSchema).optional(),
		some: z.lazy(() => TaggingWhereInputObjectSchema).optional(),
		none: z.lazy(() => TaggingWhereInputObjectSchema).optional(),
	})
	.strict();

export const TaggingListRelationFilterObjectSchema = Schema;
