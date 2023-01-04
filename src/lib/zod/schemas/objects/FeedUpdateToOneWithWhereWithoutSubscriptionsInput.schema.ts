import { z } from 'zod';
import { FeedWhereInputObjectSchema } from './FeedWhereInput.schema';
import { FeedUpdateWithoutSubscriptionsInputObjectSchema } from './FeedUpdateWithoutSubscriptionsInput.schema';
import { FeedUncheckedUpdateWithoutSubscriptionsInputObjectSchema } from './FeedUncheckedUpdateWithoutSubscriptionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedUpdateToOneWithWhereWithoutSubscriptionsInput> = z
	.object({
		where: z.lazy(() => FeedWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => FeedUpdateWithoutSubscriptionsInputObjectSchema),
			z.lazy(() => FeedUncheckedUpdateWithoutSubscriptionsInputObjectSchema),
		]),
	})
	.strict();

export const FeedUpdateToOneWithWhereWithoutSubscriptionsInputObjectSchema = Schema;
