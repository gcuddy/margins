import { z } from 'zod';
import { FeedCreateWithoutFavoriteInputObjectSchema } from './FeedCreateWithoutFavoriteInput.schema';
import { FeedUncheckedCreateWithoutFavoriteInputObjectSchema } from './FeedUncheckedCreateWithoutFavoriteInput.schema';
import { FeedCreateOrConnectWithoutFavoriteInputObjectSchema } from './FeedCreateOrConnectWithoutFavoriteInput.schema';
import { FeedUpsertWithoutFavoriteInputObjectSchema } from './FeedUpsertWithoutFavoriteInput.schema';
import { FeedWhereInputObjectSchema } from './FeedWhereInput.schema';
import { FeedWhereUniqueInputObjectSchema } from './FeedWhereUniqueInput.schema';
import { FeedUpdateToOneWithWhereWithoutFavoriteInputObjectSchema } from './FeedUpdateToOneWithWhereWithoutFavoriteInput.schema';
import { FeedUpdateWithoutFavoriteInputObjectSchema } from './FeedUpdateWithoutFavoriteInput.schema';
import { FeedUncheckedUpdateWithoutFavoriteInputObjectSchema } from './FeedUncheckedUpdateWithoutFavoriteInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FeedUpdateOneWithoutFavoriteNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => FeedCreateWithoutFavoriteInputObjectSchema),
				z.lazy(() => FeedUncheckedCreateWithoutFavoriteInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => FeedCreateOrConnectWithoutFavoriteInputObjectSchema).optional(),
		upsert: z.lazy(() => FeedUpsertWithoutFavoriteInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => FeedWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => FeedWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => FeedWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => FeedUpdateToOneWithWhereWithoutFavoriteInputObjectSchema),
				z.lazy(() => FeedUpdateWithoutFavoriteInputObjectSchema),
				z.lazy(() => FeedUncheckedUpdateWithoutFavoriteInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const FeedUpdateOneWithoutFavoriteNestedInputObjectSchema = Schema;
