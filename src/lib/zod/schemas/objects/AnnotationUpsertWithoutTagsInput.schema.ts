import { z } from 'zod';
import { AnnotationUpdateWithoutTagsInputObjectSchema } from './AnnotationUpdateWithoutTagsInput.schema';
import { AnnotationUncheckedUpdateWithoutTagsInputObjectSchema } from './AnnotationUncheckedUpdateWithoutTagsInput.schema';
import { AnnotationCreateWithoutTagsInputObjectSchema } from './AnnotationCreateWithoutTagsInput.schema';
import { AnnotationUncheckedCreateWithoutTagsInputObjectSchema } from './AnnotationUncheckedCreateWithoutTagsInput.schema';
import { AnnotationWhereInputObjectSchema } from './AnnotationWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUpsertWithoutTagsInput> = z
	.object({
		update: z.union([
			z.lazy(() => AnnotationUpdateWithoutTagsInputObjectSchema),
			z.lazy(() => AnnotationUncheckedUpdateWithoutTagsInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => AnnotationCreateWithoutTagsInputObjectSchema),
			z.lazy(() => AnnotationUncheckedCreateWithoutTagsInputObjectSchema),
		]),
		where: z.lazy(() => AnnotationWhereInputObjectSchema).optional(),
	})
	.strict();

export const AnnotationUpsertWithoutTagsInputObjectSchema = Schema;
