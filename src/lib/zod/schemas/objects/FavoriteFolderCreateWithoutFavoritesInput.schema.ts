import { z } from 'zod';
import { UserCreateNestedOneWithoutFavoriteFoldersInputObjectSchema } from './UserCreateNestedOneWithoutFavoriteFoldersInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteFolderCreateWithoutFavoritesInput> = z
	.object({
		name: z.string(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		user: z.lazy(() => UserCreateNestedOneWithoutFavoriteFoldersInputObjectSchema),
	})
	.strict();

export const FavoriteFolderCreateWithoutFavoritesInputObjectSchema = Schema;
