import { z } from 'zod';
import { BookmarkCreateManyStateInputObjectSchema } from './BookmarkCreateManyStateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkCreateManyStateInputEnvelope> = z
	.object({
		data: z.lazy(() => BookmarkCreateManyStateInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const BookmarkCreateManyStateInputEnvelopeObjectSchema = Schema;
