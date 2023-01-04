import { z } from 'zod';
import { AnnotationCreateWithoutBookmarkInputObjectSchema } from './AnnotationCreateWithoutBookmarkInput.schema';
import { AnnotationUncheckedCreateWithoutBookmarkInputObjectSchema } from './AnnotationUncheckedCreateWithoutBookmarkInput.schema';
import { AnnotationCreateOrConnectWithoutBookmarkInputObjectSchema } from './AnnotationCreateOrConnectWithoutBookmarkInput.schema';
import { AnnotationUpsertWithWhereUniqueWithoutBookmarkInputObjectSchema } from './AnnotationUpsertWithWhereUniqueWithoutBookmarkInput.schema';
import { AnnotationCreateManyBookmarkInputEnvelopeObjectSchema } from './AnnotationCreateManyBookmarkInputEnvelope.schema';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';
import { AnnotationUpdateWithWhereUniqueWithoutBookmarkInputObjectSchema } from './AnnotationUpdateWithWhereUniqueWithoutBookmarkInput.schema';
import { AnnotationUpdateManyWithWhereWithoutBookmarkInputObjectSchema } from './AnnotationUpdateManyWithWhereWithoutBookmarkInput.schema';
import { AnnotationScalarWhereInputObjectSchema } from './AnnotationScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationUpdateManyWithoutBookmarkNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => AnnotationCreateWithoutBookmarkInputObjectSchema),
				z.lazy(() => AnnotationCreateWithoutBookmarkInputObjectSchema).array(),
				z.lazy(() => AnnotationUncheckedCreateWithoutBookmarkInputObjectSchema),
				z.lazy(() => AnnotationUncheckedCreateWithoutBookmarkInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => AnnotationCreateOrConnectWithoutBookmarkInputObjectSchema),
				z.lazy(() => AnnotationCreateOrConnectWithoutBookmarkInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => AnnotationUpsertWithWhereUniqueWithoutBookmarkInputObjectSchema),
				z.lazy(() => AnnotationUpsertWithWhereUniqueWithoutBookmarkInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => AnnotationCreateManyBookmarkInputEnvelopeObjectSchema).optional(),
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
				z.lazy(() => AnnotationUpdateWithWhereUniqueWithoutBookmarkInputObjectSchema),
				z.lazy(() => AnnotationUpdateWithWhereUniqueWithoutBookmarkInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => AnnotationUpdateManyWithWhereWithoutBookmarkInputObjectSchema),
				z.lazy(() => AnnotationUpdateManyWithWhereWithoutBookmarkInputObjectSchema).array(),
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

export const AnnotationUpdateManyWithoutBookmarkNestedInputObjectSchema = Schema;
