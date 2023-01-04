import { z } from 'zod';
import { StylesheetCreateWithoutEntryInputObjectSchema } from './StylesheetCreateWithoutEntryInput.schema';
import { StylesheetUncheckedCreateWithoutEntryInputObjectSchema } from './StylesheetUncheckedCreateWithoutEntryInput.schema';
import { StylesheetCreateOrConnectWithoutEntryInputObjectSchema } from './StylesheetCreateOrConnectWithoutEntryInput.schema';
import { StylesheetCreateManyEntryInputEnvelopeObjectSchema } from './StylesheetCreateManyEntryInputEnvelope.schema';
import { StylesheetWhereUniqueInputObjectSchema } from './StylesheetWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetCreateNestedManyWithoutEntryInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => StylesheetCreateWithoutEntryInputObjectSchema),
				z.lazy(() => StylesheetCreateWithoutEntryInputObjectSchema).array(),
				z.lazy(() => StylesheetUncheckedCreateWithoutEntryInputObjectSchema),
				z.lazy(() => StylesheetUncheckedCreateWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => StylesheetCreateOrConnectWithoutEntryInputObjectSchema),
				z.lazy(() => StylesheetCreateOrConnectWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => StylesheetCreateManyEntryInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => StylesheetWhereUniqueInputObjectSchema),
				z.lazy(() => StylesheetWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const StylesheetCreateNestedManyWithoutEntryInputObjectSchema = Schema;
