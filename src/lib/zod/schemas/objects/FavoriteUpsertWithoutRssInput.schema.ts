import { z } from 'zod';
import { FavoriteUpdateWithoutRssInputObjectSchema } from './FavoriteUpdateWithoutRssInput.schema';
import { FavoriteUncheckedUpdateWithoutRssInputObjectSchema } from './FavoriteUncheckedUpdateWithoutRssInput.schema';
import { FavoriteCreateWithoutRssInputObjectSchema } from './FavoriteCreateWithoutRssInput.schema';
import { FavoriteUncheckedCreateWithoutRssInputObjectSchema } from './FavoriteUncheckedCreateWithoutRssInput.schema';
import { FavoriteWhereInputObjectSchema } from './FavoriteWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteUpsertWithoutRssInput> = z
	.object({
		update: z.union([
			z.lazy(() => FavoriteUpdateWithoutRssInputObjectSchema),
			z.lazy(() => FavoriteUncheckedUpdateWithoutRssInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => FavoriteCreateWithoutRssInputObjectSchema),
			z.lazy(() => FavoriteUncheckedCreateWithoutRssInputObjectSchema),
		]),
		where: z.lazy(() => FavoriteWhereInputObjectSchema).optional(),
	})
	.strict();

export const FavoriteUpsertWithoutRssInputObjectSchema = Schema;
