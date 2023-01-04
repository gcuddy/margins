import { z } from 'zod';
import { EntryCreateNestedOneWithoutEntryMediaInputObjectSchema } from './EntryCreateNestedOneWithoutEntryMediaInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaCreateWithoutDocumentDataInput> = z
	.object({
		url: z.string().optional().nullable(),
		size: z.number().optional().nullable(),
		duration: z.number().optional().nullable(),
		type: z.string().optional().nullable(),
		title: z.string().optional().nullable(),
		Entry: z.lazy(() => EntryCreateNestedOneWithoutEntryMediaInputObjectSchema).optional(),
	})
	.strict();

export const EntryMediaCreateWithoutDocumentDataInputObjectSchema = Schema;
