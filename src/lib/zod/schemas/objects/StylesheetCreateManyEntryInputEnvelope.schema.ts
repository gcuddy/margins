import { z } from 'zod';
import { StylesheetCreateManyEntryInputObjectSchema } from './StylesheetCreateManyEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetCreateManyEntryInputEnvelope> = z
	.object({
		data: z.lazy(() => StylesheetCreateManyEntryInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const StylesheetCreateManyEntryInputEnvelopeObjectSchema = Schema;
