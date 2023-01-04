import { z } from 'zod';
import { ContextNodeCreateManyOwnerInputObjectSchema } from './ContextNodeCreateManyOwnerInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextNodeCreateManyOwnerInputEnvelope> = z
	.object({
		data: z.lazy(() => ContextNodeCreateManyOwnerInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const ContextNodeCreateManyOwnerInputEnvelopeObjectSchema = Schema;
