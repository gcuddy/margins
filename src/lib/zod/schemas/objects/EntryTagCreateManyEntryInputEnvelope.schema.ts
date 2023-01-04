import { z } from 'zod';
import { EntryTagCreateManyEntryInputObjectSchema } from './EntryTagCreateManyEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagCreateManyEntryInputEnvelope> = z
	.object({
		data: z.lazy(() => EntryTagCreateManyEntryInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const EntryTagCreateManyEntryInputEnvelopeObjectSchema = Schema;
