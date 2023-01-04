import { z } from 'zod';
import { CollectionItemsWhereUniqueInputObjectSchema } from './CollectionItemsWhereUniqueInput.schema';
import { CollectionItemsUpdateWithoutCollectionInputObjectSchema } from './CollectionItemsUpdateWithoutCollectionInput.schema';
import { CollectionItemsUncheckedUpdateWithoutCollectionInputObjectSchema } from './CollectionItemsUncheckedUpdateWithoutCollectionInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsUpdateWithWhereUniqueWithoutCollectionInput> = z
	.object({
		where: z.lazy(() => CollectionItemsWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => CollectionItemsUpdateWithoutCollectionInputObjectSchema),
			z.lazy(() => CollectionItemsUncheckedUpdateWithoutCollectionInputObjectSchema),
		]),
	})
	.strict();

export const CollectionItemsUpdateWithWhereUniqueWithoutCollectionInputObjectSchema = Schema;
