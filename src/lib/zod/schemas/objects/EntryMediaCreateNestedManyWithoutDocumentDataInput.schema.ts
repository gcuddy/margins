import { z } from 'zod';
import { EntryMediaCreateWithoutDocumentDataInputObjectSchema } from './EntryMediaCreateWithoutDocumentDataInput.schema';
import { EntryMediaUncheckedCreateWithoutDocumentDataInputObjectSchema } from './EntryMediaUncheckedCreateWithoutDocumentDataInput.schema';
import { EntryMediaCreateOrConnectWithoutDocumentDataInputObjectSchema } from './EntryMediaCreateOrConnectWithoutDocumentDataInput.schema';
import { EntryMediaCreateManyDocumentDataInputEnvelopeObjectSchema } from './EntryMediaCreateManyDocumentDataInputEnvelope.schema';
import { EntryMediaWhereUniqueInputObjectSchema } from './EntryMediaWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryMediaCreateNestedManyWithoutDocumentDataInput> = z
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
		createMany: z.lazy(() => EntryMediaCreateManyDocumentDataInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => EntryMediaWhereUniqueInputObjectSchema),
				z.lazy(() => EntryMediaWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const EntryMediaCreateNestedManyWithoutDocumentDataInputObjectSchema = Schema;
