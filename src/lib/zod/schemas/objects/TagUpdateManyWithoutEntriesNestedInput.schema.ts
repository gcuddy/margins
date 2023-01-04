import { z } from 'zod';
import { TagCreateWithoutEntriesInputObjectSchema } from './TagCreateWithoutEntriesInput.schema';
import { TagUncheckedCreateWithoutEntriesInputObjectSchema } from './TagUncheckedCreateWithoutEntriesInput.schema';
import { TagCreateOrConnectWithoutEntriesInputObjectSchema } from './TagCreateOrConnectWithoutEntriesInput.schema';
import { TagUpsertWithWhereUniqueWithoutEntriesInputObjectSchema } from './TagUpsertWithWhereUniqueWithoutEntriesInput.schema';
import { TagWhereUniqueInputObjectSchema } from './TagWhereUniqueInput.schema';
import { TagUpdateWithWhereUniqueWithoutEntriesInputObjectSchema } from './TagUpdateWithWhereUniqueWithoutEntriesInput.schema';
import { TagUpdateManyWithWhereWithoutEntriesInputObjectSchema } from './TagUpdateManyWithWhereWithoutEntriesInput.schema';
import { TagScalarWhereInputObjectSchema } from './TagScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TagUpdateManyWithoutEntriesNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => TagCreateWithoutEntriesInputObjectSchema),
				z.lazy(() => TagCreateWithoutEntriesInputObjectSchema).array(),
				z.lazy(() => TagUncheckedCreateWithoutEntriesInputObjectSchema),
				z.lazy(() => TagUncheckedCreateWithoutEntriesInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => TagCreateOrConnectWithoutEntriesInputObjectSchema),
				z.lazy(() => TagCreateOrConnectWithoutEntriesInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => TagUpsertWithWhereUniqueWithoutEntriesInputObjectSchema),
				z.lazy(() => TagUpsertWithWhereUniqueWithoutEntriesInputObjectSchema).array(),
			])
			.optional(),
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
				z.lazy(() => TagUpdateWithWhereUniqueWithoutEntriesInputObjectSchema),
				z.lazy(() => TagUpdateWithWhereUniqueWithoutEntriesInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => TagUpdateManyWithWhereWithoutEntriesInputObjectSchema),
				z.lazy(() => TagUpdateManyWithWhereWithoutEntriesInputObjectSchema).array(),
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

export const TagUpdateManyWithoutEntriesNestedInputObjectSchema = Schema;
