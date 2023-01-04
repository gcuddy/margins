import { z } from 'zod';
import { CollectionItemsWhereUniqueInputObjectSchema } from './CollectionItemsWhereUniqueInput.schema';
import { CollectionItemsCreateWithoutCollectionInputObjectSchema } from './CollectionItemsCreateWithoutCollectionInput.schema';
import { CollectionItemsUncheckedCreateWithoutCollectionInputObjectSchema } from './CollectionItemsUncheckedCreateWithoutCollectionInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsCreateOrConnectWithoutCollectionInput> = z
	.object({
		where: z.lazy(() => CollectionItemsWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => CollectionItemsCreateWithoutCollectionInputObjectSchema),
			z.lazy(() => CollectionItemsUncheckedCreateWithoutCollectionInputObjectSchema),
		]),
	})
	.strict();

export const CollectionItemsCreateOrConnectWithoutCollectionInputObjectSchema = Schema;
