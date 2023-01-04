import { z } from 'zod';
import { FavoriteFolderWhereInputObjectSchema } from './FavoriteFolderWhereInput.schema';
import { FavoriteFolderUpdateWithoutFavoritesInputObjectSchema } from './FavoriteFolderUpdateWithoutFavoritesInput.schema';
import { FavoriteFolderUncheckedUpdateWithoutFavoritesInputObjectSchema } from './FavoriteFolderUncheckedUpdateWithoutFavoritesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteFolderUpdateToOneWithWhereWithoutFavoritesInput> = z
	.object({
		where: z.lazy(() => FavoriteFolderWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => FavoriteFolderUpdateWithoutFavoritesInputObjectSchema),
			z.lazy(() => FavoriteFolderUncheckedUpdateWithoutFavoritesInputObjectSchema),
		]),
	})
	.strict();

export const FavoriteFolderUpdateToOneWithWhereWithoutFavoritesInputObjectSchema = Schema;
