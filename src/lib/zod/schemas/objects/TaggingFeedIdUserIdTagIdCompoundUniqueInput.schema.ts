import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingFeedIdUserIdTagIdCompoundUniqueInput> = z
	.object({
		feedId: z.number(),
		userId: z.string(),
		tagId: z.number(),
	})
	.strict();

export const TaggingFeedIdUserIdTagIdCompoundUniqueInputObjectSchema = Schema;
