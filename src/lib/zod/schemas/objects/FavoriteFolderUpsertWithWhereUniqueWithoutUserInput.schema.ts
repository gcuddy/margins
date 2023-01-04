import { z } from 'zod';
import { FavoriteFolderWhereUniqueInputObjectSchema } from './FavoriteFolderWhereUniqueInput.schema';
import { FavoriteFolderUpdateWithoutUserInputObjectSchema } from './FavoriteFolderUpdateWithoutUserInput.schema';
import { FavoriteFolderUncheckedUpdateWithoutUserInputObjectSchema } from './FavoriteFolderUncheckedUpdateWithoutUserInput.schema';
import { FavoriteFolderCreateWithoutUserInputObjectSchema } from './FavoriteFolderCreateWithoutUserInput.schema';
import { FavoriteFolderUncheckedCreateWithoutUserInputObjectSchema } from './FavoriteFolderUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteFolderUpsertWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => FavoriteFolderWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => FavoriteFolderUpdateWithoutUserInputObjectSchema),
			z.lazy(() => FavoriteFolderUncheckedUpdateWithoutUserInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => FavoriteFolderCreateWithoutUserInputObjectSchema),
			z.lazy(() => FavoriteFolderUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const FavoriteFolderUpsertWithWhereUniqueWithoutUserInputObjectSchema = Schema;
