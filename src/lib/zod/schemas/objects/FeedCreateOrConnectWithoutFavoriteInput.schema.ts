import { z } from 'zod';
import { FeedWhereUniqueInputObjectSchema } from './FeedWhereUniqueInput.schema';
import { FeedCreateWithoutFavoriteInputObjectSchema } from './FeedCreateWithoutFavoriteInput.schema';
import { FeedUncheckedCreateWithoutFavoriteInputObjectSchema } from './FeedUncheckedCreateWithoutFavoriteInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedCreateOrConnectWithoutFavoriteInput> = z
	.object({
		where: z.lazy(() => FeedWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => FeedCreateWithoutFavoriteInputObjectSchema),
			z.lazy(() => FeedUncheckedCreateWithoutFavoriteInputObjectSchema),
		]),
	})
	.strict();

export const FeedCreateOrConnectWithoutFavoriteInputObjectSchema = Schema;
