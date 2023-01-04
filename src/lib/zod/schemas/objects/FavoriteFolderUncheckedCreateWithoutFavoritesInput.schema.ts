import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteFolderUncheckedCreateWithoutFavoritesInput> = z
	.object({
		id: z.number().optional(),
		name: z.string(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		userId: z.string(),
	})
	.strict();

export const FavoriteFolderUncheckedCreateWithoutFavoritesInputObjectSchema = Schema;
