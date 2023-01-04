import { z } from 'zod';
import { FavoriteCreateManyFolderInputObjectSchema } from './FavoriteCreateManyFolderInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteCreateManyFolderInputEnvelope> = z
	.object({
		data: z.lazy(() => FavoriteCreateManyFolderInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const FavoriteCreateManyFolderInputEnvelopeObjectSchema = Schema;
