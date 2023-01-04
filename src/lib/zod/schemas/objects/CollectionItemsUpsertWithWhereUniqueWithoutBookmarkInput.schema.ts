import { z } from 'zod';
import { CollectionItemsWhereUniqueInputObjectSchema } from './CollectionItemsWhereUniqueInput.schema';
import { CollectionItemsUpdateWithoutBookmarkInputObjectSchema } from './CollectionItemsUpdateWithoutBookmarkInput.schema';
import { CollectionItemsUncheckedUpdateWithoutBookmarkInputObjectSchema } from './CollectionItemsUncheckedUpdateWithoutBookmarkInput.schema';
import { CollectionItemsCreateWithoutBookmarkInputObjectSchema } from './CollectionItemsCreateWithoutBookmarkInput.schema';
import { CollectionItemsUncheckedCreateWithoutBookmarkInputObjectSchema } from './CollectionItemsUncheckedCreateWithoutBookmarkInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsUpsertWithWhereUniqueWithoutBookmarkInput> = z
	.object({
		where: z.lazy(() => CollectionItemsWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => CollectionItemsUpdateWithoutBookmarkInputObjectSchema),
			z.lazy(() => CollectionItemsUncheckedUpdateWithoutBookmarkInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => CollectionItemsCreateWithoutBookmarkInputObjectSchema),
			z.lazy(() => CollectionItemsUncheckedCreateWithoutBookmarkInputObjectSchema),
		]),
	})
	.strict();

export const CollectionItemsUpsertWithWhereUniqueWithoutBookmarkInputObjectSchema = Schema;
