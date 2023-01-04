import { z } from 'zod';
import { FavoriteWhereInputObjectSchema } from './FavoriteWhereInput.schema';
import { FavoriteUpdateWithoutSmartListInputObjectSchema } from './FavoriteUpdateWithoutSmartListInput.schema';
import { FavoriteUncheckedUpdateWithoutSmartListInputObjectSchema } from './FavoriteUncheckedUpdateWithoutSmartListInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteUpdateToOneWithWhereWithoutSmartListInput> = z
	.object({
		where: z.lazy(() => FavoriteWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => FavoriteUpdateWithoutSmartListInputObjectSchema),
			z.lazy(() => FavoriteUncheckedUpdateWithoutSmartListInputObjectSchema),
		]),
	})
	.strict();

export const FavoriteUpdateToOneWithWhereWithoutSmartListInputObjectSchema = Schema;
