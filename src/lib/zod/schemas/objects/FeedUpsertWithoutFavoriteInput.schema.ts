import { z } from 'zod';
import { FeedUpdateWithoutFavoriteInputObjectSchema } from './FeedUpdateWithoutFavoriteInput.schema';
import { FeedUncheckedUpdateWithoutFavoriteInputObjectSchema } from './FeedUncheckedUpdateWithoutFavoriteInput.schema';
import { FeedCreateWithoutFavoriteInputObjectSchema } from './FeedCreateWithoutFavoriteInput.schema';
import { FeedUncheckedCreateWithoutFavoriteInputObjectSchema } from './FeedUncheckedCreateWithoutFavoriteInput.schema';
import { FeedWhereInputObjectSchema } from './FeedWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedUpsertWithoutFavoriteInput> = z
	.object({
		update: z.union([
			z.lazy(() => FeedUpdateWithoutFavoriteInputObjectSchema),
			z.lazy(() => FeedUncheckedUpdateWithoutFavoriteInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => FeedCreateWithoutFavoriteInputObjectSchema),
			z.lazy(() => FeedUncheckedCreateWithoutFavoriteInputObjectSchema),
		]),
		where: z.lazy(() => FeedWhereInputObjectSchema).optional(),
	})
	.strict();

export const FeedUpsertWithoutFavoriteInputObjectSchema = Schema;
