import { z } from 'zod';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';
import { AnnotationCreateWithoutTagsInputObjectSchema } from './AnnotationCreateWithoutTagsInput.schema';
import { AnnotationUncheckedCreateWithoutTagsInputObjectSchema } from './AnnotationUncheckedCreateWithoutTagsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationCreateOrConnectWithoutTagsInput> = z
	.object({
		where: z.lazy(() => AnnotationWhereUniqueInputObjectSchema),
		create: z.union([
			z.lazy(() => AnnotationCreateWithoutTagsInputObjectSchema),
			z.lazy(() => AnnotationUncheckedCreateWithoutTagsInputObjectSchema),
		]),
	})
	.strict();

export const AnnotationCreateOrConnectWithoutTagsInputObjectSchema = Schema;
