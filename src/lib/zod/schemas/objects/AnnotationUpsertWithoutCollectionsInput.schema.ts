import { z } from 'zod';
import { AnnotationUpdateWithoutCollectionsInputObjectSchema } from './AnnotationUpdateWithoutCollectionsInput.schema';
import { AnnotationUncheckedUpdateWithoutCollectionsInputObjectSchema } from './AnnotationUncheckedUpdateWithoutCollectionsInput.schema';
import { AnnotationCreateWithoutCollectionsInputObjectSchema } from './AnnotationCreateWithoutCollectionsInput.schema';
import { AnnotationUncheckedCreateWithoutCollectionsInputObjectSchema } from './AnnotationUncheckedCreateWithoutCollectionsInput.schema';
import { AnnotationWhereInputObjectSchema } from './AnnotationWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUpsertWithoutCollectionsInput> = z
	.object({
		update: z.union([
			z.lazy(() => AnnotationUpdateWithoutCollectionsInputObjectSchema),
			z.lazy(() => AnnotationUncheckedUpdateWithoutCollectionsInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => AnnotationCreateWithoutCollectionsInputObjectSchema),
			z.lazy(() => AnnotationUncheckedCreateWithoutCollectionsInputObjectSchema),
		]),
		where: z.lazy(() => AnnotationWhereInputObjectSchema).optional(),
	})
	.strict();

export const AnnotationUpsertWithoutCollectionsInputObjectSchema = Schema;
