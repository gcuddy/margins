import { z } from 'zod';
import { AnnotationCreateWithoutCreatorInputObjectSchema } from './AnnotationCreateWithoutCreatorInput.schema';
import { AnnotationUncheckedCreateWithoutCreatorInputObjectSchema } from './AnnotationUncheckedCreateWithoutCreatorInput.schema';
import { AnnotationCreateOrConnectWithoutCreatorInputObjectSchema } from './AnnotationCreateOrConnectWithoutCreatorInput.schema';
import { AnnotationUpsertWithWhereUniqueWithoutCreatorInputObjectSchema } from './AnnotationUpsertWithWhereUniqueWithoutCreatorInput.schema';
import { AnnotationCreateManyCreatorInputEnvelopeObjectSchema } from './AnnotationCreateManyCreatorInputEnvelope.schema';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';
import { AnnotationUpdateWithWhereUniqueWithoutCreatorInputObjectSchema } from './AnnotationUpdateWithWhereUniqueWithoutCreatorInput.schema';
import { AnnotationUpdateManyWithWhereWithoutCreatorInputObjectSchema } from './AnnotationUpdateManyWithWhereWithoutCreatorInput.schema';
import { AnnotationScalarWhereInputObjectSchema } from './AnnotationScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUpdateManyWithoutCreatorNestedInput> = z
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
		upsert: z
			.union([
				z.lazy(() => AnnotationUpsertWithWhereUniqueWithoutCreatorInputObjectSchema),
				z.lazy(() => AnnotationUpsertWithWhereUniqueWithoutCreatorInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => AnnotationCreateManyCreatorInputEnvelopeObjectSchema).optional(),
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
				z.lazy(() => AnnotationUpdateWithWhereUniqueWithoutCreatorInputObjectSchema),
				z.lazy(() => AnnotationUpdateWithWhereUniqueWithoutCreatorInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => AnnotationUpdateManyWithWhereWithoutCreatorInputObjectSchema),
				z.lazy(() => AnnotationUpdateManyWithWhereWithoutCreatorInputObjectSchema).array(),
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

export const AnnotationUpdateManyWithoutCreatorNestedInputObjectSchema = Schema;
