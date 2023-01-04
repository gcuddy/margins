import { z } from 'zod';
import { SubscriptionWhereUniqueInputObjectSchema } from './SubscriptionWhereUniqueInput.schema';
import { SubscriptionUpdateWithoutUserInputObjectSchema } from './SubscriptionUpdateWithoutUserInput.schema';
import { SubscriptionUncheckedUpdateWithoutUserInputObjectSchema } from './SubscriptionUncheckedUpdateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionUpdateWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => SubscriptionWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => SubscriptionUpdateWithoutUserInputObjectSchema),
			z.lazy(() => SubscriptionUncheckedUpdateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const SubscriptionUpdateWithWhereUniqueWithoutUserInputObjectSchema = Schema;
