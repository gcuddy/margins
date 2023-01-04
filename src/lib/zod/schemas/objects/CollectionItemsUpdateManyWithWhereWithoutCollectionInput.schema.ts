import { z } from 'zod';
import { CollectionItemsScalarWhereInputObjectSchema } from './CollectionItemsScalarWhereInput.schema';
import { CollectionItemsUpdateManyMutationInputObjectSchema } from './CollectionItemsUpdateManyMutationInput.schema';
import { CollectionItemsUncheckedUpdateManyWithoutItemsInputObjectSchema } from './CollectionItemsUncheckedUpdateManyWithoutItemsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsUpdateManyWithWhereWithoutCollectionInput> = z
	.object({
		where: z.lazy(() => CollectionItemsScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => CollectionItemsUpdateManyMutationInputObjectSchema),
			z.lazy(() => CollectionItemsUncheckedUpdateManyWithoutItemsInputObjectSchema),
		]),
	})
	.strict();

export const CollectionItemsUpdateManyWithWhereWithoutCollectionInputObjectSchema = Schema;
