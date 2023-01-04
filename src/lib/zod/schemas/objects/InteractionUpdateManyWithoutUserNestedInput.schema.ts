import { z } from 'zod';
import { InteractionCreateWithoutUserInputObjectSchema } from './InteractionCreateWithoutUserInput.schema';
import { InteractionUncheckedCreateWithoutUserInputObjectSchema } from './InteractionUncheckedCreateWithoutUserInput.schema';
import { InteractionCreateOrConnectWithoutUserInputObjectSchema } from './InteractionCreateOrConnectWithoutUserInput.schema';
import { InteractionUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './InteractionUpsertWithWhereUniqueWithoutUserInput.schema';
import { InteractionCreateManyUserInputEnvelopeObjectSchema } from './InteractionCreateManyUserInputEnvelope.schema';
import { InteractionWhereUniqueInputObjectSchema } from './InteractionWhereUniqueInput.schema';
import { InteractionUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './InteractionUpdateWithWhereUniqueWithoutUserInput.schema';
import { InteractionUpdateManyWithWhereWithoutUserInputObjectSchema } from './InteractionUpdateManyWithWhereWithoutUserInput.schema';
import { InteractionScalarWhereInputObjectSchema } from './InteractionScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionUpdateManyWithoutUserNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => InteractionCreateWithoutUserInputObjectSchema),
				z.lazy(() => InteractionCreateWithoutUserInputObjectSchema).array(),
				z.lazy(() => InteractionUncheckedCreateWithoutUserInputObjectSchema),
				z.lazy(() => InteractionUncheckedCreateWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => InteractionCreateOrConnectWithoutUserInputObjectSchema),
				z.lazy(() => InteractionCreateOrConnectWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => InteractionUpsertWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => InteractionUpsertWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => InteractionCreateManyUserInputEnvelopeObjectSchema).optional(),
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
				z.lazy(() => InteractionUpdateWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => InteractionUpdateWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => InteractionUpdateManyWithWhereWithoutUserInputObjectSchema),
				z.lazy(() => InteractionUpdateManyWithWhereWithoutUserInputObjectSchema).array(),
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

export const InteractionUpdateManyWithoutUserNestedInputObjectSchema = Schema;
