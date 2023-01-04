import { z } from 'zod';
import { FavoriteUncheckedCreateNestedManyWithoutFolderInputObjectSchema } from './FavoriteUncheckedCreateNestedManyWithoutFolderInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteFolderUncheckedCreateWithoutUserInput> = z
	.object({
		id: z.number().optional(),
		name: z.string(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		favorites: z
			.lazy(() => FavoriteUncheckedCreateNestedManyWithoutFolderInputObjectSchema)
			.optional(),
	})
	.strict();

export const FavoriteFolderUncheckedCreateWithoutUserInputObjectSchema = Schema;
