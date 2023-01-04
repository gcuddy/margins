import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetCreateManyInput> = z
	.object({
		id: z.number().optional(),
		domain: z.string(),
		css: z.string(),
		userEntryId: z.number().optional().nullable(),
		userId: z.string(),
	})
	.strict();

export const StylesheetCreateManyInputObjectSchema = Schema;
