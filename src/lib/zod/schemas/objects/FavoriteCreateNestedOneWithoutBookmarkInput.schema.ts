import { z } from 'zod';
import { FavoriteCreateWithoutBookmarkInputObjectSchema } from './FavoriteCreateWithoutBookmarkInput.schema';
import { FavoriteUncheckedCreateWithoutBookmarkInputObjectSchema } from './FavoriteUncheckedCreateWithoutBookmarkInput.schema';
import { FavoriteCreateOrConnectWithoutBookmarkInputObjectSchema } from './FavoriteCreateOrConnectWithoutBookmarkInput.schema';
import { FavoriteWhereUniqueInputObjectSchema } from './FavoriteWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteCreateNestedOneWithoutBookmarkInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => FavoriteCreateWithoutBookmarkInputObjectSchema),
				z.lazy(() => FavoriteUncheckedCreateWithoutBookmarkInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => FavoriteCreateOrConnectWithoutBookmarkInputObjectSchema)
			.optional(),
		connect: z.lazy(() => FavoriteWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const FavoriteCreateNestedOneWithoutBookmarkInputObjectSchema = Schema;
