import { z } from 'zod';
import { BookmarkCreateWithoutEntryInputObjectSchema } from './BookmarkCreateWithoutEntryInput.schema';
import { BookmarkUncheckedCreateWithoutEntryInputObjectSchema } from './BookmarkUncheckedCreateWithoutEntryInput.schema';
import { BookmarkCreateOrConnectWithoutEntryInputObjectSchema } from './BookmarkCreateOrConnectWithoutEntryInput.schema';
import { BookmarkCreateManyEntryInputEnvelopeObjectSchema } from './BookmarkCreateManyEntryInputEnvelope.schema';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkUncheckedCreateNestedManyWithoutEntryInput> = z
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
		createMany: z.lazy(() => BookmarkCreateManyEntryInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => BookmarkWhereUniqueInputObjectSchema),
				z.lazy(() => BookmarkWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const BookmarkUncheckedCreateNestedManyWithoutEntryInputObjectSchema = Schema;
