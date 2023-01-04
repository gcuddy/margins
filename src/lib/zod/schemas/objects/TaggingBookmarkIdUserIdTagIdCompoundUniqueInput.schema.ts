import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingBookmarkIdUserIdTagIdCompoundUniqueInput> = z
	.object({
		bookmarkId: z.number(),
		userId: z.string(),
		tagId: z.number(),
	})
	.strict();

export const TaggingBookmarkIdUserIdTagIdCompoundUniqueInputObjectSchema = Schema;
