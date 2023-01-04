import { z } from 'zod';
import { AnnotationWhereInputObjectSchema } from './AnnotationWhereInput.schema';
import { AnnotationUpdateWithoutCollectionsInputObjectSchema } from './AnnotationUpdateWithoutCollectionsInput.schema';
import { AnnotationUncheckedUpdateWithoutCollectionsInputObjectSchema } from './AnnotationUncheckedUpdateWithoutCollectionsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUpdateToOneWithWhereWithoutCollectionsInput> = z
	.object({
		where: z.lazy(() => AnnotationWhereInputObjectSchema).optional(),
		data: z.union([
			z.lazy(() => AnnotationUpdateWithoutCollectionsInputObjectSchema),
			z.lazy(() => AnnotationUncheckedUpdateWithoutCollectionsInputObjectSchema),
		]),
	})
	.strict();

export const AnnotationUpdateToOneWithWhereWithoutCollectionsInputObjectSchema = Schema;
