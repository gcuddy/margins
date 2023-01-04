import { z } from 'zod';
import { InteractionCreateManyEntryInputObjectSchema } from './InteractionCreateManyEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionCreateManyEntryInputEnvelope> = z
	.object({
		data: z.lazy(() => InteractionCreateManyEntryInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const InteractionCreateManyEntryInputEnvelopeObjectSchema = Schema;
