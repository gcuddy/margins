import { z } from 'zod';
import { AnnotationScalarWhereInputObjectSchema } from './AnnotationScalarWhereInput.schema';
import { AnnotationUpdateManyMutationInputObjectSchema } from './AnnotationUpdateManyMutationInput.schema';
import { AnnotationUncheckedUpdateManyWithoutAnnotationsInputObjectSchema } from './AnnotationUncheckedUpdateManyWithoutAnnotationsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUpdateManyWithWhereWithoutBookmarkInput> = z
	.object({
		where: z.lazy(() => AnnotationScalarWhereInputObjectSchema),
		data: z.union([
			z.lazy(() => AnnotationUpdateManyMutationInputObjectSchema),
			z.lazy(() => AnnotationUncheckedUpdateManyWithoutAnnotationsInputObjectSchema),
		]),
	})
	.strict();

export const AnnotationUpdateManyWithWhereWithoutBookmarkInputObjectSchema = Schema;
