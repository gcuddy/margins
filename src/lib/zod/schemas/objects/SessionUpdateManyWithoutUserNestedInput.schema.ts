import { z } from 'zod';
import { SessionCreateWithoutUserInputObjectSchema } from './SessionCreateWithoutUserInput.schema';
import { SessionUncheckedCreateWithoutUserInputObjectSchema } from './SessionUncheckedCreateWithoutUserInput.schema';
import { SessionCreateOrConnectWithoutUserInputObjectSchema } from './SessionCreateOrConnectWithoutUserInput.schema';
import { SessionUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './SessionUpsertWithWhereUniqueWithoutUserInput.schema';
import { SessionCreateManyUserInputEnvelopeObjectSchema } from './SessionCreateManyUserInputEnvelope.schema';
import { SessionWhereUniqueInputObjectSchema } from './SessionWhereUniqueInput.schema';
import { SessionUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './SessionUpdateWithWhereUniqueWithoutUserInput.schema';
import { SessionUpdateManyWithWhereWithoutUserInputObjectSchema } from './SessionUpdateManyWithWhereWithoutUserInput.schema';
import { SessionScalarWhereInputObjectSchema } from './SessionScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SessionUpdateManyWithoutUserNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => SessionCreateWithoutUserInputObjectSchema),
				z.lazy(() => SessionCreateWithoutUserInputObjectSchema).array(),
				z.lazy(() => SessionUncheckedCreateWithoutUserInputObjectSchema),
				z.lazy(() => SessionUncheckedCreateWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => SessionCreateOrConnectWithoutUserInputObjectSchema),
				z.lazy(() => SessionCreateOrConnectWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeObjectSchema).optional(),
		set: z
			.union([
				z.lazy(() => SessionWhereUniqueInputObjectSchema),
				z.lazy(() => SessionWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => SessionWhereUniqueInputObjectSchema),
				z.lazy(() => SessionWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => SessionWhereUniqueInputObjectSchema),
				z.lazy(() => SessionWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => SessionWhereUniqueInputObjectSchema),
				z.lazy(() => SessionWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputObjectSchema),
				z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => SessionScalarWhereInputObjectSchema),
				z.lazy(() => SessionScalarWhereInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const SessionUpdateManyWithoutUserNestedInputObjectSchema = Schema;
