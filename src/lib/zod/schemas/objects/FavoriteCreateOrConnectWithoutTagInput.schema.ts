import { z } from 'zod';
import { FavoriteWhereUniqueInputObjectSchema } from './FavoriteWhereUniqueInput.schema';
import { FavoriteCreateWithoutTagInputObjectSchema } from './FavoriteCreateWithoutTagInput.schema';
import { FavoriteUncheckedCreateWithoutTagInputObjectSchema } from './FavoriteUncheckedCreateWithoutTagInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteCreateOrConnectWithoutTagInput> = z
	.object({
		where: z.lazy(() => FavoriteWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => FavoriteCreateWithoutTagInputObjectSchema),
			z.lazy(() => FavoriteUncheckedCreateWithoutTagInputObjectSchema),
		]),
	})
	.strict();

export const FavoriteCreateOrConnectWithoutTagInputObjectSchema = Schema;
