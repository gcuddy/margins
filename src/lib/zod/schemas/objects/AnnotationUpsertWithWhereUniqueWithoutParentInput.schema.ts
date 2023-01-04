import { z } from 'zod';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';
import { AnnotationUpdateWithoutParentInputObjectSchema } from './AnnotationUpdateWithoutParentInput.schema';
import { AnnotationUncheckedUpdateWithoutParentInputObjectSchema } from './AnnotationUncheckedUpdateWithoutParentInput.schema';
import { AnnotationCreateWithoutParentInputObjectSchema } from './AnnotationCreateWithoutParentInput.schema';
import { AnnotationUncheckedCreateWithoutParentInputObjectSchema } from './AnnotationUncheckedCreateWithoutParentInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUpsertWithWhereUniqueWithoutParentInput> = z
	.object({
		where: z.lazy(() => AnnotationWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => AnnotationUpdateWithoutParentInputObjectSchema),
			z.lazy(() => AnnotationUncheckedUpdateWithoutParentInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => AnnotationCreateWithoutParentInputObjectSchema),
			z.lazy(() => AnnotationUncheckedCreateWithoutParentInputObjectSchema),
		]),
	})
	.strict();

export const AnnotationUpsertWithWhereUniqueWithoutParentInputObjectSchema = Schema;
