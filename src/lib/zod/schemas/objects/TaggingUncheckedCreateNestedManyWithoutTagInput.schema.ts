import { z } from 'zod';
import { TaggingCreateWithoutTagInputObjectSchema } from './TaggingCreateWithoutTagInput.schema';
import { TaggingUncheckedCreateWithoutTagInputObjectSchema } from './TaggingUncheckedCreateWithoutTagInput.schema';
import { TaggingCreateOrConnectWithoutTagInputObjectSchema } from './TaggingCreateOrConnectWithoutTagInput.schema';
import { TaggingCreateManyTagInputEnvelopeObjectSchema } from './TaggingCreateManyTagInputEnvelope.schema';
import { TaggingWhereUniqueInputObjectSchema } from './TaggingWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingUncheckedCreateNestedManyWithoutTagInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => TaggingCreateWithoutTagInputObjectSchema),
				z.lazy(() => TaggingCreateWithoutTagInputObjectSchema).array(),
				z.lazy(() => TaggingUncheckedCreateWithoutTagInputObjectSchema),
				z.lazy(() => TaggingUncheckedCreateWithoutTagInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => TaggingCreateOrConnectWithoutTagInputObjectSchema),
				z.lazy(() => TaggingCreateOrConnectWithoutTagInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => TaggingCreateManyTagInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => TaggingWhereUniqueInputObjectSchema),
				z.lazy(() => TaggingWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const TaggingUncheckedCreateNestedManyWithoutTagInputObjectSchema = Schema;
