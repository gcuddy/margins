import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagEntryIdTagIdUserIdCompoundUniqueInput> = z
	.object({
		entryId: z.number(),
		tagId: z.number(),
		userId: z.string(),
	})
	.strict();

export const EntryTagEntryIdTagIdUserIdCompoundUniqueInputObjectSchema = Schema;
