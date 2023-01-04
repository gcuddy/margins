import { z } from 'zod';
import { EntryMediaCreateWithoutEntryInputObjectSchema } from './EntryMediaCreateWithoutEntryInput.schema';
import { EntryMediaUncheckedCreateWithoutEntryInputObjectSchema } from './EntryMediaUncheckedCreateWithoutEntryInput.schema';
import { EntryMediaCreateOrConnectWithoutEntryInputObjectSchema } from './EntryMediaCreateOrConnectWithoutEntryInput.schema';
import { EntryMediaCreateManyEntryInputEnvelopeObjectSchema } from './EntryMediaCreateManyEntryInputEnvelope.schema';
import { EntryMediaWhereUniqueInputObjectSchema } from './EntryMediaWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaCreateNestedManyWithoutEntryInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryMediaCreateWithoutEntryInputObjectSchema),
				z.lazy(() => EntryMediaCreateWithoutEntryInputObjectSchema).array(),
				z.lazy(() => EntryMediaUncheckedCreateWithoutEntryInputObjectSchema),
				z.lazy(() => EntryMediaUncheckedCreateWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => EntryMediaCreateOrConnectWithoutEntryInputObjectSchema),
				z.lazy(() => EntryMediaCreateOrConnectWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => EntryMediaCreateManyEntryInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => EntryMediaWhereUniqueInputObjectSchema),
				z.lazy(() => EntryMediaWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const EntryMediaCreateNestedManyWithoutEntryInputObjectSchema = Schema;
