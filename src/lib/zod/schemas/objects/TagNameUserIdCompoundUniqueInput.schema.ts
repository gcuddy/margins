import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagNameUserIdCompoundUniqueInput> = z
	.object({
		name: z.string(),
		userId: z.string(),
	})
	.strict();

export const TagNameUserIdCompoundUniqueInputObjectSchema = Schema;
