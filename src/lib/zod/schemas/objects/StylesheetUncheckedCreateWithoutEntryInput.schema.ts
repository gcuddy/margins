import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetUncheckedCreateWithoutEntryInput> = z
	.object({
		id: z.number().optional(),
		domain: z.string(),
		css: z.string(),
		userId: z.string(),
	})
	.strict();

export const StylesheetUncheckedCreateWithoutEntryInputObjectSchema = Schema;
