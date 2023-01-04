import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionUserIdEntryIdCompoundUniqueInput> = z
	.object({
		userId: z.string(),
		entryId: z.number(),
	})
	.strict();

export const InteractionUserIdEntryIdCompoundUniqueInputObjectSchema = Schema;
