import { z } from 'zod';
import { EntryMediaCreateManyDocumentDataInputObjectSchema } from './EntryMediaCreateManyDocumentDataInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaCreateManyDocumentDataInputEnvelope> = z
	.object({
		data: z.lazy(() => EntryMediaCreateManyDocumentDataInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const EntryMediaCreateManyDocumentDataInputEnvelopeObjectSchema = Schema;
