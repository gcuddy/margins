import { z } from 'zod';
import { FavoriteFolderUpdateWithoutFavoritesInputObjectSchema } from './FavoriteFolderUpdateWithoutFavoritesInput.schema';
import { FavoriteFolderUncheckedUpdateWithoutFavoritesInputObjectSchema } from './FavoriteFolderUncheckedUpdateWithoutFavoritesInput.schema';
import { FavoriteFolderCreateWithoutFavoritesInputObjectSchema } from './FavoriteFolderCreateWithoutFavoritesInput.schema';
import { FavoriteFolderUncheckedCreateWithoutFavoritesInputObjectSchema } from './FavoriteFolderUncheckedCreateWithoutFavoritesInput.schema';
import { FavoriteFolderWhereInputObjectSchema } from './FavoriteFolderWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteFolderUpsertWithoutFavoritesInput> = z
	.object({
		update: z.union([
			z.lazy(() => FavoriteFolderUpdateWithoutFavoritesInputObjectSchema),
			z.lazy(() => FavoriteFolderUncheckedUpdateWithoutFavoritesInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => FavoriteFolderCreateWithoutFavoritesInputObjectSchema),
			z.lazy(() => FavoriteFolderUncheckedCreateWithoutFavoritesInputObjectSchema),
		]),
		where: z.lazy(() => FavoriteFolderWhereInputObjectSchema).optional(),
	})
	.strict();

export const FavoriteFolderUpsertWithoutFavoritesInputObjectSchema = Schema;
