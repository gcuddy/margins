import { z } from 'zod';
import { AnnotationWhereInputObjectSchema } from './AnnotationWhereInput.schema';
import { AnnotationUpdateWithoutFavoriteInputObjectSchema } from './AnnotationUpdateWithoutFavoriteInput.schema';
import { AnnotationUncheckedUpdateWithoutFavoriteInputObjectSchema } from './AnnotationUncheckedUpdateWithoutFavoriteInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUpdateToOneWithWhereWithoutFavoriteInput> = z
	.object({
		where: z.lazy(() => AnnotationWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => AnnotationUpdateWithoutFavoriteInputObjectSchema),
			z.lazy(() => AnnotationUncheckedUpdateWithoutFavoriteInputObjectSchema),
		]),
	})
	.strict();

export const AnnotationUpdateToOneWithWhereWithoutFavoriteInputObjectSchema = Schema;
