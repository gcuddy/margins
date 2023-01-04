import { z } from 'zod';
import { ContextCreateManyUserInputObjectSchema } from './ContextCreateManyUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextCreateManyUserInputEnvelope> = z
	.object({
		data: z.lazy(() => ContextCreateManyUserInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const ContextCreateManyUserInputEnvelopeObjectSchema = Schema;
