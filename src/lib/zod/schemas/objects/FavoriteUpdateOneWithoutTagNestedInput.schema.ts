import { z } from 'zod';
import { FavoriteCreateWithoutTagInputObjectSchema } from './FavoriteCreateWithoutTagInput.schema';
import { FavoriteUncheckedCreateWithoutTagInputObjectSchema } from './FavoriteUncheckedCreateWithoutTagInput.schema';
import { FavoriteCreateOrConnectWithoutTagInputObjectSchema } from './FavoriteCreateOrConnectWithoutTagInput.schema';
import { FavoriteUpsertWithoutTagInputObjectSchema } from './FavoriteUpsertWithoutTagInput.schema';
import { FavoriteWhereInputObjectSchema } from './FavoriteWhereInput.schema';
import { FavoriteWhereUniqueInputObjectSchema } from './FavoriteWhereUniqueInput.schema';
import { FavoriteUpdateToOneWithWhereWithoutTagInputObjectSchema } from './FavoriteUpdateToOneWithWhereWithoutTagInput.schema';
import { FavoriteUpdateWithoutTagInputObjectSchema } from './FavoriteUpdateWithoutTagInput.schema';
import { FavoriteUncheckedUpdateWithoutTagInputObjectSchema } from './FavoriteUncheckedUpdateWithoutTagInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteUpdateOneWithoutTagNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => FavoriteCreateWithoutTagInputObjectSchema),
				z.lazy(() => FavoriteUncheckedCreateWithoutTagInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => FavoriteCreateOrConnectWithoutTagInputObjectSchema).optional(),
		upsert: z.lazy(() => FavoriteUpsertWithoutTagInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => FavoriteWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => FavoriteWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => FavoriteWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => FavoriteUpdateToOneWithWhereWithoutTagInputObjectSchema),
				z.lazy(() => FavoriteUpdateWithoutTagInputObjectSchema),
				z.lazy(() => FavoriteUncheckedUpdateWithoutTagInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const FavoriteUpdateOneWithoutTagNestedInputObjectSchema = Schema;
