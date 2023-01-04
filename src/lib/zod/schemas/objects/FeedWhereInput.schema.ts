import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { EntryListRelationFilterObjectSchema } from './EntryListRelationFilter.schema';
import { TaggingListRelationFilterObjectSchema } from './TaggingListRelationFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { FavoriteRelationFilterObjectSchema } from './FavoriteRelationFilter.schema';
import { FavoriteWhereInputObjectSchema } from './FavoriteWhereInput.schema';
import { IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { SubscriptionListRelationFilterObjectSchema } from './SubscriptionListRelationFilter.schema';
import { ContextListRelationFilterObjectSchema } from './ContextListRelationFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => FeedWhereInputObjectSchema),
				z.lazy(() => FeedWhereInputObjectSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => FeedWhereInputObjectSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => FeedWhereInputObjectSchema),
				z.lazy(() => FeedWhereInputObjectSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
		itunes_id: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		feedUrl: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
		title: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		link: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		creator: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		description: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		lastBuildDate: z
			.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.date()])
			.optional()
			.nullable(),
		imageUrl: z
			.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
			.optional()
			.nullable(),
		entries: z.lazy(() => EntryListRelationFilterObjectSchema).optional(),
		tags: z.lazy(() => TaggingListRelationFilterObjectSchema).optional(),
		podcast: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
		createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
		favorite: z
			.union([
				z.lazy(() => FavoriteRelationFilterObjectSchema),
				z.lazy(() => FavoriteWhereInputObjectSchema),
			])
			.optional()
			.nullable(),
		active: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
		velocity: z
			.union([z.lazy(() => IntNullableFilterObjectSchema), z.number()])
			.optional()
			.nullable(),
		subscriptions: z.lazy(() => SubscriptionListRelationFilterObjectSchema).optional(),
		context: z.lazy(() => ContextListRelationFilterObjectSchema).optional(),
	})
	.strict();

export const FeedWhereInputObjectSchema = Schema;
