import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ArticleUserIdUrlCompoundUniqueInput> = z
	.object({
		userId: z.string(),
		url: z.string(),
	})
	.strict();

export const ArticleUserIdUrlCompoundUniqueInputObjectSchema = Schema;
