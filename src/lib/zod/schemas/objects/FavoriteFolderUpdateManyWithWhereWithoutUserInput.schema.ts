import { z } from 'zod';
import { FavoriteFolderScalarWhereInputObjectSchema } from './FavoriteFolderScalarWhereInput.schema';
import { FavoriteFolderUpdateManyMutationInputObjectSchema } from './FavoriteFolderUpdateManyMutationInput.schema';
import { FavoriteFolderUncheckedUpdateManyWithoutFavoriteFoldersInputObjectSchema } from './FavoriteFolderUncheckedUpdateManyWithoutFavoriteFoldersInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteFolderUpdateManyWithWhereWithoutUserInput> = z
	.object({
		where: z.lazy(() => FavoriteFolderScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => FavoriteFolderUpdateManyMutationInputObjectSchema),
			z.lazy(() => FavoriteFolderUncheckedUpdateManyWithoutFavoriteFoldersInputObjectSchema),
		]),
	})
	.strict();

export const FavoriteFolderUpdateManyWithWhereWithoutUserInputObjectSchema = Schema;
