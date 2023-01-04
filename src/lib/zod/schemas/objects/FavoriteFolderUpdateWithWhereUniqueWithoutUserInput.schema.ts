import { z } from 'zod';
import { FavoriteFolderWhereUniqueInputObjectSchema } from './FavoriteFolderWhereUniqueInput.schema';
import { FavoriteFolderUpdateWithoutUserInputObjectSchema } from './FavoriteFolderUpdateWithoutUserInput.schema';
import { FavoriteFolderUncheckedUpdateWithoutUserInputObjectSchema } from './FavoriteFolderUncheckedUpdateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteFolderUpdateWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => FavoriteFolderWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => FavoriteFolderUpdateWithoutUserInputObjectSchema),
			z.lazy(() => FavoriteFolderUncheckedUpdateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const FavoriteFolderUpdateWithWhereUniqueWithoutUserInputObjectSchema = Schema;
