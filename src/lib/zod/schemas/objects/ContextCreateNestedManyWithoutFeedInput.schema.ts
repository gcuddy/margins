import { z } from 'zod';
import { ContextCreateWithoutFeedInputObjectSchema } from './ContextCreateWithoutFeedInput.schema';
import { ContextUncheckedCreateWithoutFeedInputObjectSchema } from './ContextUncheckedCreateWithoutFeedInput.schema';
import { ContextCreateOrConnectWithoutFeedInputObjectSchema } from './ContextCreateOrConnectWithoutFeedInput.schema';
import { ContextCreateManyFeedInputEnvelopeObjectSchema } from './ContextCreateManyFeedInputEnvelope.schema';
import { ContextWhereUniqueInputObjectSchema } from './ContextWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextCreateNestedManyWithoutFeedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => ContextCreateWithoutFeedInputObjectSchema),
				z.lazy(() => ContextCreateWithoutFeedInputObjectSchema).array(),
				z.lazy(() => ContextUncheckedCreateWithoutFeedInputObjectSchema),
				z.lazy(() => ContextUncheckedCreateWithoutFeedInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => ContextCreateOrConnectWithoutFeedInputObjectSchema),
				z.lazy(() => ContextCreateOrConnectWithoutFeedInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => ContextCreateManyFeedInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => ContextWhereUniqueInputObjectSchema),
				z.lazy(() => ContextWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const ContextCreateNestedManyWithoutFeedInputObjectSchema = Schema;
