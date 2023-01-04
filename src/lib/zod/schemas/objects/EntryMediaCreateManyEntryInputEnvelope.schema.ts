import { z } from 'zod';
import { EntryMediaCreateManyEntryInputObjectSchema } from './EntryMediaCreateManyEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaCreateManyEntryInputEnvelope> = z
	.object({
		data: z.lazy(() => EntryMediaCreateManyEntryInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const EntryMediaCreateManyEntryInputEnvelopeObjectSchema = Schema;
