import { z } from 'zod';
import { SubscriptionWhereUniqueInputObjectSchema } from './SubscriptionWhereUniqueInput.schema';
import { SubscriptionUpdateWithoutFeedInputObjectSchema } from './SubscriptionUpdateWithoutFeedInput.schema';
import { SubscriptionUncheckedUpdateWithoutFeedInputObjectSchema } from './SubscriptionUncheckedUpdateWithoutFeedInput.schema';
import { SubscriptionCreateWithoutFeedInputObjectSchema } from './SubscriptionCreateWithoutFeedInput.schema';
import { SubscriptionUncheckedCreateWithoutFeedInputObjectSchema } from './SubscriptionUncheckedCreateWithoutFeedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionUpsertWithWhereUniqueWithoutFeedInput> = z
	.object({
		where: z.lazy(() => SubscriptionWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => SubscriptionUpdateWithoutFeedInputObjectSchema),
			z.lazy(() => SubscriptionUncheckedUpdateWithoutFeedInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => SubscriptionCreateWithoutFeedInputObjectSchema),
			z.lazy(() => SubscriptionUncheckedCreateWithoutFeedInputObjectSchema),
		]),
	})
	.strict();

export const SubscriptionUpsertWithWhereUniqueWithoutFeedInputObjectSchema = Schema;
