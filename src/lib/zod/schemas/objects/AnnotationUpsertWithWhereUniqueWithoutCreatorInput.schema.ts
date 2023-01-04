import { z } from 'zod';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';
import { AnnotationUpdateWithoutCreatorInputObjectSchema } from './AnnotationUpdateWithoutCreatorInput.schema';
import { AnnotationUncheckedUpdateWithoutCreatorInputObjectSchema } from './AnnotationUncheckedUpdateWithoutCreatorInput.schema';
import { AnnotationCreateWithoutCreatorInputObjectSchema } from './AnnotationCreateWithoutCreatorInput.schema';
import { AnnotationUncheckedCreateWithoutCreatorInputObjectSchema } from './AnnotationUncheckedCreateWithoutCreatorInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUpsertWithWhereUniqueWithoutCreatorInput> = z
	.object({
		where: z.lazy(() => AnnotationWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => AnnotationUpdateWithoutCreatorInputObjectSchema),
			z.lazy(() => AnnotationUncheckedUpdateWithoutCreatorInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => AnnotationCreateWithoutCreatorInputObjectSchema),
			z.lazy(() => AnnotationUncheckedCreateWithoutCreatorInputObjectSchema),
		]),
	})
	.strict();

export const AnnotationUpsertWithWhereUniqueWithoutCreatorInputObjectSchema = Schema;
