import { z } from 'zod';
import { BookmarkCreateWithoutUserInputObjectSchema } from './BookmarkCreateWithoutUserInput.schema';
import { BookmarkUncheckedCreateWithoutUserInputObjectSchema } from './BookmarkUncheckedCreateWithoutUserInput.schema';
import { BookmarkCreateOrConnectWithoutUserInputObjectSchema } from './BookmarkCreateOrConnectWithoutUserInput.schema';
import { BookmarkCreateManyUserInputEnvelopeObjectSchema } from './BookmarkCreateManyUserInputEnvelope.schema';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkCreateNestedManyWithoutUserInput> = z
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
		createMany: z.lazy(() => BookmarkCreateManyUserInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => BookmarkWhereUniqueInputObjectSchema),
				z.lazy(() => BookmarkWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const BookmarkCreateNestedManyWithoutUserInputObjectSchema = Schema;
