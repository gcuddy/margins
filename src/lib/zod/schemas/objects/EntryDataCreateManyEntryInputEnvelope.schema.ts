import { z } from 'zod';
import { EntryDataCreateManyEntryInputObjectSchema } from './EntryDataCreateManyEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryDataCreateManyEntryInputEnvelope> = z
	.object({
		data: z.lazy(() => EntryDataCreateManyEntryInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const EntryDataCreateManyEntryInputEnvelopeObjectSchema = Schema;
