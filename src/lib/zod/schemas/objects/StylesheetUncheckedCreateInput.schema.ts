import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetUncheckedCreateInput> = z
	.object({
		id: z.number().optional(),
		domain: z.string(),
		css: z.string(),
		userEntryId: z.number().optional().nullable(),
		userId: z.string(),
	})
	.strict();

export const StylesheetUncheckedCreateInputObjectSchema = Schema;
