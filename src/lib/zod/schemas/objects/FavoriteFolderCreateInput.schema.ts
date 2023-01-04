import { z } from 'zod';
import { UserCreateNestedOneWithoutFavoriteFoldersInputObjectSchema } from './UserCreateNestedOneWithoutFavoriteFoldersInput.schema';
import { FavoriteCreateNestedManyWithoutFolderInputObjectSchema } from './FavoriteCreateNestedManyWithoutFolderInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteFolderCreateInput> = z
	.object({
		name: z.string(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		user: z.lazy(() => UserCreateNestedOneWithoutFavoriteFoldersInputObjectSchema),
		favorites: z.lazy(() => FavoriteCreateNestedManyWithoutFolderInputObjectSchema).optional(),
	})
	.strict();

export const FavoriteFolderCreateInputObjectSchema = Schema;
