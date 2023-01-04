import { z } from 'zod';
import { SubscriptionCreateWithoutFeedInputObjectSchema } from './SubscriptionCreateWithoutFeedInput.schema';
import { SubscriptionUncheckedCreateWithoutFeedInputObjectSchema } from './SubscriptionUncheckedCreateWithoutFeedInput.schema';
import { SubscriptionCreateOrConnectWithoutFeedInputObjectSchema } from './SubscriptionCreateOrConnectWithoutFeedInput.schema';
import { SubscriptionCreateManyFeedInputEnvelopeObjectSchema } from './SubscriptionCreateManyFeedInputEnvelope.schema';
import { SubscriptionWhereUniqueInputObjectSchema } from './SubscriptionWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionCreateNestedManyWithoutFeedInput> = z
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
		createMany: z.lazy(() => SubscriptionCreateManyFeedInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => SubscriptionWhereUniqueInputObjectSchema),
				z.lazy(() => SubscriptionWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const SubscriptionCreateNestedManyWithoutFeedInputObjectSchema = Schema;
