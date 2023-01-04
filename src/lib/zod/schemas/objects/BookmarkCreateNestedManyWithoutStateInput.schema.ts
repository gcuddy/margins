import { z } from 'zod';
import { BookmarkCreateWithoutStateInputObjectSchema } from './BookmarkCreateWithoutStateInput.schema';
import { BookmarkUncheckedCreateWithoutStateInputObjectSchema } from './BookmarkUncheckedCreateWithoutStateInput.schema';
import { BookmarkCreateOrConnectWithoutStateInputObjectSchema } from './BookmarkCreateOrConnectWithoutStateInput.schema';
import { BookmarkCreateManyStateInputEnvelopeObjectSchema } from './BookmarkCreateManyStateInputEnvelope.schema';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkCreateNestedManyWithoutStateInput> = z
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
		createMany: z.lazy(() => BookmarkCreateManyStateInputEnvelopeObjectSchema).optional(),
		connect: z
			.union([
				z.lazy(() => BookmarkWhereUniqueInputObjectSchema),
				z.lazy(() => BookmarkWhereUniqueInputObjectSchema).array(),
			])
			.optional(),
	})
	.strict();

export const BookmarkCreateNestedManyWithoutStateInputObjectSchema = Schema;
