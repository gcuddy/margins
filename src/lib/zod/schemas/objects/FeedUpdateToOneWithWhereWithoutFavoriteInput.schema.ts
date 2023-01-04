import { z } from 'zod';
import { FeedWhereInputObjectSchema } from './FeedWhereInput.schema';
import { FeedUpdateWithoutFavoriteInputObjectSchema } from './FeedUpdateWithoutFavoriteInput.schema';
import { FeedUncheckedUpdateWithoutFavoriteInputObjectSchema } from './FeedUncheckedUpdateWithoutFavoriteInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedUpdateToOneWithWhereWithoutFavoriteInput> = z
	.object({
		where: z.lazy(() => FeedWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => FeedUpdateWithoutFavoriteInputObjectSchema),
			z.lazy(() => FeedUncheckedUpdateWithoutFavoriteInputObjectSchema),
		]),
	})
	.strict();

export const FeedUpdateToOneWithWhereWithoutFavoriteInputObjectSchema = Schema;
