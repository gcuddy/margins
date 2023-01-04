import { z } from 'zod';
import { InteractionCreateManyUserInputObjectSchema } from './InteractionCreateManyUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionCreateManyUserInputEnvelope> = z
	.object({
		data: z.lazy(() => InteractionCreateManyUserInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const InteractionCreateManyUserInputEnvelopeObjectSchema = Schema;
