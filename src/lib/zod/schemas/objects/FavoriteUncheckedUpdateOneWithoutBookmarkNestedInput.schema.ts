import { z } from 'zod';
import { FavoriteCreateWithoutBookmarkInputObjectSchema } from './FavoriteCreateWithoutBookmarkInput.schema';
import { FavoriteUncheckedCreateWithoutBookmarkInputObjectSchema } from './FavoriteUncheckedCreateWithoutBookmarkInput.schema';
import { FavoriteCreateOrConnectWithoutBookmarkInputObjectSchema } from './FavoriteCreateOrConnectWithoutBookmarkInput.schema';
import { FavoriteUpsertWithoutBookmarkInputObjectSchema } from './FavoriteUpsertWithoutBookmarkInput.schema';
import { FavoriteWhereInputObjectSchema } from './FavoriteWhereInput.schema';
import { FavoriteWhereUniqueInputObjectSchema } from './FavoriteWhereUniqueInput.schema';
import { FavoriteUpdateToOneWithWhereWithoutBookmarkInputObjectSchema } from './FavoriteUpdateToOneWithWhereWithoutBookmarkInput.schema';
import { FavoriteUpdateWithoutBookmarkInputObjectSchema } from './FavoriteUpdateWithoutBookmarkInput.schema';
import { FavoriteUncheckedUpdateWithoutBookmarkInputObjectSchema } from './FavoriteUncheckedUpdateWithoutBookmarkInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteUncheckedUpdateOneWithoutBookmarkNestedInput> = z
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
		upsert: z.lazy(() => FavoriteUpsertWithoutBookmarkInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => FavoriteWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => FavoriteWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => FavoriteWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => FavoriteUpdateToOneWithWhereWithoutBookmarkInputObjectSchema),
				z.lazy(() => FavoriteUpdateWithoutBookmarkInputObjectSchema),
				z.lazy(() => FavoriteUncheckedUpdateWithoutBookmarkInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const FavoriteUncheckedUpdateOneWithoutBookmarkNestedInputObjectSchema = Schema;
