import { z } from 'zod';
import { InteractionCreateWithoutEntryInputObjectSchema } from './InteractionCreateWithoutEntryInput.schema';
import { InteractionUncheckedCreateWithoutEntryInputObjectSchema } from './InteractionUncheckedCreateWithoutEntryInput.schema';
import { InteractionCreateOrConnectWithoutEntryInputObjectSchema } from './InteractionCreateOrConnectWithoutEntryInput.schema';
import { InteractionUpsertWithWhereUniqueWithoutEntryInputObjectSchema } from './InteractionUpsertWithWhereUniqueWithoutEntryInput.schema';
import { InteractionCreateManyEntryInputEnvelopeObjectSchema } from './InteractionCreateManyEntryInputEnvelope.schema';
import { InteractionWhereUniqueInputObjectSchema } from './InteractionWhereUniqueInput.schema';
import { InteractionUpdateWithWhereUniqueWithoutEntryInputObjectSchema } from './InteractionUpdateWithWhereUniqueWithoutEntryInput.schema';
import { InteractionUpdateManyWithWhereWithoutEntryInputObjectSchema } from './InteractionUpdateManyWithWhereWithoutEntryInput.schema';
import { InteractionScalarWhereInputObjectSchema } from './InteractionScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionUncheckedUpdateManyWithoutEntryNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => InteractionCreateWithoutEntryInputObjectSchema),
				z.lazy(() => InteractionCreateWithoutEntryInputObjectSchema).array(),
				z.lazy(() => InteractionUncheckedCreateWithoutEntryInputObjectSchema),
				z.lazy(() => InteractionUncheckedCreateWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => InteractionCreateOrConnectWithoutEntryInputObjectSchema),
				z.lazy(() => InteractionCreateOrConnectWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => InteractionUpsertWithWhereUniqueWithoutEntryInputObjectSchema),
				z.lazy(() => InteractionUpsertWithWhereUniqueWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => InteractionCreateManyEntryInputEnvelopeObjectSchema).optional(),
		set: z
			.union([
				z.lazy(() => InteractionWhereUniqueInputObjectSchema),
				z.lazy(() => InteractionWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => InteractionWhereUniqueInputObjectSchema),
				z.lazy(() => InteractionWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => InteractionWhereUniqueInputObjectSchema),
				z.lazy(() => InteractionWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => InteractionWhereUniqueInputObjectSchema),
				z.lazy(() => InteractionWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => InteractionUpdateWithWhereUniqueWithoutEntryInputObjectSchema),
				z.lazy(() => InteractionUpdateWithWhereUniqueWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => InteractionUpdateManyWithWhereWithoutEntryInputObjectSchema),
				z.lazy(() => InteractionUpdateManyWithWhereWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => InteractionScalarWhereInputObjectSchema),
				z.lazy(() => InteractionScalarWhereInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const InteractionUncheckedUpdateManyWithoutEntryNestedInputObjectSchema = Schema;
