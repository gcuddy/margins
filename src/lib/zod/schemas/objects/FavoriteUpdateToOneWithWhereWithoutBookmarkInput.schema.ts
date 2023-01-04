import { z } from 'zod';
import { FavoriteWhereInputObjectSchema } from './FavoriteWhereInput.schema';
import { FavoriteUpdateWithoutBookmarkInputObjectSchema } from './FavoriteUpdateWithoutBookmarkInput.schema';
import { FavoriteUncheckedUpdateWithoutBookmarkInputObjectSchema } from './FavoriteUncheckedUpdateWithoutBookmarkInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteUpdateToOneWithWhereWithoutBookmarkInput> = z
	.object({
		where: z.lazy(() => FavoriteWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => FavoriteUpdateWithoutBookmarkInputObjectSchema),
			z.lazy(() => FavoriteUncheckedUpdateWithoutBookmarkInputObjectSchema),
		]),
	})
	.strict();

export const FavoriteUpdateToOneWithWhereWithoutBookmarkInputObjectSchema = Schema;
