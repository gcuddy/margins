import { z } from 'zod';
import { TaggingCreateWithoutFeedInputObjectSchema } from './TaggingCreateWithoutFeedInput.schema';
import { TaggingUncheckedCreateWithoutFeedInputObjectSchema } from './TaggingUncheckedCreateWithoutFeedInput.schema';
import { TaggingCreateOrConnectWithoutFeedInputObjectSchema } from './TaggingCreateOrConnectWithoutFeedInput.schema';
import { TaggingUpsertWithWhereUniqueWithoutFeedInputObjectSchema } from './TaggingUpsertWithWhereUniqueWithoutFeedInput.schema';
import { TaggingCreateManyFeedInputEnvelopeObjectSchema } from './TaggingCreateManyFeedInputEnvelope.schema';
import { TaggingWhereUniqueInputObjectSchema } from './TaggingWhereUniqueInput.schema';
import { TaggingUpdateWithWhereUniqueWithoutFeedInputObjectSchema } from './TaggingUpdateWithWhereUniqueWithoutFeedInput.schema';
import { TaggingUpdateManyWithWhereWithoutFeedInputObjectSchema } from './TaggingUpdateManyWithWhereWithoutFeedInput.schema';
import { TaggingScalarWhereInputObjectSchema } from './TaggingScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingUpdateManyWithoutFeedNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => TaggingCreateWithoutFeedInputObjectSchema),
				z.lazy(() => TaggingCreateWithoutFeedInputObjectSchema).array(),
				z.lazy(() => TaggingUncheckedCreateWithoutFeedInputObjectSchema),
				z.lazy(() => TaggingUncheckedCreateWithoutFeedInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => TaggingCreateOrConnectWithoutFeedInputObjectSchema),
				z.lazy(() => TaggingCreateOrConnectWithoutFeedInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => TaggingUpsertWithWhereUniqueWithoutFeedInputObjectSchema),
				z.lazy(() => TaggingUpsertWithWhereUniqueWithoutFeedInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => TaggingCreateManyFeedInputEnvelopeObjectSchema).optional(),
		set: z
			.union([
				z.lazy(() => TaggingWhereUniqueInputObjectSchema),
				z.lazy(() => TaggingWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => TaggingWhereUniqueInputObjectSchema),
				z.lazy(() => TaggingWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => TaggingWhereUniqueInputObjectSchema),
				z.lazy(() => TaggingWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => TaggingWhereUniqueInputObjectSchema),
				z.lazy(() => TaggingWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => TaggingUpdateWithWhereUniqueWithoutFeedInputObjectSchema),
				z.lazy(() => TaggingUpdateWithWhereUniqueWithoutFeedInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => TaggingUpdateManyWithWhereWithoutFeedInputObjectSchema),
				z.lazy(() => TaggingUpdateManyWithWhereWithoutFeedInputObjectSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => TaggingScalarWhereInputObjectSchema),
				z.lazy(() => TaggingScalarWhereInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const TaggingUpdateManyWithoutFeedNestedInputObjectSchema = Schema;
