import { z } from 'zod';
import { CollectionWhereUniqueInputObjectSchema } from './CollectionWhereUniqueInput.schema';
import { CollectionCreateWithoutItemsInputObjectSchema } from './CollectionCreateWithoutItemsInput.schema';
import { CollectionUncheckedCreateWithoutItemsInputObjectSchema } from './CollectionUncheckedCreateWithoutItemsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionCreateOrConnectWithoutItemsInput> = z
	.object({
		where: z.lazy(() => CollectionWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => CollectionCreateWithoutItemsInputObjectSchema),
			z.lazy(() => CollectionUncheckedCreateWithoutItemsInputObjectSchema),
		]),
	})
	.strict();

export const CollectionCreateOrConnectWithoutItemsInputObjectSchema = Schema;
