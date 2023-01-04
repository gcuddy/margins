import { z } from 'zod';
import { EntryTagCreateWithoutTagInputObjectSchema } from './EntryTagCreateWithoutTagInput.schema';
import { EntryTagUncheckedCreateWithoutTagInputObjectSchema } from './EntryTagUncheckedCreateWithoutTagInput.schema';
import { EntryTagCreateOrConnectWithoutTagInputObjectSchema } from './EntryTagCreateOrConnectWithoutTagInput.schema';
import { EntryTagCreateManyTagInputEnvelopeObjectSchema } from './EntryTagCreateManyTagInputEnvelope.schema';
import { EntryTagWhereUniqueInputObjectSchema } from './EntryTagWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagCreateNestedManyWithoutTagInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryTagCreateWithoutTagInputObjectSchema),
				z.lazy(() => EntryTagCreateWithoutTagInputObjectSchema).array(),
				z.lazy(() => EntryTagUncheckedCreateWithoutTagInputObjectSchema),
				z.lazy(() => EntryTagUncheckedCreateWithoutTagInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => EntryTagCreateOrConnectWithoutTagInputObjectSchema),
				z.lazy(() => EntryTagCreateOrConnectWithoutTagInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => EntryTagCreateManyTagInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => EntryTagWhereUniqueInputObjectSchema),
				z.lazy(() => EntryTagWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const EntryTagCreateNestedManyWithoutTagInputObjectSchema = Schema;
