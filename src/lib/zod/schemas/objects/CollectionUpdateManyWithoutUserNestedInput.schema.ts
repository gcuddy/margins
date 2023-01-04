import { z } from 'zod';
import { CollectionCreateWithoutUserInputObjectSchema } from './CollectionCreateWithoutUserInput.schema';
import { CollectionUncheckedCreateWithoutUserInputObjectSchema } from './CollectionUncheckedCreateWithoutUserInput.schema';
import { CollectionCreateOrConnectWithoutUserInputObjectSchema } from './CollectionCreateOrConnectWithoutUserInput.schema';
import { CollectionUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './CollectionUpsertWithWhereUniqueWithoutUserInput.schema';
import { CollectionCreateManyUserInputEnvelopeObjectSchema } from './CollectionCreateManyUserInputEnvelope.schema';
import { CollectionWhereUniqueInputObjectSchema } from './CollectionWhereUniqueInput.schema';
import { CollectionUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './CollectionUpdateWithWhereUniqueWithoutUserInput.schema';
import { CollectionUpdateManyWithWhereWithoutUserInputObjectSchema } from './CollectionUpdateManyWithWhereWithoutUserInput.schema';
import { CollectionScalarWhereInputObjectSchema } from './CollectionScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CollectionUpdateManyWithoutUserNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => CollectionCreateWithoutUserInputObjectSchema),
				z.lazy(() => CollectionCreateWithoutUserInputObjectSchema).array(),
				z.lazy(() => CollectionUncheckedCreateWithoutUserInputObjectSchema),
				z.lazy(() => CollectionUncheckedCreateWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => CollectionCreateOrConnectWithoutUserInputObjectSchema),
				z.lazy(() => CollectionCreateOrConnectWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => CollectionUpsertWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => CollectionUpsertWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => CollectionCreateManyUserInputEnvelopeObjectSchema).optional(),
		set: z
			.union([
				z.lazy(() => CollectionWhereUniqueInputObjectSchema),
				z.lazy(() => CollectionWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => CollectionWhereUniqueInputObjectSchema),
				z.lazy(() => CollectionWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => CollectionWhereUniqueInputObjectSchema),
				z.lazy(() => CollectionWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => CollectionWhereUniqueInputObjectSchema),
				z.lazy(() => CollectionWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => CollectionUpdateWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => CollectionUpdateWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => CollectionUpdateManyWithWhereWithoutUserInputObjectSchema),
				z.lazy(() => CollectionUpdateManyWithWhereWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => CollectionScalarWhereInputObjectSchema),
				z.lazy(() => CollectionScalarWhereInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const CollectionUpdateManyWithoutUserNestedInputObjectSchema = Schema;
