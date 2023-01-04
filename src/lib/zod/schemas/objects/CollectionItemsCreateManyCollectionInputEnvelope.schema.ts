import { z } from 'zod';
import { CollectionItemsCreateManyCollectionInputObjectSchema } from './CollectionItemsCreateManyCollectionInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsCreateManyCollectionInputEnvelope> = z
	.object({
		data: z.lazy(() => CollectionItemsCreateManyCollectionInputObjectSchema).array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const CollectionItemsCreateManyCollectionInputEnvelopeObjectSchema = Schema;
