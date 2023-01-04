import { z } from 'zod';
import { EntryTagCreateWithoutEntryInputObjectSchema } from './EntryTagCreateWithoutEntryInput.schema';
import { EntryTagUncheckedCreateWithoutEntryInputObjectSchema } from './EntryTagUncheckedCreateWithoutEntryInput.schema';
import { EntryTagCreateOrConnectWithoutEntryInputObjectSchema } from './EntryTagCreateOrConnectWithoutEntryInput.schema';
import { EntryTagUpsertWithWhereUniqueWithoutEntryInputObjectSchema } from './EntryTagUpsertWithWhereUniqueWithoutEntryInput.schema';
import { EntryTagCreateManyEntryInputEnvelopeObjectSchema } from './EntryTagCreateManyEntryInputEnvelope.schema';
import { EntryTagWhereUniqueInputObjectSchema } from './EntryTagWhereUniqueInput.schema';
import { EntryTagUpdateWithWhereUniqueWithoutEntryInputObjectSchema } from './EntryTagUpdateWithWhereUniqueWithoutEntryInput.schema';
import { EntryTagUpdateManyWithWhereWithoutEntryInputObjectSchema } from './EntryTagUpdateManyWithWhereWithoutEntryInput.schema';
import { EntryTagScalarWhereInputObjectSchema } from './EntryTagScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagUncheckedUpdateManyWithoutEntryNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryTagCreateWithoutEntryInputObjectSchema),
				z.lazy(() => EntryTagCreateWithoutEntryInputObjectSchema).array(),
				z.lazy(() => EntryTagUncheckedCreateWithoutEntryInputObjectSchema),
				z.lazy(() => EntryTagUncheckedCreateWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => EntryTagCreateOrConnectWithoutEntryInputObjectSchema),
				z.lazy(() => EntryTagCreateOrConnectWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => EntryTagUpsertWithWhereUniqueWithoutEntryInputObjectSchema),
				z.lazy(() => EntryTagUpsertWithWhereUniqueWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => EntryTagCreateManyEntryInputEnvelopeObjectSchema).optional(),
		set: z
			.union([
				z.lazy(() => EntryTagWhereUniqueInputObjectSchema),
				z.lazy(() => EntryTagWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => EntryTagWhereUniqueInputObjectSchema),
				z.lazy(() => EntryTagWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => EntryTagWhereUniqueInputObjectSchema),
				z.lazy(() => EntryTagWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => EntryTagWhereUniqueInputObjectSchema),
				z.lazy(() => EntryTagWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => EntryTagUpdateWithWhereUniqueWithoutEntryInputObjectSchema),
				z.lazy(() => EntryTagUpdateWithWhereUniqueWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => EntryTagUpdateManyWithWhereWithoutEntryInputObjectSchema),
				z.lazy(() => EntryTagUpdateManyWithWhereWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => EntryTagScalarWhereInputObjectSchema),
				z.lazy(() => EntryTagScalarWhereInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const EntryTagUncheckedUpdateManyWithoutEntryNestedInputObjectSchema = Schema;
