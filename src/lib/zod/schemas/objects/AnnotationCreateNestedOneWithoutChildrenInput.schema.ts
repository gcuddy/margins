import { z } from 'zod';
import { AnnotationCreateWithoutChildrenInputObjectSchema } from './AnnotationCreateWithoutChildrenInput.schema';
import { AnnotationUncheckedCreateWithoutChildrenInputObjectSchema } from './AnnotationUncheckedCreateWithoutChildrenInput.schema';
import { AnnotationCreateOrConnectWithoutChildrenInputObjectSchema } from './AnnotationCreateOrConnectWithoutChildrenInput.schema';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationCreateNestedOneWithoutChildrenInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => AnnotationCreateWithoutChildrenInputObjectSchema),
				z.lazy(() => AnnotationUncheckedCreateWithoutChildrenInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => AnnotationCreateOrConnectWithoutChildrenInputObjectSchema)
			.optional(),
		connect: z.lazy(() => AnnotationWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const AnnotationCreateNestedOneWithoutChildrenInputObjectSchema = Schema;
