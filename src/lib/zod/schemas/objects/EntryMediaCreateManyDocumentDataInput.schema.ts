import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaCreateManyDocumentDataInput> = z
	.object({
		id: z.number().optional(),
		url: z.string().optional().nullable(),
		size: z.number().optional().nullable(),
		duration: z.number().optional().nullable(),
		type: z.string().optional().nullable(),
		title: z.string().optional().nullable(),
		entryId: z.number().optional().nullable(),
	})
	.strict();

export const EntryMediaCreateManyDocumentDataInputObjectSchema = Schema;
