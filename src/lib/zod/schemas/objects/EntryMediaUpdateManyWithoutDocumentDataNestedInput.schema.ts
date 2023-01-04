import { z } from 'zod';
import { EntryMediaCreateWithoutDocumentDataInputObjectSchema } from './EntryMediaCreateWithoutDocumentDataInput.schema';
import { EntryMediaUncheckedCreateWithoutDocumentDataInputObjectSchema } from './EntryMediaUncheckedCreateWithoutDocumentDataInput.schema';
import { EntryMediaCreateOrConnectWithoutDocumentDataInputObjectSchema } from './EntryMediaCreateOrConnectWithoutDocumentDataInput.schema';
import { EntryMediaUpsertWithWhereUniqueWithoutDocumentDataInputObjectSchema } from './EntryMediaUpsertWithWhereUniqueWithoutDocumentDataInput.schema';
import { EntryMediaCreateManyDocumentDataInputEnvelopeObjectSchema } from './EntryMediaCreateManyDocumentDataInputEnvelope.schema';
import { EntryMediaWhereUniqueInputObjectSchema } from './EntryMediaWhereUniqueInput.schema';
import { EntryMediaUpdateWithWhereUniqueWithoutDocumentDataInputObjectSchema } from './EntryMediaUpdateWithWhereUniqueWithoutDocumentDataInput.schema';
import { EntryMediaUpdateManyWithWhereWithoutDocumentDataInputObjectSchema } from './EntryMediaUpdateManyWithWhereWithoutDocumentDataInput.schema';
import { EntryMediaScalarWhereInputObjectSchema } from './EntryMediaScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaUpdateManyWithoutDocumentDataNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryMediaCreateWithoutDocumentDataInputObjectSchema),
				z.lazy(() => EntryMediaCreateWithoutDocumentDataInputObjectSchema).array(),
				z.lazy(() => EntryMediaUncheckedCreateWithoutDocumentDataInputObjectSchema),
				z.lazy(() => EntryMediaUncheckedCreateWithoutDocumentDataInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => EntryMediaCreateOrConnectWithoutDocumentDataInputObjectSchema),
				z.lazy(() => EntryMediaCreateOrConnectWithoutDocumentDataInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => EntryMediaUpsertWithWhereUniqueWithoutDocumentDataInputObjectSchema),
				z.lazy(() => EntryMediaUpsertWithWhereUniqueWithoutDocumentDataInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => EntryMediaCreateManyDocumentDataInputEnvelopeObjectSchema).optional(),
		set: z
			.union([
				z.lazy(() => EntryMediaWhereUniqueInputObjectSchema),
				z.lazy(() => EntryMediaWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => EntryMediaWhereUniqueInputObjectSchema),
				z.lazy(() => EntryMediaWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => EntryMediaWhereUniqueInputObjectSchema),
				z.lazy(() => EntryMediaWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => EntryMediaWhereUniqueInputObjectSchema),
				z.lazy(() => EntryMediaWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => EntryMediaUpdateWithWhereUniqueWithoutDocumentDataInputObjectSchema),
				z.lazy(() => EntryMediaUpdateWithWhereUniqueWithoutDocumentDataInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => EntryMediaUpdateManyWithWhereWithoutDocumentDataInputObjectSchema),
				z.lazy(() => EntryMediaUpdateManyWithWhereWithoutDocumentDataInputObjectSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => EntryMediaScalarWhereInputObjectSchema),
				z.lazy(() => EntryMediaScalarWhereInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const EntryMediaUpdateManyWithoutDocumentDataNestedInputObjectSchema = Schema;
