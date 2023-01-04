import { z } from 'zod';
import { ContextCreateWithoutUserInputObjectSchema } from './ContextCreateWithoutUserInput.schema';
import { ContextUncheckedCreateWithoutUserInputObjectSchema } from './ContextUncheckedCreateWithoutUserInput.schema';
import { ContextCreateOrConnectWithoutUserInputObjectSchema } from './ContextCreateOrConnectWithoutUserInput.schema';
import { ContextCreateManyUserInputEnvelopeObjectSchema } from './ContextCreateManyUserInputEnvelope.schema';
import { ContextWhereUniqueInputObjectSchema } from './ContextWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextUncheckedCreateNestedManyWithoutUserInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => ContextCreateWithoutUserInputObjectSchema),
				z.lazy(() => ContextCreateWithoutUserInputObjectSchema).array(),
				z.lazy(() => ContextUncheckedCreateWithoutUserInputObjectSchema),
				z.lazy(() => ContextUncheckedCreateWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => ContextCreateOrConnectWithoutUserInputObjectSchema),
				z.lazy(() => ContextCreateOrConnectWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => ContextCreateManyUserInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => ContextWhereUniqueInputObjectSchema),
				z.lazy(() => ContextWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const ContextUncheckedCreateNestedManyWithoutUserInputObjectSchema = Schema;
