import { z } from 'zod';
import { EntryTagCreateWithoutUserInputObjectSchema } from './EntryTagCreateWithoutUserInput.schema';
import { EntryTagUncheckedCreateWithoutUserInputObjectSchema } from './EntryTagUncheckedCreateWithoutUserInput.schema';
import { EntryTagCreateOrConnectWithoutUserInputObjectSchema } from './EntryTagCreateOrConnectWithoutUserInput.schema';
import { EntryTagUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './EntryTagUpsertWithWhereUniqueWithoutUserInput.schema';
import { EntryTagCreateManyUserInputEnvelopeObjectSchema } from './EntryTagCreateManyUserInputEnvelope.schema';
import { EntryTagWhereUniqueInputObjectSchema } from './EntryTagWhereUniqueInput.schema';
import { EntryTagUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './EntryTagUpdateWithWhereUniqueWithoutUserInput.schema';
import { EntryTagUpdateManyWithWhereWithoutUserInputObjectSchema } from './EntryTagUpdateManyWithWhereWithoutUserInput.schema';
import { EntryTagScalarWhereInputObjectSchema } from './EntryTagScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagUncheckedUpdateManyWithoutUserNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryTagCreateWithoutUserInputObjectSchema),
				z.lazy(() => EntryTagCreateWithoutUserInputObjectSchema).array(),
				z.lazy(() => EntryTagUncheckedCreateWithoutUserInputObjectSchema),
				z.lazy(() => EntryTagUncheckedCreateWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => EntryTagCreateOrConnectWithoutUserInputObjectSchema),
				z.lazy(() => EntryTagCreateOrConnectWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => EntryTagUpsertWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => EntryTagUpsertWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => EntryTagCreateManyUserInputEnvelopeObjectSchema).optional(),
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
				z.lazy(() => EntryTagUpdateWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => EntryTagUpdateWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => EntryTagUpdateManyWithWhereWithoutUserInputObjectSchema),
				z.lazy(() => EntryTagUpdateManyWithWhereWithoutUserInputObjectSchema).array(),
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

export const EntryTagUncheckedUpdateManyWithoutUserNestedInputObjectSchema = Schema;
