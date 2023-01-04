import { z } from 'zod';
import { SubscriptionScalarWhereInputObjectSchema } from './SubscriptionScalarWhereInput.schema';
import { SubscriptionUpdateManyMutationInputObjectSchema } from './SubscriptionUpdateManyMutationInput.schema';
import { SubscriptionUncheckedUpdateManyWithoutSubscriptionsInputObjectSchema } from './SubscriptionUncheckedUpdateManyWithoutSubscriptionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionUpdateManyWithWhereWithoutFeedInput> = z
	.object({
		where: z.lazy(() => SubscriptionScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => SubscriptionUpdateManyMutationInputObjectSchema),
			z.lazy(() => SubscriptionUncheckedUpdateManyWithoutSubscriptionsInputObjectSchema),
		]),
	})
	.strict();

export const SubscriptionUpdateManyWithWhereWithoutFeedInputObjectSchema = Schema;
