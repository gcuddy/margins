import { z } from 'zod';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';
import { AnnotationUpdateWithoutCreatorInputObjectSchema } from './AnnotationUpdateWithoutCreatorInput.schema';
import { AnnotationUncheckedUpdateWithoutCreatorInputObjectSchema } from './AnnotationUncheckedUpdateWithoutCreatorInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUpdateWithWhereUniqueWithoutCreatorInput> = z
	.object({
		where: z.lazy(() => AnnotationWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => AnnotationUpdateWithoutCreatorInputObjectSchema),
			z.lazy(() => AnnotationUncheckedUpdateWithoutCreatorInputObjectSchema),
		]),
	})
	.strict();

export const AnnotationUpdateWithWhereUniqueWithoutCreatorInputObjectSchema = Schema;
