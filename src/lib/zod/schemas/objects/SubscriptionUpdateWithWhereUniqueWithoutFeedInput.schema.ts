import { z } from 'zod';
import { SubscriptionWhereUniqueInputObjectSchema } from './SubscriptionWhereUniqueInput.schema';
import { SubscriptionUpdateWithoutFeedInputObjectSchema } from './SubscriptionUpdateWithoutFeedInput.schema';
import { SubscriptionUncheckedUpdateWithoutFeedInputObjectSchema } from './SubscriptionUncheckedUpdateWithoutFeedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionUpdateWithWhereUniqueWithoutFeedInput> = z
	.object({
		where: z.lazy(() => SubscriptionWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => SubscriptionUpdateWithoutFeedInputObjectSchema),
			z.lazy(() => SubscriptionUncheckedUpdateWithoutFeedInputObjectSchema),
		]),
	})
	.strict();

export const SubscriptionUpdateWithWhereUniqueWithoutFeedInputObjectSchema = Schema;
