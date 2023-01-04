import { z } from 'zod';
import { EntryTagCreateWithoutUserInputObjectSchema } from './EntryTagCreateWithoutUserInput.schema';
import { EntryTagUncheckedCreateWithoutUserInputObjectSchema } from './EntryTagUncheckedCreateWithoutUserInput.schema';
import { EntryTagCreateOrConnectWithoutUserInputObjectSchema } from './EntryTagCreateOrConnectWithoutUserInput.schema';
import { EntryTagCreateManyUserInputEnvelopeObjectSchema } from './EntryTagCreateManyUserInputEnvelope.schema';
import { EntryTagWhereUniqueInputObjectSchema } from './EntryTagWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagCreateNestedManyWithoutUserInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryTagCreateWithoutUserInputObjectSchema),
				z.lazy(() => EntryTagCreateWithoutUserInputObjectSchema).array(),
				z.lazy(() => EntryTagUncheckedCreateWithoutUserInputObjectSchema),
				z.lazy(() => EntryTagUncheckedCreateWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => EntryTagCreateOrConnectWithoutUserInputObjectSchema),
				z.lazy(() => EntryTagCreateOrConnectWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => EntryTagCreateManyUserInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => EntryTagWhereUniqueInputObjectSchema),
				z.lazy(() => EntryTagWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const EntryTagCreateNestedManyWithoutUserInputObjectSchema = Schema;
