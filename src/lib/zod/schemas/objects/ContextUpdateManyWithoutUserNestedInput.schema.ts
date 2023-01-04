import { z } from 'zod';
import { ContextCreateWithoutUserInputObjectSchema } from './ContextCreateWithoutUserInput.schema';
import { ContextUncheckedCreateWithoutUserInputObjectSchema } from './ContextUncheckedCreateWithoutUserInput.schema';
import { ContextCreateOrConnectWithoutUserInputObjectSchema } from './ContextCreateOrConnectWithoutUserInput.schema';
import { ContextUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './ContextUpsertWithWhereUniqueWithoutUserInput.schema';
import { ContextCreateManyUserInputEnvelopeObjectSchema } from './ContextCreateManyUserInputEnvelope.schema';
import { ContextWhereUniqueInputObjectSchema } from './ContextWhereUniqueInput.schema';
import { ContextUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './ContextUpdateWithWhereUniqueWithoutUserInput.schema';
import { ContextUpdateManyWithWhereWithoutUserInputObjectSchema } from './ContextUpdateManyWithWhereWithoutUserInput.schema';
import { ContextScalarWhereInputObjectSchema } from './ContextScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextUpdateManyWithoutUserNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => ContextCreateWithoutUserInputObjectSchema),
				z.lazy(() => ContextCreateWithoutUserInputObjectSchema).array(),
				z.lazy(() => ContextUncheckedCreateWithoutUserInputObjectSchema),
				z.lazy(() => ContextUncheckedCreateWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => ContextCreateOrConnectWithoutUserInputObjectSchema),
				z.lazy(() => ContextCreateOrConnectWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => ContextUpsertWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => ContextUpsertWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => ContextCreateManyUserInputEnvelopeObjectSchema).optional(),
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
				z.lazy(() => ContextUpdateWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => ContextUpdateWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => ContextUpdateManyWithWhereWithoutUserInputObjectSchema),
				z.lazy(() => ContextUpdateManyWithWhereWithoutUserInputObjectSchema).array(),
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

export const ContextUpdateManyWithoutUserNestedInputObjectSchema = Schema;
