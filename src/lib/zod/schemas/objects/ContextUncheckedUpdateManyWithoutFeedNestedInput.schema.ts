import { z } from 'zod';
import { ContextCreateWithoutFeedInputObjectSchema } from './ContextCreateWithoutFeedInput.schema';
import { ContextUncheckedCreateWithoutFeedInputObjectSchema } from './ContextUncheckedCreateWithoutFeedInput.schema';
import { ContextCreateOrConnectWithoutFeedInputObjectSchema } from './ContextCreateOrConnectWithoutFeedInput.schema';
import { ContextUpsertWithWhereUniqueWithoutFeedInputObjectSchema } from './ContextUpsertWithWhereUniqueWithoutFeedInput.schema';
import { ContextCreateManyFeedInputEnvelopeObjectSchema } from './ContextCreateManyFeedInputEnvelope.schema';
import { ContextWhereUniqueInputObjectSchema } from './ContextWhereUniqueInput.schema';
import { ContextUpdateWithWhereUniqueWithoutFeedInputObjectSchema } from './ContextUpdateWithWhereUniqueWithoutFeedInput.schema';
import { ContextUpdateManyWithWhereWithoutFeedInputObjectSchema } from './ContextUpdateManyWithWhereWithoutFeedInput.schema';
import { ContextScalarWhereInputObjectSchema } from './ContextScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ContextUncheckedUpdateManyWithoutFeedNestedInput> = z
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
		upsert: z
			.union([
				z.lazy(() => ContextUpsertWithWhereUniqueWithoutFeedInputObjectSchema),
				z.lazy(() => ContextUpsertWithWhereUniqueWithoutFeedInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => ContextCreateManyFeedInputEnvelopeObjectSchema).optional(),
		set: z
			.union([
				z.lazy(() => ContextWhereUniqueInputObjectSchema),
				z.lazy(() => ContextWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => ContextWhereUniqueInputObjectSchema),
				z.lazy(() => ContextWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => ContextWhereUniqueInputObjectSchema),
				z.lazy(() => ContextWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => ContextWhereUniqueInputObjectSchema),
				z.lazy(() => ContextWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => ContextUpdateWithWhereUniqueWithoutFeedInputObjectSchema),
				z.lazy(() => ContextUpdateWithWhereUniqueWithoutFeedInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => ContextUpdateManyWithWhereWithoutFeedInputObjectSchema),
				z.lazy(() => ContextUpdateManyWithWhereWithoutFeedInputObjectSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => ContextScalarWhereInputObjectSchema),
				z.lazy(() => ContextScalarWhereInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const ContextUncheckedUpdateManyWithoutFeedNestedInputObjectSchema = Schema;
