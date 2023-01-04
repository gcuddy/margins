import { z } from 'zod';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';
import { AnnotationUpdateWithoutBookmarkInputObjectSchema } from './AnnotationUpdateWithoutBookmarkInput.schema';
import { AnnotationUncheckedUpdateWithoutBookmarkInputObjectSchema } from './AnnotationUncheckedUpdateWithoutBookmarkInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUpdateWithWhereUniqueWithoutBookmarkInput> = z
	.object({
		where: z.lazy(() => AnnotationWhereUniqueInputObjectSchema),
		data: z.union([
			z.lazy(() => AnnotationUpdateWithoutBookmarkInputObjectSchema),
			z.lazy(() => AnnotationUncheckedUpdateWithoutBookmarkInputObjectSchema),
		]),
	})
	.strict();

export const AnnotationUpdateWithWhereUniqueWithoutBookmarkInputObjectSchema = Schema;
