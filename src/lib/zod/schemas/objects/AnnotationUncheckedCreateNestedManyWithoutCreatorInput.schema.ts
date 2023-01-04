import { z } from 'zod';
import { AnnotationCreateWithoutCreatorInputObjectSchema } from './AnnotationCreateWithoutCreatorInput.schema';
import { AnnotationUncheckedCreateWithoutCreatorInputObjectSchema } from './AnnotationUncheckedCreateWithoutCreatorInput.schema';
import { AnnotationCreateOrConnectWithoutCreatorInputObjectSchema } from './AnnotationCreateOrConnectWithoutCreatorInput.schema';
import { AnnotationCreateManyCreatorInputEnvelopeObjectSchema } from './AnnotationCreateManyCreatorInputEnvelope.schema';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUncheckedCreateNestedManyWithoutCreatorInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => AnnotationCreateWithoutCreatorInputObjectSchema),
				z.lazy(() => AnnotationCreateWithoutCreatorInputObjectSchema).array(),
				z.lazy(() => AnnotationUncheckedCreateWithoutCreatorInputObjectSchema),
				z.lazy(() => AnnotationUncheckedCreateWithoutCreatorInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => AnnotationCreateOrConnectWithoutCreatorInputObjectSchema),
				z.lazy(() => AnnotationCreateOrConnectWithoutCreatorInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => AnnotationCreateManyCreatorInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => AnnotationWhereUniqueInputObjectSchema),
				z.lazy(() => AnnotationWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const AnnotationUncheckedCreateNestedManyWithoutCreatorInputObjectSchema = Schema;
