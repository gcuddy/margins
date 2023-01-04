import { z } from 'zod';
import { InteractionCreateWithoutEntryInputObjectSchema } from './InteractionCreateWithoutEntryInput.schema';
import { InteractionUncheckedCreateWithoutEntryInputObjectSchema } from './InteractionUncheckedCreateWithoutEntryInput.schema';
import { InteractionCreateOrConnectWithoutEntryInputObjectSchema } from './InteractionCreateOrConnectWithoutEntryInput.schema';
import { InteractionCreateManyEntryInputEnvelopeObjectSchema } from './InteractionCreateManyEntryInputEnvelope.schema';
import { InteractionWhereUniqueInputObjectSchema } from './InteractionWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.InteractionCreateNestedManyWithoutEntryInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => InteractionCreateWithoutEntryInputObjectSchema),
				z.lazy(() => InteractionCreateWithoutEntryInputObjectSchema).array(),
				z.lazy(() => InteractionUncheckedCreateWithoutEntryInputObjectSchema),
				z.lazy(() => InteractionUncheckedCreateWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => InteractionCreateOrConnectWithoutEntryInputObjectSchema),
				z.lazy(() => InteractionCreateOrConnectWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => InteractionCreateManyEntryInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => InteractionWhereUniqueInputObjectSchema),
				z.lazy(() => InteractionWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const InteractionCreateNestedManyWithoutEntryInputObjectSchema = Schema;
