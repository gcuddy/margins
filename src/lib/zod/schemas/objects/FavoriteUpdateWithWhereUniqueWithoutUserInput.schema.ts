import { z } from 'zod';
import { FavoriteWhereUniqueInputObjectSchema } from './FavoriteWhereUniqueInput.schema';
import { FavoriteUpdateWithoutUserInputObjectSchema } from './FavoriteUpdateWithoutUserInput.schema';
import { FavoriteUncheckedUpdateWithoutUserInputObjectSchema } from './FavoriteUncheckedUpdateWithoutUserInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteUpdateWithWhereUniqueWithoutUserInput> = z
	.object({
		where: z.lazy(() => FavoriteWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => FavoriteUpdateWithoutUserInputObjectSchema),
			z.lazy(() => FavoriteUncheckedUpdateWithoutUserInputObjectSchema),
		]),
	})
	.strict();

export const FavoriteUpdateWithWhereUniqueWithoutUserInputObjectSchema = Schema;
