import { z } from 'zod';
import { AnnotationWhereInputObjectSchema } from './AnnotationWhereInput.schema';
import { AnnotationUpdateWithoutTagsInputObjectSchema } from './AnnotationUpdateWithoutTagsInput.schema';
import { AnnotationUncheckedUpdateWithoutTagsInputObjectSchema } from './AnnotationUncheckedUpdateWithoutTagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUpdateToOneWithWhereWithoutTagsInput> = z
	.object({
		where: z.lazy(() => AnnotationWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => AnnotationUpdateWithoutTagsInputObjectSchema),
			z.lazy(() => AnnotationUncheckedUpdateWithoutTagsInputObjectSchema),
		]),
	})
	.strict();

export const AnnotationUpdateToOneWithWhereWithoutTagsInputObjectSchema = Schema;
