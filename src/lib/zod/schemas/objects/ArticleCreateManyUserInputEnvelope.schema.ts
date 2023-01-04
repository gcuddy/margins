import { z } from 'zod';
import { ArticleCreateManyUserInputObjectSchema } from './ArticleCreateManyUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ArticleCreateManyUserInputEnvelope> = z
	.object({
		data: z.lazy(() => ArticleCreateManyUserInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const ArticleCreateManyUserInputEnvelopeObjectSchema = Schema;
