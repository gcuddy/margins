import { z } from 'zod';
import { AnnotationCreateWithoutBookmarkInputObjectSchema } from './AnnotationCreateWithoutBookmarkInput.schema';
import { AnnotationUncheckedCreateWithoutBookmarkInputObjectSchema } from './AnnotationUncheckedCreateWithoutBookmarkInput.schema';
import { AnnotationCreateOrConnectWithoutBookmarkInputObjectSchema } from './AnnotationCreateOrConnectWithoutBookmarkInput.schema';
import { AnnotationCreateManyBookmarkInputEnvelopeObjectSchema } from './AnnotationCreateManyBookmarkInputEnvelope.schema';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationCreateNestedManyWithoutBookmarkInput> = z
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
		createMany: z.lazy(() => AnnotationCreateManyBookmarkInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => AnnotationWhereUniqueInputObjectSchema),
				z.lazy(() => AnnotationWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const AnnotationCreateNestedManyWithoutBookmarkInputObjectSchema = Schema;
