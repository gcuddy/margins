import { z } from 'zod';
import { FavoriteCreateWithoutTagInputObjectSchema } from './FavoriteCreateWithoutTagInput.schema';
import { FavoriteUncheckedCreateWithoutTagInputObjectSchema } from './FavoriteUncheckedCreateWithoutTagInput.schema';
import { FavoriteCreateOrConnectWithoutTagInputObjectSchema } from './FavoriteCreateOrConnectWithoutTagInput.schema';
import { FavoriteWhereUniqueInputObjectSchema } from './FavoriteWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteCreateNestedOneWithoutTagInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => FavoriteCreateWithoutTagInputObjectSchema),
				z.lazy(() => FavoriteUncheckedCreateWithoutTagInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => FavoriteCreateOrConnectWithoutTagInputObjectSchema).optional(),
		connect: z.lazy(() => FavoriteWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const FavoriteCreateNestedOneWithoutTagInputObjectSchema = Schema;
