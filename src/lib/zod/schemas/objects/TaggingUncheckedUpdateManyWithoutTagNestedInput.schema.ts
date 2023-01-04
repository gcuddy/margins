import { z } from 'zod';
import { TaggingCreateWithoutTagInputObjectSchema } from './TaggingCreateWithoutTagInput.schema';
import { TaggingUncheckedCreateWithoutTagInputObjectSchema } from './TaggingUncheckedCreateWithoutTagInput.schema';
import { TaggingCreateOrConnectWithoutTagInputObjectSchema } from './TaggingCreateOrConnectWithoutTagInput.schema';
import { TaggingUpsertWithWhereUniqueWithoutTagInputObjectSchema } from './TaggingUpsertWithWhereUniqueWithoutTagInput.schema';
import { TaggingCreateManyTagInputEnvelopeObjectSchema } from './TaggingCreateManyTagInputEnvelope.schema';
import { TaggingWhereUniqueInputObjectSchema } from './TaggingWhereUniqueInput.schema';
import { TaggingUpdateWithWhereUniqueWithoutTagInputObjectSchema } from './TaggingUpdateWithWhereUniqueWithoutTagInput.schema';
import { TaggingUpdateManyWithWhereWithoutTagInputObjectSchema } from './TaggingUpdateManyWithWhereWithoutTagInput.schema';
import { TaggingScalarWhereInputObjectSchema } from './TaggingScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingUncheckedUpdateManyWithoutTagNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => TaggingCreateWithoutTagInputObjectSchema),
				z.lazy(() => TaggingCreateWithoutTagInputObjectSchema).array(),
				z.lazy(() => TaggingUncheckedCreateWithoutTagInputObjectSchema),
				z.lazy(() => TaggingUncheckedCreateWithoutTagInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => TaggingCreateOrConnectWithoutTagInputObjectSchema),
				z.lazy(() => TaggingCreateOrConnectWithoutTagInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => TaggingUpsertWithWhereUniqueWithoutTagInputObjectSchema),
				z.lazy(() => TaggingUpsertWithWhereUniqueWithoutTagInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => TaggingCreateManyTagInputEnvelopeObjectSchema).optional(),
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
				z.lazy(() => TaggingUpdateWithWhereUniqueWithoutTagInputObjectSchema),
				z.lazy(() => TaggingUpdateWithWhereUniqueWithoutTagInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => TaggingUpdateManyWithWhereWithoutTagInputObjectSchema),
				z.lazy(() => TaggingUpdateManyWithWhereWithoutTagInputObjectSchema).array(),
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

export const TaggingUncheckedUpdateManyWithoutTagNestedInputObjectSchema = Schema;
