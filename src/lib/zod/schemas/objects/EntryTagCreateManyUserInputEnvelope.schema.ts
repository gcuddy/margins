import { z } from 'zod';
import { EntryTagCreateManyUserInputObjectSchema } from './EntryTagCreateManyUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagCreateManyUserInputEnvelope> = z
	.object({
		data: z.lazy(() => EntryTagCreateManyUserInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const EntryTagCreateManyUserInputEnvelopeObjectSchema = Schema;
