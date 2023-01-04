import { z } from 'zod';
import { TaggingCreateWithoutAnnotationInputObjectSchema } from './TaggingCreateWithoutAnnotationInput.schema';
import { TaggingUncheckedCreateWithoutAnnotationInputObjectSchema } from './TaggingUncheckedCreateWithoutAnnotationInput.schema';
import { TaggingCreateOrConnectWithoutAnnotationInputObjectSchema } from './TaggingCreateOrConnectWithoutAnnotationInput.schema';
import { TaggingCreateManyAnnotationInputEnvelopeObjectSchema } from './TaggingCreateManyAnnotationInputEnvelope.schema';
import { TaggingWhereUniqueInputObjectSchema } from './TaggingWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingCreateNestedManyWithoutAnnotationInput> = z
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
		createMany: z.lazy(() => TaggingCreateManyAnnotationInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => TaggingWhereUniqueInputObjectSchema),
				z.lazy(() => TaggingWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const TaggingCreateNestedManyWithoutAnnotationInputObjectSchema = Schema;
