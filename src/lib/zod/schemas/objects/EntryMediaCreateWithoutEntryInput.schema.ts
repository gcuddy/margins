import { z } from 'zod';
import { EntryDataCreateNestedOneWithoutMediaInputObjectSchema } from './EntryDataCreateNestedOneWithoutMediaInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaCreateWithoutEntryInput> = z
	.object({
		url: z.string().optional().nullable(),
		size: z.number().optional().nullable(),
		duration: z.number().optional().nullable(),
		type: z.string().optional().nullable(),
		title: z.string().optional().nullable(),
		DocumentData: z.lazy(() => EntryDataCreateNestedOneWithoutMediaInputObjectSchema),
	})
	.strict();

export const EntryMediaCreateWithoutEntryInputObjectSchema = Schema;
