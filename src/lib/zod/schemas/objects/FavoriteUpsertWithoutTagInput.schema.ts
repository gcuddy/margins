import { z } from 'zod';
import { FavoriteUpdateWithoutTagInputObjectSchema } from './FavoriteUpdateWithoutTagInput.schema';
import { FavoriteUncheckedUpdateWithoutTagInputObjectSchema } from './FavoriteUncheckedUpdateWithoutTagInput.schema';
import { FavoriteCreateWithoutTagInputObjectSchema } from './FavoriteCreateWithoutTagInput.schema';
import { FavoriteUncheckedCreateWithoutTagInputObjectSchema } from './FavoriteUncheckedCreateWithoutTagInput.schema';
import { FavoriteWhereInputObjectSchema } from './FavoriteWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteUpsertWithoutTagInput> = z
	.object({
		update: z.union([
			z.lazy(() => FavoriteUpdateWithoutTagInputObjectSchema),
			z.lazy(() => FavoriteUncheckedUpdateWithoutTagInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => FavoriteCreateWithoutTagInputObjectSchema),
			z.lazy(() => FavoriteUncheckedCreateWithoutTagInputObjectSchema),
		]),
		where: z.lazy(() => FavoriteWhereInputObjectSchema).optional(),
	})
	.strict();

export const FavoriteUpsertWithoutTagInputObjectSchema = Schema;
