import { z } from 'zod';
import { BookmarkCreateWithoutUserInputObjectSchema } from './BookmarkCreateWithoutUserInput.schema';
import { BookmarkUncheckedCreateWithoutUserInputObjectSchema } from './BookmarkUncheckedCreateWithoutUserInput.schema';
import { BookmarkCreateOrConnectWithoutUserInputObjectSchema } from './BookmarkCreateOrConnectWithoutUserInput.schema';
import { BookmarkUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './BookmarkUpsertWithWhereUniqueWithoutUserInput.schema';
import { BookmarkCreateManyUserInputEnvelopeObjectSchema } from './BookmarkCreateManyUserInputEnvelope.schema';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';
import { BookmarkUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './BookmarkUpdateWithWhereUniqueWithoutUserInput.schema';
import { BookmarkUpdateManyWithWhereWithoutUserInputObjectSchema } from './BookmarkUpdateManyWithWhereWithoutUserInput.schema';
import { BookmarkScalarWhereInputObjectSchema } from './BookmarkScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkUncheckedUpdateManyWithoutUserNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => BookmarkCreateWithoutUserInputObjectSchema),
				z.lazy(() => BookmarkCreateWithoutUserInputObjectSchema).array(),
				z.lazy(() => BookmarkUncheckedCreateWithoutUserInputObjectSchema),
				z.lazy(() => BookmarkUncheckedCreateWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => BookmarkCreateOrConnectWithoutUserInputObjectSchema),
				z.lazy(() => BookmarkCreateOrConnectWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => BookmarkUpsertWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => BookmarkUpsertWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => BookmarkCreateManyUserInputEnvelopeObjectSchema).optional(),
		set: z
			.union([
				z.lazy(() => BookmarkWhereUniqueInputObjectSchema),
				z.lazy(() => BookmarkWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		disconnect: z
			.union([
				z.lazy(() => BookmarkWhereUniqueInputObjectSchema),
				z.lazy(() => BookmarkWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		delete: z
			.union([
				z.lazy(() => BookmarkWhereUniqueInputObjectSchema),
				z.lazy(() => BookmarkWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		connect: z
			.union([
				z.lazy(() => BookmarkWhereUniqueInputObjectSchema),
				z.lazy(() => BookmarkWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
		update: z
			.union([
				z.lazy(() => BookmarkUpdateWithWhereUniqueWithoutUserInputObjectSchema),
				z.lazy(() => BookmarkUpdateWithWhereUniqueWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => BookmarkUpdateManyWithWhereWithoutUserInputObjectSchema),
				z.lazy(() => BookmarkUpdateManyWithWhereWithoutUserInputObjectSchema).array(),
			])
			.optional(),
		deleteMany: z
			.union([
				z.lazy(() => BookmarkScalarWhereInputObjectSchema),
				z.lazy(() => BookmarkScalarWhereInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const BookmarkUncheckedUpdateManyWithoutUserNestedInputObjectSchema = Schema;
