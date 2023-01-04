import { z } from 'zod';
import { StylesheetCreateManyUserInputObjectSchema } from './StylesheetCreateManyUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetCreateManyUserInputEnvelope> = z
	.object({
		data: z.lazy(() => StylesheetCreateManyUserInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const StylesheetCreateManyUserInputEnvelopeObjectSchema = Schema;
