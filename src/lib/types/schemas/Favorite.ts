import { Prisma } from '@prisma/client';
import { z } from 'zod';

export const Id = z.number().int().nonnegative();

export const FavoriteSchema = z.object({
	articleId: Id.optional(),
	tagId: Id.optional(),
	rssId: Id.optional(),
	smartListId: Id.optional()
});

export const _FavoriteArgs = {
	include: {
		tag: {
			select: {
				name: true,
				id: true
			}
		},
		rss: {
			select: {
				id: true,
				title: true
			}
		},
		smartList: {
			select: {
				id: true,
				name: true
			}
		}
	}
};

// 1. Define a User type that includes the "cars" relation.
const favoriteWithPayload = Prisma.validator<Prisma.FavoriteArgs>()(_FavoriteArgs);

export type FavoriteWithPayload = Prisma.FavoriteGetPayload<typeof favoriteWithPayload>;
