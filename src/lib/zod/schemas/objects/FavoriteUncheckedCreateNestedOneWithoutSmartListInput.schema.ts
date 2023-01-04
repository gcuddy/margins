import { z } from 'zod';
import { FavoriteCreateWithoutSmartListInputObjectSchema } from './FavoriteCreateWithoutSmartListInput.schema';
import { FavoriteUncheckedCreateWithoutSmartListInputObjectSchema } from './FavoriteUncheckedCreateWithoutSmartListInput.schema';
import { FavoriteCreateOrConnectWithoutSmartListInputObjectSchema } from './FavoriteCreateOrConnectWithoutSmartListInput.schema';
import { FavoriteWhereUniqueInputObjectSchema } from './FavoriteWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteUncheckedCreateNestedOneWithoutSmartListInput> = z
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
		connect: z.lazy(() => FavoriteWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const FavoriteUncheckedCreateNestedOneWithoutSmartListInputObjectSchema = Schema;
