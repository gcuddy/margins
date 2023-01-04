import { z } from 'zod';
import { AnnotationCreateWithoutEntryInputObjectSchema } from './AnnotationCreateWithoutEntryInput.schema';
import { AnnotationUncheckedCreateWithoutEntryInputObjectSchema } from './AnnotationUncheckedCreateWithoutEntryInput.schema';
import { AnnotationCreateOrConnectWithoutEntryInputObjectSchema } from './AnnotationCreateOrConnectWithoutEntryInput.schema';
import { AnnotationUpsertWithWhereUniqueWithoutEntryInputObjectSchema } from './AnnotationUpsertWithWhereUniqueWithoutEntryInput.schema';
import { AnnotationCreateManyEntryInputEnvelopeObjectSchema } from './AnnotationCreateManyEntryInputEnvelope.schema';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';
import { AnnotationUpdateWithWhereUniqueWithoutEntryInputObjectSchema } from './AnnotationUpdateWithWhereUniqueWithoutEntryInput.schema';
import { AnnotationUpdateManyWithWhereWithoutEntryInputObjectSchema } from './AnnotationUpdateManyWithWhereWithoutEntryInput.schema';
import { AnnotationScalarWhereInputObjectSchema } from './AnnotationScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUncheckedUpdateManyWithoutEntryNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => AnnotationCreateWithoutEntryInputObjectSchema),
				z.lazy(() => AnnotationCreateWithoutEntryInputObjectSchema).array(),
				z.lazy(() => AnnotationUncheckedCreateWithoutEntryInputObjectSchema),
				z.lazy(() => AnnotationUncheckedCreateWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => AnnotationCreateOrConnectWithoutEntryInputObjectSchema),
				z.lazy(() => AnnotationCreateOrConnectWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => AnnotationUpsertWithWhereUniqueWithoutEntryInputObjectSchema),
				z.lazy(() => AnnotationUpsertWithWhereUniqueWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => AnnotationCreateManyEntryInputEnvelopeObjectSchema).optional(),
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
				z.lazy(() => AnnotationUpdateWithWhereUniqueWithoutEntryInputObjectSchema),
				z.lazy(() => AnnotationUpdateWithWhereUniqueWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => AnnotationUpdateManyWithWhereWithoutEntryInputObjectSchema),
				z.lazy(() => AnnotationUpdateManyWithWhereWithoutEntryInputObjectSchema).array(),
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

export const AnnotationUncheckedUpdateManyWithoutEntryNestedInputObjectSchema = Schema;
