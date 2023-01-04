import { z } from 'zod';
import { StateCreateWithoutUserInputObjectSchema } from './StateCreateWithoutUserInput.schema';
import { StateUncheckedCreateWithoutUserInputObjectSchema } from './StateUncheckedCreateWithoutUserInput.schema';
import { StateCreateOrConnectWithoutUserInputObjectSchema } from './StateCreateOrConnectWithoutUserInput.schema';
import { StateUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './StateUpsertWithWhereUniqueWithoutUserInput.schema';
import { StateCreateManyUserInputEnvelopeObjectSchema } from './StateCreateManyUserInputEnvelope.schema';
import { StateWhereUniqueInputObjectSchema } from './StateWhereUniqueInput.schema';
import { StateUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './StateUpdateWithWhereUniqueWithoutUserInput.schema';
import { StateUpdateManyWithWhereWithoutUserInputObjectSchema } from './StateUpdateManyWithWhereWithoutUserInput.schema';
import { StateScalarWhereInputObjectSchema } from './StateScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateUpdateManyWithoutUserNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => StateCreateWithoutUserInputObjectSchema),
				z.lazy(() => StateCreateWithoutUserInputObjectSchema).array(),
				z.lazy(() => StateUncheckedCreateWithoutUserInputObjectSchema),
				z.lazy(() => StateUncheckedCreateWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => StateCreateOrConnectWithoutUserInputObjectSchema),
				z.lazy(() => StateCreateOrConnectWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => StateUpsertWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => StateUpsertWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => StateCreateManyUserInputEnvelopeObjectSchema).optional(),
		set: z
			.union([
				z.lazy(() => StateWhereUniqueInputObjectSchema),
				z.lazy(() => StateWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => StateWhereUniqueInputObjectSchema),
				z.lazy(() => StateWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => StateWhereUniqueInputObjectSchema),
				z.lazy(() => StateWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => StateWhereUniqueInputObjectSchema),
				z.lazy(() => StateWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => StateUpdateWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => StateUpdateWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => StateUpdateManyWithWhereWithoutUserInputObjectSchema),
				z.lazy(() => StateUpdateManyWithWhereWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => StateScalarWhereInputObjectSchema),
				z.lazy(() => StateScalarWhereInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const StateUpdateManyWithoutUserNestedInputObjectSchema = Schema;
