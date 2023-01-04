import { z } from 'zod';
import { FavoriteUpdateWithoutSmartListInputObjectSchema } from './FavoriteUpdateWithoutSmartListInput.schema';
import { FavoriteUncheckedUpdateWithoutSmartListInputObjectSchema } from './FavoriteUncheckedUpdateWithoutSmartListInput.schema';
import { FavoriteCreateWithoutSmartListInputObjectSchema } from './FavoriteCreateWithoutSmartListInput.schema';
import { FavoriteUncheckedCreateWithoutSmartListInputObjectSchema } from './FavoriteUncheckedCreateWithoutSmartListInput.schema';
import { FavoriteWhereInputObjectSchema } from './FavoriteWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteUpsertWithoutSmartListInput> = z
	.object({
		update: z.union([
			z.lazy(() => FavoriteUpdateWithoutSmartListInputObjectSchema),
			z.lazy(() => FavoriteUncheckedUpdateWithoutSmartListInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => FavoriteCreateWithoutSmartListInputObjectSchema),
			z.lazy(() => FavoriteUncheckedCreateWithoutSmartListInputObjectSchema),
		]),
		where: z.lazy(() => FavoriteWhereInputObjectSchema).optional(),
	})
	.strict();

export const FavoriteUpsertWithoutSmartListInputObjectSchema = Schema;
