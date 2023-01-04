import { z } from 'zod';
import { InteractionCreateWithoutUserInputObjectSchema } from './InteractionCreateWithoutUserInput.schema';
import { InteractionUncheckedCreateWithoutUserInputObjectSchema } from './InteractionUncheckedCreateWithoutUserInput.schema';
import { InteractionCreateOrConnectWithoutUserInputObjectSchema } from './InteractionCreateOrConnectWithoutUserInput.schema';
import { InteractionCreateManyUserInputEnvelopeObjectSchema } from './InteractionCreateManyUserInputEnvelope.schema';
import { InteractionWhereUniqueInputObjectSchema } from './InteractionWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionUncheckedCreateNestedManyWithoutUserInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => InteractionCreateWithoutUserInputObjectSchema),
				z.lazy(() => InteractionCreateWithoutUserInputObjectSchema).array(),
				z.lazy(() => InteractionUncheckedCreateWithoutUserInputObjectSchema),
				z.lazy(() => InteractionUncheckedCreateWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => InteractionCreateOrConnectWithoutUserInputObjectSchema),
				z.lazy(() => InteractionCreateOrConnectWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => InteractionCreateManyUserInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => InteractionWhereUniqueInputObjectSchema),
				z.lazy(() => InteractionWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const InteractionUncheckedCreateNestedManyWithoutUserInputObjectSchema = Schema;
