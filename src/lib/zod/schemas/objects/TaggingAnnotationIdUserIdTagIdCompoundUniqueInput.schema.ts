import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingAnnotationIdUserIdTagIdCompoundUniqueInput> = z
	.object({
		annotationId: z.number(),
		userId: z.string(),
		tagId: z.number(),
	})
	.strict();

export const TaggingAnnotationIdUserIdTagIdCompoundUniqueInputObjectSchema = Schema;
