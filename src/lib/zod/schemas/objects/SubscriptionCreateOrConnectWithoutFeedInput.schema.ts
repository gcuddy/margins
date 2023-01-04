import { z } from 'zod';
import { SubscriptionWhereUniqueInputObjectSchema } from './SubscriptionWhereUniqueInput.schema';
import { SubscriptionCreateWithoutFeedInputObjectSchema } from './SubscriptionCreateWithoutFeedInput.schema';
import { SubscriptionUncheckedCreateWithoutFeedInputObjectSchema } from './SubscriptionUncheckedCreateWithoutFeedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionCreateOrConnectWithoutFeedInput> = z
	.object({
		where: z.lazy(() => SubscriptionWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => SubscriptionCreateWithoutFeedInputObjectSchema),
			z.lazy(() => SubscriptionUncheckedCreateWithoutFeedInputObjectSchema),
		]),
	})
	.strict();

export const SubscriptionCreateOrConnectWithoutFeedInputObjectSchema = Schema;
