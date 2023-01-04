import { z } from 'zod';
import { FavoriteWhereUniqueInputObjectSchema } from './FavoriteWhereUniqueInput.schema';
import { FavoriteCreateWithoutRssInputObjectSchema } from './FavoriteCreateWithoutRssInput.schema';
import { FavoriteUncheckedCreateWithoutRssInputObjectSchema } from './FavoriteUncheckedCreateWithoutRssInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteCreateOrConnectWithoutRssInput> = z
	.object({
		where: z.lazy(() => FavoriteWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => FavoriteCreateWithoutRssInputObjectSchema),
			z.lazy(() => FavoriteUncheckedCreateWithoutRssInputObjectSchema),
		]),
	})
	.strict();

export const FavoriteCreateOrConnectWithoutRssInputObjectSchema = Schema;
