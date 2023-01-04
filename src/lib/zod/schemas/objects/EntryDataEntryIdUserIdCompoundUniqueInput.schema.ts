import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryDataEntryIdUserIdCompoundUniqueInput> = z
	.object({
		entryId: z.number(),
		userId: z.string(),
	})
	.strict();

export const EntryDataEntryIdUserIdCompoundUniqueInputObjectSchema = Schema;
