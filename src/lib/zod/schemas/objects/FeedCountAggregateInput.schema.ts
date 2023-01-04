import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedCountAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		itunes_id: z.literal(true).optional(),
		feedUrl: z.literal(true).optional(),
		title: z.literal(true).optional(),
		link: z.literal(true).optional(),
		creator: z.literal(true).optional(),
		description: z.literal(true).optional(),
		lastBuildDate: z.literal(true).optional(),
		imageUrl: z.literal(true).optional(),
		podcast: z.literal(true).optional(),
		createdAt: z.literal(true).optional(),
		updatedAt: z.literal(true).optional(),
		active: z.literal(true).optional(),
		velocity: z.literal(true).optional(),
		_all: z.literal(true).optional(),
	})
	.strict();

export const FeedCountAggregateInputObjectSchema = Schema;
