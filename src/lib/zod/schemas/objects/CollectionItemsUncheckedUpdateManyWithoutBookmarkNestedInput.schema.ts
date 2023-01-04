import { z } from 'zod';
import { CollectionItemsCreateWithoutBookmarkInputObjectSchema } from './CollectionItemsCreateWithoutBookmarkInput.schema';
import { CollectionItemsUncheckedCreateWithoutBookmarkInputObjectSchema } from './CollectionItemsUncheckedCreateWithoutBookmarkInput.schema';
import { CollectionItemsCreateOrConnectWithoutBookmarkInputObjectSchema } from './CollectionItemsCreateOrConnectWithoutBookmarkInput.schema';
import { CollectionItemsUpsertWithWhereUniqueWithoutBookmarkInputObjectSchema } from './CollectionItemsUpsertWithWhereUniqueWithoutBookmarkInput.schema';
import { CollectionItemsCreateManyBookmarkInputEnvelopeObjectSchema } from './CollectionItemsCreateManyBookmarkInputEnvelope.schema';
import { CollectionItemsWhereUniqueInputObjectSchema } from './CollectionItemsWhereUniqueInput.schema';
import { CollectionItemsUpdateWithWhereUniqueWithoutBookmarkInputObjectSchema } from './CollectionItemsUpdateWithWhereUniqueWithoutBookmarkInput.schema';
import { CollectionItemsUpdateManyWithWhereWithoutBookmarkInputObjectSchema } from './CollectionItemsUpdateManyWithWhereWithoutBookmarkInput.schema';
import { CollectionItemsScalarWhereInputObjectSchema } from './CollectionItemsScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionItemsUncheckedUpdateManyWithoutBookmarkNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => CollectionItemsCreateWithoutBookmarkInputObjectSchema),
				z.lazy(() => CollectionItemsCreateWithoutBookmarkInputObjectSchema).array(),
				z.lazy(() => CollectionItemsUncheckedCreateWithoutBookmarkInputObjectSchema),
				z.lazy(() => CollectionItemsUncheckedCreateWithoutBookmarkInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => CollectionItemsCreateOrConnectWithoutBookmarkInputObjectSchema),
				z.lazy(() => CollectionItemsCreateOrConnectWithoutBookmarkInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => CollectionItemsUpsertWithWhereUniqueWithoutBookmarkInputObjectSchema),
				z.lazy(() => CollectionItemsUpsertWithWhereUniqueWithoutBookmarkInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => CollectionItemsCreateManyBookmarkInputEnvelopeObjectSchema).optional(),
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
				z.lazy(() => CollectionItemsUpdateWithWhereUniqueWithoutBookmarkInputObjectSchema),
				z.lazy(() => CollectionItemsUpdateWithWhereUniqueWithoutBookmarkInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => CollectionItemsUpdateManyWithWhereWithoutBookmarkInputObjectSchema),
				z.lazy(() => CollectionItemsUpdateManyWithWhereWithoutBookmarkInputObjectSchema).array(),
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

export const CollectionItemsUncheckedUpdateManyWithoutBookmarkNestedInputObjectSchema = Schema;
