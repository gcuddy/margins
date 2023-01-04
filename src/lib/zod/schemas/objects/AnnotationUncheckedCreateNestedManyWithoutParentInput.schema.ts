import { z } from 'zod';
import { AnnotationCreateWithoutParentInputObjectSchema } from './AnnotationCreateWithoutParentInput.schema';
import { AnnotationUncheckedCreateWithoutParentInputObjectSchema } from './AnnotationUncheckedCreateWithoutParentInput.schema';
import { AnnotationCreateOrConnectWithoutParentInputObjectSchema } from './AnnotationCreateOrConnectWithoutParentInput.schema';
import { AnnotationCreateManyParentInputEnvelopeObjectSchema } from './AnnotationCreateManyParentInputEnvelope.schema';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUncheckedCreateNestedManyWithoutParentInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => AnnotationCreateWithoutParentInputObjectSchema),
				z.lazy(() => AnnotationCreateWithoutParentInputObjectSchema).array(),
				z.lazy(() => AnnotationUncheckedCreateWithoutParentInputObjectSchema),
				z.lazy(() => AnnotationUncheckedCreateWithoutParentInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => AnnotationCreateOrConnectWithoutParentInputObjectSchema),
				z.lazy(() => AnnotationCreateOrConnectWithoutParentInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => AnnotationCreateManyParentInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => AnnotationWhereUniqueInputObjectSchema),
				z.lazy(() => AnnotationWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const AnnotationUncheckedCreateNestedManyWithoutParentInputObjectSchema = Schema;
