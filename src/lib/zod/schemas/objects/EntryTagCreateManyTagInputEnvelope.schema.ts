import { z } from 'zod';
import { EntryTagCreateManyTagInputObjectSchema } from './EntryTagCreateManyTagInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagCreateManyTagInputEnvelope> = z
	.object({
		data: z.lazy(() => EntryTagCreateManyTagInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const EntryTagCreateManyTagInputEnvelopeObjectSchema = Schema;
