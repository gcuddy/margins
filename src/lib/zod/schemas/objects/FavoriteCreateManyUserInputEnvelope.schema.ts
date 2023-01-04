import { z } from 'zod';
import { FavoriteCreateManyUserInputObjectSchema } from './FavoriteCreateManyUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteCreateManyUserInputEnvelope> = z
	.object({
		data: z.lazy(() => FavoriteCreateManyUserInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const FavoriteCreateManyUserInputEnvelopeObjectSchema = Schema;
