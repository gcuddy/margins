import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUriIdCompoundUniqueInput> = z
	.object({
		uri: z.string(),
		id: z.number(),
	})
	.strict();

export const EntryUriIdCompoundUniqueInputObjectSchema = Schema;
