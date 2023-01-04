import { z } from 'zod';
import { FavoriteWhereUniqueInputObjectSchema } from './FavoriteWhereUniqueInput.schema';
import { FavoriteUpdateWithoutFolderInputObjectSchema } from './FavoriteUpdateWithoutFolderInput.schema';
import { FavoriteUncheckedUpdateWithoutFolderInputObjectSchema } from './FavoriteUncheckedUpdateWithoutFolderInput.schema';
import { FavoriteCreateWithoutFolderInputObjectSchema } from './FavoriteCreateWithoutFolderInput.schema';
import { FavoriteUncheckedCreateWithoutFolderInputObjectSchema } from './FavoriteUncheckedCreateWithoutFolderInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteUpsertWithWhereUniqueWithoutFolderInput> = z
	.object({
		where: z.lazy(() => FavoriteWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => FavoriteUpdateWithoutFolderInputObjectSchema),
			z.lazy(() => FavoriteUncheckedUpdateWithoutFolderInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => FavoriteCreateWithoutFolderInputObjectSchema),
			z.lazy(() => FavoriteUncheckedCreateWithoutFolderInputObjectSchema),
		]),
	})
	.strict();

export const FavoriteUpsertWithWhereUniqueWithoutFolderInputObjectSchema = Schema;
