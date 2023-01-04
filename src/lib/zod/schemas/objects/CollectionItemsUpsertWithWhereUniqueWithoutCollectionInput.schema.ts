import { z } from 'zod';
import { CollectionItemsWhereUniqueInputObjectSchema } from './CollectionItemsWhereUniqueInput.schema';
import { CollectionItemsUpdateWithoutCollectionInputObjectSchema } from './CollectionItemsUpdateWithoutCollectionInput.schema';
import { CollectionItemsUncheckedUpdateWithoutCollectionInputObjectSchema } from './CollectionItemsUncheckedUpdateWithoutCollectionInput.schema';
import { CollectionItemsCreateWithoutCollectionInputObjectSchema } from './CollectionItemsCreateWithoutCollectionInput.schema';
import { CollectionItemsUncheckedCreateWithoutCollectionInputObjectSchema } from './CollectionItemsUncheckedCreateWithoutCollectionInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsUpsertWithWhereUniqueWithoutCollectionInput> = z
	.object({
		where: z.lazy(() => CollectionItemsWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => CollectionItemsUpdateWithoutCollectionInputObjectSchema),
			z.lazy(() => CollectionItemsUncheckedUpdateWithoutCollectionInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => CollectionItemsCreateWithoutCollectionInputObjectSchema),
			z.lazy(() => CollectionItemsUncheckedCreateWithoutCollectionInputObjectSchema),
		]),
	})
	.strict();

export const CollectionItemsUpsertWithWhereUniqueWithoutCollectionInputObjectSchema = Schema;
