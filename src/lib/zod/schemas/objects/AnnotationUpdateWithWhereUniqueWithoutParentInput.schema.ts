import { z } from 'zod';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';
import { AnnotationUpdateWithoutParentInputObjectSchema } from './AnnotationUpdateWithoutParentInput.schema';
import { AnnotationUncheckedUpdateWithoutParentInputObjectSchema } from './AnnotationUncheckedUpdateWithoutParentInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUpdateWithWhereUniqueWithoutParentInput> = z
	.object({
		where: z.lazy(() => AnnotationWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => AnnotationUpdateWithoutParentInputObjectSchema),
			z.lazy(() => AnnotationUncheckedUpdateWithoutParentInputObjectSchema),
		]),
	})
	.strict();

export const AnnotationUpdateWithWhereUniqueWithoutParentInputObjectSchema = Schema;
