import { z } from 'zod';
import { StylesheetCreateWithoutUserInputObjectSchema } from './StylesheetCreateWithoutUserInput.schema';
import { StylesheetUncheckedCreateWithoutUserInputObjectSchema } from './StylesheetUncheckedCreateWithoutUserInput.schema';
import { StylesheetCreateOrConnectWithoutUserInputObjectSchema } from './StylesheetCreateOrConnectWithoutUserInput.schema';
import { StylesheetUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './StylesheetUpsertWithWhereUniqueWithoutUserInput.schema';
import { StylesheetCreateManyUserInputEnvelopeObjectSchema } from './StylesheetCreateManyUserInputEnvelope.schema';
import { StylesheetWhereUniqueInputObjectSchema } from './StylesheetWhereUniqueInput.schema';
import { StylesheetUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './StylesheetUpdateWithWhereUniqueWithoutUserInput.schema';
import { StylesheetUpdateManyWithWhereWithoutUserInputObjectSchema } from './StylesheetUpdateManyWithWhereWithoutUserInput.schema';
import { StylesheetScalarWhereInputObjectSchema } from './StylesheetScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetUpdateManyWithoutUserNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => StylesheetCreateWithoutUserInputObjectSchema),
				z.lazy(() => StylesheetCreateWithoutUserInputObjectSchema).array(),
				z.lazy(() => StylesheetUncheckedCreateWithoutUserInputObjectSchema),
				z.lazy(() => StylesheetUncheckedCreateWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => StylesheetCreateOrConnectWithoutUserInputObjectSchema),
				z.lazy(() => StylesheetCreateOrConnectWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => StylesheetUpsertWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => StylesheetUpsertWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => StylesheetCreateManyUserInputEnvelopeObjectSchema).optional(),
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
				z.lazy(() => StylesheetUpdateWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => StylesheetUpdateWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => StylesheetUpdateManyWithWhereWithoutUserInputObjectSchema),
				z.lazy(() => StylesheetUpdateManyWithWhereWithoutUserInputObjectSchema).array(),
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

export const StylesheetUpdateManyWithoutUserNestedInputObjectSchema = Schema;
