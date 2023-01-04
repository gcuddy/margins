import { z } from 'zod';
import { StylesheetCreateWithoutUserInputObjectSchema } from './StylesheetCreateWithoutUserInput.schema';
import { StylesheetUncheckedCreateWithoutUserInputObjectSchema } from './StylesheetUncheckedCreateWithoutUserInput.schema';
import { StylesheetCreateOrConnectWithoutUserInputObjectSchema } from './StylesheetCreateOrConnectWithoutUserInput.schema';
import { StylesheetCreateManyUserInputEnvelopeObjectSchema } from './StylesheetCreateManyUserInputEnvelope.schema';
import { StylesheetWhereUniqueInputObjectSchema } from './StylesheetWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.StylesheetCreateNestedManyWithoutUserInput> = z
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
		createMany: z.lazy(() => StylesheetCreateManyUserInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => StylesheetWhereUniqueInputObjectSchema),
				z.lazy(() => StylesheetWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const StylesheetCreateNestedManyWithoutUserInputObjectSchema = Schema;
