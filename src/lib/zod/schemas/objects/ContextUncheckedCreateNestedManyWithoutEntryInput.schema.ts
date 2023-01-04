import { z } from 'zod';
import { ContextCreateWithoutEntryInputObjectSchema } from './ContextCreateWithoutEntryInput.schema';
import { ContextUncheckedCreateWithoutEntryInputObjectSchema } from './ContextUncheckedCreateWithoutEntryInput.schema';
import { ContextCreateOrConnectWithoutEntryInputObjectSchema } from './ContextCreateOrConnectWithoutEntryInput.schema';
import { ContextCreateManyEntryInputEnvelopeObjectSchema } from './ContextCreateManyEntryInputEnvelope.schema';
import { ContextWhereUniqueInputObjectSchema } from './ContextWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextUncheckedCreateNestedManyWithoutEntryInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => ContextCreateWithoutEntryInputObjectSchema),
				z.lazy(() => ContextCreateWithoutEntryInputObjectSchema).array(),
				z.lazy(() => ContextUncheckedCreateWithoutEntryInputObjectSchema),
				z.lazy(() => ContextUncheckedCreateWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => ContextCreateOrConnectWithoutEntryInputObjectSchema),
				z.lazy(() => ContextCreateOrConnectWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => ContextCreateManyEntryInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => ContextWhereUniqueInputObjectSchema),
				z.lazy(() => ContextWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const ContextUncheckedCreateNestedManyWithoutEntryInputObjectSchema = Schema;
