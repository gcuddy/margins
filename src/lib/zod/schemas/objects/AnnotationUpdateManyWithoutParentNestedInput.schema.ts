import { z } from 'zod';
import { AnnotationCreateWithoutParentInputObjectSchema } from './AnnotationCreateWithoutParentInput.schema';
import { AnnotationUncheckedCreateWithoutParentInputObjectSchema } from './AnnotationUncheckedCreateWithoutParentInput.schema';
import { AnnotationCreateOrConnectWithoutParentInputObjectSchema } from './AnnotationCreateOrConnectWithoutParentInput.schema';
import { AnnotationUpsertWithWhereUniqueWithoutParentInputObjectSchema } from './AnnotationUpsertWithWhereUniqueWithoutParentInput.schema';
import { AnnotationCreateManyParentInputEnvelopeObjectSchema } from './AnnotationCreateManyParentInputEnvelope.schema';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';
import { AnnotationUpdateWithWhereUniqueWithoutParentInputObjectSchema } from './AnnotationUpdateWithWhereUniqueWithoutParentInput.schema';
import { AnnotationUpdateManyWithWhereWithoutParentInputObjectSchema } from './AnnotationUpdateManyWithWhereWithoutParentInput.schema';
import { AnnotationScalarWhereInputObjectSchema } from './AnnotationScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUpdateManyWithoutParentNestedInput> = z
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
		upsert: z
			.union([
				z.lazy(() => AnnotationUpsertWithWhereUniqueWithoutParentInputObjectSchema),
				z.lazy(() => AnnotationUpsertWithWhereUniqueWithoutParentInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => AnnotationCreateManyParentInputEnvelopeObjectSchema).optional(),
		set: z
			.union([
				z.lazy(() => AnnotationWhereUniqueInputObjectSchema),
				z.lazy(() => AnnotationWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => AnnotationWhereUniqueInputObjectSchema),
				z.lazy(() => AnnotationWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => AnnotationWhereUniqueInputObjectSchema),
				z.lazy(() => AnnotationWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => AnnotationWhereUniqueInputObjectSchema),
				z.lazy(() => AnnotationWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => AnnotationUpdateWithWhereUniqueWithoutParentInputObjectSchema),
				z.lazy(() => AnnotationUpdateWithWhereUniqueWithoutParentInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => AnnotationUpdateManyWithWhereWithoutParentInputObjectSchema),
				z.lazy(() => AnnotationUpdateManyWithWhereWithoutParentInputObjectSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => AnnotationScalarWhereInputObjectSchema),
				z.lazy(() => AnnotationScalarWhereInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const AnnotationUpdateManyWithoutParentNestedInputObjectSchema = Schema;
