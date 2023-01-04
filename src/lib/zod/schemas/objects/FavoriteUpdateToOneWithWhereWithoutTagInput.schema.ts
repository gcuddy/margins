import { z } from 'zod';
import { FavoriteWhereInputObjectSchema } from './FavoriteWhereInput.schema';
import { FavoriteUpdateWithoutTagInputObjectSchema } from './FavoriteUpdateWithoutTagInput.schema';
import { FavoriteUncheckedUpdateWithoutTagInputObjectSchema } from './FavoriteUncheckedUpdateWithoutTagInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteUpdateToOneWithWhereWithoutTagInput> = z
	.object({
		where: z.lazy(() => FavoriteWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => FavoriteUpdateWithoutTagInputObjectSchema),
			z.lazy(() => FavoriteUncheckedUpdateWithoutTagInputObjectSchema),
		]),
	})
	.strict();

export const FavoriteUpdateToOneWithWhereWithoutTagInputObjectSchema = Schema;
