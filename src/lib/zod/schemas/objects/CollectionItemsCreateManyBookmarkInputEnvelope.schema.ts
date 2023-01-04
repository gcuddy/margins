import { z } from 'zod';
import { CollectionItemsCreateManyBookmarkInputObjectSchema } from './CollectionItemsCreateManyBookmarkInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsCreateManyBookmarkInputEnvelope> = z
	.object({
		data: z.lazy(() => CollectionItemsCreateManyBookmarkInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const CollectionItemsCreateManyBookmarkInputEnvelopeObjectSchema = Schema;
