import { z } from 'zod';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';
import { AnnotationCreateWithoutBookmarkInputObjectSchema } from './AnnotationCreateWithoutBookmarkInput.schema';
import { AnnotationUncheckedCreateWithoutBookmarkInputObjectSchema } from './AnnotationUncheckedCreateWithoutBookmarkInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationCreateOrConnectWithoutBookmarkInput> = z
	.object({
		where: z.lazy(() => AnnotationWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => AnnotationCreateWithoutBookmarkInputObjectSchema),
			z.lazy(() => AnnotationUncheckedCreateWithoutBookmarkInputObjectSchema),
		]),
	})
	.strict();

export const AnnotationCreateOrConnectWithoutBookmarkInputObjectSchema = Schema;
