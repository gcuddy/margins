import { z } from 'zod';
import { AnnotationCreateWithoutEntryInputObjectSchema } from './AnnotationCreateWithoutEntryInput.schema';
import { AnnotationUncheckedCreateWithoutEntryInputObjectSchema } from './AnnotationUncheckedCreateWithoutEntryInput.schema';
import { AnnotationCreateOrConnectWithoutEntryInputObjectSchema } from './AnnotationCreateOrConnectWithoutEntryInput.schema';
import { AnnotationCreateManyEntryInputEnvelopeObjectSchema } from './AnnotationCreateManyEntryInputEnvelope.schema';
import { AnnotationWhereUniqueInputObjectSchema } from './AnnotationWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.AnnotationCreateNestedManyWithoutEntryInput> = z
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
		createMany: z.lazy(() => AnnotationCreateManyEntryInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => AnnotationWhereUniqueInputObjectSchema),
				z.lazy(() => AnnotationWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const AnnotationCreateNestedManyWithoutEntryInputObjectSchema = Schema;
