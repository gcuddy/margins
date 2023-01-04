import { z } from 'zod';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';
import { AnnotationCreateWithoutChildrenInputObjectSchema } from './AnnotationCreateWithoutChildrenInput.schema';
import { AnnotationUncheckedCreateWithoutChildrenInputObjectSchema } from './AnnotationUncheckedCreateWithoutChildrenInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationCreateOrConnectWithoutChildrenInput> = z
	.object({
		where: z.lazy(() => AnnotationWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => AnnotationCreateWithoutChildrenInputObjectSchema),
			z.lazy(() => AnnotationUncheckedCreateWithoutChildrenInputObjectSchema),
		]),
	})
	.strict();

export const AnnotationCreateOrConnectWithoutChildrenInputObjectSchema = Schema;
