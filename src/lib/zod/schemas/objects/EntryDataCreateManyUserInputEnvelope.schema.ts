import { z } from 'zod';
import { EntryDataCreateManyUserInputObjectSchema } from './EntryDataCreateManyUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryDataCreateManyUserInputEnvelope> = z
	.object({
		data: z.lazy(() => EntryDataCreateManyUserInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const EntryDataCreateManyUserInputEnvelopeObjectSchema = Schema;
