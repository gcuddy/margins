import { z } from 'zod';
import { FavoriteCreateNestedManyWithoutFolderInputObjectSchema } from './FavoriteCreateNestedManyWithoutFolderInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteFolderCreateWithoutUserInput> = z
	.object({
		name: z.string(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
		favorites: z.lazy(() => FavoriteCreateNestedManyWithoutFolderInputObjectSchema).optional(),
	})
	.strict();

export const FavoriteFolderCreateWithoutUserInputObjectSchema = Schema;
