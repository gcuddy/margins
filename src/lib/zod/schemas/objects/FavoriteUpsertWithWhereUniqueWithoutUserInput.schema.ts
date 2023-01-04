import { z } from 'zod';
import { FavoriteWhereUniqueInputObjectSchema } from './FavoriteWhereUniqueInput.schema';
import { FavoriteUpdateWithoutUserInputObjectSchema } from './FavoriteUpdateWithoutUserInput.schema';
import { FavoriteUncheckedUpdateWithoutUserInputObjectSchema } from './FavoriteUncheckedUpdateWithoutUserInput.schema';
import { FavoriteCreateWithoutUserInputObjectSchema } from './FavoriteCreateWithoutUserInput.schema';
import { FavoriteUncheckedCreateWithoutUserInputObjectSchema } from './FavoriteUncheckedCreateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteUpsertWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => FavoriteWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => FavoriteUpdateWithoutUserInputObjectSchema),
			z.lazy(() => FavoriteUncheckedUpdateWithoutUserInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => FavoriteCreateWithoutUserInputObjectSchema),
			z.lazy(() => FavoriteUncheckedCreateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const FavoriteUpsertWithWhereUniqueWithoutUserInputObjectSchema = Schema;
