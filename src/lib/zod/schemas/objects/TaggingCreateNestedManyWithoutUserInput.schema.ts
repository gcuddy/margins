import { z } from 'zod';
import { TaggingCreateWithoutUserInputObjectSchema } from './TaggingCreateWithoutUserInput.schema';
import { TaggingUncheckedCreateWithoutUserInputObjectSchema } from './TaggingUncheckedCreateWithoutUserInput.schema';
import { TaggingCreateOrConnectWithoutUserInputObjectSchema } from './TaggingCreateOrConnectWithoutUserInput.schema';
import { TaggingCreateManyUserInputEnvelopeObjectSchema } from './TaggingCreateManyUserInputEnvelope.schema';
import { TaggingWhereUniqueInputObjectSchema } from './TaggingWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingCreateNestedManyWithoutUserInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => TaggingCreateWithoutUserInputObjectSchema),
				z.lazy(() => TaggingCreateWithoutUserInputObjectSchema).array(),
				z.lazy(() => TaggingUncheckedCreateWithoutUserInputObjectSchema),
				z.lazy(() => TaggingUncheckedCreateWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => TaggingCreateOrConnectWithoutUserInputObjectSchema),
				z.lazy(() => TaggingCreateOrConnectWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => TaggingCreateManyUserInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => TaggingWhereUniqueInputObjectSchema),
				z.lazy(() => TaggingWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const TaggingCreateNestedManyWithoutUserInputObjectSchema = Schema;
