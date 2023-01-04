import { z } from 'zod';
import { FavoriteFolderWhereUniqueInputObjectSchema } from './FavoriteFolderWhereUniqueInput.schema';
import { FavoriteFolderCreateWithoutFavoritesInputObjectSchema } from './FavoriteFolderCreateWithoutFavoritesInput.schema';
import { FavoriteFolderUncheckedCreateWithoutFavoritesInputObjectSchema } from './FavoriteFolderUncheckedCreateWithoutFavoritesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteFolderCreateOrConnectWithoutFavoritesInput> = z
	.object({
		where: z.lazy(() => FavoriteFolderWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => FavoriteFolderCreateWithoutFavoritesInputObjectSchema),
			z.lazy(() => FavoriteFolderUncheckedCreateWithoutFavoritesInputObjectSchema),
		]),
	})
	.strict();

export const FavoriteFolderCreateOrConnectWithoutFavoritesInputObjectSchema = Schema;
