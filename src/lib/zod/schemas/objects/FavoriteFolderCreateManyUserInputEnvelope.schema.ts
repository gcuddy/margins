import { z } from 'zod';
import { FavoriteFolderCreateManyUserInputObjectSchema } from './FavoriteFolderCreateManyUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteFolderCreateManyUserInputEnvelope> = z
	.object({
		data: z.lazy(() => FavoriteFolderCreateManyUserInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const FavoriteFolderCreateManyUserInputEnvelopeObjectSchema = Schema;
