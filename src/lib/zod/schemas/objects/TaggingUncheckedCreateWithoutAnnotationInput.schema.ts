import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingUncheckedCreateWithoutAnnotationInput> = z
	.object({
		id: z.number().optional(),
		tagId: z.number(),
		userId: z.string(),
		feedId: z.number().optional().nullable(),
		bookmarkId: z.number().optional().nullable(),
	})
	.strict();

export const TaggingUncheckedCreateWithoutAnnotationInputObjectSchema = Schema;
