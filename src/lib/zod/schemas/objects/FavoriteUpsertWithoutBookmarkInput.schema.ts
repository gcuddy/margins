import { z } from 'zod';
import { FavoriteUpdateWithoutBookmarkInputObjectSchema } from './FavoriteUpdateWithoutBookmarkInput.schema';
import { FavoriteUncheckedUpdateWithoutBookmarkInputObjectSchema } from './FavoriteUncheckedUpdateWithoutBookmarkInput.schema';
import { FavoriteCreateWithoutBookmarkInputObjectSchema } from './FavoriteCreateWithoutBookmarkInput.schema';
import { FavoriteUncheckedCreateWithoutBookmarkInputObjectSchema } from './FavoriteUncheckedCreateWithoutBookmarkInput.schema';
import { FavoriteWhereInputObjectSchema } from './FavoriteWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteUpsertWithoutBookmarkInput> = z
	.object({
		update: z.union([
			z.lazy(() => FavoriteUpdateWithoutBookmarkInputObjectSchema),
			z.lazy(() => FavoriteUncheckedUpdateWithoutBookmarkInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => FavoriteCreateWithoutBookmarkInputObjectSchema),
			z.lazy(() => FavoriteUncheckedCreateWithoutBookmarkInputObjectSchema),
		]),
		where: z.lazy(() => FavoriteWhereInputObjectSchema).optional(),
	})
	.strict();

export const FavoriteUpsertWithoutBookmarkInputObjectSchema = Schema;
