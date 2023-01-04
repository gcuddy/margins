import { z } from 'zod';
import { StateCreateWithoutUserInputObjectSchema } from './StateCreateWithoutUserInput.schema';
import { StateUncheckedCreateWithoutUserInputObjectSchema } from './StateUncheckedCreateWithoutUserInput.schema';
import { StateCreateOrConnectWithoutUserInputObjectSchema } from './StateCreateOrConnectWithoutUserInput.schema';
import { StateCreateManyUserInputEnvelopeObjectSchema } from './StateCreateManyUserInputEnvelope.schema';
import { StateWhereUniqueInputObjectSchema } from './StateWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StateCreateNestedManyWithoutUserInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => StateCreateWithoutUserInputObjectSchema),
				z.lazy(() => StateCreateWithoutUserInputObjectSchema).array(),
				z.lazy(() => StateUncheckedCreateWithoutUserInputObjectSchema),
				z.lazy(() => StateUncheckedCreateWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => StateCreateOrConnectWithoutUserInputObjectSchema),
				z.lazy(() => StateCreateOrConnectWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => StateCreateManyUserInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => StateWhereUniqueInputObjectSchema),
				z.lazy(() => StateWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const StateCreateNestedManyWithoutUserInputObjectSchema = Schema;
