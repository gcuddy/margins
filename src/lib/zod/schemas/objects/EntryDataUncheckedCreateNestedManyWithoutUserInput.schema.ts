import { z } from 'zod';
import { EntryDataCreateWithoutUserInputObjectSchema } from './EntryDataCreateWithoutUserInput.schema';
import { EntryDataUncheckedCreateWithoutUserInputObjectSchema } from './EntryDataUncheckedCreateWithoutUserInput.schema';
import { EntryDataCreateOrConnectWithoutUserInputObjectSchema } from './EntryDataCreateOrConnectWithoutUserInput.schema';
import { EntryDataCreateManyUserInputEnvelopeObjectSchema } from './EntryDataCreateManyUserInputEnvelope.schema';
import { EntryDataWhereUniqueInputObjectSchema } from './EntryDataWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryDataUncheckedCreateNestedManyWithoutUserInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryDataCreateWithoutUserInputObjectSchema),
				z.lazy(() => EntryDataCreateWithoutUserInputObjectSchema).array(),
				z.lazy(() => EntryDataUncheckedCreateWithoutUserInputObjectSchema),
				z.lazy(() => EntryDataUncheckedCreateWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => EntryDataCreateOrConnectWithoutUserInputObjectSchema),
				z.lazy(() => EntryDataCreateOrConnectWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => EntryDataCreateManyUserInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => EntryDataWhereUniqueInputObjectSchema),
				z.lazy(() => EntryDataWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const EntryDataUncheckedCreateNestedManyWithoutUserInputObjectSchema = Schema;
