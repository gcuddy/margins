import { z } from 'zod';
import { EntryCreateWithoutTagsInputObjectSchema } from './EntryCreateWithoutTagsInput.schema';
import { EntryUncheckedCreateWithoutTagsInputObjectSchema } from './EntryUncheckedCreateWithoutTagsInput.schema';
import { EntryCreateOrConnectWithoutTagsInputObjectSchema } from './EntryCreateOrConnectWithoutTagsInput.schema';
import { EntryUpsertWithWhereUniqueWithoutTagsInputObjectSchema } from './EntryUpsertWithWhereUniqueWithoutTagsInput.schema';
import { EntryWhereUniqueInputObjectSchema } from './EntryWhereUniqueInput.schema';
import { EntryUpdateWithWhereUniqueWithoutTagsInputObjectSchema } from './EntryUpdateWithWhereUniqueWithoutTagsInput.schema';
import { EntryUpdateManyWithWhereWithoutTagsInputObjectSchema } from './EntryUpdateManyWithWhereWithoutTagsInput.schema';
import { EntryScalarWhereInputObjectSchema } from './EntryScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.EntryUncheckedUpdateManyWithoutTagsNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => EntryCreateWithoutTagsInputObjectSchema),
				z.lazy(() => EntryCreateWithoutTagsInputObjectSchema).array(),
				z.lazy(() => EntryUncheckedCreateWithoutTagsInputObjectSchema),
				z.lazy(() => EntryUncheckedCreateWithoutTagsInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => EntryCreateOrConnectWithoutTagsInputObjectSchema),
				z.lazy(() => EntryCreateOrConnectWithoutTagsInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => EntryUpsertWithWhereUniqueWithoutTagsInputObjectSchema),
				z.lazy(() => EntryUpsertWithWhereUniqueWithoutTagsInputObjectSchema).array(),
			])
			.optional(),
		set: z
			.union([
				z.lazy(() => EntryWhereUniqueInputObjectSchema),
				z.lazy(() => EntryWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => EntryWhereUniqueInputObjectSchema),
				z.lazy(() => EntryWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => EntryWhereUniqueInputObjectSchema),
				z.lazy(() => EntryWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => EntryWhereUniqueInputObjectSchema),
				z.lazy(() => EntryWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => EntryUpdateWithWhereUniqueWithoutTagsInputObjectSchema),
				z.lazy(() => EntryUpdateWithWhereUniqueWithoutTagsInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => EntryUpdateManyWithWhereWithoutTagsInputObjectSchema),
				z.lazy(() => EntryUpdateManyWithWhereWithoutTagsInputObjectSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => EntryScalarWhereInputObjectSchema),
				z.lazy(() => EntryScalarWhereInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const EntryUncheckedUpdateManyWithoutTagsNestedInputObjectSchema = Schema;
