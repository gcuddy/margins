import { z } from 'zod';
import { FavoriteWhereInputObjectSchema } from './FavoriteWhereInput.schema';
import { FavoriteUpdateWithoutRssInputObjectSchema } from './FavoriteUpdateWithoutRssInput.schema';
import { FavoriteUncheckedUpdateWithoutRssInputObjectSchema } from './FavoriteUncheckedUpdateWithoutRssInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteUpdateToOneWithWhereWithoutRssInput> = z
	.object({
		where: z.lazy(() => FavoriteWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => FavoriteUpdateWithoutRssInputObjectSchema),
			z.lazy(() => FavoriteUncheckedUpdateWithoutRssInputObjectSchema),
		]),
	})
	.strict();

export const FavoriteUpdateToOneWithWhereWithoutRssInputObjectSchema = Schema;
