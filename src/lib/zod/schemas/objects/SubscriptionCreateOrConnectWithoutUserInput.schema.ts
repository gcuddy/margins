import { z } from 'zod';
import { SubscriptionWhereUniqueInputObjectSchema } from './SubscriptionWhereUniqueInput.schema';
import { SubscriptionCreateWithoutUserInputObjectSchema } from './SubscriptionCreateWithoutUserInput.schema';
import { SubscriptionUncheckedCreateWithoutUserInputObjectSchema } from './SubscriptionUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionCreateOrConnectWithoutUserInput> = z
	.object({
		where: z.lazy(() => SubscriptionWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => SubscriptionCreateWithoutUserInputObjectSchema),
			z.lazy(() => SubscriptionUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const SubscriptionCreateOrConnectWithoutUserInputObjectSchema = Schema;
