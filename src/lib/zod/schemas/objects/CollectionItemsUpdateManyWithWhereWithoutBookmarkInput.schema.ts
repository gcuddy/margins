import { z } from 'zod';
import { CollectionItemsScalarWhereInputObjectSchema } from './CollectionItemsScalarWhereInput.schema';
import { CollectionItemsUpdateManyMutationInputObjectSchema } from './CollectionItemsUpdateManyMutationInput.schema';
import { CollectionItemsUncheckedUpdateManyWithoutCollectionsInputObjectSchema } from './CollectionItemsUncheckedUpdateManyWithoutCollectionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsUpdateManyWithWhereWithoutBookmarkInput> = z
	.object({
		where: z.lazy(() => CollectionItemsScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => CollectionItemsUpdateManyMutationInputObjectSchema),
			z.lazy(() => CollectionItemsUncheckedUpdateManyWithoutCollectionsInputObjectSchema),
		]),
	})
	.strict();

export const CollectionItemsUpdateManyWithWhereWithoutBookmarkInputObjectSchema = Schema;
