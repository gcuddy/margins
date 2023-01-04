import { z } from 'zod';
import { FavoriteCreateWithoutRssInputObjectSchema } from './FavoriteCreateWithoutRssInput.schema';
import { FavoriteUncheckedCreateWithoutRssInputObjectSchema } from './FavoriteUncheckedCreateWithoutRssInput.schema';
import { FavoriteCreateOrConnectWithoutRssInputObjectSchema } from './FavoriteCreateOrConnectWithoutRssInput.schema';
import { FavoriteWhereUniqueInputObjectSchema } from './FavoriteWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteCreateNestedOneWithoutRssInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => FavoriteCreateWithoutRssInputObjectSchema),
				z.lazy(() => FavoriteUncheckedCreateWithoutRssInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => FavoriteCreateOrConnectWithoutRssInputObjectSchema).optional(),
		connect: z.lazy(() => FavoriteWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const FavoriteCreateNestedOneWithoutRssInputObjectSchema = Schema;
