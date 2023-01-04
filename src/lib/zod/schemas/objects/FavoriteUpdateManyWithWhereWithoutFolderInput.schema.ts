import { z } from 'zod';
import { FavoriteScalarWhereInputObjectSchema } from './FavoriteScalarWhereInput.schema';
import { FavoriteUpdateManyMutationInputObjectSchema } from './FavoriteUpdateManyMutationInput.schema';
import { FavoriteUncheckedUpdateManyWithoutFavoritesInputObjectSchema } from './FavoriteUncheckedUpdateManyWithoutFavoritesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteUpdateManyWithWhereWithoutFolderInput> = z
	.object({
		where: z.lazy(() => FavoriteScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => FavoriteUpdateManyMutationInputObjectSchema),
			z.lazy(() => FavoriteUncheckedUpdateManyWithoutFavoritesInputObjectSchema),
		]),
	})
	.strict();

export const FavoriteUpdateManyWithWhereWithoutFolderInputObjectSchema = Schema;
