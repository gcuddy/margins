import { z } from 'zod';
import { EntryTagCreateWithoutEntryInputObjectSchema } from './EntryTagCreateWithoutEntryInput.schema';
import { EntryTagUncheckedCreateWithoutEntryInputObjectSchema } from './EntryTagUncheckedCreateWithoutEntryInput.schema';
import { EntryTagCreateOrConnectWithoutEntryInputObjectSchema } from './EntryTagCreateOrConnectWithoutEntryInput.schema';
import { EntryTagCreateManyEntryInputEnvelopeObjectSchema } from './EntryTagCreateManyEntryInputEnvelope.schema';
import { EntryTagWhereUniqueInputObjectSchema } from './EntryTagWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryTagUncheckedCreateNestedManyWithoutEntryInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryTagCreateWithoutEntryInputObjectSchema),
				z.lazy(() => EntryTagCreateWithoutEntryInputObjectSchema).array(),
				z.lazy(() => EntryTagUncheckedCreateWithoutEntryInputObjectSchema),
				z.lazy(() => EntryTagUncheckedCreateWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => EntryTagCreateOrConnectWithoutEntryInputObjectSchema),
				z.lazy(() => EntryTagCreateOrConnectWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => EntryTagCreateManyEntryInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => EntryTagWhereUniqueInputObjectSchema),
				z.lazy(() => EntryTagWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const EntryTagUncheckedCreateNestedManyWithoutEntryInputObjectSchema = Schema;
