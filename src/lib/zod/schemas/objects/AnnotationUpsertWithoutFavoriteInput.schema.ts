import { z } from 'zod';
import { AnnotationUpdateWithoutFavoriteInputObjectSchema } from './AnnotationUpdateWithoutFavoriteInput.schema';
import { AnnotationUncheckedUpdateWithoutFavoriteInputObjectSchema } from './AnnotationUncheckedUpdateWithoutFavoriteInput.schema';
import { AnnotationCreateWithoutFavoriteInputObjectSchema } from './AnnotationCreateWithoutFavoriteInput.schema';
import { AnnotationUncheckedCreateWithoutFavoriteInputObjectSchema } from './AnnotationUncheckedCreateWithoutFavoriteInput.schema';
import { AnnotationWhereInputObjectSchema } from './AnnotationWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUpsertWithoutFavoriteInput> = z
	.object({
		update: z.union([
			z.lazy(() => AnnotationUpdateWithoutFavoriteInputObjectSchema),
			z.lazy(() => AnnotationUncheckedUpdateWithoutFavoriteInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => AnnotationCreateWithoutFavoriteInputObjectSchema),
			z.lazy(() => AnnotationUncheckedCreateWithoutFavoriteInputObjectSchema),
		]),
		where: z.lazy(() => AnnotationWhereInputObjectSchema).optional(),
	})
	.strict();

export const AnnotationUpsertWithoutFavoriteInputObjectSchema = Schema;
