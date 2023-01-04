import { z } from 'zod';
import { FavoriteCreateWithoutSmartListInputObjectSchema } from './FavoriteCreateWithoutSmartListInput.schema';
import { FavoriteUncheckedCreateWithoutSmartListInputObjectSchema } from './FavoriteUncheckedCreateWithoutSmartListInput.schema';
import { FavoriteCreateOrConnectWithoutSmartListInputObjectSchema } from './FavoriteCreateOrConnectWithoutSmartListInput.schema';
import { FavoriteUpsertWithoutSmartListInputObjectSchema } from './FavoriteUpsertWithoutSmartListInput.schema';
import { FavoriteWhereInputObjectSchema } from './FavoriteWhereInput.schema';
import { FavoriteWhereUniqueInputObjectSchema } from './FavoriteWhereUniqueInput.schema';
import { FavoriteUpdateToOneWithWhereWithoutSmartListInputObjectSchema } from './FavoriteUpdateToOneWithWhereWithoutSmartListInput.schema';
import { FavoriteUpdateWithoutSmartListInputObjectSchema } from './FavoriteUpdateWithoutSmartListInput.schema';
import { FavoriteUncheckedUpdateWithoutSmartListInputObjectSchema } from './FavoriteUncheckedUpdateWithoutSmartListInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteUpdateOneWithoutSmartListNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => FavoriteCreateWithoutSmartListInputObjectSchema),
				z.lazy(() => FavoriteUncheckedCreateWithoutSmartListInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => FavoriteCreateOrConnectWithoutSmartListInputObjectSchema)
			.optional(),
		upsert: z.lazy(() => FavoriteUpsertWithoutSmartListInputObjectSchema).optional(),
		disconnect: z.union([z.boolean(), z.lazy(() => FavoriteWhereInputObjectSchema)]).optional(),
		delete: z.union([z.boolean(), z.lazy(() => FavoriteWhereInputObjectSchema)]).optional(),
		connect: z.lazy(() => FavoriteWhereUniqueInputObjectSchema).optional(),
		update: z
			.union([
				z.lazy(() => FavoriteUpdateToOneWithWhereWithoutSmartListInputObjectSchema),
				z.lazy(() => FavoriteUpdateWithoutSmartListInputObjectSchema),
				z.lazy(() => FavoriteUncheckedUpdateWithoutSmartListInputObjectSchema),
			])
			.optional(),
	})
	.strict();

export const FavoriteUpdateOneWithoutSmartListNestedInputObjectSchema = Schema;
