import { z } from 'zod';
import { EntryDataCreateWithoutUserInputObjectSchema } from './EntryDataCreateWithoutUserInput.schema';
import { EntryDataUncheckedCreateWithoutUserInputObjectSchema } from './EntryDataUncheckedCreateWithoutUserInput.schema';
import { EntryDataCreateOrConnectWithoutUserInputObjectSchema } from './EntryDataCreateOrConnectWithoutUserInput.schema';
import { EntryDataUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './EntryDataUpsertWithWhereUniqueWithoutUserInput.schema';
import { EntryDataCreateManyUserInputEnvelopeObjectSchema } from './EntryDataCreateManyUserInputEnvelope.schema';
import { EntryDataWhereUniqueInputObjectSchema } from './EntryDataWhereUniqueInput.schema';
import { EntryDataUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './EntryDataUpdateWithWhereUniqueWithoutUserInput.schema';
import { EntryDataUpdateManyWithWhereWithoutUserInputObjectSchema } from './EntryDataUpdateManyWithWhereWithoutUserInput.schema';
import { EntryDataScalarWhereInputObjectSchema } from './EntryDataScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryDataUpdateManyWithoutUserNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryDataCreateWithoutUserInputObjectSchema),
				z.lazy(() => EntryDataCreateWithoutUserInputObjectSchema).array(),
				z.lazy(() => EntryDataUncheckedCreateWithoutUserInputObjectSchema),
				z.lazy(() => EntryDataUncheckedCreateWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => EntryDataCreateOrConnectWithoutUserInputObjectSchema),
				z.lazy(() => EntryDataCreateOrConnectWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => EntryDataUpsertWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => EntryDataUpsertWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => EntryDataCreateManyUserInputEnvelopeObjectSchema).optional(),
		set: z
			.union([
				z.lazy(() => EntryDataWhereUniqueInputObjectSchema),
				z.lazy(() => EntryDataWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => EntryDataWhereUniqueInputObjectSchema),
				z.lazy(() => EntryDataWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => EntryDataWhereUniqueInputObjectSchema),
				z.lazy(() => EntryDataWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => EntryDataWhereUniqueInputObjectSchema),
				z.lazy(() => EntryDataWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => EntryDataUpdateWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => EntryDataUpdateWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => EntryDataUpdateManyWithWhereWithoutUserInputObjectSchema),
				z.lazy(() => EntryDataUpdateManyWithWhereWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => EntryDataScalarWhereInputObjectSchema),
				z.lazy(() => EntryDataScalarWhereInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const EntryDataUpdateManyWithoutUserNestedInputObjectSchema = Schema;
