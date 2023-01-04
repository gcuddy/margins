import { z } from 'zod';
import { StateCreateManyUserInputObjectSchema } from './StateCreateManyUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateCreateManyUserInputEnvelope> = z
	.object({
		data: z.lazy(() => StateCreateManyUserInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const StateCreateManyUserInputEnvelopeObjectSchema = Schema;
