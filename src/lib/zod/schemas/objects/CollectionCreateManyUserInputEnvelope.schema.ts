import { z } from 'zod';
import { CollectionCreateManyUserInputObjectSchema } from './CollectionCreateManyUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionCreateManyUserInputEnvelope> = z
	.object({
		data: z.lazy(() => CollectionCreateManyUserInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const CollectionCreateManyUserInputEnvelopeObjectSchema = Schema;
