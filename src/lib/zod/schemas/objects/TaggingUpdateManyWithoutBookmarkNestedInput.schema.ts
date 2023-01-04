import { z } from 'zod';
import { TaggingCreateWithoutBookmarkInputObjectSchema } from './TaggingCreateWithoutBookmarkInput.schema';
import { TaggingUncheckedCreateWithoutBookmarkInputObjectSchema } from './TaggingUncheckedCreateWithoutBookmarkInput.schema';
import { TaggingCreateOrConnectWithoutBookmarkInputObjectSchema } from './TaggingCreateOrConnectWithoutBookmarkInput.schema';
import { TaggingUpsertWithWhereUniqueWithoutBookmarkInputObjectSchema } from './TaggingUpsertWithWhereUniqueWithoutBookmarkInput.schema';
import { TaggingCreateManyBookmarkInputEnvelopeObjectSchema } from './TaggingCreateManyBookmarkInputEnvelope.schema';
import { TaggingWhereUniqueInputObjectSchema } from './TaggingWhereUniqueInput.schema';
import { TaggingUpdateWithWhereUniqueWithoutBookmarkInputObjectSchema } from './TaggingUpdateWithWhereUniqueWithoutBookmarkInput.schema';
import { TaggingUpdateManyWithWhereWithoutBookmarkInputObjectSchema } from './TaggingUpdateManyWithWhereWithoutBookmarkInput.schema';
import { TaggingScalarWhereInputObjectSchema } from './TaggingScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaggingUpdateManyWithoutBookmarkNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => TaggingCreateWithoutBookmarkInputObjectSchema),
				z.lazy(() => TaggingCreateWithoutBookmarkInputObjectSchema).array(),
				z.lazy(() => TaggingUncheckedCreateWithoutBookmarkInputObjectSchema),
				z.lazy(() => TaggingUncheckedCreateWithoutBookmarkInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => TaggingCreateOrConnectWithoutBookmarkInputObjectSchema),
				z.lazy(() => TaggingCreateOrConnectWithoutBookmarkInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => TaggingUpsertWithWhereUniqueWithoutBookmarkInputObjectSchema),
				z.lazy(() => TaggingUpsertWithWhereUniqueWithoutBookmarkInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => TaggingCreateManyBookmarkInputEnvelopeObjectSchema).optional(),
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
				z.lazy(() => TaggingUpdateWithWhereUniqueWithoutBookmarkInputObjectSchema),
				z.lazy(() => TaggingUpdateWithWhereUniqueWithoutBookmarkInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => TaggingUpdateManyWithWhereWithoutBookmarkInputObjectSchema),
				z.lazy(() => TaggingUpdateManyWithWhereWithoutBookmarkInputObjectSchema).array(),
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

export const TaggingUpdateManyWithoutBookmarkNestedInputObjectSchema = Schema;
