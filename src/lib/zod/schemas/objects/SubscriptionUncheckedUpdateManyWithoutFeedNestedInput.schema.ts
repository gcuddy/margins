import { z } from 'zod';
import { SubscriptionCreateWithoutFeedInputObjectSchema } from './SubscriptionCreateWithoutFeedInput.schema';
import { SubscriptionUncheckedCreateWithoutFeedInputObjectSchema } from './SubscriptionUncheckedCreateWithoutFeedInput.schema';
import { SubscriptionCreateOrConnectWithoutFeedInputObjectSchema } from './SubscriptionCreateOrConnectWithoutFeedInput.schema';
import { SubscriptionUpsertWithWhereUniqueWithoutFeedInputObjectSchema } from './SubscriptionUpsertWithWhereUniqueWithoutFeedInput.schema';
import { SubscriptionCreateManyFeedInputEnvelopeObjectSchema } from './SubscriptionCreateManyFeedInputEnvelope.schema';
import { SubscriptionWhereUniqueInputObjectSchema } from './SubscriptionWhereUniqueInput.schema';
import { SubscriptionUpdateWithWhereUniqueWithoutFeedInputObjectSchema } from './SubscriptionUpdateWithWhereUniqueWithoutFeedInput.schema';
import { SubscriptionUpdateManyWithWhereWithoutFeedInputObjectSchema } from './SubscriptionUpdateManyWithWhereWithoutFeedInput.schema';
import { SubscriptionScalarWhereInputObjectSchema } from './SubscriptionScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionUncheckedUpdateManyWithoutFeedNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => SubscriptionCreateWithoutFeedInputObjectSchema),
				z.lazy(() => SubscriptionCreateWithoutFeedInputObjectSchema).array(),
				z.lazy(() => SubscriptionUncheckedCreateWithoutFeedInputObjectSchema),
				z.lazy(() => SubscriptionUncheckedCreateWithoutFeedInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => SubscriptionCreateOrConnectWithoutFeedInputObjectSchema),
				z.lazy(() => SubscriptionCreateOrConnectWithoutFeedInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => SubscriptionUpsertWithWhereUniqueWithoutFeedInputObjectSchema),
				z.lazy(() => SubscriptionUpsertWithWhereUniqueWithoutFeedInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => SubscriptionCreateManyFeedInputEnvelopeObjectSchema).optional(),
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
				z.lazy(() => SubscriptionUpdateWithWhereUniqueWithoutFeedInputObjectSchema),
				z.lazy(() => SubscriptionUpdateWithWhereUniqueWithoutFeedInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => SubscriptionUpdateManyWithWhereWithoutFeedInputObjectSchema),
				z.lazy(() => SubscriptionUpdateManyWithWhereWithoutFeedInputObjectSchema).array(),
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

export const SubscriptionUncheckedUpdateManyWithoutFeedNestedInputObjectSchema = Schema;
