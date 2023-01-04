import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetCreateManyUserInput> = z
	.object({
		id: z.number().optional(),
		domain: z.string(),
		css: z.string(),
		userEntryId: z.number().optional().nullable(),
	})
	.strict();

export const StylesheetCreateManyUserInputObjectSchema = Schema;
