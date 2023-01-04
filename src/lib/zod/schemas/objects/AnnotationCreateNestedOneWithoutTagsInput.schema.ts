import { z } from 'zod';
import { AnnotationCreateWithoutTagsInputObjectSchema } from './AnnotationCreateWithoutTagsInput.schema';
import { AnnotationUncheckedCreateWithoutTagsInputObjectSchema } from './AnnotationUncheckedCreateWithoutTagsInput.schema';
import { AnnotationCreateOrConnectWithoutTagsInputObjectSchema } from './AnnotationCreateOrConnectWithoutTagsInput.schema';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationCreateNestedOneWithoutTagsInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => AnnotationCreateWithoutTagsInputObjectSchema),
				z.lazy(() => AnnotationUncheckedCreateWithoutTagsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z.lazy(() => AnnotationCreateOrConnectWithoutTagsInputObjectSchema).optional(),
		connect: z.lazy(() => AnnotationWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const AnnotationCreateNestedOneWithoutTagsInputObjectSchema = Schema;
