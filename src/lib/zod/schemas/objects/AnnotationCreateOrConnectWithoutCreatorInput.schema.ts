import { z } from 'zod';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';
import { AnnotationCreateWithoutCreatorInputObjectSchema } from './AnnotationCreateWithoutCreatorInput.schema';
import { AnnotationUncheckedCreateWithoutCreatorInputObjectSchema } from './AnnotationUncheckedCreateWithoutCreatorInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationCreateOrConnectWithoutCreatorInput> = z
	.object({
		where: z.lazy(() => AnnotationWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => AnnotationCreateWithoutCreatorInputObjectSchema),
			z.lazy(() => AnnotationUncheckedCreateWithoutCreatorInputObjectSchema),
		]),
	})
	.strict();

export const AnnotationCreateOrConnectWithoutCreatorInputObjectSchema = Schema;
