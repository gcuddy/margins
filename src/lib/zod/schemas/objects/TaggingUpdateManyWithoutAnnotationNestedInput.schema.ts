import { z } from 'zod';
import { TaggingCreateWithoutAnnotationInputObjectSchema } from './TaggingCreateWithoutAnnotationInput.schema';
import { TaggingUncheckedCreateWithoutAnnotationInputObjectSchema } from './TaggingUncheckedCreateWithoutAnnotationInput.schema';
import { TaggingCreateOrConnectWithoutAnnotationInputObjectSchema } from './TaggingCreateOrConnectWithoutAnnotationInput.schema';
import { TaggingUpsertWithWhereUniqueWithoutAnnotationInputObjectSchema } from './TaggingUpsertWithWhereUniqueWithoutAnnotationInput.schema';
import { TaggingCreateManyAnnotationInputEnvelopeObjectSchema } from './TaggingCreateManyAnnotationInputEnvelope.schema';
import { TaggingWhereUniqueInputObjectSchema } from './TaggingWhereUniqueInput.schema';
import { TaggingUpdateWithWhereUniqueWithoutAnnotationInputObjectSchema } from './TaggingUpdateWithWhereUniqueWithoutAnnotationInput.schema';
import { TaggingUpdateManyWithWhereWithoutAnnotationInputObjectSchema } from './TaggingUpdateManyWithWhereWithoutAnnotationInput.schema';
import { TaggingScalarWhereInputObjectSchema } from './TaggingScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingUpdateManyWithoutAnnotationNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => TaggingCreateWithoutAnnotationInputObjectSchema),
				z.lazy(() => TaggingCreateWithoutAnnotationInputObjectSchema).array(),
				z.lazy(() => TaggingUncheckedCreateWithoutAnnotationInputObjectSchema),
				z.lazy(() => TaggingUncheckedCreateWithoutAnnotationInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => TaggingCreateOrConnectWithoutAnnotationInputObjectSchema),
				z.lazy(() => TaggingCreateOrConnectWithoutAnnotationInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => TaggingUpsertWithWhereUniqueWithoutAnnotationInputObjectSchema),
				z.lazy(() => TaggingUpsertWithWhereUniqueWithoutAnnotationInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => TaggingCreateManyAnnotationInputEnvelopeObjectSchema).optional(),
		set: z
			.union([
				z.lazy(() => TaggingWhereUniqueInputObjectSchema),
				z.lazy(() => TaggingWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => TaggingWhereUniqueInputObjectSchema),
				z.lazy(() => TaggingWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => TaggingWhereUniqueInputObjectSchema),
				z.lazy(() => TaggingWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => TaggingWhereUniqueInputObjectSchema),
				z.lazy(() => TaggingWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => TaggingUpdateWithWhereUniqueWithoutAnnotationInputObjectSchema),
				z.lazy(() => TaggingUpdateWithWhereUniqueWithoutAnnotationInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => TaggingUpdateManyWithWhereWithoutAnnotationInputObjectSchema),
				z.lazy(() => TaggingUpdateManyWithWhereWithoutAnnotationInputObjectSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => TaggingScalarWhereInputObjectSchema),
				z.lazy(() => TaggingScalarWhereInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const TaggingUpdateManyWithoutAnnotationNestedInputObjectSchema = Schema;
