import { z } from 'zod';
import { FeedCreateWithoutSubscriptionsInputObjectSchema } from './FeedCreateWithoutSubscriptionsInput.schema';
import { FeedUncheckedCreateWithoutSubscriptionsInputObjectSchema } from './FeedUncheckedCreateWithoutSubscriptionsInput.schema';
import { FeedCreateOrConnectWithoutSubscriptionsInputObjectSchema } from './FeedCreateOrConnectWithoutSubscriptionsInput.schema';
import { FeedWhereUniqueInputObjectSchema } from './FeedWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedCreateNestedOneWithoutSubscriptionsInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => FeedCreateWithoutSubscriptionsInputObjectSchema),
				z.lazy(() => FeedUncheckedCreateWithoutSubscriptionsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => FeedCreateOrConnectWithoutSubscriptionsInputObjectSchema)
			.optional(),
		connect: z.lazy(() => FeedWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const FeedCreateNestedOneWithoutSubscriptionsInputObjectSchema = Schema;
