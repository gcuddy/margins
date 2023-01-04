import { z } from 'zod';
import { CollectionItemTypeSchema } from '../enums/CollectionItemType.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsCreateManyInput> = z
	.object({
		id: z.number().optional(),
		collectionId: z.number(),
		position: z.number().optional(),
		type: z.lazy(() => CollectionItemTypeSchema),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		annotationId: z.number().optional().nullable(),
		bookmarkId: z.number().optional().nullable(),
	})
	.strict();

export const CollectionItemsCreateManyInputObjectSchema = Schema;
