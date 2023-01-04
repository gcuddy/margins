import { z } from 'zod';
import { ContextCreateManyEntryInputObjectSchema } from './ContextCreateManyEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextCreateManyEntryInputEnvelope> = z
	.object({
		data: z.lazy(() => ContextCreateManyEntryInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const ContextCreateManyEntryInputEnvelopeObjectSchema = Schema;
