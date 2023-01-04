import { z } from 'zod';
import { StylesheetCreateWithoutEntryInputObjectSchema } from './StylesheetCreateWithoutEntryInput.schema';
import { StylesheetUncheckedCreateWithoutEntryInputObjectSchema } from './StylesheetUncheckedCreateWithoutEntryInput.schema';
import { StylesheetCreateOrConnectWithoutEntryInputObjectSchema } from './StylesheetCreateOrConnectWithoutEntryInput.schema';
import { StylesheetUpsertWithWhereUniqueWithoutEntryInputObjectSchema } from './StylesheetUpsertWithWhereUniqueWithoutEntryInput.schema';
import { StylesheetCreateManyEntryInputEnvelopeObjectSchema } from './StylesheetCreateManyEntryInputEnvelope.schema';
import { StylesheetWhereUniqueInputObjectSchema } from './StylesheetWhereUniqueInput.schema';
import { StylesheetUpdateWithWhereUniqueWithoutEntryInputObjectSchema } from './StylesheetUpdateWithWhereUniqueWithoutEntryInput.schema';
import { StylesheetUpdateManyWithWhereWithoutEntryInputObjectSchema } from './StylesheetUpdateManyWithWhereWithoutEntryInput.schema';
import { StylesheetScalarWhereInputObjectSchema } from './StylesheetScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetUpdateManyWithoutEntryNestedInput> = z
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
		upsert: z
			.union([
				z.lazy(() => StylesheetUpsertWithWhereUniqueWithoutEntryInputObjectSchema),
				z.lazy(() => StylesheetUpsertWithWhereUniqueWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => StylesheetCreateManyEntryInputEnvelopeObjectSchema).optional(),
		set: z
			.union([
				z.lazy(() => StylesheetWhereUniqueInputObjectSchema),
				z.lazy(() => StylesheetWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => StylesheetWhereUniqueInputObjectSchema),
				z.lazy(() => StylesheetWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => StylesheetWhereUniqueInputObjectSchema),
				z.lazy(() => StylesheetWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => StylesheetWhereUniqueInputObjectSchema),
				z.lazy(() => StylesheetWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => StylesheetUpdateWithWhereUniqueWithoutEntryInputObjectSchema),
				z.lazy(() => StylesheetUpdateWithWhereUniqueWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => StylesheetUpdateManyWithWhereWithoutEntryInputObjectSchema),
				z.lazy(() => StylesheetUpdateManyWithWhereWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => StylesheetScalarWhereInputObjectSchema),
				z.lazy(() => StylesheetScalarWhereInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const StylesheetUpdateManyWithoutEntryNestedInputObjectSchema = Schema;
