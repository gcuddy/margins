import { z } from 'zod';
import { CollectionItemsWhereUniqueInputObjectSchema } from './CollectionItemsWhereUniqueInput.schema';
import { CollectionItemsCreateWithoutBookmarkInputObjectSchema } from './CollectionItemsCreateWithoutBookmarkInput.schema';
import { CollectionItemsUncheckedCreateWithoutBookmarkInputObjectSchema } from './CollectionItemsUncheckedCreateWithoutBookmarkInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsCreateOrConnectWithoutBookmarkInput> = z
	.object({
		where: z.lazy(() => CollectionItemsWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => CollectionItemsCreateWithoutBookmarkInputObjectSchema),
			z.lazy(() => CollectionItemsUncheckedCreateWithoutBookmarkInputObjectSchema),
		]),
	})
	.strict();

export const CollectionItemsCreateOrConnectWithoutBookmarkInputObjectSchema = Schema;
