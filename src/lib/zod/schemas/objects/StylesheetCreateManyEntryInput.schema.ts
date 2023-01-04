import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetCreateManyEntryInput> = z
	.object({
		id: z.number().optional(),
		domain: z.string(),
		css: z.string(),
		userId: z.string(),
	})
	.strict();

export const StylesheetCreateManyEntryInputObjectSchema = Schema;
