import { z } from 'zod';
import { CollectionItemsCreateWithoutCollectionInputObjectSchema } from './CollectionItemsCreateWithoutCollectionInput.schema';
import { CollectionItemsUncheckedCreateWithoutCollectionInputObjectSchema } from './CollectionItemsUncheckedCreateWithoutCollectionInput.schema';
import { CollectionItemsCreateOrConnectWithoutCollectionInputObjectSchema } from './CollectionItemsCreateOrConnectWithoutCollectionInput.schema';
import { CollectionItemsUpsertWithWhereUniqueWithoutCollectionInputObjectSchema } from './CollectionItemsUpsertWithWhereUniqueWithoutCollectionInput.schema';
import { CollectionItemsCreateManyCollectionInputEnvelopeObjectSchema } from './CollectionItemsCreateManyCollectionInputEnvelope.schema';
import { CollectionItemsWhereUniqueInputObjectSchema } from './CollectionItemsWhereUniqueInput.schema';
import { CollectionItemsUpdateWithWhereUniqueWithoutCollectionInputObjectSchema } from './CollectionItemsUpdateWithWhereUniqueWithoutCollectionInput.schema';
import { CollectionItemsUpdateManyWithWhereWithoutCollectionInputObjectSchema } from './CollectionItemsUpdateManyWithWhereWithoutCollectionInput.schema';
import { CollectionItemsScalarWhereInputObjectSchema } from './CollectionItemsScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsUpdateManyWithoutCollectionNestedInput> = z
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
		upsert: z
			.union([
				z.lazy(() => CollectionItemsUpsertWithWhereUniqueWithoutCollectionInputObjectSchema),
				z
					.lazy(() => CollectionItemsUpsertWithWhereUniqueWithoutCollectionInputObjectSchema)
					.array(),
			])
			.optional(),
		createMany: z
			.lazy(() => CollectionItemsCreateManyCollectionInputEnvelopeObjectSchema)
			.optional(),
		set: z
			.union([
				z.lazy(() => CollectionItemsWhereUniqueInputObjectSchema),
				z.lazy(() => CollectionItemsWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => CollectionItemsWhereUniqueInputObjectSchema),
				z.lazy(() => CollectionItemsWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => CollectionItemsWhereUniqueInputObjectSchema),
				z.lazy(() => CollectionItemsWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => CollectionItemsWhereUniqueInputObjectSchema),
				z.lazy(() => CollectionItemsWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => CollectionItemsUpdateWithWhereUniqueWithoutCollectionInputObjectSchema),
				z
					.lazy(() => CollectionItemsUpdateWithWhereUniqueWithoutCollectionInputObjectSchema)
					.array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => CollectionItemsUpdateManyWithWhereWithoutCollectionInputObjectSchema),
				z.lazy(() => CollectionItemsUpdateManyWithWhereWithoutCollectionInputObjectSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => CollectionItemsScalarWhereInputObjectSchema),
				z.lazy(() => CollectionItemsScalarWhereInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const CollectionItemsUpdateManyWithoutCollectionNestedInputObjectSchema = Schema;
