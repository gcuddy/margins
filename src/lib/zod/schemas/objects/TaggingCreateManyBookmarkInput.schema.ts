import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingCreateManyBookmarkInput> = z
	.object({
		id: z.number().optional(),
		tagId: z.number(),
		userId: z.string(),
		feedId: z.number().optional().nullable(),
		annotationId: z.number().optional().nullable(),
	})
	.strict();

export const TaggingCreateManyBookmarkInputObjectSchema = Schema;
