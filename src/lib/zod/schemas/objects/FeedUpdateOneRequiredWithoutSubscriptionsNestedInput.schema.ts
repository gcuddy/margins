import { z } from 'zod';
import { FeedCreateWithoutSubscriptionsInputObjectSchema } from './FeedCreateWithoutSubscriptionsInput.schema';
import { FeedUncheckedCreateWithoutSubscriptionsInputObjectSchema } from './FeedUncheckedCreateWithoutSubscriptionsInput.schema';
import { FeedCreateOrConnectWithoutSubscriptionsInputObjectSchema } from './FeedCreateOrConnectWithoutSubscriptionsInput.schema';
import { FeedUpsertWithoutSubscriptionsInputObjectSchema } from './FeedUpsertWithoutSubscriptionsInput.schema';
import { FeedWhereUniqueInputObjectSchema } from './FeedWhereUniqueInput.schema';
import { FeedUpdateToOneWithWhereWithoutSubscriptionsInputObjectSchema } from './FeedUpdateToOneWithWhereWithoutSubscriptionsInput.schema';
import { FeedUpdateWithoutSubscriptionsInputObjectSchema } from './FeedUpdateWithoutSubscriptionsInput.schema';
import { FeedUncheckedUpdateWithoutSubscriptionsInputObjectSchema } from './FeedUncheckedUpdateWithoutSubscriptionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedUpdateOneRequiredWithoutSubscriptionsNestedInput> = z
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
		upsert: z.lazy(() => FeedUpsertWithoutSubscriptionsInputObjectSchema).optional(),
		connect: z.lazy(() => FeedWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => FeedUpdateToOneWithWhereWithoutSubscriptionsInputObjectSchema),
				z.lazy(() => FeedUpdateWithoutSubscriptionsInputObjectSchema),
				z.lazy(() => FeedUncheckedUpdateWithoutSubscriptionsInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const FeedUpdateOneRequiredWithoutSubscriptionsNestedInputObjectSchema = Schema;
