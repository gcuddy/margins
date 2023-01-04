import { z } from 'zod';
import { AnnotationScalarWhereInputObjectSchema } from './AnnotationScalarWhereInput.schema';
import { AnnotationUpdateManyMutationInputObjectSchema } from './AnnotationUpdateManyMutationInput.schema';
import { AnnotationUncheckedUpdateManyWithoutChildrenInputObjectSchema } from './AnnotationUncheckedUpdateManyWithoutChildrenInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUpdateManyWithWhereWithoutParentInput> = z
	.object({
		where: z.lazy(() => AnnotationScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => AnnotationUpdateManyMutationInputObjectSchema),
			z.lazy(() => AnnotationUncheckedUpdateManyWithoutChildrenInputObjectSchema),
		]),
	})
	.strict();

export const AnnotationUpdateManyWithWhereWithoutParentInputObjectSchema = Schema;
