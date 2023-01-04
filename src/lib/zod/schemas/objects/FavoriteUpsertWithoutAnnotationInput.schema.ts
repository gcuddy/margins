import { z } from 'zod';
import { FavoriteUpdateWithoutAnnotationInputObjectSchema } from './FavoriteUpdateWithoutAnnotationInput.schema';
import { FavoriteUncheckedUpdateWithoutAnnotationInputObjectSchema } from './FavoriteUncheckedUpdateWithoutAnnotationInput.schema';
import { FavoriteCreateWithoutAnnotationInputObjectSchema } from './FavoriteCreateWithoutAnnotationInput.schema';
import { FavoriteUncheckedCreateWithoutAnnotationInputObjectSchema } from './FavoriteUncheckedCreateWithoutAnnotationInput.schema';
import { FavoriteWhereInputObjectSchema } from './FavoriteWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.FavoriteUpsertWithoutAnnotationInput> = z
	.object({
		update: z.union([
			z.lazy(() => FavoriteUpdateWithoutAnnotationInputObjectSchema),
			z.lazy(() => FavoriteUncheckedUpdateWithoutAnnotationInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => FavoriteCreateWithoutAnnotationInputObjectSchema),
			z.lazy(() => FavoriteUncheckedCreateWithoutAnnotationInputObjectSchema),
		]),
		where: z.lazy(() => FavoriteWhereInputObjectSchema).optional(),
	})
	.strict();

export const FavoriteUpsertWithoutAnnotationInputObjectSchema = Schema;
