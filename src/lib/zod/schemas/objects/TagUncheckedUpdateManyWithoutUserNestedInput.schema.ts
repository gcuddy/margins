import { z } from 'zod';
import { TagCreateWithoutUserInputObjectSchema } from './TagCreateWithoutUserInput.schema';
import { TagUncheckedCreateWithoutUserInputObjectSchema } from './TagUncheckedCreateWithoutUserInput.schema';
import { TagCreateOrConnectWithoutUserInputObjectSchema } from './TagCreateOrConnectWithoutUserInput.schema';
import { TagUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './TagUpsertWithWhereUniqueWithoutUserInput.schema';
import { TagCreateManyUserInputEnvelopeObjectSchema } from './TagCreateManyUserInputEnvelope.schema';
import { TagWhereUniqueInputObjectSchema } from './TagWhereUniqueInput.schema';
import { TagUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './TagUpdateWithWhereUniqueWithoutUserInput.schema';
import { TagUpdateManyWithWhereWithoutUserInputObjectSchema } from './TagUpdateManyWithWhereWithoutUserInput.schema';
import { TagScalarWhereInputObjectSchema } from './TagScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagUncheckedUpdateManyWithoutUserNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => TagCreateWithoutUserInputObjectSchema),
				z.lazy(() => TagCreateWithoutUserInputObjectSchema).array(),
				z.lazy(() => TagUncheckedCreateWithoutUserInputObjectSchema),
				z.lazy(() => TagUncheckedCreateWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => TagCreateOrConnectWithoutUserInputObjectSchema),
				z.lazy(() => TagCreateOrConnectWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => TagUpsertWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => TagUpsertWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => TagCreateManyUserInputEnvelopeObjectSchema).optional(),
		set: z
			.union([
				z.lazy(() => TagWhereUniqueInputObjectSchema),
				z.lazy(() => TagWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => TagWhereUniqueInputObjectSchema),
				z.lazy(() => TagWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => TagWhereUniqueInputObjectSchema),
				z.lazy(() => TagWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => TagWhereUniqueInputObjectSchema),
				z.lazy(() => TagWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => TagUpdateWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => TagUpdateWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => TagUpdateManyWithWhereWithoutUserInputObjectSchema),
				z.lazy(() => TagUpdateManyWithWhereWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => TagScalarWhereInputObjectSchema),
				z.lazy(() => TagScalarWhereInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const TagUncheckedUpdateManyWithoutUserNestedInputObjectSchema = Schema;
