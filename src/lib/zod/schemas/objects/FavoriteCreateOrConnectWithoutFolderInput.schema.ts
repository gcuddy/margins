import { z } from 'zod';
import { FavoriteWhereUniqueInputObjectSchema } from './FavoriteWhereUniqueInput.schema';
import { FavoriteCreateWithoutFolderInputObjectSchema } from './FavoriteCreateWithoutFolderInput.schema';
import { FavoriteUncheckedCreateWithoutFolderInputObjectSchema } from './FavoriteUncheckedCreateWithoutFolderInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteCreateOrConnectWithoutFolderInput> = z
	.object({
		where: z.lazy(() => FavoriteWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => FavoriteCreateWithoutFolderInputObjectSchema),
			z.lazy(() => FavoriteUncheckedCreateWithoutFolderInputObjectSchema),
		]),
	})
	.strict();

export const FavoriteCreateOrConnectWithoutFolderInputObjectSchema = Schema;
