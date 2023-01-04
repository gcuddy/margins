import { z } from 'zod';
import { FavoriteCreateWithoutRssInputObjectSchema } from './FavoriteCreateWithoutRssInput.schema';
import { FavoriteUncheckedCreateWithoutRssInputObjectSchema } from './FavoriteUncheckedCreateWithoutRssInput.schema';
import { FavoriteCreateOrConnectWithoutRssInputObjectSchema } from './FavoriteCreateOrConnectWithoutRssInput.schema';
import { FavoriteUpsertWithoutRssInputObjectSchema } from './FavoriteUpsertWithoutRssInput.schema';
import { FavoriteWhereInputObjectSchema } from './FavoriteWhereInput.schema';
import { FavoriteWhereUniqueInputObjectSchema } from './FavoriteWhereUniqueInput.schema';
import { FavoriteUpdateToOneWithWhereWithoutRssInputObjectSchema } from './FavoriteUpdateToOneWithWhereWithoutRssInput.schema';
import { FavoriteUpdateWithoutRssInputObjectSchema } from './FavoriteUpdateWithoutRssInput.schema';
import { FavoriteUncheckedUpdateWithoutRssInputObjectSchema } from './FavoriteUncheckedUpdateWithoutRssInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteUncheckedUpdateOneWithoutRssNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => FavoriteCreateWithoutRssInputObjectSchema),
				z.lazy(() => FavoriteUncheckedCreateWithoutRssInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => FavoriteCreateOrConnectWithoutRssInputObjectSchema).optional(),
		upsert: z.lazy(() => FavoriteUpsertWithoutRssInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => FavoriteWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => FavoriteWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => FavoriteWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => FavoriteUpdateToOneWithWhereWithoutRssInputObjectSchema),
				z.lazy(() => FavoriteUpdateWithoutRssInputObjectSchema),
				z.lazy(() => FavoriteUncheckedUpdateWithoutRssInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const FavoriteUncheckedUpdateOneWithoutRssNestedInputObjectSchema = Schema;
