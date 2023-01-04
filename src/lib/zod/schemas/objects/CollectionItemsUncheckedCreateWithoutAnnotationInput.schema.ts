import { z } from 'zod';
import { CollectionItemTypeSchema } from '../enums/CollectionItemType.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsUncheckedCreateWithoutAnnotationInput> = z
	.object({
		id: z.number().optional(),
		collectionId: z.number(),
		position: z.number().optional(),
		type: z.lazy(() => CollectionItemTypeSchema),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		bookmarkId: z.number().optional().nullable(),
	})
	.strict();

export const CollectionItemsUncheckedCreateWithoutAnnotationInputObjectSchema = Schema;
