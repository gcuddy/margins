import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingCreateManyTagInput> = z
	.object({
		id: z.number().optional(),
		userId: z.string(),
		feedId: z.number().optional().nullable(),
		annotationId: z.number().optional().nullable(),
		bookmarkId: z.number().optional().nullable(),
	})
	.strict();

export const TaggingCreateManyTagInputObjectSchema = Schema;
