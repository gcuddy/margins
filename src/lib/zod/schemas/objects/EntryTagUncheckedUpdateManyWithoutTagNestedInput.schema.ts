import { z } from 'zod';
import { EntryTagCreateWithoutTagInputObjectSchema } from './EntryTagCreateWithoutTagInput.schema';
import { EntryTagUncheckedCreateWithoutTagInputObjectSchema } from './EntryTagUncheckedCreateWithoutTagInput.schema';
import { EntryTagCreateOrConnectWithoutTagInputObjectSchema } from './EntryTagCreateOrConnectWithoutTagInput.schema';
import { EntryTagUpsertWithWhereUniqueWithoutTagInputObjectSchema } from './EntryTagUpsertWithWhereUniqueWithoutTagInput.schema';
import { EntryTagCreateManyTagInputEnvelopeObjectSchema } from './EntryTagCreateManyTagInputEnvelope.schema';
import { EntryTagWhereUniqueInputObjectSchema } from './EntryTagWhereUniqueInput.schema';
import { EntryTagUpdateWithWhereUniqueWithoutTagInputObjectSchema } from './EntryTagUpdateWithWhereUniqueWithoutTagInput.schema';
import { EntryTagUpdateManyWithWhereWithoutTagInputObjectSchema } from './EntryTagUpdateManyWithWhereWithoutTagInput.schema';
import { EntryTagScalarWhereInputObjectSchema } from './EntryTagScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagUncheckedUpdateManyWithoutTagNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryTagCreateWithoutTagInputObjectSchema),
				z.lazy(() => EntryTagCreateWithoutTagInputObjectSchema).array(),
				z.lazy(() => EntryTagUncheckedCreateWithoutTagInputObjectSchema),
				z.lazy(() => EntryTagUncheckedCreateWithoutTagInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => EntryTagCreateOrConnectWithoutTagInputObjectSchema),
				z.lazy(() => EntryTagCreateOrConnectWithoutTagInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => EntryTagUpsertWithWhereUniqueWithoutTagInputObjectSchema),
				z.lazy(() => EntryTagUpsertWithWhereUniqueWithoutTagInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => EntryTagCreateManyTagInputEnvelopeObjectSchema).optional(),
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
				z.lazy(() => EntryTagUpdateWithWhereUniqueWithoutTagInputObjectSchema),
				z.lazy(() => EntryTagUpdateWithWhereUniqueWithoutTagInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => EntryTagUpdateManyWithWhereWithoutTagInputObjectSchema),
				z.lazy(() => EntryTagUpdateManyWithWhereWithoutTagInputObjectSchema).array(),
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

export const EntryTagUncheckedUpdateManyWithoutTagNestedInputObjectSchema = Schema;
