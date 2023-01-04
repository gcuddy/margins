import { z } from 'zod';
import { AnnotationWhereInputObjectSchema } from './AnnotationWhereInput.schema';
import { AnnotationUpdateWithoutChildrenInputObjectSchema } from './AnnotationUpdateWithoutChildrenInput.schema';
import { AnnotationUncheckedUpdateWithoutChildrenInputObjectSchema } from './AnnotationUncheckedUpdateWithoutChildrenInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUpdateToOneWithWhereWithoutChildrenInput> = z
	.object({
		where: z.lazy(() => AnnotationWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => AnnotationUpdateWithoutChildrenInputObjectSchema),
			z.lazy(() => AnnotationUncheckedUpdateWithoutChildrenInputObjectSchema),
		]),
	})
	.strict();

export const AnnotationUpdateToOneWithWhereWithoutChildrenInputObjectSchema = Schema;
