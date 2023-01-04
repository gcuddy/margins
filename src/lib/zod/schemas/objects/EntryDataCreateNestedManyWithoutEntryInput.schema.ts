import { z } from 'zod';
import { EntryDataCreateWithoutEntryInputObjectSchema } from './EntryDataCreateWithoutEntryInput.schema';
import { EntryDataUncheckedCreateWithoutEntryInputObjectSchema } from './EntryDataUncheckedCreateWithoutEntryInput.schema';
import { EntryDataCreateOrConnectWithoutEntryInputObjectSchema } from './EntryDataCreateOrConnectWithoutEntryInput.schema';
import { EntryDataCreateManyEntryInputEnvelopeObjectSchema } from './EntryDataCreateManyEntryInputEnvelope.schema';
import { EntryDataWhereUniqueInputObjectSchema } from './EntryDataWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryDataCreateNestedManyWithoutEntryInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryDataCreateWithoutEntryInputObjectSchema),
				z.lazy(() => EntryDataCreateWithoutEntryInputObjectSchema).array(),
				z.lazy(() => EntryDataUncheckedCreateWithoutEntryInputObjectSchema),
				z.lazy(() => EntryDataUncheckedCreateWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => EntryDataCreateOrConnectWithoutEntryInputObjectSchema),
				z.lazy(() => EntryDataCreateOrConnectWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => EntryDataCreateManyEntryInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => EntryDataWhereUniqueInputObjectSchema),
				z.lazy(() => EntryDataWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const EntryDataCreateNestedManyWithoutEntryInputObjectSchema = Schema;
