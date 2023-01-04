import { z } from 'zod';
import { EntryMediaCreateWithoutEntryInputObjectSchema } from './EntryMediaCreateWithoutEntryInput.schema';
import { EntryMediaUncheckedCreateWithoutEntryInputObjectSchema } from './EntryMediaUncheckedCreateWithoutEntryInput.schema';
import { EntryMediaCreateOrConnectWithoutEntryInputObjectSchema } from './EntryMediaCreateOrConnectWithoutEntryInput.schema';
import { EntryMediaUpsertWithWhereUniqueWithoutEntryInputObjectSchema } from './EntryMediaUpsertWithWhereUniqueWithoutEntryInput.schema';
import { EntryMediaCreateManyEntryInputEnvelopeObjectSchema } from './EntryMediaCreateManyEntryInputEnvelope.schema';
import { EntryMediaWhereUniqueInputObjectSchema } from './EntryMediaWhereUniqueInput.schema';
import { EntryMediaUpdateWithWhereUniqueWithoutEntryInputObjectSchema } from './EntryMediaUpdateWithWhereUniqueWithoutEntryInput.schema';
import { EntryMediaUpdateManyWithWhereWithoutEntryInputObjectSchema } from './EntryMediaUpdateManyWithWhereWithoutEntryInput.schema';
import { EntryMediaScalarWhereInputObjectSchema } from './EntryMediaScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaUncheckedUpdateManyWithoutEntryNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryMediaCreateWithoutEntryInputObjectSchema),
				z.lazy(() => EntryMediaCreateWithoutEntryInputObjectSchema).array(),
				z.lazy(() => EntryMediaUncheckedCreateWithoutEntryInputObjectSchema),
				z.lazy(() => EntryMediaUncheckedCreateWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => EntryMediaCreateOrConnectWithoutEntryInputObjectSchema),
				z.lazy(() => EntryMediaCreateOrConnectWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => EntryMediaUpsertWithWhereUniqueWithoutEntryInputObjectSchema),
				z.lazy(() => EntryMediaUpsertWithWhereUniqueWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => EntryMediaCreateManyEntryInputEnvelopeObjectSchema).optional(),
		set: z
			.union([
				z.lazy(() => EntryMediaWhereUniqueInputObjectSchema),
				z.lazy(() => EntryMediaWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => EntryMediaWhereUniqueInputObjectSchema),
				z.lazy(() => EntryMediaWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => EntryMediaWhereUniqueInputObjectSchema),
				z.lazy(() => EntryMediaWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => EntryMediaWhereUniqueInputObjectSchema),
				z.lazy(() => EntryMediaWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => EntryMediaUpdateWithWhereUniqueWithoutEntryInputObjectSchema),
				z.lazy(() => EntryMediaUpdateWithWhereUniqueWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => EntryMediaUpdateManyWithWhereWithoutEntryInputObjectSchema),
				z.lazy(() => EntryMediaUpdateManyWithWhereWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => EntryMediaScalarWhereInputObjectSchema),
				z.lazy(() => EntryMediaScalarWhereInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const EntryMediaUncheckedUpdateManyWithoutEntryNestedInputObjectSchema = Schema;
