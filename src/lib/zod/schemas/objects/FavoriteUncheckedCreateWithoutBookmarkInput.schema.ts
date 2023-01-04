import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteUncheckedCreateWithoutBookmarkInput> = z
	.object({
		id: z.number().optional(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		userId: z.string(),
		deleted: z.date().optional().nullable(),
		tagId: z.number().optional().nullable(),
		rssId: z.number().optional().nullable(),
		smartListId: z.number().optional().nullable(),
		favoriteFolderId: z.number().optional().nullable(),
		annotationId: z.number().optional().nullable(),
	})
	.strict();

export const FavoriteUncheckedCreateWithoutBookmarkInputObjectSchema = Schema;
