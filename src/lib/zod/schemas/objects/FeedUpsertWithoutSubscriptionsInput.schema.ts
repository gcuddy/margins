import { z } from 'zod';
import { FeedUpdateWithoutSubscriptionsInputObjectSchema } from './FeedUpdateWithoutSubscriptionsInput.schema';
import { FeedUncheckedUpdateWithoutSubscriptionsInputObjectSchema } from './FeedUncheckedUpdateWithoutSubscriptionsInput.schema';
import { FeedCreateWithoutSubscriptionsInputObjectSchema } from './FeedCreateWithoutSubscriptionsInput.schema';
import { FeedUncheckedCreateWithoutSubscriptionsInputObjectSchema } from './FeedUncheckedCreateWithoutSubscriptionsInput.schema';
import { FeedWhereInputObjectSchema } from './FeedWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedUpsertWithoutSubscriptionsInput> = z
	.object({
		update: z.union([
			z.lazy(() => FeedUpdateWithoutSubscriptionsInputObjectSchema),
			z.lazy(() => FeedUncheckedUpdateWithoutSubscriptionsInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => FeedCreateWithoutSubscriptionsInputObjectSchema),
			z.lazy(() => FeedUncheckedCreateWithoutSubscriptionsInputObjectSchema),
		]),
		where: z.lazy(() => FeedWhereInputObjectSchema).optional(),
	})
	.strict();

export const FeedUpsertWithoutSubscriptionsInputObjectSchema = Schema;
