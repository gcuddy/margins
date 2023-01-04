import { z } from 'zod';
import { SubscriptionWhereUniqueInputObjectSchema } from './SubscriptionWhereUniqueInput.schema';
import { SubscriptionUpdateWithoutUserInputObjectSchema } from './SubscriptionUpdateWithoutUserInput.schema';
import { SubscriptionUncheckedUpdateWithoutUserInputObjectSchema } from './SubscriptionUncheckedUpdateWithoutUserInput.schema';
import { SubscriptionCreateWithoutUserInputObjectSchema } from './SubscriptionCreateWithoutUserInput.schema';
import { SubscriptionUncheckedCreateWithoutUserInputObjectSchema } from './SubscriptionUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionUpsertWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => SubscriptionWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => SubscriptionUpdateWithoutUserInputObjectSchema),
			z.lazy(() => SubscriptionUncheckedUpdateWithoutUserInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => SubscriptionCreateWithoutUserInputObjectSchema),
			z.lazy(() => SubscriptionUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const SubscriptionUpsertWithWhereUniqueWithoutUserInputObjectSchema = Schema;
