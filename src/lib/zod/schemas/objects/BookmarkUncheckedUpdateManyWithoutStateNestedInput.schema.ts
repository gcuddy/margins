import { z } from 'zod';
import { BookmarkCreateWithoutStateInputObjectSchema } from './BookmarkCreateWithoutStateInput.schema';
import { BookmarkUncheckedCreateWithoutStateInputObjectSchema } from './BookmarkUncheckedCreateWithoutStateInput.schema';
import { BookmarkCreateOrConnectWithoutStateInputObjectSchema } from './BookmarkCreateOrConnectWithoutStateInput.schema';
import { BookmarkUpsertWithWhereUniqueWithoutStateInputObjectSchema } from './BookmarkUpsertWithWhereUniqueWithoutStateInput.schema';
import { BookmarkCreateManyStateInputEnvelopeObjectSchema } from './BookmarkCreateManyStateInputEnvelope.schema';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';
import { BookmarkUpdateWithWhereUniqueWithoutStateInputObjectSchema } from './BookmarkUpdateWithWhereUniqueWithoutStateInput.schema';
import { BookmarkUpdateManyWithWhereWithoutStateInputObjectSchema } from './BookmarkUpdateManyWithWhereWithoutStateInput.schema';
import { BookmarkScalarWhereInputObjectSchema } from './BookmarkScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkUncheckedUpdateManyWithoutStateNestedInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => BookmarkCreateWithoutStateInputObjectSchema),
				z.lazy(() => BookmarkCreateWithoutStateInputObjectSchema).array(),
				z.lazy(() => BookmarkUncheckedCreateWithoutStateInputObjectSchema),
				z.lazy(() => BookmarkUncheckedCreateWithoutStateInputObjectSchema).array(),
			])
			.optional(),
		connectOrCreate: z
			.union([
				z.lazy(() => BookmarkCreateOrConnectWithoutStateInputObjectSchema),
				z.lazy(() => BookmarkCreateOrConnectWithoutStateInputObjectSchema).array(),
			])
			.optional(),
		upsert: z
			.union([
				z.lazy(() => BookmarkUpsertWithWhereUniqueWithoutStateInputObjectSchema),
				z.lazy(() => BookmarkUpsertWithWhereUniqueWithoutStateInputObjectSchema).array(),
			])
			.optional(),
		createMany: z.lazy(() => BookmarkCreateManyStateInputEnvelopeObjectSchema).optional(),
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
				z.lazy(() => BookmarkUpdateWithWhereUniqueWithoutStateInputObjectSchema),
				z.lazy(() => BookmarkUpdateWithWhereUniqueWithoutStateInputObjectSchema).array(),
			])
			.optional(),
		updateMany: z
			.union([
				z.lazy(() => BookmarkUpdateManyWithWhereWithoutStateInputObjectSchema),
				z.lazy(() => BookmarkUpdateManyWithWhereWithoutStateInputObjectSchema).array(),
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

export const BookmarkUncheckedUpdateManyWithoutStateNestedInputObjectSchema = Schema;
