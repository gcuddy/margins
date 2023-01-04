import { z } from 'zod';
import { TagCreateWithoutUserInputObjectSchema } from './TagCreateWithoutUserInput.schema';
import { TagUncheckedCreateWithoutUserInputObjectSchema } from './TagUncheckedCreateWithoutUserInput.schema';
import { TagCreateOrConnectWithoutUserInputObjectSchema } from './TagCreateOrConnectWithoutUserInput.schema';
import { TagCreateManyUserInputEnvelopeObjectSchema } from './TagCreateManyUserInputEnvelope.schema';
import { TagWhereUniqueInputObjectSchema } from './TagWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagCreateNestedManyWithoutUserInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => TagCreateWithoutUserInputObjectSchema),
				z.lazy(() => TagCreateWithoutUserInputObjectSchema).array(),
				z.lazy(() => TagUncheckedCreateWithoutUserInputObjectSchema),
				z.lazy(() => TagUncheckedCreateWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => TagCreateOrConnectWithoutUserInputObjectSchema),
				z.lazy(() => TagCreateOrConnectWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => TagCreateManyUserInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => TagWhereUniqueInputObjectSchema),
				z.lazy(() => TagWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const TagCreateNestedManyWithoutUserInputObjectSchema = Schema;
