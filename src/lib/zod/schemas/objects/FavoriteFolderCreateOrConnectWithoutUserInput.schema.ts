import { z } from 'zod';
import { FavoriteFolderWhereUniqueInputObjectSchema } from './FavoriteFolderWhereUniqueInput.schema';
import { FavoriteFolderCreateWithoutUserInputObjectSchema } from './FavoriteFolderCreateWithoutUserInput.schema';
import { FavoriteFolderUncheckedCreateWithoutUserInputObjectSchema } from './FavoriteFolderUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteFolderCreateOrConnectWithoutUserInput> = z
	.object({
		where: z.lazy(() => FavoriteFolderWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => FavoriteFolderCreateWithoutUserInputObjectSchema),
			z.lazy(() => FavoriteFolderUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const FavoriteFolderCreateOrConnectWithoutUserInputObjectSchema = Schema;
