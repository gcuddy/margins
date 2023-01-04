import { z } from 'zod';
import { FavoriteFolderCreateWithoutFavoritesInputObjectSchema } from './FavoriteFolderCreateWithoutFavoritesInput.schema';
import { FavoriteFolderUncheckedCreateWithoutFavoritesInputObjectSchema } from './FavoriteFolderUncheckedCreateWithoutFavoritesInput.schema';
import { FavoriteFolderCreateOrConnectWithoutFavoritesInputObjectSchema } from './FavoriteFolderCreateOrConnectWithoutFavoritesInput.schema';
import { FavoriteFolderWhereUniqueInputObjectSchema } from './FavoriteFolderWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteFolderCreateNestedOneWithoutFavoritesInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => FavoriteFolderCreateWithoutFavoritesInputObjectSchema),
				z.lazy(() => FavoriteFolderUncheckedCreateWithoutFavoritesInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => FavoriteFolderCreateOrConnectWithoutFavoritesInputObjectSchema)
			.optional(),
		connect: z.lazy(() => FavoriteFolderWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const FavoriteFolderCreateNestedOneWithoutFavoritesInputObjectSchema = Schema;
