import { z } from 'zod';
import { TaggingCreateNestedManyWithoutFeedInputObjectSchema } from './TaggingCreateNestedManyWithoutFeedInput.schema';
import { FavoriteCreateNestedOneWithoutRssInputObjectSchema } from './FavoriteCreateNestedOneWithoutRssInput.schema';
import { SubscriptionCreateNestedManyWithoutFeedInputObjectSchema } from './SubscriptionCreateNestedManyWithoutFeedInput.schema';
import { ContextCreateNestedManyWithoutFeedInputObjectSchema } from './ContextCreateNestedManyWithoutFeedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedCreateWithoutEntriesInput> = z
	.object({
		itunes_id: z.string().optional().nullable(),
		feedUrl: z.string(),
		title: z.string().optional().nullable(),
		link: z.string().optional().nullable(),
		creator: z.string().optional().nullable(),
		description: z.string().optional().nullable(),
		lastBuildDate: z.date().optional().nullable(),
		imageUrl: z.string().optional().nullable(),
		tags: z.lazy(() => TaggingCreateNestedManyWithoutFeedInputObjectSchema).optional(),
		podcast: z.boolean().optional(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		favorite: z.lazy(() => FavoriteCreateNestedOneWithoutRssInputObjectSchema).optional(),
		active: z.boolean().optional(),
		velocity: z.number().optional().nullable(),
		subscriptions: z
			.lazy(() => SubscriptionCreateNestedManyWithoutFeedInputObjectSchema)
			.optional(),
		context: z.lazy(() => ContextCreateNestedManyWithoutFeedInputObjectSchema).optional(),
	})
	.strict();

export const FeedCreateWithoutEntriesInputObjectSchema = Schema;
