import { z } from 'zod';
import { FavoriteWhereUniqueInputObjectSchema } from './FavoriteWhereUniqueInput.schema';
import { FavoriteCreateWithoutUserInputObjectSchema } from './FavoriteCreateWithoutUserInput.schema';
import { FavoriteUncheckedCreateWithoutUserInputObjectSchema } from './FavoriteUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteCreateOrConnectWithoutUserInput> = z
	.object({
		where: z.lazy(() => FavoriteWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => FavoriteCreateWithoutUserInputObjectSchema),
			z.lazy(() => FavoriteUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const FavoriteCreateOrConnectWithoutUserInputObjectSchema = Schema;
