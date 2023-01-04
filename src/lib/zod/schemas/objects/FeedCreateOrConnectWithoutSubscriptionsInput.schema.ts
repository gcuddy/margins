import { z } from 'zod';
import { FeedWhereUniqueInputObjectSchema } from './FeedWhereUniqueInput.schema';
import { FeedCreateWithoutSubscriptionsInputObjectSchema } from './FeedCreateWithoutSubscriptionsInput.schema';
import { FeedUncheckedCreateWithoutSubscriptionsInputObjectSchema } from './FeedUncheckedCreateWithoutSubscriptionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedCreateOrConnectWithoutSubscriptionsInput> = z
	.object({
		where: z.lazy(() => FeedWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => FeedCreateWithoutSubscriptionsInputObjectSchema),
			z.lazy(() => FeedUncheckedCreateWithoutSubscriptionsInputObjectSchema),
		]),
	})
	.strict();

export const FeedCreateOrConnectWithoutSubscriptionsInputObjectSchema = Schema;
