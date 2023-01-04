import { z } from 'zod';
import { TaggingCreateWithoutUserInputObjectSchema } from './TaggingCreateWithoutUserInput.schema';
import { TaggingUncheckedCreateWithoutUserInputObjectSchema } from './TaggingUncheckedCreateWithoutUserInput.schema';
import { TaggingCreateOrConnectWithoutUserInputObjectSchema } from './TaggingCreateOrConnectWithoutUserInput.schema';
import { TaggingUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './TaggingUpsertWithWhereUniqueWithoutUserInput.schema';
import { TaggingCreateManyUserInputEnvelopeObjectSchema } from './TaggingCreateManyUserInputEnvelope.schema';
import { TaggingWhereUniqueInputObjectSchema } from './TaggingWhereUniqueInput.schema';
import { TaggingUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './TaggingUpdateWithWhereUniqueWithoutUserInput.schema';
import { TaggingUpdateManyWithWhereWithoutUserInputObjectSchema } from './TaggingUpdateManyWithWhereWithoutUserInput.schema';
import { TaggingScalarWhereInputObjectSchema } from './TaggingScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingUncheckedUpdateManyWithoutUserNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => TaggingCreateWithoutUserInputObjectSchema),
				z.lazy(() => TaggingCreateWithoutUserInputObjectSchema).array(),
				z.lazy(() => TaggingUncheckedCreateWithoutUserInputObjectSchema),
				z.lazy(() => TaggingUncheckedCreateWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => TaggingCreateOrConnectWithoutUserInputObjectSchema),
				z.lazy(() => TaggingCreateOrConnectWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => TaggingUpsertWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => TaggingUpsertWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => TaggingCreateManyUserInputEnvelopeObjectSchema).optional(),
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
				z.lazy(() => TaggingUpdateWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => TaggingUpdateWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => TaggingUpdateManyWithWhereWithoutUserInputObjectSchema),
				z.lazy(() => TaggingUpdateManyWithWhereWithoutUserInputObjectSchema).array(),
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

export const TaggingUncheckedUpdateManyWithoutUserNestedInputObjectSchema = Schema;
