import { z } from 'zod';
import { BookmarkCreateWithoutEntryInputObjectSchema } from './BookmarkCreateWithoutEntryInput.schema';
import { BookmarkUncheckedCreateWithoutEntryInputObjectSchema } from './BookmarkUncheckedCreateWithoutEntryInput.schema';
import { BookmarkCreateOrConnectWithoutEntryInputObjectSchema } from './BookmarkCreateOrConnectWithoutEntryInput.schema';
import { BookmarkUpsertWithWhereUniqueWithoutEntryInputObjectSchema } from './BookmarkUpsertWithWhereUniqueWithoutEntryInput.schema';
import { BookmarkCreateManyEntryInputEnvelopeObjectSchema } from './BookmarkCreateManyEntryInputEnvelope.schema';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';
import { BookmarkUpdateWithWhereUniqueWithoutEntryInputObjectSchema } from './BookmarkUpdateWithWhereUniqueWithoutEntryInput.schema';
import { BookmarkUpdateManyWithWhereWithoutEntryInputObjectSchema } from './BookmarkUpdateManyWithWhereWithoutEntryInput.schema';
import { BookmarkScalarWhereInputObjectSchema } from './BookmarkScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkUncheckedUpdateManyWithoutEntryNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => BookmarkCreateWithoutEntryInputObjectSchema),
				z.lazy(() => BookmarkCreateWithoutEntryInputObjectSchema).array(),
				z.lazy(() => BookmarkUncheckedCreateWithoutEntryInputObjectSchema),
				z.lazy(() => BookmarkUncheckedCreateWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => BookmarkCreateOrConnectWithoutEntryInputObjectSchema),
				z.lazy(() => BookmarkCreateOrConnectWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => BookmarkUpsertWithWhereUniqueWithoutEntryInputObjectSchema),
				z.lazy(() => BookmarkUpsertWithWhereUniqueWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => BookmarkCreateManyEntryInputEnvelopeObjectSchema).optional(),
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
				z.lazy(() => BookmarkUpdateWithWhereUniqueWithoutEntryInputObjectSchema),
				z.lazy(() => BookmarkUpdateWithWhereUniqueWithoutEntryInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => BookmarkUpdateManyWithWhereWithoutEntryInputObjectSchema),
				z.lazy(() => BookmarkUpdateManyWithWhereWithoutEntryInputObjectSchema).array(),
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

export const BookmarkUncheckedUpdateManyWithoutEntryNestedInputObjectSchema = Schema;
