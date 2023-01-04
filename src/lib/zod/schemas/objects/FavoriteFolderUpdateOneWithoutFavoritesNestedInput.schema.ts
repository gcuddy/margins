import { z } from 'zod';
import { FavoriteFolderCreateWithoutFavoritesInputObjectSchema } from './FavoriteFolderCreateWithoutFavoritesInput.schema';
import { FavoriteFolderUncheckedCreateWithoutFavoritesInputObjectSchema } from './FavoriteFolderUncheckedCreateWithoutFavoritesInput.schema';
import { FavoriteFolderCreateOrConnectWithoutFavoritesInputObjectSchema } from './FavoriteFolderCreateOrConnectWithoutFavoritesInput.schema';
import { FavoriteFolderUpsertWithoutFavoritesInputObjectSchema } from './FavoriteFolderUpsertWithoutFavoritesInput.schema';
import { FavoriteFolderWhereInputObjectSchema } from './FavoriteFolderWhereInput.schema';
import { FavoriteFolderWhereUniqueInputObjectSchema } from './FavoriteFolderWhereUniqueInput.schema';
import { FavoriteFolderUpdateToOneWithWhereWithoutFavoritesInputObjectSchema } from './FavoriteFolderUpdateToOneWithWhereWithoutFavoritesInput.schema';
import { FavoriteFolderUpdateWithoutFavoritesInputObjectSchema } from './FavoriteFolderUpdateWithoutFavoritesInput.schema';
import { FavoriteFolderUncheckedUpdateWithoutFavoritesInputObjectSchema } from './FavoriteFolderUncheckedUpdateWithoutFavoritesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteFolderUpdateOneWithoutFavoritesNestedInput> = z
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
		upsert: z.lazy(() => FavoriteFolderUpsertWithoutFavoritesInputObjectSchema).optional(),
		disconnect: z
			.union([z.boolean(), z.lazy(() => FavoriteFolderWhereInputObjectSchema)])
			.optional(),
		delete: z.union([z.boolean(), z.lazy(() => FavoriteFolderWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => FavoriteFolderWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => FavoriteFolderUpdateToOneWithWhereWithoutFavoritesInputObjectSchema),
				z.lazy(() => FavoriteFolderUpdateWithoutFavoritesInputObjectSchema),
				z.lazy(() => FavoriteFolderUncheckedUpdateWithoutFavoritesInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const FavoriteFolderUpdateOneWithoutFavoritesNestedInputObjectSchema = Schema;
