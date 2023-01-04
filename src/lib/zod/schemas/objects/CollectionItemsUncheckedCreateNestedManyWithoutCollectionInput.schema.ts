import { z } from 'zod';
import { CollectionItemsCreateWithoutCollectionInputObjectSchema } from './CollectionItemsCreateWithoutCollectionInput.schema';
import { CollectionItemsUncheckedCreateWithoutCollectionInputObjectSchema } from './CollectionItemsUncheckedCreateWithoutCollectionInput.schema';
import { CollectionItemsCreateOrConnectWithoutCollectionInputObjectSchema } from './CollectionItemsCreateOrConnectWithoutCollectionInput.schema';
import { CollectionItemsCreateManyCollectionInputEnvelopeObjectSchema } from './CollectionItemsCreateManyCollectionInputEnvelope.schema';
import { CollectionItemsWhereUniqueInputObjectSchema } from './CollectionItemsWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsUncheckedCreateNestedManyWithoutCollectionInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => CollectionItemsCreateWithoutCollectionInputObjectSchema),
				z.lazy(() => CollectionItemsCreateWithoutCollectionInputObjectSchema).array(),
				z.lazy(() => CollectionItemsUncheckedCreateWithoutCollectionInputObjectSchema),
				z.lazy(() => CollectionItemsUncheckedCreateWithoutCollectionInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => CollectionItemsCreateOrConnectWithoutCollectionInputObjectSchema),
				z.lazy(() => CollectionItemsCreateOrConnectWithoutCollectionInputObjectSchema).array(),
			])
			.optional(),
		createMany: z
			.lazy(() => CollectionItemsCreateManyCollectionInputEnvelopeObjectSchema)
			.optional(),
		connect: z
			.union([
				z.lazy(() => CollectionItemsWhereUniqueInputObjectSchema),
				z.lazy(() => CollectionItemsWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const CollectionItemsUncheckedCreateNestedManyWithoutCollectionInputObjectSchema = Schema;
