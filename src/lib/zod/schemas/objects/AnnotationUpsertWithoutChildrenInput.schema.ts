import { z } from 'zod';
import { AnnotationUpdateWithoutChildrenInputObjectSchema } from './AnnotationUpdateWithoutChildrenInput.schema';
import { AnnotationUncheckedUpdateWithoutChildrenInputObjectSchema } from './AnnotationUncheckedUpdateWithoutChildrenInput.schema';
import { AnnotationCreateWithoutChildrenInputObjectSchema } from './AnnotationCreateWithoutChildrenInput.schema';
import { AnnotationUncheckedCreateWithoutChildrenInputObjectSchema } from './AnnotationUncheckedCreateWithoutChildrenInput.schema';
import { AnnotationWhereInputObjectSchema } from './AnnotationWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUpsertWithoutChildrenInput> = z
	.object({
		update: z.union([
			z.lazy(() => AnnotationUpdateWithoutChildrenInputObjectSchema),
			z.lazy(() => AnnotationUncheckedUpdateWithoutChildrenInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => AnnotationCreateWithoutChildrenInputObjectSchema),
			z.lazy(() => AnnotationUncheckedCreateWithoutChildrenInputObjectSchema),
		]),
		where: z.lazy(() => AnnotationWhereInputObjectSchema).optional(),
	})
	.strict();

export const AnnotationUpsertWithoutChildrenInputObjectSchema = Schema;
