import { z } from 'zod';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';
import { AnnotationCreateWithoutFavoriteInputObjectSchema } from './AnnotationCreateWithoutFavoriteInput.schema';
import { AnnotationUncheckedCreateWithoutFavoriteInputObjectSchema } from './AnnotationUncheckedCreateWithoutFavoriteInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationCreateOrConnectWithoutFavoriteInput> = z
	.object({
		where: z.lazy(() => AnnotationWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => AnnotationCreateWithoutFavoriteInputObjectSchema),
			z.lazy(() => AnnotationUncheckedCreateWithoutFavoriteInputObjectSchema),
		]),
	})
	.strict();

export const AnnotationCreateOrConnectWithoutFavoriteInputObjectSchema = Schema;
