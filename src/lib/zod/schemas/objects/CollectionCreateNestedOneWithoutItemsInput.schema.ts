import { z } from 'zod';
import { CollectionCreateWithoutItemsInputObjectSchema } from './CollectionCreateWithoutItemsInput.schema';
import { CollectionUncheckedCreateWithoutItemsInputObjectSchema } from './CollectionUncheckedCreateWithoutItemsInput.schema';
import { CollectionCreateOrConnectWithoutItemsInputObjectSchema } from './CollectionCreateOrConnectWithoutItemsInput.schema';
import { CollectionWhereUniqueInputObjectSchema } from './CollectionWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionCreateNestedOneWithoutItemsInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => CollectionCreateWithoutItemsInputObjectSchema),
				z.lazy(() => CollectionUncheckedCreateWithoutItemsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => CollectionCreateOrConnectWithoutItemsInputObjectSchema)
			.optional(),
		connect: z.lazy(() => CollectionWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const CollectionCreateNestedOneWithoutItemsInputObjectSchema = Schema;
