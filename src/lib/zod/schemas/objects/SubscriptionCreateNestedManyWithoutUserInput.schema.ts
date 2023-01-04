import { z } from 'zod';
import { SubscriptionCreateWithoutUserInputObjectSchema } from './SubscriptionCreateWithoutUserInput.schema';
import { SubscriptionUncheckedCreateWithoutUserInputObjectSchema } from './SubscriptionUncheckedCreateWithoutUserInput.schema';
import { SubscriptionCreateOrConnectWithoutUserInputObjectSchema } from './SubscriptionCreateOrConnectWithoutUserInput.schema';
import { SubscriptionCreateManyUserInputEnvelopeObjectSchema } from './SubscriptionCreateManyUserInputEnvelope.schema';
import { SubscriptionWhereUniqueInputObjectSchema } from './SubscriptionWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionCreateNestedManyWithoutUserInput> = z
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
		createMany: z.lazy(() => SubscriptionCreateManyUserInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => SubscriptionWhereUniqueInputObjectSchema),
				z.lazy(() => SubscriptionWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const SubscriptionCreateNestedManyWithoutUserInputObjectSchema = Schema;
