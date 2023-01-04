import { z } from 'zod';
import { FeedCreateWithoutFavoriteInputObjectSchema } from './FeedCreateWithoutFavoriteInput.schema';
import { FeedUncheckedCreateWithoutFavoriteInputObjectSchema } from './FeedUncheckedCreateWithoutFavoriteInput.schema';
import { FeedCreateOrConnectWithoutFavoriteInputObjectSchema } from './FeedCreateOrConnectWithoutFavoriteInput.schema';
import { FeedWhereUniqueInputObjectSchema } from './FeedWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedCreateNestedOneWithoutFavoriteInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => FeedCreateWithoutFavoriteInputObjectSchema),
				z.lazy(() => FeedUncheckedCreateWithoutFavoriteInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => FeedCreateOrConnectWithoutFavoriteInputObjectSchema).optional(),
		connect: z.lazy(() => FeedWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const FeedCreateNestedOneWithoutFavoriteInputObjectSchema = Schema;
