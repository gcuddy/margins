import { z } from 'zod';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';
import { AnnotationCreateWithoutParentInputObjectSchema } from './AnnotationCreateWithoutParentInput.schema';
import { AnnotationUncheckedCreateWithoutParentInputObjectSchema } from './AnnotationUncheckedCreateWithoutParentInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationCreateOrConnectWithoutParentInput> = z
	.object({
		where: z.lazy(() => AnnotationWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => AnnotationCreateWithoutParentInputObjectSchema),
			z.lazy(() => AnnotationUncheckedCreateWithoutParentInputObjectSchema),
		]),
	})
	.strict();

export const AnnotationCreateOrConnectWithoutParentInputObjectSchema = Schema;
