import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteMinAggregateInputType> = z
	.object({
		id: z.literal(true).optional(),
		createdAt: z.literal(true).optional(),
		updatedAt: z.literal(true).optional(),
		userId: z.literal(true).optional(),
		deleted: z.literal(true).optional(),
		tagId: z.literal(true).optional(),
		rssId: z.literal(true).optional(),
		smartListId: z.literal(true).optional(),
		favoriteFolderId: z.literal(true).optional(),
		annotationId: z.literal(true).optional(),
		bookmarkId: z.literal(true).optional(),
	})
	.strict();

export const FavoriteMinAggregateInputObjectSchema = Schema;
