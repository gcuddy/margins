import { z } from 'zod';
import { FavoriteWhereInputObjectSchema } from './FavoriteWhereInput.schema';
import { FavoriteUpdateWithoutAnnotationInputObjectSchema } from './FavoriteUpdateWithoutAnnotationInput.schema';
import { FavoriteUncheckedUpdateWithoutAnnotationInputObjectSchema } from './FavoriteUncheckedUpdateWithoutAnnotationInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteUpdateToOneWithWhereWithoutAnnotationInput> = z
	.object({
		where: z.lazy(() => FavoriteWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => FavoriteUpdateWithoutAnnotationInputObjectSchema),
			z.lazy(() => FavoriteUncheckedUpdateWithoutAnnotationInputObjectSchema),
		]),
	})
	.strict();

export const FavoriteUpdateToOneWithWhereWithoutAnnotationInputObjectSchema = Schema;
