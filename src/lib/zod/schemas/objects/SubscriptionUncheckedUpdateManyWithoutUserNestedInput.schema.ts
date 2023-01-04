import { z } from 'zod';
import { SubscriptionCreateWithoutUserInputObjectSchema } from './SubscriptionCreateWithoutUserInput.schema';
import { SubscriptionUncheckedCreateWithoutUserInputObjectSchema } from './SubscriptionUncheckedCreateWithoutUserInput.schema';
import { SubscriptionCreateOrConnectWithoutUserInputObjectSchema } from './SubscriptionCreateOrConnectWithoutUserInput.schema';
import { SubscriptionUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './SubscriptionUpsertWithWhereUniqueWithoutUserInput.schema';
import { SubscriptionCreateManyUserInputEnvelopeObjectSchema } from './SubscriptionCreateManyUserInputEnvelope.schema';
import { SubscriptionWhereUniqueInputObjectSchema } from './SubscriptionWhereUniqueInput.schema';
import { SubscriptionUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './SubscriptionUpdateWithWhereUniqueWithoutUserInput.schema';
import { SubscriptionUpdateManyWithWhereWithoutUserInputObjectSchema } from './SubscriptionUpdateManyWithWhereWithoutUserInput.schema';
import { SubscriptionScalarWhereInputObjectSchema } from './SubscriptionScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionUncheckedUpdateManyWithoutUserNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => SubscriptionCreateWithoutUserInputObjectSchema),
				z.lazy(() => SubscriptionCreateWithoutUserInputObjectSchema).array(),
				z.lazy(() => SubscriptionUncheckedCreateWithoutUserInputObjectSchema),
				z.lazy(() => SubscriptionUncheckedCreateWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => SubscriptionCreateOrConnectWithoutUserInputObjectSchema),
				z.lazy(() => SubscriptionCreateOrConnectWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => SubscriptionUpsertWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => SubscriptionUpsertWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => SubscriptionCreateManyUserInputEnvelopeObjectSchema).optional(),
		set: z
			.union([
				z.lazy(() => SubscriptionWhereUniqueInputObjectSchema),
				z.lazy(() => SubscriptionWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => SubscriptionWhereUniqueInputObjectSchema),
				z.lazy(() => SubscriptionWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => SubscriptionWhereUniqueInputObjectSchema),
				z.lazy(() => SubscriptionWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => SubscriptionWhereUniqueInputObjectSchema),
				z.lazy(() => SubscriptionWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => SubscriptionUpdateWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => SubscriptionUpdateWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => SubscriptionUpdateManyWithWhereWithoutUserInputObjectSchema),
				z.lazy(() => SubscriptionUpdateManyWithWhereWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => SubscriptionScalarWhereInputObjectSchema),
				z.lazy(() => SubscriptionScalarWhereInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const SubscriptionUncheckedUpdateManyWithoutUserNestedInputObjectSchema = Schema;
