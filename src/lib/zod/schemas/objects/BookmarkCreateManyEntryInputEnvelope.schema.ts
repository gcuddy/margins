import { z } from 'zod';
import { BookmarkCreateManyEntryInputObjectSchema } from './BookmarkCreateManyEntryInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkCreateManyEntryInputEnvelope> = z
	.object({
		data: z.lazy(() => BookmarkCreateManyEntryInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const BookmarkCreateManyEntryInputEnvelopeObjectSchema = Schema;
