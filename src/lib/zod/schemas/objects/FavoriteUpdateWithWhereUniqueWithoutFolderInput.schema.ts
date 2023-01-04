import { z } from 'zod';
import { FavoriteWhereUniqueInputObjectSchema } from './FavoriteWhereUniqueInput.schema';
import { FavoriteUpdateWithoutFolderInputObjectSchema } from './FavoriteUpdateWithoutFolderInput.schema';
import { FavoriteUncheckedUpdateWithoutFolderInputObjectSchema } from './FavoriteUncheckedUpdateWithoutFolderInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteUpdateWithWhereUniqueWithoutFolderInput> = z
	.object({
		where: z.lazy(() => FavoriteWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => FavoriteUpdateWithoutFolderInputObjectSchema),
			z.lazy(() => FavoriteUncheckedUpdateWithoutFolderInputObjectSchema),
		]),
	})
	.strict();

export const FavoriteUpdateWithWhereUniqueWithoutFolderInputObjectSchema = Schema;
