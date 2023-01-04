import { z } from 'zod';
import { EntryDataCreateWithoutEntryInputObjectSchema } from './EntryDataCreateWithoutEntryInput.schema';
import { EntryDataUncheckedCreateWithoutEntryInputObjectSchema } from './EntryDataUncheckedCreateWithoutEntryInput.schema';
import { EntryDataCreateOrConnectWithoutEntryInputObjectSchema } from './EntryDataCreateOrConnectWithoutEntryInput.schema';
import { EntryDataUpsertWithWhereUniqueWithoutEntryInputObjectSchema } from './EntryDataUpsertWithWhereUniqueWithoutEntryInput.schema';
import { EntryDataCreateManyEntryInputEnvelopeObjectSchema } from './EntryDataCreateManyEntryInputEnvelope.schema';
import { EntryDataWhereUniqueInputObjectSchema } from './EntryDataWhereUniqueInput.schema';
import { EntryDataUpdateWithWhereUniqueWithoutEntryInputObjectSchema } from './EntryDataUpdateWithWhereUniqueWithoutEntryInput.schema';
import { EntryDataUpdateManyWithWhereWithoutEntryInputObjectSchema } from './EntryDataUpdateManyWithWhereWithoutEntryInput.schema';
import { EntryDataScalarWhereInputObjectSchema } from './EntryDataScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryDataUpdateManyWithoutEntryNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryDataCreateWithoutEntryInputObjectSchema),
				z.lazy(() => EntryDataCreateWithoutEntryInputObjectSchema).array(),
				z.lazy(() => EntryDataUncheckedCreateWithoutEntryInputObjectSchema),
				z.lazy(() => EntryDataUncheckedCreateWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => EntryDataCreateOrConnectWithoutEntryInputObjectSchema),
				z.lazy(() => EntryDataCreateOrConnectWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => EntryDataUpsertWithWhereUniqueWithoutEntryInputObjectSchema),
				z.lazy(() => EntryDataUpsertWithWhereUniqueWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => EntryDataCreateManyEntryInputEnvelopeObjectSchema).optional(),
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
				z.lazy(() => EntryDataUpdateWithWhereUniqueWithoutEntryInputObjectSchema),
				z.lazy(() => EntryDataUpdateWithWhereUniqueWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => EntryDataUpdateManyWithWhereWithoutEntryInputObjectSchema),
				z.lazy(() => EntryDataUpdateManyWithWhereWithoutEntryInputObjectSchema).array(),
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

export const EntryDataUpdateManyWithoutEntryNestedInputObjectSchema = Schema;
