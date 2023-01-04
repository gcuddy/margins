import { z } from 'zod';
import { CollectionWhereInputObjectSchema } from './CollectionWhereInput.schema';
import { CollectionUpdateWithoutItemsInputObjectSchema } from './CollectionUpdateWithoutItemsInput.schema';
import { CollectionUncheckedUpdateWithoutItemsInputObjectSchema } from './CollectionUncheckedUpdateWithoutItemsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionUpdateToOneWithWhereWithoutItemsInput> = z
	.object({
		where: z.lazy(() => CollectionWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => CollectionUpdateWithoutItemsInputObjectSchema),
			z.lazy(() => CollectionUncheckedUpdateWithoutItemsInputObjectSchema),
		]),
	})
	.strict();

export const CollectionUpdateToOneWithWhereWithoutItemsInputObjectSchema = Schema;
