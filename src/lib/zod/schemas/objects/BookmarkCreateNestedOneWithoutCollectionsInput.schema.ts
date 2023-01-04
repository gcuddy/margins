import { z } from 'zod';
import { BookmarkCreateWithoutCollectionsInputObjectSchema } from './BookmarkCreateWithoutCollectionsInput.schema';
import { BookmarkUncheckedCreateWithoutCollectionsInputObjectSchema } from './BookmarkUncheckedCreateWithoutCollectionsInput.schema';
import { BookmarkCreateOrConnectWithoutCollectionsInputObjectSchema } from './BookmarkCreateOrConnectWithoutCollectionsInput.schema';
import { BookmarkWhereUniqueInputObjectSchema } from './BookmarkWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.BookmarkCreateNestedOneWithoutCollectionsInput> = z
	.object({
		create: z
			.union([
				z.lazy(() => BookmarkCreateWithoutCollectionsInputObjectSchema),
				z.lazy(() => BookmarkUncheckedCreateWithoutCollectionsInputObjectSchema),
			])
			.optional(),
		connectOrCreate: z
			.lazy(() => BookmarkCreateOrConnectWithoutCollectionsInputObjectSchema)
			.optional(),
		connect: z.lazy(() => BookmarkWhereUniqueInputObjectSchema).optional(),
	})
	.strict();

export const BookmarkCreateNestedOneWithoutCollectionsInputObjectSchema = Schema;
