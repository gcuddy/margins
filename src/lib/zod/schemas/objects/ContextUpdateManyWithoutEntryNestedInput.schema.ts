import { z } from 'zod';
import { ContextCreateWithoutEntryInputObjectSchema } from './ContextCreateWithoutEntryInput.schema';
import { ContextUncheckedCreateWithoutEntryInputObjectSchema } from './ContextUncheckedCreateWithoutEntryInput.schema';
import { ContextCreateOrConnectWithoutEntryInputObjectSchema } from './ContextCreateOrConnectWithoutEntryInput.schema';
import { ContextUpsertWithWhereUniqueWithoutEntryInputObjectSchema } from './ContextUpsertWithWhereUniqueWithoutEntryInput.schema';
import { ContextCreateManyEntryInputEnvelopeObjectSchema } from './ContextCreateManyEntryInputEnvelope.schema';
import { ContextWhereUniqueInputObjectSchema } from './ContextWhereUniqueInput.schema';
import { ContextUpdateWithWhereUniqueWithoutEntryInputObjectSchema } from './ContextUpdateWithWhereUniqueWithoutEntryInput.schema';
import { ContextUpdateManyWithWhereWithoutEntryInputObjectSchema } from './ContextUpdateManyWithWhereWithoutEntryInput.schema';
import { ContextScalarWhereInputObjectSchema } from './ContextScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextUpdateManyWithoutEntryNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => ContextCreateWithoutEntryInputObjectSchema),
				z.lazy(() => ContextCreateWithoutEntryInputObjectSchema).array(),
				z.lazy(() => ContextUncheckedCreateWithoutEntryInputObjectSchema),
				z.lazy(() => ContextUncheckedCreateWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => ContextCreateOrConnectWithoutEntryInputObjectSchema),
				z.lazy(() => ContextCreateOrConnectWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => ContextUpsertWithWhereUniqueWithoutEntryInputObjectSchema),
				z.lazy(() => ContextUpsertWithWhereUniqueWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => ContextCreateManyEntryInputEnvelopeObjectSchema).optional(),
		set: z
			.union([
				z.lazy(() => ContextWhereUniqueInputObjectSchema),
				z.lazy(() => ContextWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => ContextWhereUniqueInputObjectSchema),
				z.lazy(() => ContextWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => ContextWhereUniqueInputObjectSchema),
				z.lazy(() => ContextWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => ContextWhereUniqueInputObjectSchema),
				z.lazy(() => ContextWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => ContextUpdateWithWhereUniqueWithoutEntryInputObjectSchema),
				z.lazy(() => ContextUpdateWithWhereUniqueWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => ContextUpdateManyWithWhereWithoutEntryInputObjectSchema),
				z.lazy(() => ContextUpdateManyWithWhereWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => ContextScalarWhereInputObjectSchema),
				z.lazy(() => ContextScalarWhereInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const ContextUpdateManyWithoutEntryNestedInputObjectSchema = Schema;
