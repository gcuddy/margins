import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionUserIdNameCompoundUniqueInput> = z
	.object({
		userId: z.string(),
		name: z.string(),
	})
	.strict();

export const CollectionUserIdNameCompoundUniqueInputObjectSchema = Schema;
