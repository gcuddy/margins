import { z } from 'zod';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';
import { AnnotationUpdateWithoutBookmarkInputObjectSchema } from './AnnotationUpdateWithoutBookmarkInput.schema';
import { AnnotationUncheckedUpdateWithoutBookmarkInputObjectSchema } from './AnnotationUncheckedUpdateWithoutBookmarkInput.schema';
import { AnnotationCreateWithoutBookmarkInputObjectSchema } from './AnnotationCreateWithoutBookmarkInput.schema';
import { AnnotationUncheckedCreateWithoutBookmarkInputObjectSchema } from './AnnotationUncheckedCreateWithoutBookmarkInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUpsertWithWhereUniqueWithoutBookmarkInput> = z
	.object({
		where: z.lazy(() => AnnotationWhereUniqueInputObjectSchema),
		update: z.union([
			z.lazy(() => AnnotationUpdateWithoutBookmarkInputObjectSchema),
			z.lazy(() => AnnotationUncheckedUpdateWithoutBookmarkInputObjectSchema),
		]),
		create: z.union([
			z.lazy(() => AnnotationCreateWithoutBookmarkInputObjectSchema),
			z.lazy(() => AnnotationUncheckedCreateWithoutBookmarkInputObjectSchema),
		]),
	})
	.strict();

export const AnnotationUpsertWithWhereUniqueWithoutBookmarkInputObjectSchema = Schema;
