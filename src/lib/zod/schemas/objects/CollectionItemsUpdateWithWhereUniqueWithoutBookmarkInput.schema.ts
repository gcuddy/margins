import { z } from 'zod';
import { CollectionItemsWhereUniqueInputObjectSchema } from './CollectionItemsWhereUniqueInput.schema';
import { CollectionItemsUpdateWithoutBookmarkInputObjectSchema } from './CollectionItemsUpdateWithoutBookmarkInput.schema';
import { CollectionItemsUncheckedUpdateWithoutBookmarkInputObjectSchema } from './CollectionItemsUncheckedUpdateWithoutBookmarkInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsUpdateWithWhereUniqueWithoutBookmarkInput> = z
	.object({
		where: z.lazy(() => CollectionItemsWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => CollectionItemsUpdateWithoutBookmarkInputObjectSchema),
			z.lazy(() => CollectionItemsUncheckedUpdateWithoutBookmarkInputObjectSchema),
		]),
	})
	.strict();

export const CollectionItemsUpdateWithWhereUniqueWithoutBookmarkInputObjectSchema = Schema;
