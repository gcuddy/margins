import { z } from 'zod';
import { CollectionUpdateWithoutItemsInputObjectSchema } from './CollectionUpdateWithoutItemsInput.schema';
import { CollectionUncheckedUpdateWithoutItemsInputObjectSchema } from './CollectionUncheckedUpdateWithoutItemsInput.schema';
import { CollectionCreateWithoutItemsInputObjectSchema } from './CollectionCreateWithoutItemsInput.schema';
import { CollectionUncheckedCreateWithoutItemsInputObjectSchema } from './CollectionUncheckedCreateWithoutItemsInput.schema';
import { CollectionWhereInputObjectSchema } from './CollectionWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionUpsertWithoutItemsInput> = z
	.object({
		update: z.union([
			z.lazy(() => CollectionUpdateWithoutItemsInputObjectSchema),
			z.lazy(() => CollectionUncheckedUpdateWithoutItemsInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => CollectionCreateWithoutItemsInputObjectSchema),
			z.lazy(() => CollectionUncheckedCreateWithoutItemsInputObjectSchema),
		]),
		where: z.lazy(() => CollectionWhereInputObjectSchema).optional(),
	})
	.strict();

export const CollectionUpsertWithoutItemsInputObjectSchema = Schema;
