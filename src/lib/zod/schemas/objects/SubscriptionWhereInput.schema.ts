import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { FeedRelationFilterObjectSchema } from './FeedRelationFilter.schema';
import { FeedWhereInputObjectSchema } from './FeedWhereInput.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { UserRelationFilterObjectSchema } from './UserRelationFilter.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.SubscriptionWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => SubscriptionWhereInputObjectSchema),
				z.lazy(() => SubscriptionWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => SubscriptionWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => SubscriptionWhereInputObjectSchema),
				z.lazy(() => SubscriptionWhereInputObjectSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		feed: z
			.union([
				z.lazy(() => FeedRelationFilterObjectSchema),
				z.lazy(() => FeedWhereInputObjectSchema),
			])
			.optional(),
		feedId: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		user: z
			.union([
				z.lazy(() => UserRelationFilterObjectSchema),
				z.lazy(() => UserWhereInputObjectSchema),
			])
			.optional(),
		createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		download_full: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
	})
	.strict();

export const SubscriptionWhereInputObjectSchema = Schema;
