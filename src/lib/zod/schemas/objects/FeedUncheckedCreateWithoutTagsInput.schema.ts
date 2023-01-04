import { z } from 'zod';
import { EntryUncheckedCreateNestedManyWithoutFeedInputObjectSchema } from './EntryUncheckedCreateNestedManyWithoutFeedInput.schema';
import { FavoriteUncheckedCreateNestedOneWithoutRssInputObjectSchema } from './FavoriteUncheckedCreateNestedOneWithoutRssInput.schema';
import { SubscriptionUncheckedCreateNestedManyWithoutFeedInputObjectSchema } from './SubscriptionUncheckedCreateNestedManyWithoutFeedInput.schema';
import { ContextUncheckedCreateNestedManyWithoutFeedInputObjectSchema } from './ContextUncheckedCreateNestedManyWithoutFeedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedUncheckedCreateWithoutTagsInput> = z
	.object({
		id: z.number().optional(),
		itunes_id: z.string().optional().nullable(),
		feedUrl: z.string(),
		title: z.string().optional().nullable(),
		link: z.string().optional().nullable(),
		creator: z.string().optional().nullable(),
		description: z.string().optional().nullable(),
		lastBuildDate: z.date().optional().nullable(),
		imageUrl: z.string().optional().nullable(),
		entries: z.lazy(() => EntryUncheckedCreateNestedManyWithoutFeedInputObjectSchema).optional(),
		podcast: z.boolean().optional(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		favorite: z.lazy(() => FavoriteUncheckedCreateNestedOneWithoutRssInputObjectSchema).optional(),
		active: z.boolean().optional(),
		velocity: z.number().optional().nullable(),
		subscriptions: z
			.lazy(() => SubscriptionUncheckedCreateNestedManyWithoutFeedInputObjectSchema)
			.optional(),
		context: z.lazy(() => ContextUncheckedCreateNestedManyWithoutFeedInputObjectSchema).optional(),
	})
	.strict();

export const FeedUncheckedCreateWithoutTagsInputObjectSchema = Schema;
