import { z } from 'zod';
import { CollectionItemTypeSchema } from '../enums/CollectionItemType.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EnumCollectionItemTypeFieldUpdateOperationsInput> = z
	.object({
		set: z.lazy(() => CollectionItemTypeSchema).optional(),
	})
	.strict();

export const EnumCollectionItemTypeFieldUpdateOperationsInputObjectSchema = Schema;
